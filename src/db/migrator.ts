import { getDatabase } from '@/db/database';
import { migration as V001 } from '@/db/migrations/V001__initial_schema';

export interface Migration {
  version: number;
  description: string;
  up: string;
}

// All migrations in order — add new ones here as the schema evolves
const migrations: Migration[] = [V001];

export async function runMigrations(): Promise<void> {
  const pool = getDatabase();

  // Ensure the migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     INTEGER PRIMARY KEY,
      description TEXT    NOT NULL,
      applied_at  TEXT    NOT NULL
    )
  `);

  // Determine which migrations have already been applied
  const { rows } = await pool.query<{ version: number }>(
    'SELECT version FROM schema_migrations ORDER BY version'
  );
  const appliedVersions = new Set(rows.map((r) => r.version));

  // Run each pending migration inside its own transaction
  const pending = migrations
    .filter((m) => !appliedVersions.has(m.version))
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(migration.up);
      await client.query(
        'INSERT INTO schema_migrations (version, description, applied_at) VALUES ($1, $2, $3)',
        [migration.version, migration.description, new Date().toISOString()]
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
