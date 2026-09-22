# E-commerce Frontend

A Next.js + TypeScript storefront focused on product browsing, cart state and checkout-oriented UI.

## Preview

[Live demo](https://ecommerce-storefront.netlify.app)

![Project preview](https://d33wubrfki0l68.cloudfront.net/6846cc62e9f6300008b608e2/screenshot_2025-06-09-11-59-24-0000.webp)

## Highlights

- Product catalogue with paginated loading
- Infinite-scroll product fetching
- Shopping cart state and quantity management
- Product cards and reusable UI components
- Reviews and order form
- Success state after order submission
- Responsive storefront layout
- API integration layer isolated from UI components

## Tech stack

- Next.js
- React
- TypeScript
- CSS
- Netlify / Next.js deployment configuration

## Architecture

```text
src/
├── app/          # App Router pages and global styles
├── components/   # Product, cart, review and form UI
├── hooks/        # Reusable client-side state
├── types/        # Shared TypeScript models
└── utils/        # API and application utilities
```

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Status

Portfolio frontend project demonstrating component architecture, asynchronous data loading and e-commerce interaction patterns.
