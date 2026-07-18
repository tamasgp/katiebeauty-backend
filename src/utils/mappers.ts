import { BlogPost, Subscriber, User } from '@/types';

export function mapPost(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    image: row.image,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    authorId: row.author_id,
    authorName: row.author_name,
  };
}

export function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

export function mapSubscriber(row: any): Subscriber {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    status: row.status,
    consentAt: row.consent_at,
    createdAt: row.created_at,
    unsubscribedAt: row.unsubscribed_at,
  };
}
