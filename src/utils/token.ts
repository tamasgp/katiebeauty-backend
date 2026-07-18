import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { AuthUser } from '@/types';

export function signToken(user: AuthUser): string {
  return jwt.sign(user, config.jwtSecret, { expiresIn: '8h' });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, config.jwtSecret) as AuthUser;
}
