# Ben's Cranes — Remix

Remix + Prisma. App: **Ben's Cranes**.

## Prerequisites

- Node.js 18+
- PostgreSQL (local). Create DB: `createdb bens_cranes_remix`

## Startup (do this every day)

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open **http://localhost:5173**.

## Admin

- Path: `/admin`
- Login: **Ethan** / **123qwe**

## Database

- Name: `bens_cranes_remix`
- Port: 5432 (local PostgreSQL)

## Demo

See [demo-script.md](./demo-script.md).
