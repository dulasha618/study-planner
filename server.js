const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'planner.db'));
db.exec('PRAGMA foreign_keys = ON');

function tx(fn) {
  db.exec('BEGIN');
  try { fn(); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; }
}
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// Upgrade an older planner.db (adds the new columns if missing)
const cols = db.prepare('PRAGMA table_info(tasks)').all().map(c => c.name);
[['days', 'INTEGER NOT NULL DEFAULT 1'], ['est', 'INTEGER NOT NULL DEFAULT 60'],
 ['plan_dates', "TEXT NOT NULL DEFAULT ''"], ['logs', "TEXT NOT NULL DEFAULT '[]'"]]
  .forEach(([n, d]) => { if (!cols.includes(n)) db.exec('ALTER TABLE tasks ADD COLUMN ' + n + ' ' + d); });

db.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES ('perDay','3')").run();
db.prepare("INSERT OR IGNORE INTO settings (key,value) VALUES ('startTime','16:00')").run();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const setting = k => db.prepare('SELECT value FROM settings WHERE key=?').get(k).value;
const num = (v, min, d) => Math.max(min, parseInt(v, 10) || d);

app.get('/api/state', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id').all();
  const subjects = db.prepare('SELECT * FROM subjects ORDER BY id').all().map(s => ({
    id: String(s.id), name: s.name, color: s.color,
    tasks: tasks.filter(t => t.subject_id === s.id).map(t => ({
      id: String(t.id), t: t.title, kind: t.kind, due: t.due, days: t.days, est: t.est,
      dates: t.plan_dates ? t.plan_dates.split(',') : [],
      done: !!t.done, doneOn: t.done_on, logs: JSON.parse(t.logs || '[]')
    }))
  }));
  res.json({ perDay: parseInt(setting('perDay'), 10), startTime: setting('startTime'), subjects });
});

app.put('/api/settings', (req, res) => {
  const up = db.prepare('UPDATE settings SET value=? WHERE key=?');
  up.run(String(Math.min(12, num(req.body.perDay, 1, 3))), 'perDay');
  if (/^\d\d:\d\d$/.test(req.body.startTime || '')) up.run(req.body.startTime, 'startTime');
  res.json({ ok: true });
});

app.post('/api/subjects', (req, res) => {
  const name = String(req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'name required' });
  db.prepare('INSERT INTO subjects (name,color) VALUES (?,?)').run(name, req.body.color || '#0e6b5c');
  res.json({ ok: true });
});
app.patch('/api/subjects/:id', (req, res) => {
  const name = String(req.body.name || '').trim();
  if (name) db.prepare('UPDATE subjects SET name=? WHERE id=?').run(name, Number(req.params.id));
  if (req.body.color) db.prepare('UPDATE subjects SET color=? WHERE id=?').run(req.body.color, Number(req.params.id));
  res.json({ ok: true });
});
app.delete('/api/subjects/:id', (req, res) => {
  db.prepare('DELETE FROM subjects WHERE id=?').run(Number(req.params.id));
  res.json({ ok: true });
});

app.post('/api/subjects/:id/tasks', (req, res) => {
  const b = req.body, title = String(b.t || '').trim();
  if (!title) return res.status(400).json({ error: 'title required' });
  db.prepare('INSERT INTO tasks (subject_id,title,kind,due,days,est) VALUES (?,?,?,?,?,?)')
    .run(Number(req.params.id), title, b.kind === 'assignment' ? 'assignment' : 'part', b.due || '', num(b.days, 1, 1), num(b.est, 5, 60));
  res.json({ ok: true });
});
app.patch('/api/tasks/:id', (req, res) => {
  const b = req.body;
  db.prepare('UPDATE tasks SET title=?,kind=?,due=?,days=?,est=?,plan_dates=?,done=?,done_on=?,logs=? WHERE id=?')
    .run(String(b.t || '').trim() || 'Untitled', b.kind === 'assignment' ? 'assignment' : 'part', b.due || '',
      num(b.days, 1, 1), num(b.est, 5, 60), (b.dates || []).join(','), b.done ? 1 : 0,
      b.done ? (b.doneOn || '') : '', JSON.stringify(b.logs || []), Number(req.params.id));
  res.json({ ok: true });
});
app.delete('/api/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id=?').run(Number(req.params.id));
  res.json({ ok: true });
});

// Save the generated plan: [{id, dates:[...]}]
app.post('/api/plan', (req, res) => {
  const upd = db.prepare('UPDATE tasks SET plan_dates=? WHERE id=?');
  tx(() => (req.body.items || []).forEach(i => upd.run((i.dates || []).join(','), Number(i.id))));
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Study Planner running: http://localhost:' + PORT));
