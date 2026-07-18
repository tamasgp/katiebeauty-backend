import 'dotenv/config';
import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

export const config = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseFile: (() => {
    const file = resolve(process.env.DATABASE_FILE || './data/katie-beauty.db');
    mkdirSync(dirname(file), { recursive: true });
    return file;
  })(),
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@katiebeauty.hu').trim().toLowerCase(),
    name: process.env.ADMIN_NAME || 'Katie Beauty Admin',
    password: process.env.ADMIN_PASSWORD || 'change-me-now',
  },
};
