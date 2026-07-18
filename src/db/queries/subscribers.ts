import { getDatabase } from '@/db/database';
import { randomUUID } from 'node:crypto';

export const subscriberQueries = {
  async create(name: string, email: string): Promise<any> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await getDatabase().query(
      'INSERT INTO subscribers (id, name, email, status, consent_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, name, email.toLowerCase(), 'ACTIVE', now, now]
    );

    return this.findById(id);
  },

  async findById(id: string): Promise<any> {
    const result = await getDatabase().query(
      'SELECT id, name, email, status, consent_at, created_at, unsubscribed_at FROM subscribers WHERE id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<any> {
    const result = await getDatabase().query(
      'SELECT id, status FROM subscribers WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] ?? null;
  },

  async resubscribe(id: string, name: string): Promise<any> {
    const now = new Date().toISOString();

    await getDatabase().query(
      "UPDATE subscribers SET name = $1, status = 'ACTIVE', consent_at = $2, unsubscribed_at = NULL WHERE id = $3",
      [name, now, id]
    );

    return this.findById(id);
  },

  async listAll(): Promise<any[]> {
    const result = await getDatabase().query(
      'SELECT id, name, email, status, consent_at, created_at, unsubscribed_at FROM subscribers ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async updateStatus(id: string, status: 'ACTIVE' | 'UNSUBSCRIBED'): Promise<boolean> {
    const unsubscribedAt = status === 'UNSUBSCRIBED' ? new Date().toISOString() : null;

    const result = await getDatabase().query(
      'UPDATE subscribers SET status = $1, unsubscribed_at = $2 WHERE id = $3',
      [status, unsubscribedAt, id]
    );

    return (result.rowCount ?? 0) > 0;
  },
};
