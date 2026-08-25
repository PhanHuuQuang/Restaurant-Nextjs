# Restaurant Frontend

Next.js customer-facing app for the Restaurant project: menu, featured products, offers, cart and login. It fetches all data from the [backend API](../backend/README.md). Includes authentication with JWT and Google OAuth2.

## Tech Stack

- [Next.js](https://nextjs.org/docs) 16 (App Router, Turbopack, `src/app`)
- React 19 + TypeScript
- Tailwind CSS 3
- ESLint 9 (flat config) with `eslint-config-next`
- react-countdown (offer timer)

## Project Structure

```
frontend/
├── .env                      # Environment variables (API_BASE_URL, auth keys)
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
    │   └── auth/             # Login, Register, Google OAuth callback
    ├── components/           # NavBar, Featured, Slider, Offer, Menu, Price, ...
    ├── hooks/                # Custom hooks (useAuth, useToken)
    ├── api/                  # Typed API client for the backend
    │   ├── client.ts         # Base fetch wrapper (reads API_BASE_URL)
    │   ├── auth.ts           # Auth endpoints (register, login, refresh, profile)
    │   ├── categories.ts     # Category endpoints
    │   ├── products.ts       # Product endpoints
    │   └── types.ts          # Shared types (Product, Category, ProductOption, User)
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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

This tells the frontend where the NestJS backend API is running. The Google Client ID is used for Google OAuth2 login on the client side.

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
| `src/api/auth.ts` | `register()`, `login()`, `refreshToken()`, `getProfile()`, `getGoogleAuthUrl()` |
| `src/api/categories.ts` | `getCategories()`, `getCategory(slug)` |
| `src/api/products.ts` | `getProducts(categoryId?)`, `getFeaturedProducts()`, `getProduct(id)` |
| `src/api/types.ts` | `Product`, `Category`, `CategoryWithProducts`, `ProductOption`, `User`, `AuthResponse` |

All API requests use `cache: "no-store"` to always fetch fresh data.

## Authentication

The frontend supports:
- **Email/password registration and login** via JWT tokens
- **Google OAuth2** social login
- Automatic token refresh using refresh tokens
- Protected routes (cart, orders) require authentication

## Notes

- Product images referenced by the database seed live in `public/temporary/`.
- The `src/data.ts` file contains legacy mock data that is no longer used — all pages now fetch from the API.
- The backend uses **soft delete** (`deletedAt`), so the frontend only sees active records.
- Auth tokens are stored in localStorage and attached to API requests automatically.
