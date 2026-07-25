import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { initializeDatabase, closeDatabase } from '@/db/database';
import { runMigrations } from '@/db/migrator';
import { userQueries } from '@/db/queries/users';
import { config } from '@/config/env';

export default fp(
  async (fastify: FastifyInstance) => {
    // Initialize database connection
    initializeDatabase();

    // Run pending schema migrations
    await runMigrations();

    // Seed admin user if doesn't exist
    await userQueries.seedAdmin(config.admin.email, config.admin.name, config.admin.password);

    // Log seed info
    const adminExists = await userQueries.findByEmail(config.admin.email);
    if (adminExists && config.nodeEnv === 'development') {
      fastify.log.info(`Admin user ready: ${config.admin.email}`);
    }

    // Hook to close database on app shutdown
    fastify.addHook('onClose', async () => {
      await closeDatabase();
      fastify.log.info('Database connection closed');
    });
  },
  {
    name: 'database',
  }
);
