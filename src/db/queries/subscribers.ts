import { getDatabase } from '@/db/database';
import { randomUUID } from 'node:crypto';

export const subscriberQueries = {
  async create(name: string, email: string): Promise<any> {
    const id = randomUUID();
    const now = new Date().toISOString();

    await getDatabase()('subscribers').insert({
      id,
      name,
      email: email.toLowerCase(),
      status: 'ACTIVE',
      consent_at: now,
      created_at: now,
    });

    return this.findById(id);
  },

  async findById(id: string): Promise<any> {
    return getDatabase()('subscribers')
      .select('id', 'name', 'email', 'status', 'consent_at', 'created_at', 'unsubscribed_at')
      .where('id', id)
      .first() ?? null;
  },

  async findByEmail(email: string): Promise<any> {
    return getDatabase()('subscribers')
      .select('id', 'status')
      .where('email', email.toLowerCase())
      .first() ?? null;
  },

  async resubscribe(id: string, name: string): Promise<any> {
    const now = new Date().toISOString();

    await getDatabase()('subscribers').where('id', id).update({
      name,
      status: 'ACTIVE',
      consent_at: now,
      unsubscribed_at: null,
    });

    return this.findById(id);
  },

  async listAll(): Promise<any[]> {
    return getDatabase()('subscribers')
      .select('id', 'name', 'email', 'status', 'consent_at', 'created_at', 'unsubscribed_at')
      .orderBy('created_at', 'desc');
  },

  async updateStatus(id: string, status: 'ACTIVE' | 'UNSUBSCRIBED'): Promise<boolean> {
    const unsubscribedAt = status === 'UNSUBSCRIBED' ? new Date().toISOString() : null;

    const count = await getDatabase()('subscribers').where('id', id).update({
      status,
      unsubscribed_at: unsubscribedAt,
    });

    return count > 0;
  },
};
