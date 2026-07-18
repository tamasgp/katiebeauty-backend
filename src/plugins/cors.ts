import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fcors from '@fastify/cors';
import { config } from '@/config/env';

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.register(fcors, {
      origin: config.frontendOrigin,
    });
  },
  {
    name: 'cors',
  }
);
