/*
 * build_doc.js — renders the LIMS specification markdown into a Word document.
 *
 * Usage: node build_doc.js <input.md> <output.docx>
 *
 * Markdown supported: ATX headings (## -> H1 ... ##### -> H4), paragraphs,
 * bullet lists, ordered lists (author's literal numbers preserved — the spec
 * numbers requirements, so renumbering would corrupt cross-references),
 * pipe tables, fenced code blocks (used for the ASCII flow diagrams),
 * blockquotes, horizontal rules, and inline bold / italic / code.
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageBreak, Header, Footer, PageNumber, TableOfContents, PageOrientation,
  convertInchesToTwip, VerticalAlign, LevelFormat, TabStopType,
  PositionalTab, PositionalTabAlignment, PositionalTabLeader, PositionalTabRelativeTo,
} = require('docx');

// ---------------------------------------------------------------- page metrics
// A4 (Indian standard). Dimensions in DXA twips: 1440 = 1 inch.
const PAGE_W = 11906;
const PAGE_H = 16838;
const MARGIN = 1000;                       // ~0.7 inch, buys width for tables
const CONTENT_W = PAGE_W - MARGIN * 2;     // 9906
const TABLE_W = 9900;

const FONT = 'Calibri';
const MONO = 'Consolas';

const C = {
  ink:      '1A1A1A',
  muted:    '5A5A5A',
  accent:   '7A1F2B',   // deep silk red — CSB/textile feel, prints legibly in mono
  accent2:  '2E4A62',
  rule:     'C8C8C8',
  headHdr:  'EDE4E4',
  codeBg:   'F4F4F4',
  must:     'A11524',
  should:   'A96410',
  later:    '5A5A5A',
};

// ---------------------------------------------------------------- inline parse
// Splits a line into TextRuns, honouring **bold**, *italic*, `code`, and
// giving the [MUST]/[SHOULD]/[LATER] priority tags their own colour so a
// reader can scan obligation level down the page.
function inlineRuns(text, base = {}) {
  const runs = [];
  if (text == null) return [new TextRun({ text: '', font: FONT, ...base })];

  // Normalise the characters Word renders badly or that arrive from research.
  let s = String(text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/ /g, ' ')
    .replace(/\\\|/g, '|');

  const TOKEN = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*\n]+\*|\[(?:MUST|SHOULD|LATER|MAY)\]|OPEN-Q\d*)/g;
  let last = 0;
  let m;
  while ((m = TOKEN.exec(s)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: s.slice(last, m.index), font: FONT, color: C.ink, ...base }));
    }
    const tok = m[0];
    if (/^\*\*[\s\S]+\*\*$/.test(tok) || /^__[\s\S]+__$/.test(tok)) {
      runs.push(new TextRun({ text: tok.slice(2, -2), bold: true, font: FONT, color: C.ink, ...base }));
    } else if (/^`[\s\S]+`$/.test(tok)) {
      runs.push(new TextRun({
        text: tok.slice(1, -1), font: MONO, size: 18,
        shading: { type: ShadingType.CLEAR, fill: C.codeBg }, color: C.ink, ...base,
      }));
    } else if (/^\[(MUST|SHOULD|LATER|MAY)\]$/.test(tok)) {
      const kind = tok.slice(1, -1);
      const col = kind === 'MUST' ? C.must : kind === 'SHOULD' ? C.should : C.later;
      runs.push(new TextRun({ text: tok, bold: true, font: FONT, color: col, ...base }));
    } else if (/^OPEN-Q/.test(tok)) {
      runs.push(new TextRun({ text: tok, bold: true, font: FONT, color: C.accent2, ...base }));
    } else if (/^\*[\s\S]+\*$/.test(tok)) {
      runs.push(new TextRun({ text: tok.slice(1, -1), italics: true, font: FONT, color: C.ink, ...base }));
    } else {
      runs.push(new TextRun({ text: tok, font: FONT, color: C.ink, ...base }));
    }
    last = m.index + tok.length;
  }
  if (last < s.length) {
    runs.push(new TextRun({ text: s.slice(last), font: FONT, color: C.ink, ...base }));
  }
  return runs.length ? runs : [new TextRun({ text: '', font: FONT, ...base })];
}

function plain(text) {
  return String(text == null ? '' : text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/\*\*/g, '').replace(/__/g, '')
    .replace(/`/g, '').replace(/\*/g, '')
    .trim();
}

// ---------------------------------------------------------------- table widths
// Column widths must sum to the table width and be set on the table AND every
// cell (percentage widths break in other word processors). Weight each column
// by the longest cell it holds, then clamp so no column collapses.
function columnWidths(rows, total) {
  const cols = Math.max(...rows.map(r => r.length));
  const score = new Array(cols).fill(1);
  rows.forEach((r, ri) => {
    r.forEach((cell, ci) => {
      // Header text is short but must not be squeezed; weight body rows more.
      const len = plain(cell).length;
      const w = ri === 0 ? Math.min(len, 18) : Math.min(len, 90);
      if (w > score[ci]) score[ci] = w;
    });
  });
  const min = Math.max(700, Math.floor(total / (cols * 2.6)));
  let widths = score.map(s => Math.max(min, s));
  const sum = widths.reduce((a, b) => a + b, 0);
  widths = widths.map(w => Math.max(min, Math.round((w / sum) * total)));
  // Fix rounding drift onto the widest column so the sum is exact.
  const drift = total - widths.reduce((a, b) => a + b, 0);
  const widest = widths.indexOf(Math.max(...widths));
  widths[widest] += drift;
  return widths;
}

function cellBorders() {
  const e = { style: BorderStyle.SINGLE, size: 4, color: C.rule };
  return { top: e, bottom: e, left: e, right: e };
}

function buildTable(rows) {
  const cols = Math.max(...rows.map(r => r.length));
  const widths = columnWidths(rows, TABLE_W);

  const trs = rows.map((cells, ri) => {
    const padded = cells.slice();
    while (padded.length < cols) padded.push('');
    return new TableRow({
      tableHeader: ri === 0,
      cantSplit: false,
      children: padded.slice(0, cols).map((cell, ci) => new TableCell({
        width: { size: widths[ci], type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        verticalAlign: VerticalAlign.TOP,
        shading: ri === 0
          ? { type: ShadingType.CLEAR, fill: C.headHdr, color: 'auto' }
          : undefined,
        borders: cellBorders(),
        children: String(cell).split(/<br\s*\/?>/i).map((part, pi) => new Paragraph({
          spacing: { before: pi === 0 ? 0 : 40, after: 0, line: 240 },
          children: inlineRuns(part, ri === 0 ? { bold: true, size: 18 } : { size: 18 }),
        })),
      })),
    });
  });

  return new Table({
    columnWidths: widths,
    width: { size: TABLE_W, type: WidthType.DXA },
    rows: trs,
  });
}

// ---------------------------------------------------------------- block render
function isTableDivider(line) {
  return /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes('-');
}
function splitRow(line) {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map(c => c.trim());
}

function heading(level, text) {
  const map = {
    1: { h: HeadingLevel.HEADING_1, size: 30, color: C.accent,  before: 380, after: 150, rule: true },
    2: { h: HeadingLevel.HEADING_2, size: 25, color: C.accent2, before: 300, after: 110, rule: false },
    3: { h: HeadingLevel.HEADING_3, size: 22, color: C.ink,     before: 240, after: 90,  rule: false },
    4: { h: HeadingLevel.HEADING_4, size: 20, color: C.muted,   before: 200, after: 80,  rule: false },
  };
  const st = map[level] || map[4];
  return new Paragraph({
    heading: st.h,
    keepNext: true,
    spacing: { before: st.before, after: st.after },
    border: st.rule
      ? { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.rule, space: 6 } }
      : undefined,
    children: inlineRuns(text, { bold: true, size: st.size, color: st.color }),
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 130, line: 276 },
    alignment: AlignmentType.LEFT,
    indent: opts.indent,
    children: inlineRuns(text, opts.run || {}),
  });
}

function bullet(text, level) {
  return new Paragraph({
    numbering: { reference: 'spec-bullets', level: Math.min(level, 2) },
    spacing: { before: 0, after: 70, line: 268 },
    children: inlineRuns(text),
  });
}

// Ordered items keep the author's own number as literal text with a hanging
// indent, so requirement numbering never drifts from the cross-references.
function ordered(marker, text, level) {
  const left = 360 + level * 360;
  return new Paragraph({
    spacing: { before: 0, after: 70, line: 268 },
    indent: { left: left + 340, hanging: 340 },
    children: [
      new TextRun({ text: marker + '\t', bold: true, font: FONT, color: C.accent2 }),
      ...inlineRuns(text),
    ],
    tabStops: [{ type: TabStopType.LEFT, position: left + 340 }],
  });
}

function codeLine(text, first, last) {
  return new Paragraph({
    spacing: { before: first ? 90 : 0, after: last ? 140 : 0, line: 230 },
    shading: { type: ShadingType.CLEAR, fill: C.codeBg, color: 'auto' },
    indent: { left: 120, right: 120 },
    children: [new TextRun({ text: text.length ? text : ' ', font: MONO, size: 16, color: C.ink })],
  });
}

function quote(text) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 268 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 10 } },
    children: inlineRuns(text, { italics: true, color: C.muted }),
  });
}

function rule() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.rule, space: 4 } },
    children: [new TextRun({ text: '', font: FONT })],
  });
}

/** Convert a markdown string into an array of docx block elements. */
function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ---- page break marker
    if (trimmed === '<<<PAGEBREAK>>>') {
      out.push(new Paragraph({ children: [new PageBreak()] }));
      i++; continue;
    }

    // ---- blank
    if (!trimmed) { i++; continue; }

    // ---- fenced code / ASCII diagram
    if (/^```/.test(trimmed)) {
      i++;
      const buf = [];
      while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
      i++; // closing fence
      while (buf.length && !buf[0].trim()) buf.shift();
      while (buf.length && !buf[buf.length - 1].trim()) buf.pop();
      buf.forEach((l, k) => out.push(codeLine(l.replace(/\t/g, '    '), k === 0, k === buf.length - 1)));
      continue;
    }

    // ---- horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { out.push(rule()); i++; continue; }

    // ---- heading
    const h = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = Math.max(1, h[1].length - 1);   // '##' is the section level
      out.push(heading(lvl, h[2].replace(/\s*#+\s*$/, '')));
      i++; continue;
    }

    // ---- pipe table (needs a divider row directly beneath the header)
    if (trimmed.includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const rows = [splitRow(lines[i])];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        if (isTableDivider(lines[i])) { i++; continue; }
        rows.push(splitRow(lines[i]));
        i++;
      }
      out.push(buildTable(rows));
      out.push(new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: '', font: FONT })] }));
      continue;
    }

    // ---- blockquote
    if (/^>\s?/.test(trimmed)) {
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, '')); i++;
      }
      out.push(quote(buf.join(' ').trim()));
      continue;
    }

    // ---- list item (bullet or ordered), with continuation lines folded in
    const li = line.match(/^(\s*)([-*+]|\d+[.)]|[a-zA-Z][.)])\s+(.*)$/);
    if (li) {
      const indentSpaces = li[1].replace(/\t/g, '    ').length;
      const level = Math.min(Math.floor(indentSpaces / 2), 2);
      const marker = li[2];
      let text = li[3];
      // fold wrapped continuation lines into the same item
      let j = i + 1;
      while (j < lines.length) {
        const nxt = lines[j];
        if (!nxt.trim()) break;
        if (/^(\s*)([-*+]|\d+[.)]|[a-zA-Z][.)])\s+/.test(nxt)) break;
        if (/^\s*#{1,6}\s/.test(nxt)) break;
        if (nxt.includes('|')) break;
        if (/^```/.test(nxt.trim())) break;
        const lead = nxt.match(/^\s*/)[0].replace(/\t/g, '    ').length;
        if (lead < indentSpaces + 1) break;
        text += ' ' + nxt.trim();
        j++;
      }
      i = j;
      if (/^[-*+]$/.test(marker)) out.push(bullet(text, level));
      else out.push(ordered(marker, text, level));
      continue;
    }

    // ---- paragraph (fold soft-wrapped lines)
    const buf = [trimmed];
    i++;
    while (i < lines.length) {
      const nxt = lines[i];
      if (!nxt.trim()) break;
      if (/^\s*#{1,6}\s/.test(nxt)) break;
      if (/^```/.test(nxt.trim())) break;
      if (/^(\s*)([-*+]|\d+[.)])\s+/.test(nxt)) break;
      if (/^>\s?/.test(nxt.trim())) break;
      if (nxt.includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) break;
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(nxt.trim())) break;
      buf.push(nxt.trim());
      i++;
    }
    out.push(body(buf.join(' ')));
  }

  return out;
}

