import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { postQueries } from '@/db/queries/posts';
import { mapPost } from '@/utils/mappers';

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().min(1).max(280),
  content: z.string().min(1),
  image: z.string(),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().min(10),
});

async function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (request.user?.role !== 'ADMIN') {
    return reply.status(403).send({
      message: 'Administrator access required',
    });
  }
}

export async function registerPostRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/posts', async (_request: FastifyRequest, reply: FastifyReply) => {
    const rows = await postQueries.listPublished();
    return reply.send(rows.map(mapPost));
  });

  fastify.get<{ Params: { slug: string } }>(
    '/api/posts/:slug',
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      const row = await postQueries.findBySlug(request.params.slug);
      if (!row) {
        return reply.status(404).send({
          message: 'Post not found',
        });
      }
      return reply.send(mapPost(row));
    }
  );

  fastify.get(
    '/api/admin/posts',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const rows = await postQueries.listAll();
      return reply.send(rows.map(mapPost));
    }
  );

  fastify.post<{ Body: z.infer<typeof postSchema> }>(
    '/api/admin/posts',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = postSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid post',
          errors: parsed.error.flatten(),
        });
      }

      const p = parsed.data;
      try {
        const row = await postQueries.create(
          p.title,
          p.slug,
          p.excerpt,
          p.content,
          p.image,
          p.status,
          p.publishedAt,
          request.user!.id
        );
        return reply.status(201).send(mapPost(row));
      } catch (error) {
        if ((error as any).code === '23505') {
          return reply.status(409).send({
            message: 'Slug already exists',
          });
        }
        throw error;
      }
    }
  );

  fastify.put<{ Params: { id: string }; Body: z.infer<typeof postSchema> }>(
    '/api/admin/posts/:id',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (request: FastifyRequest<{ Params: { id: string }; Body: z.infer<typeof postSchema> }>, reply: FastifyReply) => {
      const parsed = postSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid post',
          errors: parsed.error.flatten(),
        });
      }

      const p = parsed.data;
      try {
        const row = await postQueries.update(
          request.params.id,
          p.title,
          p.slug,
          p.excerpt,
          p.content,
          p.image,
          p.status,
          p.publishedAt
        );
        if (!row) {
          return reply.status(404).send({
            message: 'Post not found',
          });
        }
        return reply.send(mapPost(row));
      } catch (error) {
        if ((error as any).code === '23505') {
          return reply.status(409).send({
            message: 'Slug already exists',
          });
        }
        throw error;
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/api/admin/posts/:id',
    { onRequest: [fastify.authenticate, requireAdmin] },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const deleted = await postQueries.delete(request.params.id);
      if (!deleted) {
        return reply.status(404).send({
          message: 'Post not found',
        });
      }
      return reply.status(204).send();
    }
  );
}
