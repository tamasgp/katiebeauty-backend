import { getDatabase } from '@/db/database';
import { AuthUser } from '@/types';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

export const userQueries = {
  async findByEmail(email: string): Promise<any> {
    const result = await getDatabase().query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] ?? null;
  },

  async findById(id: string): Promise<any> {
    const result = await getDatabase().query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(name: string, email: string, password: string, role: 'ADMIN' | 'USER' = 'USER'): Promise<AuthUser> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();

    await getDatabase().query(
      'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, name, email.toLowerCase(), passwordHash, role, createdAt]
    );

    return { id, name, email: email.toLowerCase(), role };
  },

  async updateLastLogin(id: string): Promise<void> {
    await getDatabase().query(
      'UPDATE users SET last_login_at = $1 WHERE id = $2',
      [new Date().toISOString(), id]
    );
  },

  async listAll(): Promise<any[]> {
    const result = await getDatabase().query(
      'SELECT id, name, email, role, created_at, last_login_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async seedAdmin(email: string, name: string, password: string): Promise<void> {
    const existing = await this.findByEmail(email);
    if (!existing) {
      await this.create(name, email, password, 'ADMIN');
    }
  },
};
