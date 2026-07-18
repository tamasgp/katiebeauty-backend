import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fjwt from '@fastify/jwt';
import { config } from '@/config/env';

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.register(fjwt, {
      secret: config.jwtSecret,
      sign: { expiresIn: '8h' },
    });

    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      }
    );
  },
  {
    name: 'auth',
  }
);
