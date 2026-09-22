# E-commerce Frontend

A production-oriented Next.js + TypeScript storefront with a fully local mock data layer. The project demonstrates catalogue pagination, persistent cart state, form validation, resilient UI states and a deployable frontend that does not depend on the original closed backend.

## Live demo

The Netlify deployment will run entirely from the repository and use the local mock store.

## Highlights

- 48 deterministic catalogue items with pagination
- Infinite-scroll loading with request guards and retry state
- Persistent shopping cart via localStorage
- Quantity management and checkout flow
- Local mock API replacing the original unavailable backend
- Reviews and order responses without external network dependencies
- Responsive storefront UI
- Typed API/domain models
- Next.js Image optimization with an explicit remote image allow-list
- ESLint + TypeScript quality checks
- Netlify-ready production configuration

## Architecture

```text
src/
├── app/              # App Router pages and global styles
├── components/       # Product, review, cart and checkout UI
├── data/             # Local mock data and deterministic store
├── hooks/            # Client-side state such as the cart
├── types/            # Shared domain/API models
└── utils/            # API facade, persistence and validation
```

### Data flow

```text
UI components
     ↓
api.ts
     ↓
mockStore.ts
     ↓
local deterministic data

Cart / phone
     ↓
localStorage
```

The UI talks to an API-shaped facade, so replacing the mock store with a real backend later does not require rewriting the presentation layer.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Netlify uses:

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: 20

The application has no runtime dependency on `o-complex.com` or any other backend service.
