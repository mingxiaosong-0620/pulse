import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Daily breakdown by category
router.get('/daily', async (req, res) => {
  const { profile_id, date } = req.query;
  if (!profile_id || !date) {
    res.status(400).json({ error: 'profile_id and date required' });
    return;
  }

  const { rows: stats } = await pool.query(`
    SELECT c.id, c.name, c.color, c.icon,
           COALESCE(SUM(e.duration_minutes), 0)::int as total_minutes
    FROM categories c
    LEFT JOIN subcategories s ON s.category_id = c.id
    LEFT JOIN entries e ON e.subcategory_id = s.id AND e.profile_id = $1 AND e.date = $2
    GROUP BY c.id, c.name, c.color, c.icon, c.sort_order
    ORDER BY c.sort_order
  `, [profile_id, date]);

  // Calculate unlabeled time (24h = 1440 min minus tracked)
  const tracked = stats.reduce((sum: number, s: any) => sum + s.total_minutes, 0);
  const unlabeled = Math.max(0, 1440 - tracked);
  const unlabeledCat = stats.find((s: any) => s.name === 'Unlabeled');
  if (unlabeledCat) {
    unlabeledCat.total_minutes = unlabeled;
  } else {
    stats.push({ id: 6, name: 'Unlabeled', color: '#9CA3AF', icon: '❓', total_minutes: unlabeled });
  }
  res.json(stats);
});

// Weekly breakdown by category
router.get('/weekly', async (req, res) => {
  const { profile_id, start_date, end_date } = req.query;
  if (!profile_id || !start_date || !end_date) {
    res.status(400).json({ error: 'profile_id, start_date, and end_date required' });
    return;
  }

  const { rows: daily } = await pool.query(`
    SELECT e.date, c.id as category_id, c.name as category_name, c.color,
           SUM(e.duration_minutes)::int as total_minutes
    FROM entries e
    JOIN subcategories s ON e.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE e.profile_id = $1 AND e.date >= $2 AND e.date <= $3
    GROUP BY e.date, c.id, c.name, c.color, c.sort_order
    ORDER BY e.date, c.sort_order
  `, [profile_id, start_date, end_date]);

  const { rows: totals } = await pool.query(`
    SELECT c.id, c.name, c.color, c.icon,
           COALESCE(SUM(e.duration_minutes), 0)::int as total_minutes
    FROM categories c
    LEFT JOIN subcategories s ON s.category_id = c.id
    LEFT JOIN entries e ON e.subcategory_id = s.id
      AND e.profile_id = $1 AND e.date >= $2 AND e.date <= $3
    GROUP BY c.id, c.name, c.color, c.icon
    ORDER BY total_minutes DESC
  `, [profile_id, start_date, end_date]);

  res.json({ daily, totals });
});

export default router;
