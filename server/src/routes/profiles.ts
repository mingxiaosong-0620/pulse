import { Router } from 'express';
import db from '../db/connection.js';

const router = Router();

router.get('/', (_req, res) => {
  const profiles = db.prepare('SELECT * FROM profiles ORDER BY id').all();
  res.json(profiles);
});

export default router;
