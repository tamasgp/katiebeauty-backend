import { type Migration } from '@/db/migrator';

export const migration: Migration = {
  version: 1,
  description: 'initial_schema',
  up: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN','USER')) DEFAULT 'USER',
      created_at TEXT NOT NULL,
      last_login_at TEXT,
      CONSTRAINT users_email_unique UNIQUE (email),
      CONSTRAINT users_email_lowercase CHECK (email = LOWER(email))
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft','published')) DEFAULT 'draft',
      published_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      author_id TEXT NOT NULL,
      CONSTRAINT blog_posts_slug_unique UNIQUE (slug),
      CONSTRAINT blog_posts_author_fk FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_blog_posts_status_date
      ON blog_posts(status, published_at DESC);

    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ACTIVE','UNSUBSCRIBED')) DEFAULT 'ACTIVE',
      consent_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      unsubscribed_at TEXT,
      CONSTRAINT subscribers_email_unique UNIQUE (email),
      CONSTRAINT subscribers_email_lowercase CHECK (email = LOWER(email))
    );

    CREATE INDEX IF NOT EXISTS idx_subscribers_status_created
      ON subscribers(status, created_at DESC);
  `,
};
