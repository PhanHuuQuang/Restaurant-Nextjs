# Restaurant Backend

NestJS REST API for the Restaurant project. It serves categories, products, users, and orders to the [frontend](../frontend/README.md), uses Prisma 7 as ORM and PostgreSQL 16 (via Docker) as the database.

## Tech Stack

- [NestJS](https://docs.nestjs.com) 10 (framework)
- [Prisma](https://www.prisma.io/docs) 7 (ORM + migrations + seed, driver adapter via `@prisma/adapter-pg`)
- PostgreSQL 16 (Docker, see `docker-compose.yml`)
- Swagger for API documentation
- class-validator / class-transformer for request validation
- Passport + JWT (installed, ready for auth implementation)

## Database Models

| Model | Description |
|-------|-------------|
| **Category** | Menu categories (pizzas, burgers, pastas). Fields: `slug`, `title`, `description`, `image`, `color` |
| **Product** | Menu items with price, description, image, and featured flag. Belongs to a Category |
| **ProductOption** | Size/variant options per product (e.g. Small/Medium/Large with additional price) |
| **User** | Customers with email/password or OAuth (`provider`). Roles: `USER`, `ADMIN` |
| **Order** | Customer orders with subtotal, delivery/service costs, total, status, address, phone |
| **OrderItem** | Line items in an order with quantity, selected size option, and price snapshot |

All models support **soft delete** via `deletedAt` timestamp.

## Project Structure

```
backend/
├── docker-compose.yml        # PostgreSQL container definition
├── .env                      # Environment variables (see below)
├── prisma.config.ts          # Prisma 7 config (datasource URL, seed command)
├── prisma/
│   ├── schema.prisma         # Database models + enums
│   ├── migrations/           # Applied SQL migrations
│   ├── seed.ts               # Demo data seeder (categories + products with options)
│   └── generated/prisma/     # Generated Prisma client (do not edit)
└── src/
    ├── main.ts               # App bootstrap (dotenv, CORS, validation, Swagger)
    ├── app.module.ts          # Root module
    ├── prisma/                # PrismaService + PrismaModule (global)
    ├── categories/            # Category CRUD module (entity, DTOs, service, controller)
    └── products/              # Product CRUD module (entity, DTOs, service, controller)
```

## Prerequisites

- Node.js >= 20.19 and npm
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
JWT_SECRET_KEY="your_secret_key_here"
PORT=5555
```

### 4. Run migrations and generate the Prisma client

```bash
npx prisma migrate dev
```

### 5. Seed demo data

```bash
npx prisma db seed
```

This creates 3 categories (pizzas, burgers, pastas) and 14 products with size options (Small/Medium/Large).

### 6. Start the dev server

```bash
npm run start:dev
```

The API runs at `http://localhost:5555`.

## API

Interactive documentation (Swagger): `http://localhost:5555/api`

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/categories` | Create a category |
| GET | `/categories` | List all categories |
| GET | `/categories/:slug` | Get a category with products |
| PATCH | `/categories/:slug` | Update a category |
| DELETE | `/categories/:slug` | Soft-delete a category |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create a product (with nested options) |
| GET | `/products` | List products (`?categoryId=`) |
| GET | `/products/featured` | List featured products |
| GET | `/products/:id` | Get one product with options + category |
| PATCH | `/products/:id` | Update a product (replaces options if provided) |
| DELETE | `/products/:id` | Soft-delete a product |

## Useful Commands

```bash
npm run start:dev        # Dev server with watch mode
npm run build            # Build to dist/
npm run start:prod       # Run the production build
npm run lint             # ESLint (with auto-fix)
npm run format           # Prettier
npm run test             # Unit tests (Jest)

npx prisma studio        # Browse the database in the browser
npx prisma generate      # Regenerate Prisma client (required after schema changes)
npx prisma migrate dev   # Apply migrations in development
npx prisma db seed       # Re-seed demo data
npx prisma migrate reset # Reset database and re-apply all migrations
```

## Prisma 7 Notes

- The `DATABASE_URL` is configured in `prisma.config.ts`, **not** in `schema.prisma`
- The generated client lives in `prisma/generated/prisma/` — import from there, not from `@prisma/client`
- PrismaClient requires a **driver adapter** (`PrismaPg`) to connect
- `.env` is loaded manually via `dotenv/config` in `main.ts` and `seed.ts`
- `prisma migrate dev` no longer runs seed automatically — run `npx prisma db seed` separately
- `prisma generate` must be run manually after schema changes

## Troubleshooting

- **`P1000: Authentication failed`** — the credentials or port in `DATABASE_URL` do not match the Docker container. Verify with: `docker inspect restaurant-postgres`.
- **`Environment variable not found: DATABASE_URL`** — the `.env` file is missing or you are running the command outside the `backend/` directory.
- **`SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`** — `dotenv/config` is not loaded. Make sure `import 'dotenv/config'` is at the top of `main.ts`.
- **`PrismaClient was instantiated without any options`** — Prisma 7 requires a driver adapter. See `prisma.service.ts` for the correct `PrismaPg` setup.
- **Port 5432 already in use** — change the host port in `docker-compose.yml` (e.g. `5433:5432`).
