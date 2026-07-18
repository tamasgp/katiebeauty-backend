# Katie Beauty Backend API

A modern, type-safe backend API built with Fastify, TypeScript, and PostgreSQL.

## Features

- 🚀 **Fastify** - High-performance HTTP framework
- 📝 **TypeScript** - Full type safety
- 🔐 **JWT Authentication** - Secure user authentication
- 📚 **Blog Management** - Create and publish blog posts
- 📧 **Subscriber Management** - Newsletter subscriptions
- 👥 **Role-based Access Control** - Admin and user roles
- ✅ **Zod Validation** - Runtime type validation
- 🛡️ **Security** - Helmet for HTTP headers, CORS support
- 🐘 **PostgreSQL** - Reliable, production-grade database
- 🐳 **Docker** - Easy local development and production deployment

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 16+ (or use Docker)

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

## Docker

The easiest way to run the full stack locally is with Docker Compose.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start (Development)

```bash
# Copy the Docker environment file
cp .env.docker .env.docker.local
# Edit .env.docker.local and change passwords as needed

# Start all services (PostgreSQL + backend with hot reload)
docker-compose --env-file .env.docker up

# Or run in the background
docker-compose --env-file .env.docker up -d
```

The API will be available at `http://localhost:3001`.

### Production

```bash
# Production requires explicit secrets (no defaults)
export POSTGRES_PASSWORD=your-strong-db-password
export JWT_SECRET=your-strong-jwt-secret
export ADMIN_PASSWORD=your-admin-password
export FRONTEND_ORIGIN=https://your-frontend-domain.com

docker-compose -f docker-compose.prod.yml up -d
```

### Useful Commands

```bash
# View live logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Run database seed / migrations
docker-compose exec backend npm run seed

# Rebuild after dependency changes
docker-compose build backend

# Stop all services
docker-compose down

# Stop and remove database volume (destructive!)
docker-compose down -v
```

### Environment Variables for Docker

All defaults are in `.env.docker`. Override them by providing your own values:

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `katiebeauty` | Database name |
| `POSTGRES_USER` | `katiebeauty` | Database user |
| `POSTGRES_PASSWORD` | `secure-password-change-me` | **Change in production** |
| `PORT` | `3001` | Backend port |
| `JWT_SECRET` | `development-secret-key` | **Change in production** |
| `ADMIN_EMAIL` | `admin@katiebeauty.hu` | Initial admin account email |
| `ADMIN_PASSWORD` | `admin-password-change-me` | **Change in production** |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

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
