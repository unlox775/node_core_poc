# Ben's Cranes — NestJS + Vite React + AdminJS

NestJS (backend) + Vite React (frontend) + Prisma + **AdminJS**. Admin area is auto-generated from Prisma models (ActiveAdmin-style).

## Prerequisites

- PostgreSQL (local). Create DB: `createdb bens_cranes_nestjs_adminjs`

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

AdminJS reads Prisma models (Deal, AdminUser) and generates full CRUD. Add a new model to the schema → migrate → add to AdminJS `resources` in `api/src/app.module.ts` — done.

## Demo

See [demo-script.md](./demo-script.md).
