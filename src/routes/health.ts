import { FastifyInstance } from 'fastify';

export async function registerHealthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
  });
}
