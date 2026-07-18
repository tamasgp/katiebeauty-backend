export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

export interface User extends AuthUser {
  createdAt: string;
  lastLoginAt: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  status: 'draft' | 'published';
  publishedAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  consentAt: string;
  createdAt: string;
  unsubscribedAt: string | null;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      DATABASE_FILE?: string;
      JWT_SECRET?: string;
      FRONTEND_ORIGIN?: string;
      ADMIN_EMAIL?: string;
      ADMIN_NAME?: string;
      ADMIN_PASSWORD?: string;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}
