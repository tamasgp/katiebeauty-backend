import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/katiebeauty',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-me',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@katiebeauty.hu').trim().toLowerCase(),
    name: process.env.ADMIN_NAME || 'Katie Beauty Admin',
    password: process.env.ADMIN_PASSWORD || 'change-me-now',
  },
};
