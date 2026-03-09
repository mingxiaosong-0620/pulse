import pool from './connection.js';
import { initializeDatabase } from './schema.js';

async function seed() {
  await initializeDatabase();

  // Clear existing data for re-seeding
  await pool.query('DELETE FROM entries');
  await pool.query('DELETE FROM subcategories');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM profiles');

  // Seed profiles
  await pool.query(`
    INSERT INTO profiles (id, name, avatar) VALUES
      (1, 'Mingxiao', '🦝'),
      (2, 'Partner', '🐢')
  `);
  await pool.query("SELECT setval('profiles_id_seq', 2)");

  // Seed categories
  await pool.query(`
    INSERT INTO categories (id, name, color, icon, sort_order) VALUES
      (1, 'Professional', '#3B82F6', '💼', 1),
      (2, 'People',       '#FB7185', '❤️', 2),
      (3, 'Growth',       '#10B981', '🌱', 3),
      (4, 'Vital',        '#F59E0B', '⚡', 4),
      (5, 'Leisure',      '#A78BFA', '🎮', 5),
      (6, 'Unlabeled',    '#9CA3AF', '❓', 6)
  `);
  await pool.query("SELECT setval('categories_id_seq', 6)");

  // Seed subcategories
  await pool.query(`
    INSERT INTO subcategories (id, category_id, name, icon) VALUES
      (1,  1, 'Deep Work',         '🎯'),
      (2,  1, 'Meetings',          '🤝'),
      (3,  1, 'Email/Comms',       '📧'),
      (4,  1, 'Planning',          '📋'),
      (5,  1, 'Learning/Training', '📚'),
      (6,  1, 'Admin',             '🗂️'),
      (7,  2, 'Partner Time',      '💕'),
      (8,  2, 'Family',            '👨‍👩‍👧'),
      (9,  2, 'Friends',           '👯'),
      (10, 2, 'Networking',        '🌐'),
      (11, 2, 'Community',         '🏘️'),
      (12, 3, 'Reading',           '📖'),
      (13, 3, 'Side Projects',     '🔧'),
      (14, 3, 'Courses',           '🎓'),
      (15, 3, 'Writing/Reflection','✍️'),
      (16, 3, 'Fitness',           '💪'),
      (17, 4, 'Sleep',             '😴'),
      (18, 4, 'Meals/Cooking',     '🍳'),
      (19, 4, 'Hygiene',           '🚿'),
      (20, 4, 'Commute',           '🚇'),
      (21, 4, 'Chores',            '🧹'),
      (22, 4, 'Health',            '🏥'),
      (23, 5, 'Gaming',            '🎮'),
      (24, 5, 'Social Media',      '📱'),
      (25, 5, 'TV/Movies',         '🎬'),
      (26, 5, 'Music',             '🎵'),
      (27, 5, 'Outdoors',          '🏕️'),
      (28, 5, 'Hobbies',           '🎨'),
      (29, 6, 'Untracked',         '❓')
  `);
  await pool.query("SELECT setval('subcategories_id_seq', 29)");

  // Seed sample entries for today and yesterday
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

  const insertEntry = async (profile_id: number, subcategory_id: number, date: string, start_time: string, duration_minutes: number, tags: string, note: string | null) => {
    await pool.query(
      'INSERT INTO entries (profile_id, subcategory_id, date, start_time, duration_minutes, tags, note) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [profile_id, subcategory_id, date, start_time, duration_minutes, tags, note]
    );
  };

  // === Mingxiao's today ===
  await insertEntry(1, 17, today, '00:00', 420, '[]', null);
  await insertEntry(1, 19, today, '07:00', 30,  '[]', null);
  await insertEntry(1, 18, today, '07:30', 30,  '[]', 'Oatmeal + coffee');
  await insertEntry(1, 20, today, '08:00', 30,  '[]', null);
  await insertEntry(1, 1,  today, '08:30', 120, '["#reranker"]', 'Working on SLM reranking model');
  await insertEntry(1, 2,  today, '10:30', 60,  '["#teamSync"]', 'Weekly team standup');
  await insertEntry(1, 3,  today, '11:30', 30,  '[]', null);
  await insertEntry(1, 18, today, '12:00', 60,  '[]', 'Lunch with team');
  await insertEntry(1, 1,  today, '13:00', 90,  '["#reranker"]', 'Fine-tuning experiments');
  await insertEntry(1, 7,  today, '14:30', 30,  '[]', 'Quick call');
  await insertEntry(1, 5,  today, '15:00', 60,  '["#papers"]', 'Reading quantization papers');
  await insertEntry(1, 16, today, '16:00', 60,  '["#gym"]', 'Upper body day');

  // === Mingxiao's yesterday ===
  await insertEntry(1, 17, yesterday, '00:00', 420, '[]', null);
  await insertEntry(1, 19, yesterday, '07:00', 30,  '[]', null);
  await insertEntry(1, 18, yesterday, '07:30', 30,  '[]', null);
  await insertEntry(1, 1,  yesterday, '08:00', 180, '["#reranker"]', 'Model architecture work');
  await insertEntry(1, 18, yesterday, '11:00', 60,  '[]', null);
  await insertEntry(1, 2,  yesterday, '12:00', 60,  '["#1on1"]', '1:1 with manager');
  await insertEntry(1, 13, yesterday, '13:00', 120, '["#pulse"]', 'Building Pulse app');
  await insertEntry(1, 12, yesterday, '15:00', 60,  '[]', 'Finished chapter on transformer arch');
  await insertEntry(1, 9,  yesterday, '16:00', 90,  '[]', 'Coffee with college friends');
  await insertEntry(1, 25, yesterday, '18:00', 120, '[]', 'Movie night');

  // === Mingxiao's two days ago ===
  await insertEntry(1, 17, twoDaysAgo, '00:00', 420, '[]', null);
  await insertEntry(1, 16, twoDaysAgo, '07:00', 60,  '["#run"]', 'Morning run');
  await insertEntry(1, 18, twoDaysAgo, '08:00', 30,  '[]', null);
  await insertEntry(1, 1,  twoDaysAgo, '08:30', 150, '["#reranker"]', null);
  await insertEntry(1, 4,  twoDaysAgo, '11:00', 60,  '[]', 'Sprint planning');
  await insertEntry(1, 18, twoDaysAgo, '12:00', 60,  '[]', null);
  await insertEntry(1, 1,  twoDaysAgo, '13:00', 120, '[]', null);
  await insertEntry(1, 15, twoDaysAgo, '15:00', 60,  '[]', 'Weekly reflection');
  await insertEntry(1, 7,  twoDaysAgo, '16:00', 120, '[]', 'Date night prep + dinner');
  await insertEntry(1, 23, twoDaysAgo, '18:00', 120, '[]', 'Gaming session');

  // === Partner's today ===
  await insertEntry(2, 17, today, '00:00', 480, '[]', null);
  await insertEntry(2, 19, today, '08:00', 30,  '[]', null);
  await insertEntry(2, 18, today, '08:30', 30,  '[]', null);
  await insertEntry(2, 1,  today, '09:00', 120, '[]', 'Working on project');
  await insertEntry(2, 2,  today, '11:00', 60,  '[]', 'Team meeting');
  await insertEntry(2, 18, today, '12:00', 60,  '[]', null);
  await insertEntry(2, 1,  today, '13:00', 120, '[]', null);
  await insertEntry(2, 16, today, '15:00', 45,  '["#yoga"]', 'Yoga class');
  await insertEntry(2, 12, today, '16:00', 60,  '[]', 'Reading');

  // === Partner's yesterday ===
  await insertEntry(2, 17, yesterday, '00:00', 480, '[]', null);
  await insertEntry(2, 18, yesterday, '08:00', 30,  '[]', null);
  await insertEntry(2, 1,  yesterday, '08:30', 150, '[]', null);
  await insertEntry(2, 18, yesterday, '11:00', 60,  '[]', null);
  await insertEntry(2, 14, yesterday, '12:00', 120, '[]', 'Online course');
  await insertEntry(2, 9,  yesterday, '14:00', 90,  '[]', 'Lunch with friends');
  await insertEntry(2, 27, yesterday, '16:00', 120, '[]', 'Hiking');
  await insertEntry(2, 7,  yesterday, '18:00', 120, '[]', 'Dinner together');

  console.log('Database seeded with sample data');
  await pool.end();
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