// ---------------------------------------------------------------- cover + TOC
function coverPage(meta) {
  const el = [];
  el.push(new Paragraph({ spacing: { before: 1500, after: 0 }, children: [
    new TextRun({ text: meta.org.toUpperCase(), bold: true, size: 22, color: C.muted, font: FONT, characterSpacing: 40 }),
  ]}));
  el.push(new Paragraph({ spacing: { before: 40, after: 0 }, children: [
    new TextRun({ text: meta.unit, size: 20, color: C.muted, font: FONT }),
  ]}));
  el.push(new Paragraph({
    spacing: { before: 40, after: 300 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 12 } },
    children: [new TextRun({ text: '', font: FONT })],
  }));
  el.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [
    new TextRun({ text: meta.title, bold: true, size: 52, color: C.accent, font: FONT }),
  ]}));
  el.push(new Paragraph({ spacing: { after: 500 }, children: [
    new TextRun({ text: meta.subtitle, size: 26, color: C.accent2, font: FONT }),
  ]}));

  const rows = [['Field', 'Detail']].concat(meta.facts);
  el.push(buildTable(rows));

  el.push(new Paragraph({ spacing: { before: 500, after: 60 }, children: [
    new TextRun({ text: 'How to read this document', bold: true, size: 24, color: C.accent2, font: FONT }),
  ]}));
  meta.howToRead.forEach(t => el.push(bullet(t, 0)));

  el.push(new Paragraph({ children: [new PageBreak()] }));
  return el;
}

