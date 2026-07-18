import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { userQueries } from '@/db/queries/users';
import { comparePassword } from '@/utils/password';
import { signToken } from '@/utils/token';
import { AuthUser } from '@/types';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerAuthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<{ Body: z.infer<typeof registerSchema> }>(
    '/api/auth/register',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid registration data',
          errors: parsed.error.flatten(),
        });
      }

      const { name, password } = parsed.data;
      const email = parsed.data.email.toLowerCase();

      try {
        const user = await userQueries.create(name, email, password, 'USER');
        return reply.status(201).send({
          token: signToken(user),
          user,
        });
      } catch (error) {
        if ((error as any).code === '23505') {
          return reply.status(409).send({
            message: 'This email address is already registered',
          });
        }
        throw error;
      }
    }
  );

  fastify.post<{ Body: z.infer<typeof loginSchema> }>(
    '/api/auth/login',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid login data',
        });
      }

      const row = await userQueries.findByEmail(parsed.data.email);
      if (!row || !(await comparePassword(parsed.data.password, row.password_hash))) {
        return reply.status(401).send({
          message: 'Invalid email or password',
        });
      }

      await userQueries.updateLastLogin(row.id);
      const user: AuthUser = {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
      };

      return reply.send({
        token: signToken(user),
        user,
      });
    }
  );

  fastify.get(
    '/api/auth/me',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({
        user: request.user,
      });
    }
  );
}
