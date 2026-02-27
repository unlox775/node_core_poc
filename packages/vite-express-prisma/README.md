# Ben's Cranes — Vite + Express + Prisma

Vite (React) + Express + Prisma. App: **Ben's Cranes**.

## Prerequisites

- Node.js 18+
- PostgreSQL (local). Create DB: `createdb bens_cranes_vite_express`

## Startup (do this every day)

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- Frontend: **http://localhost:5173**
- API: **http://localhost:3001**

## Admin

- Path: `/admin`
- Login: **Ethan** / **123qwe**

## Database

- Name: `bens_cranes_vite_express`
- Port: 5432 (local PostgreSQL)

## Demo

See [demo-script.md](./demo-script.md).
