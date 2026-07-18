import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fhelmet from '@fastify/helmet';

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.register(fhelmet, {
      crossOriginResourcePolicy: false,
    });
  },
  {
    name: 'helmet',
  }
);
