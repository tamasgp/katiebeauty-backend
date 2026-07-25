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
  const db = getDatabase();

  // Ensure the migrations tracking table exists
  await db.raw(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     INTEGER PRIMARY KEY,
      description TEXT    NOT NULL,
      applied_at  TEXT    NOT NULL
    )
  `);

  // Determine which migrations have already been applied
  const { rows } = await db.raw<{ rows: { version: number }[] }>(
    'SELECT version FROM schema_migrations ORDER BY version'
  );
  const appliedVersions = new Set(rows.map((r) => r.version));

  // Run each pending migration inside its own transaction
  const pending = migrations
    .filter((m) => !appliedVersions.has(m.version))
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await db.transaction(async (trx) => {
      await trx.raw(migration.up);
      await trx.raw(
        'INSERT INTO schema_migrations (version, description, applied_at) VALUES (?, ?, ?)',
        [migration.version, migration.description, new Date().toISOString()]
      );
    });
  }
}
