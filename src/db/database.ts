import pg from 'pg';
import { config } from '@/config/env';

const { Pool } = pg;

let pool: pg.Pool;

export function initializeDatabase(): pg.Pool {
  pool = new Pool({
    connectionString: config.databaseUrl,
  });
  return pool;
}

export function getDatabase(): pg.Pool {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
