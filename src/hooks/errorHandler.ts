import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export function registerErrorHandler(fastify: FastifyInstance): void {
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: error.flatten(),
      });
    }

    // Handle SQLite constraint violations
    if (error.message?.includes('UNIQUE')) {
      return reply.status(409).send({
        message: 'Resource already exists',
      });
    }

    if (error.statusCode === 401) {
      return reply.status(401).send({
        message: 'Authentication required',
      });
    }

    if (error.statusCode === 403) {
      return reply.status(403).send({
        message: 'Forbidden',
      });
    }

    reply.status(error.statusCode || 500).send({
      message: error.message || 'Internal server error',
    });
  });
}
