import { Router } from 'express';
import { db } from '../config/db.js';

const router = Router();

// List markers
router.get('/', (_req, res) => {
  db.all('SELECT * FROM markers ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create marker
router.post('/', (req, res) => {
  const { title, description, lat, lng } = req.body || {};
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'lat and lng required (number)' });
  }
  const stmt = db.prepare('INSERT INTO markers (title, description, lat, lng) VALUES (?, ?, ?, ?)');
  stmt.run(title || null, description || null, lat, lng, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM markers WHERE id = ?', this.lastID, (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      res.status(201).json(row);
    });
  });
});

// Update marker
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, description, lat, lng } = req.body || {};
  const stmt = db.prepare(
    'UPDATE markers SET title = COALESCE(?, title), description = COALESCE(?, description), lat = COALESCE(?, lat), lng = COALESCE(?, lng), updated_at = datetime(\'now\') WHERE id = ?'
  );
  stmt.run(title, description, lat, lng, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM markers WHERE id = ?', id, (getErr, row) => {
      if (getErr) return res.status(500).json({ error: getErr.message });
      res.json(row);
    });
  });
});

// Delete marker
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  db.run('DELETE FROM markers WHERE id = ?', id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes > 0 });
  });
});

export default router;