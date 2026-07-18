import { getDatabase } from '@/db/database';
import { randomUUID } from 'node:crypto';

export const subscriberQueries = {
  create(name: string, email: string): any {
    const id = randomUUID();
    const now = new Date().toISOString();

    getDatabase()
      .prepare(
        'INSERT INTO subscribers (id, name, email, status, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(id, name, email.toLowerCase(), 'ACTIVE', now, now);

    return this.findById(id);
  },

  findById(id: string): any {
    return getDatabase()
      .prepare(
        'SELECT id, name, email, status, consent_at, created_at, unsubscribed_at FROM subscribers WHERE id = ?'
      )
      .get(id);
  },

  findByEmail(email: string): any {
    return getDatabase()
      .prepare('SELECT id, status FROM subscribers WHERE email = ?')
      .get(email.toLowerCase());
  },

  resubscribe(id: string, name: string): any {
    const now = new Date().toISOString();

    getDatabase()
      .prepare(
        'UPDATE subscribers SET name = ?, status = \'ACTIVE\', consent_at = ?, unsubscribed_at = NULL WHERE id = ?'
      )
      .run(name, now, id);

    return this.findById(id);
  },

  listAll(): any[] {
    return getDatabase()
      .prepare(
        'SELECT id, name, email, status, consent_at, created_at, unsubscribed_at FROM subscribers ORDER BY created_at DESC'
      )
      .all();
  },

  updateStatus(id: string, status: 'ACTIVE' | 'UNSUBSCRIBED'): boolean {
    const unsubscribedAt = status === 'UNSUBSCRIBED' ? new Date().toISOString() : null;

    const result = getDatabase()
      .prepare('UPDATE subscribers SET status = ?, unsubscribed_at = ? WHERE id = ?')
      .run(status, unsubscribedAt, id);

    return result.changes > 0;
  },
};
