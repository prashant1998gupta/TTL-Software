-- Phase 1 core schema — the Limited Test path, end to end.
-- Naming per SPEC §25: mst_ master data, txn_ transactions, sys_ system.
-- Human-readable numbers are UNIQUE columns, never primary keys (DB-01).

CREATE TABLE IF NOT EXISTS mst_user (
  id            BIGSERIAL PRIMARY KEY,
  username      VARCHAR(40) NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL,
  full_name_te  VARCHAR(200),                 -- Telugu, shown beside English where useful
  role          VARCHAR(20) NOT NULL CHECK (role IN ('counter','tester','verifier','signatory','admin')),
  pass_salt     VARCHAR(64) NOT NULL,
  pass_hash     VARCHAR(128) NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS mst_customer (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  name_te       VARCHAR(300),
  phone         VARCHAR(20),
  place         VARCHAR(120),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, phone)
);

CREATE TABLE IF NOT EXISTS mst_test (
  id            BIGSERIAL PRIMARY KEY,
  code          VARCHAR(20) NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL,
  name_te       VARCHAR(200),
  fee_rupees    NUMERIC(8,2) NOT NULL,
  readings_required INT NOT NULL,
  -- M8-72: explicit master data, default Non-NABL. No derivation from names.
  is_accredited BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS mst_equipment (
  id            BIGSERIAL PRIMARY KEY,
  code          VARCHAR(20) NOT NULL UNIQUE,
  name          VARCHAR(120) NOT NULL,
  calibrated_to DATE NOT NULL,                -- M11: validity checked at use
  is_in_service BOOLEAN NOT NULL DEFAULT true
);

-- Gap-free number series (WF-112, DB-13). Allocation is SELECT ... FOR UPDATE
-- inside the same transaction as the row that consumes the number, so a crash
-- between the two cannot burn one and two counters can never collide.
CREATE TABLE IF NOT EXISTS sys_series (
  id            BIGSERIAL PRIMARY KEY,
  series_code   VARCHAR(20) NOT NULL,        -- 'SAMPLE' | 'REPORT'
  fin_year      VARCHAR(7)  NOT NULL,        -- '2026-27'
  next_no       BIGINT NOT NULL,
  UNIQUE (series_code, fin_year)
);

CREATE TABLE IF NOT EXISTS txn_sample (
  id            BIGSERIAL PRIMARY KEY,
  sample_no     VARCHAR(30) NOT NULL UNIQUE, -- DVM/26-27/00412
  customer_id   BIGINT NOT NULL REFERENCES mst_customer(id),
  -- M1: frozen snapshot at registration; a later customer edit cannot rewrite history
  customer_name VARCHAR(200) NOT NULL,
  brought_by    VARCHAR(200),
  lot_mark      VARCHAR(60) NOT NULL,
  declared_denier VARCHAR(20) NOT NULL,
  bales         INT NOT NULL DEFAULT 0,
  books         INT NOT NULL DEFAULT 0,
  weight_kg     NUMERIC(8,1),
  test_id       BIGINT NOT NULL REFERENCES mst_test(id),
  test_name     VARCHAR(120) NOT NULL,       -- snapshot
  fee_rupees    NUMERIC(8,2) NOT NULL,       -- snapshot from the rate card of the day
  readings_required INT NOT NULL,
  status        VARCHAR(12) NOT NULL DEFAULT 'REGISTERED'
                CHECK (status IN ('REGISTERED','IN_TEST','SUBMITTED','VERIFIED','ISSUED','WITHDRAWN')),
  registered_by BIGINT NOT NULL REFERENCES mst_user(id),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tester_id     BIGINT REFERENCES mst_user(id),
  equipment_id  BIGINT REFERENCES mst_equipment(id),
  verified_by   BIGINT REFERENCES mst_user(id),
  verified_at   TIMESTAMPTZ,
  sendback_reason TEXT
);
CREATE INDEX IF NOT EXISTS ix_sample_status ON txn_sample(status);
CREATE INDEX IF NOT EXISTS ix_sample_customer ON txn_sample(customer_name);

-- Every original reading, append-only (M6-04). An amended reading is a new row
-- with revises_id set; nothing is ever UPDATEd or DELETEd here.
CREATE TABLE IF NOT EXISTS txn_reading (
  id            BIGSERIAL PRIMARY KEY,
  sample_id     BIGINT NOT NULL REFERENCES txn_sample(id),
  position      INT NOT NULL,                -- 1..n on the bench sheet
  grams         NUMERIC(9,4) NOT NULL,
  entered_by    BIGINT NOT NULL REFERENCES mst_user(id),
  entered_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revises_id    BIGINT REFERENCES txn_reading(id)
);
CREATE INDEX IF NOT EXISTS ix_reading_sample ON txn_reading(sample_id);
-- A reading can be revised by AT MOST one row. Without this, a bug that revised
-- the wrong generation inserted silently; with it, the same bug is an error.
CREATE UNIQUE INDEX IF NOT EXISTS ux_reading_revises ON txn_reading(revises_id)
  WHERE revises_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS txn_report (
  id            BIGSERIAL PRIMARY KEY,
  report_no     VARCHAR(30) NOT NULL UNIQUE, -- DVM/R/26-27/00311
  sample_id     BIGINT NOT NULL REFERENCES txn_sample(id),
  issued_by     BIGINT NOT NULL REFERENCES mst_user(id),
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- M8: the exact issued file, frozen. The sha256 is printed on the paper.
  pdf           BYTEA NOT NULL,
  pdf_sha256    CHAR(64) NOT NULL,
  computed      JSONB NOT NULL,              -- the values as issued, for the record
  verify_token  VARCHAR(43) NOT NULL UNIQUE, -- unguessable, in the QR
  status        VARCHAR(12) NOT NULL DEFAULT 'CURRENT'
                CHECK (status IN ('CURRENT','WITHDRAWN')),
  withdrawn_reason TEXT,
  withdrawn_at  TIMESTAMPTZ
);

-- What the public verification service reads. It holds ONLY what an anonymous
-- scan may see (M9): no results, no customer address, no file.
CREATE TABLE IF NOT EXISTS sys_published_verification (
  verify_token  VARCHAR(43) PRIMARY KEY,
  report_no     VARCHAR(30) NOT NULL,
  sample_no     VARCHAR(30) NOT NULL,
  lot_mark      VARCHAR(60) NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  test_name     VARCHAR(120) NOT NULL,
  issued_on     DATE NOT NULL,
  pdf_sha256    CHAR(64) NOT NULL,
  status        VARCHAR(12) NOT NULL DEFAULT 'CURRENT'
);

-- Append-only audit trail (M21). No UPDATE, no DELETE, ever.
CREATE TABLE IF NOT EXISTS txn_event (
  id            BIGSERIAL PRIMARY KEY,
  at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_id      BIGINT REFERENCES mst_user(id),
  sample_id     BIGINT REFERENCES txn_sample(id),
  action        VARCHAR(40) NOT NULL,
  detail        JSONB
);
CREATE INDEX IF NOT EXISTS ix_event_sample ON txn_event(sample_id);

-- Append-only, enforced where it cannot be argued with. A REVOKE alone is not
-- enough: the table OWNER bypasses it, so a compromised owner connection could
-- still rewrite history. A trigger binds everyone, owner included (DB-04) —
-- and this was found by trying the attack, not by reading about it.
CREATE OR REPLACE FUNCTION refuse_rewrite() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only: % refused', TG_TABLE_NAME, TG_OP;
END $$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='no_rewrite_event') THEN
    CREATE TRIGGER no_rewrite_event BEFORE UPDATE OR DELETE ON txn_event
      FOR EACH ROW EXECUTE FUNCTION refuse_rewrite();
    CREATE TRIGGER no_rewrite_reading BEFORE UPDATE OR DELETE ON txn_reading
      FOR EACH ROW EXECUTE FUNCTION refuse_rewrite();
  END IF;
END $$;
REVOKE UPDATE, DELETE ON txn_event, txn_reading FROM PUBLIC;
