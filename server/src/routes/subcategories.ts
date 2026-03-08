import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

// Create a new subcategory
router.post('/', (req, res) => {
  const { category_id, name, icon } = req.body;
  if (!category_id || !name || !icon) {
    return res.status(400).json({ error: 'category_id, name, and icon are required' });
  }
  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
  if (!category) return res.status(404).json({ error: 'Category not found' });

  const result = db.prepare('INSERT INTO subcategories (category_id, name, icon) VALUES (?, ?, ?)').run(category_id, name, icon);
  const subcategory = db.prepare('SELECT * FROM subcategories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(subcategory);
});

// Delete a subcategory
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM subcategories WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Subcategory not found' });
  res.status(204).send();
});

export default router;
