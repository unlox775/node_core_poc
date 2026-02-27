# Ben's Cranes — RedwoodJS

RedwoodJS + Prisma. App: **Ben's Cranes**.

## Prerequisites

- Node.js 20.x (use asdf: `asdf set nodejs 20.18.0` in this directory)
- Yarn
- PostgreSQL (local). Create DB: `createdb bens_cranes_redwoodjs`

## Startup

```bash
yarn install
cp .env.example .env
yarn rw prisma db push
yarn rw prisma db seed
yarn rw dev
```

Open **http://localhost:8910**.

## Commands

- `yarn rw dev` — Start dev server
- `yarn rw prisma db push` — Push schema to DB
- `yarn rw prisma db seed` — Seed data
- `yarn rw prisma migrate reset` — Reseed (wipe + migrate + seed)

## Admin

- Path: `/admin`
- Login: **ethan** / **123qwe**

## Database

- Name: `bens_cranes_redwoodjs`
- Port: 5432 (local PostgreSQL)

## Demo

See [demo-script.md](./demo-script.md).
