import { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';

export function registerErrorHandler(fastify: FastifyInstance): void {
  fastify.setErrorHandler((error: FastifyError | Error | unknown, _request, reply) => {
    fastify.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: error.flatten(),
      });
    }

    // Handle PostgreSQL unique constraint violations (error code 23505)
    if ((error as { code?: string }).code === '23505') {
      return reply.status(409).send({
        message: 'Resource already exists',
      });
    }

    const statusCode = (error as FastifyError).statusCode;

    if (statusCode === 401) {
      return reply.status(401).send({
        message: 'Authentication required',
      });
    }

    if (statusCode === 403) {
      return reply.status(403).send({
        message: 'Forbidden',
      });
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    return reply.status(statusCode ?? 500).send({
      message: message || 'Internal server error',
    });
  });
}
