# Ben's Cranes — NestJS + Vite React

NestJS (backend) + Vite React (frontend) + Prisma. App: **Ben's Cranes**.

## Prerequisites

- PostgreSQL (local). Create DB: `createdb bens_cranes_nestjs`

## Startup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- Frontend: **http://localhost:5173**
- API: **http://localhost:3000**

## Admin

- Path: `/admin`
- Login: **ethan** / **123qwe**

## Database

- Name: `bens_cranes_nestjs`
- Port: 5432 (local PostgreSQL)

## Demo

See [demo-script.md](./demo-script.md).
