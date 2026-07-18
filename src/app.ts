import Fastify from 'fastify';
import { config } from '@/config/env';
import { registerErrorHandler } from '@/hooks/errorHandler';

// Plugins
import corsPlugin from '@/plugins/cors';
import helmetPlugin from '@/plugins/helmet';
import authPlugin from '@/plugins/auth';
import databasePlugin from '@/plugins/database';

// Routes
import { registerHealthRoutes } from '@/routes/health';
import { registerAuthRoutes } from '@/routes/auth';
import { registerPostRoutes } from '@/routes/posts';
import { registerSubscriberRoutes } from '@/routes/subscribers';
import { registerUserRoutes } from '@/routes/users';

const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
fastify.register(corsPlugin);
fastify.register(helmetPlugin);
fastify.register(authPlugin);
fastify.register(databasePlugin);

// Register error handler
registerErrorHandler(fastify);

// Register routes
fastify.register(registerHealthRoutes);
fastify.register(registerAuthRoutes);
fastify.register(registerPostRoutes);
fastify.register(registerSubscriberRoutes);
fastify.register(registerUserRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Katie Beauty API listening at http://localhost:${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
