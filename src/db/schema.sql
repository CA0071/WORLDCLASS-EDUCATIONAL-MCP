-- Phase 2: D1-backed persistence schema for schoolme101-mcp
-- Apply with: wrangler d1 execute schoolme101-mcp --file src/db/schema.sql

-- Student progress history
CREATE TABLE IF NOT EXISTS student_progress (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id  TEXT    NOT NULL,
  subject     TEXT    NOT NULL,
  score       REAL    NOT NULL,
  country     TEXT,
  locale      TEXT,
  recorded_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress (student_id);
CREATE INDEX IF NOT EXISTS idx_progress_subject ON student_progress (subject);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name TEXT NOT NULL,
  user_id   TEXT NOT NULL,
  role      TEXT NOT NULL,
  country   TEXT,
  locale    TEXT,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_tool ON audit_log (tool_name);
