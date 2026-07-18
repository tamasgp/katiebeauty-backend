import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { userQueries } from '@/db/queries/users';
import { mapUser } from '@/utils/mappers';

async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.user?.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Administrator access required',
    });
  }
}

export async function registerUserRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/api/admin/users',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const rows = userQueries.listAll();
      return reply.send(rows.map(mapUser));
    }
  );
}
