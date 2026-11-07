CREATE TABLE IF NOT EXISTS subjects (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#0e6b5c'
);
CREATE TABLE IF NOT EXISTS tasks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  kind       TEXT NOT NULL DEFAULT 'part',   -- 'part' or 'assignment'
  due        TEXT NOT NULL DEFAULT '',       -- YYYY-MM-DD
  days       INTEGER NOT NULL DEFAULT 1,     -- days needed for this task
  est        INTEGER NOT NULL DEFAULT 60,    -- minutes per day
  plan_dates TEXT NOT NULL DEFAULT '',       -- planned days, comma separated
  done       INTEGER NOT NULL DEFAULT 0,
  done_on    TEXT NOT NULL DEFAULT '',
  logs       TEXT NOT NULL DEFAULT '[]'      -- JSON: [{d:'YYYY-MM-DD', m:minutes}]
);
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
