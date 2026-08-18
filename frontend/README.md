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
├── eslint.config.mjs       # ESLint flat config (eslint-config-next)
├── tailwind.config.js
├── public/temporary/        # Product / category images
└── src/
    ├── app/                 # App Router pages
    │   ├── page.tsx         # Home (slider, featured, offers)
    │   ├── menu/            # Full menu + menu/[category]
    │   ├── product/[id]/    # Product detail page
    │   ├── cart/            # Cart
    │   ├── orders/          # Orders
    │   └── login/           # Login
    ├── components/          # NavBar, Featured, Slider, Offer, Menu, Price, ...
    ├── api/                 # Typed API client for the backend
    │   ├── client.ts        # Base fetch wrapper (API_BASE_URL)
    │   ├── categories.ts    # Category endpoints
    │   ├── products.ts      # Product endpoints
    │   └── types.ts         # Shared types (Product, Category, ...)
    └── hook/                # Custom React hooks
```

## Prerequisites

- Node.js >= 18 and npm
- The [backend](../backend/README.md) must be installed and **running on port 3000**
  (`http://localhost:3000`), including the database seed, otherwise all pages
  will fail to load data.

## Setup

Run all commands from the `frontend/` directory.

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server on port 3001

The backend already occupies port 3000, so the frontend must use another port:

```bash
npm run dev -- -p 3001
```

Open `http://localhost:3001` in your browser.

### (Optional) Point to a different backend URL

The API base URL defaults to `http://localhost:3000`. To change it, start the
dev server with:

```bash
API_BASE_URL=http://localhost:4000 npm run dev -- -p 3001
```

## Useful Commands

```bash
npm run dev        # Dev server (add -- -p 3001 to avoid clashing with the backend)
npm run build      # Production build (Turbopack)
npm run start      # Run the production build
npm run lint       # ESLint (flat config, eslint-config-next)
```

> Note: `next lint` no longer exists in Next.js 16 — the `lint` script runs
> `eslint .` directly. Keep ESLint on major version 9 (`eslint-config-next@16`
> is not compatible with ESLint 10 yet).

## Notes

- The API client (`src/api/client.ts`) throws an `ApiError` (with HTTP status)
  on non-2xx responses; pages fetch data with `cache: "no-store"` requests.
- Product images referenced by the database seed live in `public/temporary/`.
