import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import { config } from '@/config/env';

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.register(fjwt, {
      secret: config.jwtSecret,
      sign: { expiresIn: '8h' },
    });
  },
  {
    name: 'auth',
  }
);
