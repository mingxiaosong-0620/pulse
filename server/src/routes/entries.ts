import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

// Get entries for a profile on a date
router.get('/', (req, res) => {
  const { profile_id, date } = req.query;
  if (!profile_id || !date) {
    res.status(400).json({ error: 'profile_id and date required' });
    return;
  }

  const entries = db.prepare(`
    SELECT e.*, s.name as subcategory_name, s.icon as subcategory_icon,
           c.name as category_name, c.color as category_color, c.icon as category_icon, c.id as category_id
    FROM entries e
    JOIN subcategories s ON e.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE e.profile_id = ? AND e.date = ?
    ORDER BY e.start_time ASC, e.created_at ASC
  `).all(profile_id, date);

  res.json(entries);
});

// Create entry
router.post('/', (req, res) => {
  const { profile_id, subcategory_id, date, start_time, duration_minutes, tags, note } = req.body;

  if (!profile_id || !subcategory_id || !date) {
    res.status(400).json({ error: 'profile_id, subcategory_id, and date required' });
    return;
  }

  const result = db.prepare(`
    INSERT INTO entries (profile_id, subcategory_id, date, start_time, duration_minutes, tags, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    profile_id,
    subcategory_id,
    date,
    start_time || null,
    duration_minutes || 15,
    JSON.stringify(tags || []),
    note || null
  );

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(entry);
});

// Update entry
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { subcategory_id, start_time, duration_minutes, tags, note } = req.body;

  db.prepare(`
    UPDATE entries SET
      subcategory_id = COALESCE(?, subcategory_id),
      start_time = COALESCE(?, start_time),
      duration_minutes = COALESCE(?, duration_minutes),
      tags = COALESCE(?, tags),
      note = COALESCE(?, note)
    WHERE id = ?
  `).run(subcategory_id, start_time, duration_minutes, tags ? JSON.stringify(tags) : null, note, id);

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(id);
  res.json(entry);
});

// Delete entry
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
