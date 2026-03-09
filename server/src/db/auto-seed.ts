import pool from './connection.js';

/**
 * Auto-seed the database with default categories and profiles
 * if it's empty (first deploy). Does NOT add sample entries.
 */
export async function autoSeed(): Promise<void> {
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM profiles');
  if (parseInt(rows[0].count) > 0) return; // Already seeded

  console.log('Empty database detected — seeding defaults...');

  await pool.query(`
    INSERT INTO profiles (id, name, avatar) VALUES
      (1, 'Mingxiao', '🦝'),
      (2, 'Erik', '🐢')
    ON CONFLICT DO NOTHING;

    SELECT setval('profiles_id_seq', 2);

    INSERT INTO categories (id, name, color, icon, sort_order) VALUES
      (1, 'Professional', '#3B82F6', '💼', 1),
      (2, 'People',       '#FB7185', '❤️', 2),
      (3, 'Growth',       '#10B981', '🌱', 3),
      (4, 'Vital',        '#F59E0B', '⚡', 4),
      (5, 'Leisure',      '#A78BFA', '🎮', 5),
      (6, 'Unlabeled',    '#9CA3AF', '❓', 6)
    ON CONFLICT DO NOTHING;

    SELECT setval('categories_id_seq', 6);

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
    ON CONFLICT DO NOTHING;

    SELECT setval('subcategories_id_seq', 29);
  `);

  console.log('Database seeded with default categories and profiles');
}
