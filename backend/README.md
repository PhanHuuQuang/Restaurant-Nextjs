# Restaurant Backend

NestJS REST API for the Restaurant project. It serves categories and products to the [frontend](../frontend/README.md), uses Prisma as ORM and PostgreSQL 16 (via Docker) as the database.

## Tech Stack

- [NestJS](https://docs.nestjs.com) 10 (framework)
- [Prisma](https://www.prisma.io/docs) 6 (ORM + migrations + seed)
- PostgreSQL 16 (Docker, see `docker-compose.yml`)
- Swagger for API documentation
- class-validator / class-transformer for request validation

## Project Structure

```
backend/
├── docker-compose.yml    # PostgreSQL container definition
├── .env                  # Environment variables (create it, see below)
├── prisma/
│   ├── schema.prisma     # Database models (Category, Product)
│   ├── migrations/       # Applied SQL migrations
│   └── seed.ts           # Demo data seeder
└── src/
    ├── main.ts           # App bootstrap (CORS, validation, Swagger)
    ├── app.module.ts     # Root module
    ├── prisma/           # PrismaService (PrismaModule)
    ├── categories/       # Category CRUD module
    └── products/         # Product CRUD module
```

## Prerequisites

- Node.js >= 18 and npm
- Docker (for the database)

## Setup (first time)

Run all commands from the `backend/` directory.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container (`restaurant-postgres`) with user `restaurant`, password `restaurant`, database `restaurant`.

### 3. Create the `.env` file

```env
DATABASE_URL="postgresql://restaurant:restaurant@localhost:5432/restaurant"
```

### 4. Run migrations and generate the Prisma client

```bash
npx prisma migrate dev
```

### 5. Seed demo data

```bash
npx prisma db seed
```

### 6. Start the dev server

```bash
npm run start:dev
```

The API now runs at `http://localhost:3000`.

> Keep the backend on port 3000 — the frontend expects the API there by default.
> If you must change it, set `PORT` in `.env` and update `API_BASE_URL` in the frontend.

## API

Interactive documentation (Swagger): `http://localhost:3000/api`

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/categories`        | Create a category              |
| GET    | `/categories`        | List all categories            |
| GET    | `/categories/:slug`  | Get a category with products   |
| PATCH  | `/categories/:slug`  | Update a category              |
| DELETE | `/categories/:slug`  | Delete a category              |
| POST   | `/products`          | Create a product               |
| GET    | `/products`          | List products (`?categoryId=`) |
| GET    | `/products/featured` | List featured products         |
| GET    | `/products/:id`      | Get one product                |
| PATCH  | `/products/:id`      | Update a product               |
| DELETE | `/products/:id`      | Delete a product               |

## Useful Commands

```bash
npm run start:dev        # Dev server with watch mode
npm run build            # Build to dist/
npm run start:prod       # Run the production build
npm run lint             # ESLint (with auto-fix)
npm run format           # Prettier
npm run test             # Unit tests (Jest)

npx prisma studio        # Browse the database in the browser
npx prisma migrate dev   # Apply migrations in development
npx prisma db seed       # Re-seed demo data
```

## Troubleshooting

- **`P1000: Authentication failed`** — the credentials or port in `DATABASE_URL`
  do not match the Docker container. Verify with: `docker inspect restaurant-postgres`.
- **`Environment variable not found: DATABASE_URL`** — the `.env` file is missing
  or you are running the command outside the `backend/` directory.
- **Port 5432 already in use** — see the note in step 3 (use 5433).
