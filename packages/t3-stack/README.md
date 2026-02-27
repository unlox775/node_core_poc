# Ben's Cranes — T3 Stack

Next.js + tRPC + Prisma. App: **Ben's Cranes**.

## Prerequisites

- Node.js 18+
- PostgreSQL (local). Create DB: `createdb bens_cranes_t3`

## Startup (do this every day)

```bash
# 1. Install deps (first time only)
npm install

# 2. Create DB schema and seed
cp .env.example .env
npm run db:push
npm run db:seed

# 3. Start dev server
npm run dev
```

Open **http://localhost:3000**.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:seed` | Seed default deals + admin user |
| `npm run db:reseed` | Wipe DB, push schema, seed |

## Admin

- Path: `/admin`
- Login: **Ethan** / **123qwe**

## Database

- Name: `bens_cranes_t3`
- Port: 5432 (local PostgreSQL)
- Connect with: `postgresql://postgres:postgres@localhost:5432/bens_cranes_t3`

## Demo

See [demo-script.md](./demo-script.md) for the full demo flow.
