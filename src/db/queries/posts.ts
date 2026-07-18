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

    await getDatabase().query(
      'INSERT INTO blog_posts (id, title, slug, excerpt, content, image, status, published_at, updated_at, author_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, title, slug, excerpt, content, image, status, publishedAt, now, authorId]
    );

    return this.findById(id);
  },

  async findById(id: string): Promise<any> {
    const result = await getDatabase().query(
      'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findBySlug(slug: string, published = true): Promise<any> {
    const query = published
      ? "SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.slug = $1 AND p.status = 'published'"
      : 'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.slug = $1';

    const result = await getDatabase().query(query, [slug]);
    return result.rows[0] ?? null;
  },

  async listPublished(): Promise<any[]> {
    const result = await getDatabase().query(
      "SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.status = 'published' ORDER BY p.published_at DESC"
    );
    return result.rows;
  },

  async listAll(): Promise<any[]> {
    const result = await getDatabase().query(
      'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id ORDER BY p.updated_at DESC'
    );
    return result.rows;
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

    const result = await getDatabase().query(
      'UPDATE blog_posts SET title = $1, slug = $2, excerpt = $3, content = $4, image = $5, status = $6, published_at = $7, updated_at = $8 WHERE id = $9',
      [title, slug, excerpt, content, image, status, publishedAt, now, id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await getDatabase().query(
      'DELETE FROM blog_posts WHERE id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
