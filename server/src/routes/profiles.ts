import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM profiles ORDER BY id');
  res.json(rows);
});

export default router;
