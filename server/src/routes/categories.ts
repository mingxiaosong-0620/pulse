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

export default router;