function tocPage() {
  return [
    new Paragraph({
      spacing: { before: 200, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C.rule, space: 6 } },
      children: [new TextRun({ text: 'Contents', bold: true, size: 34, color: C.accent, font: FONT })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({
        text: 'If the list below appears empty or out of date, press Ctrl+A then F9 in Word to refresh it.',
        italics: true, size: 17, color: C.muted, font: FONT,
      })],
    }),
    new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-3' }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ---------------------------------------------------------------- document
function build(md, meta) {
  const numbering = {
    config: [{
      reference: 'spec-bullets',
      levels: [0, 1, 2].map(l => ({
        level: l,
        format: LevelFormat.BULLET,
        text: ['•', '◦', '▪'][l],
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360 + l * 360, hanging: 240 } } },
      })),
    }],
  };

  const header = new Header({ children: [new Paragraph({
    spacing: { after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.rule, space: 4 } },
    children: [
      new TextRun({ text: meta.runningHead, size: 15, color: C.muted, font: FONT }),
      new TextRun({ children: [new PositionalTab({
        alignment: PositionalTabAlignment.RIGHT,
        relativeTo: PositionalTabRelativeTo.MARGIN,
        leader: PositionalTabLeader.NONE,
      })] }),
      new TextRun({ text: meta.docCode, size: 15, color: C.muted, font: FONT }),
    ],
  })] });

  const footer = new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: meta.docCode + '   |   Page ', size: 15, color: C.muted, font: FONT }),
      new TextRun({ children: [PageNumber.CURRENT], size: 15, color: C.muted, font: FONT }),
      new TextRun({ text: ' of ', size: 15, color: C.muted, font: FONT }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: C.muted, font: FONT }),
    ],
  })] });

  const doc = new Document({
    creator: meta.creator,
    title: meta.title,
    description: meta.subtitle,
    features: { updateFields: true },
    numbering,
    styles: {
      default: {
        document: { run: { font: FONT, size: 21, color: C.ink } },
      },
      paragraphStyles: [
        { id: 'Normal', name: 'Normal', quickFormat: true,
          run: { font: FONT, size: 21, color: C.ink },
          paragraph: { spacing: { line: 276, after: 130 } } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN,
                    header: 500, footer: 500 },
        },
      },
      headers: { default: header },
      footers: { default: footer },
      children: [
        ...coverPage(meta),
        ...tocPage(),
        ...renderMarkdown(md),
      ],
    }],
  });

  return doc;
}

// ---------------------------------------------------------------- entry point
async function main() {
  const [inFile, outFile, metaFile] = process.argv.slice(2);
  if (!inFile || !outFile) {
    console.error('usage: node build_doc.js <input.md> <output.docx> [meta.json]');
    process.exit(2);
  }
  const md = fs.readFileSync(inFile, 'utf8');
  const meta = JSON.parse(fs.readFileSync(metaFile || path.join(__dirname, 'doc_meta.json'), 'utf8'));
  const doc = build(md, meta);
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outFile, buf);
  const words = md.split(/\s+/).filter(Boolean).length;
  console.log(`wrote ${outFile}  (${(buf.length / 1024).toFixed(0)} KB, ~${words} words of source)`);
}

if (require.main === module) {
  main().catch(e => { console.error(e); process.exit(1); });
}

module.exports = { renderMarkdown, build };
