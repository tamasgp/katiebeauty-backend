import knexLib, { type Knex } from 'knex';
import { config } from '@/config/env';

let db: Knex;

export function initializeDatabase(): Knex {
  db = knexLib({
    client: 'pg',
    connection: config.databaseUrl,
  });
  return db;
}

export function getDatabase(): Knex {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.destroy();
  }
}
