import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export const initDb = async () => {
  if (db) return db;

  db = await open({
    filename: './bambee.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      password VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE
    );
  `);

  await db.run(
    `INSERT OR IGNORE INTO users (id, name, password, email) VALUES (1, 'Alice', '$2b$10$HeyX6EOQItiHiQ7TV/L2YuFxNsk7/aJfLC6UV9NxBNwYn/3mdfJ3a', 'alice@example.com')`,
  );
  await db.run(
    `INSERT OR IGNORE INTO users (id, name, password, email) VALUES (2, 'Bob', '$2b$10$HeyX6EOQItiHiQ7TV/L2YuFxNsk7/aJfLC6UV9NxBNwYn/3mdfJ3a', 'bob@example.com')`,
  );

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name VARCHAR(50) NOT NULL,
         description TEXT,
         status TEXT CHECK (status IN ('todo', 'done')),
         ownerId INTEGER NOT NULL,
         dueDate INTEGER NULL,
         isDeleted BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (ownerId) REFERENCES users(id)
      );
  `);

  return db;
};

export const getDb = (): Database => {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
};
