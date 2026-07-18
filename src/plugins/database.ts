import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { initializeDatabase, closeDatabase } from '@/db/database';
import { initializeSchema } from '@/db/schema';
import { userQueries } from '@/db/queries/users';
import { config } from '@/config/env';
import { postQueries } from '@/db/queries/posts';

export default fp(
  async (fastify: FastifyInstance) => {
    // Initialize database connection
    initializeDatabase();

    // Initialize schema
    initializeSchema();

    // Seed admin user if doesn't exist
    userQueries.seedAdmin(config.admin.email, config.admin.name, config.admin.password);

    // Log seed info
    const adminExists = userQueries.findByEmail(config.admin.email);
    if (adminExists && config.nodeEnv === 'development') {
      fastify.log.info(`Admin user ready: ${config.admin.email}`);
    }

    // Hook to close database on app shutdown
    fastify.addHook('onClose', async () => {
      closeDatabase();
      fastify.log.info('Database connection closed');
    });
  },
  {
    name: 'database',
  }
);
