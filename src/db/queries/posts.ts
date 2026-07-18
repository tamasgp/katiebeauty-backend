import { getDatabase } from '@/db/database';
import { randomUUID } from 'node:crypto';

export const postQueries = {
  create(
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    image: string,
    status: 'draft' | 'published',
    publishedAt: string,
    authorId: string
  ): any {
    const id = randomUUID();
    const now = new Date().toISOString();

    getDatabase()
      .prepare(
        'INSERT INTO blog_posts (id, title, slug, excerpt, content, image, status, published_at, updated_at, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(id, title, slug, excerpt, content, image, status, publishedAt, now, authorId);

    return this.findById(id);
  },

  findById(id: string): any {
    return getDatabase()
      .prepare(
        'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?'
      )
      .get(id);
  },

  findBySlug(slug: string, published = true): any {
    const query = published
      ? 'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.slug = ? AND p.status = \'published\''
      : 'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.slug = ?';

    return getDatabase().prepare(query).get(slug);
  },

  listPublished(): any[] {
    return getDatabase()
      .prepare(
        'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id WHERE p.status = \'published\' ORDER BY p.published_at DESC'
      )
      .all();
  },

  listAll(): any[] {
    return getDatabase()
      .prepare(
        'SELECT p.*, u.name as author_name FROM blog_posts p JOIN users u ON u.id = p.author_id ORDER BY p.updated_at DESC'
      )
      .all();
  },

  update(
    id: string,
    title: string,
    slug: string,
    excerpt: string,
    content: string,
    image: string,
    status: 'draft' | 'published',
    publishedAt: string
  ): any {
    const now = new Date().toISOString();

    const result = getDatabase()
      .prepare(
        'UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, image = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?'
      )
      .run(title, slug, excerpt, content, image, status, publishedAt, now, id);

    if (result.changes === 0) {
      return null;
    }

    return this.findById(id);
  },

  delete(id: string): boolean {
    const result = getDatabase().prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    return result.changes > 0;
  },
};
