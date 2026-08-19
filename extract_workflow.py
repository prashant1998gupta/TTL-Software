"""
Pull each workflow subagent's full return text out of the run transcript.

The workflow's own return value can be too large to surface intact, so this
reads journal.jsonl (which records every agent's actual result) and identifies
which task each agent ran by matching a distinctive phrase from its prompt.

Usage: python extract_workflow.py <run_transcript_dir> <out_dir>
"""
import json
import os
import sys

# Distinctive phrase from each prompt -> output filename.
FINGERPRINTS = [
    ("Research the ACTUAL testing domain",            "research_silk_domain.md"),
    ("ISO/IEC 17025:2017 + NABL",                     "research_nabl_17025.md"),
    ("reference feature-and-data-model brief",        "research_lims_reference.md"),
    ("rigorous, adversarial gap analysis",            "research_gap_analysis.md"),
    ("India-specific commercial, statutory",          "research_india_commercial.md"),
    ("YOUR SECTION: the opening of the specification", "section_1_foundation.md"),
    ("YOUR SECTION: the conceptual model",            "section_2_workflow.md"),
    ("functional requirements for modules M1 to M10", "section_3_functional_core.md"),
    ("functional requirements for modules M11 to M22", "section_4_functional_support.md"),
    ("YOUR SECTION: the non-functional, technical",   "section_5_nfr_plan.md"),
    ("You are a completeness critic",                 "critique_completeness.md"),
    ("told to build it alone, starting Monday",        "critique_buildability.md"),
]


def all_assistant_text(path):
    """
    Concatenate every assistant text block in an agent transcript.

    The journal records only an agent's final text block. When an agent emits a
    long answer across several blocks, that final block is just the tail, so the
    transcript is the only complete copy.
    """
    blocks = []
    try:
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                msg = obj.get("message") or obj
                if msg.get("role") != "assistant":
                    continue
                content = msg.get("content")
                if isinstance(content, str):
                    blocks.append(content)
                elif isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get("type") == "text":
                            blocks.append(block.get("text", ""))
    except OSError:
        return ""
    return "\n".join(b for b in blocks if b.strip())


def first_user_prompt(path):
    """Return the first user-turn text in an agent transcript."""
    try:
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                msg = obj.get("message") or obj
                if msg.get("role") != "user":
                    continue
                content = msg.get("content")
                if isinstance(content, str):
                    return content
                if isinstance(content, list):
                    parts = [c.get("text", "") for c in content
                             if isinstance(c, dict) and c.get("type") == "text"]
                    if parts:
                        return "\n".join(parts)
    except OSError:
        pass
    return ""


def main():
    run_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    results = {}
    journal = os.path.join(run_dir, "journal.jsonl")
    with open(journal, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if obj.get("type") == "result":
                results[obj["agentId"]] = obj.get("result") or ""

    prompts, fulltext = {}, {}
    for name in os.listdir(run_dir):
        if name.startswith("agent-") and name.endswith(".jsonl"):
            agent_id = name[len("agent-"):-len(".jsonl")]
            path = os.path.join(run_dir, name)
            prompts[agent_id] = first_user_prompt(path)
            fulltext[agent_id] = all_assistant_text(path)

    written, unmatched, recovered = [], [], []
    used = set()
    for agent_id, result in results.items():
        # Prefer the transcript when the journal only captured a trailing block.
        full = fulltext.get(agent_id, "")
        if len(full) > len(result) * 1.05:
            recovered.append((agent_id, len(result), len(full)))
            result = full
        prompt = prompts.get(agent_id, "")
        target = None
        for phrase, filename in FINGERPRINTS:
            if phrase in prompt and filename not in used:
                target = filename
                break
        if target is None:
            unmatched.append((agent_id, len(result)))
            target = "unmatched_%s.md" % agent_id
        used.add(target)
        path = os.path.join(out_dir, target)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(result)
        written.append((target, len(result), len(result.split())))

    written.sort()
    print("agents with results: %d" % len(results))
    for name, chars, words in written:
        print("  %-38s %8d chars  %7d words" % (name, chars, words))
    if recovered:
        print("RECOVERED from transcript (journal held only the tail):")
        for agent_id, short, full in recovered:
            print("  %s  %d -> %d chars" % (agent_id, short, full))
    if unmatched:
        print("UNMATCHED (identify manually): %s" % unmatched)
    missing = [f for _, f in FINGERPRINTS if f not in used]
    if missing:
        print("NO RESULT YET FOR: %s" % ", ".join(missing))


if __name__ == "__main__":
    main()
