import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

router.get('/', (_req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order').all() as any[];
  const subcategories = db.prepare('SELECT * FROM subcategories ORDER BY id').all() as any[];

  const result = categories.map(cat => ({
    ...cat,
    subcategories: subcategories.filter(sub => sub.category_id === cat.id)
  }));

  res.json(result);
});

// Create a new category
router.post('/', (req, res) => {
  const { name, color, icon } = req.body;
  if (!name || !color || !icon) {
    return res.status(400).json({ error: 'name, color, and icon are required' });
  }
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM categories').get() as any;
  const result = db.prepare('INSERT INTO categories (name, color, icon, sort_order) VALUES (?, ?, ?, ?)').run(name, color, icon, maxOrder.max_order + 1);
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as any;
  res.status(201).json({ ...category, subcategories: [] });
});

// Update a category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, color, icon } = req.body;
  if (!name || !color || !icon) {
    return res.status(400).json({ error: 'name, color, and icon are required' });
  }
  db.prepare('UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ?').run(name, color, icon, id);
  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as any;
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const subcategories = db.prepare('SELECT * FROM subcategories WHERE category_id = ? ORDER BY id').all(id);
  res.json({ ...category, subcategories });
});

// Delete a category and its subcategories
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM subcategories WHERE category_id = ?').run(id);
  const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
  res.status(204).send();
});

export default router;
