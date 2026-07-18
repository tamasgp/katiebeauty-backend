# Katie Beauty Backend API

A modern, type-safe backend API built with Fastify, TypeScript, and SQLite.

## Features

- 🚀 **Fastify** - High-performance HTTP framework
- 📝 **TypeScript** - Full type safety
- 🔐 **JWT Authentication** - Secure user authentication
- 📚 **Blog Management** - Create and publish blog posts
- 📧 **Subscriber Management** - Newsletter subscriptions
- 👥 **Role-based Access Control** - Admin and user roles
- ✅ **Zod Validation** - Runtime type validation
- 🛡️ **Security** - Helmet for HTTP headers, CORS support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

The API will start at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Blog Posts

- `GET /api/posts` - List published posts
- `GET /api/posts/:slug` - Get post by slug
- `GET /api/admin/posts` - List all posts (admin only)
- `POST /api/admin/posts` - Create post (admin only)
- `PUT /api/admin/posts/:id` - Update post (admin only)
- `DELETE /api/admin/posts/:id` - Delete post (admin only)

### Subscribers

- `POST /api/subscribers` - Subscribe to newsletter
- `GET /api/admin/subscribers` - List subscribers (admin only)
- `PATCH /api/admin/subscribers/:id/status` - Update subscriber status (admin only)

### Users

- `GET /api/admin/users` - List users (admin only)

### Health

- `GET /api/health` - Health check

## Project Structure

```
src/
├── config/          # Configuration files
├── db/              # Database setup and queries
├── plugins/         # Fastify plugins
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── hooks/           # Fastify hooks
└── app.ts           # Application entry point
```

## License

MIT
