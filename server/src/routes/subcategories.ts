import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Create a new subcategory
router.post('/', async (req, res) => {
  const { category_id, name, icon } = req.body;
  if (!category_id || !name || !icon) {
    res.status(400).json({ error: 'category_id, name, and icon are required' });
    return;
  }
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE id = $1', [category_id]);
  if (catRows.length === 0) { res.status(404).json({ error: 'Category not found' }); return; }

  const { rows } = await pool.query(
    'INSERT INTO subcategories (category_id, name, icon) VALUES ($1, $2, $3) RETURNING *',
    [category_id, name, icon]
  );
  res.status(201).json(rows[0]);
});

// Delete a subcategory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM subcategories WHERE id = $1', [id]);
  if (result.rowCount === 0) { res.status(404).json({ error: 'Subcategory not found' }); return; }
  res.status(204).send();
});

export default router;
