# Backend

Express API for Recipe App favorites.

## Requirements

- Node.js 18+
- Postgres database (Neon-compatible connection URL)

## Environment Variables

Create `apps/backend/.env` with:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgres://...
API_URL=https://your-api-domain.example.com/api/health
```

Notes:

- `DATABASE_URL` is required in all environments.
- `API_URL` is required in production (used by the cron keep-alive job).

## Scripts

- `npm run -w backend dev` starts API in watch mode.
- `npm run -w backend start` starts API once.
- `npm run -w backend lint` runs ESLint on backend source.
- `npm run -w backend check-types` runs syntax checks across backend files.
- `npm run -w backend db:generate` generates Drizzle migration files.
- `npm run -w backend db:migrate` runs Drizzle migrations.

## API Endpoints

- `GET /api/health`
- `POST /api/favorites`
- `GET /api/favorites/:userId`
- `DELETE /api/favorites/:userId/:recipeId`

## Data Rules

- Favorites are unique per `(userId, recipeId)`.
- Invalid IDs return `400`.
- Creating an existing favorite returns `409`.
- Deleting a missing favorite returns `404`.
