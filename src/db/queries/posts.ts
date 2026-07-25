import { getDatabase } from '@/db/database';
import { randomUUID } from 'node:crypto';

export const postQueries = {
  async create(
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    image: string,
    status: 'draft' | 'published',
    publishedAt: string,
    authorId: string
  ): Promise<any> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await getDatabase()('blog_posts').insert({
      id,
      title,
      slug,
      excerpt,
      content,
      image,
      status,
      published_at: publishedAt,
      updated_at: now,
      author_id: authorId,
    });

    return this.findById(id);
  },

  async findById(id: string): Promise<any> {
    return getDatabase()('blog_posts as p')
      .join('users as u', 'u.id', 'p.author_id')
      .select('p.*', 'u.name as author_name')
      .where('p.id', id)
      .first() ?? null;
  },

  async findBySlug(slug: string, published = true): Promise<any> {
    const query = getDatabase()('blog_posts as p')
      .join('users as u', 'u.id', 'p.author_id')
      .select('p.*', 'u.name as author_name')
      .where('p.slug', slug);

    if (published) {
      query.where('p.status', 'published');
    }

    return query.first() ?? null;
  },

  async listPublished(): Promise<any[]> {
    return getDatabase()('blog_posts as p')
      .join('users as u', 'u.id', 'p.author_id')
      .select('p.*', 'u.name as author_name')
      .where('p.status', 'published')
      .orderBy('p.published_at', 'desc');
  },

  async listAll(): Promise<any[]> {
    return getDatabase()('blog_posts as p')
      .join('users as u', 'u.id', 'p.author_id')
      .select('p.*', 'u.name as author_name')
      .orderBy('p.updated_at', 'desc');
  },

  async update(
    id: string,
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    image: string,
    status: 'draft' | 'published',
    publishedAt: string
  ): Promise<any> {
    const now = new Date().toISOString();

    const count = await getDatabase()('blog_posts').where('id', id).update({
      title,
      slug,
      excerpt,
      content,
      image,
      status,
      published_at: publishedAt,
      updated_at: now,
    });

    if (count === 0) {
      return null;
    }

    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const count = await getDatabase()('blog_posts').where('id', id).delete();
    return count > 0;
  },
};
