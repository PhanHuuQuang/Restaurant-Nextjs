# Restaurant Frontend

Next.js customer-facing app for the Restaurant project: menu, featured products, offers, cart and login. It fetches all data from the [backend API](../backend/README.md).

## Tech Stack

- [Next.js](https://nextjs.org/docs) 16 (App Router, Turbopack, `src/app`)
- React 19 + TypeScript
- Tailwind CSS 3
- ESLint 9 (flat config) with `eslint-config-next`
- react-countdown (offer timer)

## Project Structure

```
frontend/
├── .env                      # Environment variables (API_BASE_URL)
├── eslint.config.mjs         # ESLint flat config (eslint-config-next)
├── tailwind.config.js
├── public/temporary/         # Product / category images
└── src/
    ├── app/                  # App Router pages
    │   ├── page.tsx          # Home (slider, featured, offers)
    │   ├── menu/             # Full menu + menu/[category]
    │   ├── product/[id]/     # Product detail page
    │   ├── cart/             # Cart
    │   ├── orders/           # Orders
    │   └── login/            # Login
    ├── components/           # NavBar, Featured, Slider, Offer, Menu, Price, ...
    ├── api/                  # Typed API client for the backend
    │   ├── client.ts         # Base fetch wrapper (reads API_BASE_URL)
    │   ├── categories.ts     # Category endpoints
    │   ├── products.ts       # Product endpoints
    │   └── types.ts          # Shared types (Product, Category, ProductOption)
    └── data.ts               # Mock data (legacy, now replaced by API calls)
```

## Prerequisites

- Node.js >= 18 and npm
- The [backend](../backend/README.md) must be installed and **running on port 5555**, including the database seed, otherwise all pages will fail to load data.

## Setup

Run all commands from the `frontend/` directory.

### 1. Install dependencies

```bash
npm install
```

### 2. Create the `.env` file

```env
API_BASE_URL=http://localhost:5555
```

This tells the frontend where the NestJS backend API is running.

### 3. Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

> The backend runs on port 5555, the frontend on port 3000. They are separate servers.

## Useful Commands

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build (Turbopack)
npm run start      # Run the production build
npm run lint       # ESLint (flat config, eslint-config-next)
```

## API Integration

The frontend communicates with the backend through a typed API client:

| File | Purpose |
|------|---------|
| `src/api/client.ts` | Generic fetch wrapper. Reads `API_BASE_URL` from env. Throws `ApiError` on non-2xx responses. |
| `src/api/categories.ts` | `getCategories()`, `getCategory(slug)` |
| `src/api/products.ts` | `getProducts(categoryId?)`, `getFeaturedProducts()`, `getProduct(id)` |
| `src/api/types.ts` | `Product`, `Category`, `CategoryWithProducts`, `ProductOption` |

All API requests use `cache: "no-store"` to always fetch fresh data.

## Notes

- Product images referenced by the database seed live in `public/temporary/`.
- The `src/data.ts` file contains legacy mock data that is no longer used — all pages now fetch from the API.
- The backend uses **soft delete** (`deletedAt`), so the frontend only sees active records.
- Auth (login, orders, cart persistence) is not yet implemented — UI shells exist at `/login`, `/orders`, `/cart`.
