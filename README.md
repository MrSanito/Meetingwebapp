
# Apidel Monorepo

This monorepo contains a Next.js frontend (`apps/web`) and an Express backend (`apps/http`).

## Structure

- `apps/web`: Next.js 14 application with Tailwind CSS, React Toastify, and React Icons.
- `apps/http`: Express server with Prisma ORM.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize Prisma (if not already done):
   ```bash
   cd apps/http
   npx prisma init --datasource-provider sqlite
   npx prisma generate
   ```

## Development

Run both applications concurrently:

```bash
npm run dev
```

- Web App: `http://localhost:3000`
- API Server: `http://localhost:3001`
