import { getDatabase } from '@/db/database';
import { AuthUser } from '@/types';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

export const userQueries = {
  async findByEmail(email: string): Promise<any> {
    return getDatabase()('users').where('email', email.toLowerCase()).first() ?? null;
  },

  async findById(id: string): Promise<any> {
    return getDatabase()('users').where('id', id).first() ?? null;
  },

  async create(name: string, email: string, password: string, role: 'ADMIN' | 'USER' = 'USER'): Promise<AuthUser> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();

    await getDatabase()('users').insert({
      id,
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      role,
      created_at: createdAt,
    });

    return { id, name, email: email.toLowerCase(), role };
  },

  async updateLastLogin(id: string): Promise<void> {
    await getDatabase()('users').where('id', id).update({ last_login_at: new Date().toISOString() });
  },

  async listAll(): Promise<any[]> {
    return getDatabase()('users')
      .select('id', 'name', 'email', 'role', 'created_at', 'last_login_at')
      .orderBy('created_at', 'desc');
  },

  async seedAdmin(email: string, name: string, password: string): Promise<void> {
    const existing = await this.findByEmail(email);
    if (!existing) {
      await this.create(name, email, password, 'ADMIN');
    }
  },
};
