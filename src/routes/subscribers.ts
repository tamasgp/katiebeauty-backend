import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { subscriberQueries } from '@/db/queries/subscribers';
import { mapSubscriber } from '@/utils/mappers';

const subscriberSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  consent: z.literal(true),
});

const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'UNSUBSCRIBED']),
});

async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.user?.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Administrator access required',
    });
  }
}

export async function registerSubscriberRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: z.infer<typeof subscriberSchema> }>(
    '/api/subscribers',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = subscriberSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid subscriber data',
          errors: parsed.error.flatten(),
        });
      }

      const email = parsed.data.email.toLowerCase();
      const existing = await subscriberQueries.findByEmail(email);

      if (existing) {
        const row = await subscriberQueries.resubscribe(existing.id, parsed.data.name);
        return reply.send(mapSubscriber(row));
      }

      const row = await subscriberQueries.create(parsed.data.name, email);
      return reply.status(201).send(mapSubscriber(row));
    }
  );

  fastify.get(
    '/api/admin/subscribers',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const rows = await subscriberQueries.listAll();
      return reply.send(rows.map(mapSubscriber));
    }
  );

  fastify.patch<{ Params: { id: string }; Body: z.infer<typeof statusSchema> }>(
    '/api/admin/subscribers/:id/status',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (request: FastifyRequest<{ Params: { id: string }; Body: z.infer<typeof statusSchema> }>, reply: FastifyReply) => {
      const parsed = statusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid status',
        });
      }

      const updated = await subscriberQueries.updateStatus(request.params.id, parsed.data.status);
      if (!updated) {
        return reply.status(404).send({
          message: 'Subscriber not found',
        });
      }

      return reply.send({ ok: true });
    }
  );
}
