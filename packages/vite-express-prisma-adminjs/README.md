# Ben's Cranes — Vite + Express + Prisma + AdminJS

Vite (React) + Express + Prisma + **AdminJS**. Admin area is auto-generated from Prisma models (ActiveAdmin-style).

## Prerequisites

- Node.js 18+
- PostgreSQL (local). Create DB: `createdb bens_cranes_vite_express_adminjs`

## Startup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- Frontend: **http://localhost:5173**
- AdminJS: **http://localhost:5173/admin** (proxied to API)
- Login: **ethan** / **123qwe** (use "ethan" in the email field)

## Admin

AdminJS reads Prisma models (Deal, AdminUser) and generates full CRUD. Add a new model to the schema → migrate → add to AdminJS `resources` in `api/index.ts` — done.

## Demo

See [demo-script.md](./demo-script.md).
