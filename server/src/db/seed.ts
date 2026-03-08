import db from './connection.js';
import { initializeDatabase } from './schema.js';

initializeDatabase();

// Clear existing data for re-seeding
db.exec('DELETE FROM entries');
db.exec('DELETE FROM subcategories');
db.exec('DELETE FROM categories');
db.exec('DELETE FROM profiles');

// Seed profiles
const insertProfile = db.prepare('INSERT INTO profiles (id, name, avatar) VALUES (?, ?, ?)');
insertProfile.run(1, 'Mingxiao', '🦝');
insertProfile.run(2, 'Partner', '🐻');

// Seed categories
const insertCategory = db.prepare('INSERT INTO categories (id, name, color, icon, sort_order) VALUES (?, ?, ?, ?, ?)');
insertCategory.run(1, 'Professional', '#3B82F6', '💼', 1);
insertCategory.run(2, 'People',       '#FB7185', '❤️', 2);
insertCategory.run(3, 'Growth',       '#10B981', '🌱', 3);
insertCategory.run(4, 'Vital',        '#F59E0B', '⚡', 4);
insertCategory.run(5, 'Leisure',      '#A78BFA', '🎮', 5);

// Seed subcategories
const insertSub = db.prepare('INSERT INTO subcategories (id, category_id, name, icon) VALUES (?, ?, ?, ?)');
// Professional
insertSub.run(1,  1, 'Deep Work',         '🎯');
insertSub.run(2,  1, 'Meetings',          '🤝');
insertSub.run(3,  1, 'Email/Comms',       '📧');
insertSub.run(4,  1, 'Planning',          '📋');
insertSub.run(5,  1, 'Learning/Training', '📚');
insertSub.run(6,  1, 'Admin',             '🗂️');
// People
insertSub.run(7,  2, 'Partner Time',      '💕');
insertSub.run(8,  2, 'Family',            '👨‍👩‍👧');
insertSub.run(9,  2, 'Friends',           '👯');
insertSub.run(10, 2, 'Networking',        '🌐');
insertSub.run(11, 2, 'Community',         '🏘️');
// Growth
insertSub.run(12, 3, 'Reading',           '📖');
insertSub.run(13, 3, 'Side Projects',     '🔧');
insertSub.run(14, 3, 'Courses',           '🎓');
insertSub.run(15, 3, 'Writing/Reflection','✍️');
insertSub.run(16, 3, 'Fitness',           '💪');
// Vital
insertSub.run(17, 4, 'Sleep',             '😴');
insertSub.run(18, 4, 'Meals/Cooking',     '🍳');
insertSub.run(19, 4, 'Hygiene',           '🚿');
insertSub.run(20, 4, 'Commute',           '🚇');
insertSub.run(21, 4, 'Chores',            '🧹');
insertSub.run(22, 4, 'Health',            '🏥');
// Leisure
insertSub.run(23, 5, 'Gaming',            '🎮');
insertSub.run(24, 5, 'Social Media',      '📱');
insertSub.run(25, 5, 'TV/Movies',         '🎬');
insertSub.run(26, 5, 'Music',             '🎵');
insertSub.run(27, 5, 'Outdoors',          '🏕️');
insertSub.run(28, 5, 'Hobbies',           '🎨');

console.log('Database seeded successfully');
process.exit(0);
