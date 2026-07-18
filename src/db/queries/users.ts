import { getDatabase } from '@/db/database';
import { AuthUser } from '@/types';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';

export const userQueries = {
  findByEmail(email: string): any {
    return getDatabase()
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase());
  },

  findById(id: string): any {
    return getDatabase()
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(id);
  },

  async create(name: string, email: string, password: string, role: 'ADMIN' | 'USER' = 'USER'): Promise<AuthUser> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();

    getDatabase()
      .prepare(
        'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(id, name, email.toLowerCase(), passwordHash, role, createdAt);

    return { id, name, email: email.toLowerCase(), role };
  },

  updateLastLogin(id: string): void {
    getDatabase()
      .prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
      .run(new Date().toISOString(), id);
  },

  listAll(): any[] {
    return getDatabase()
      .prepare(
        'SELECT id, name, email, role, created_at, last_login_at FROM users ORDER BY created_at DESC'
      )
      .all();
  },

  seedAdmin(email: string, name: string, password: string): void {
    if (!this.findByEmail(email)) {
      this.create(name, email, password, 'ADMIN');
    }
  },
};
