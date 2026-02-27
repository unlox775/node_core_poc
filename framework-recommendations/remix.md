# Remix

**Philosophy**: Web standards, progressive enhancement, full-stack with a different data-loading model.

## Components

- **Remix** — Full-stack React framework (React Router–based)
- **Prisma** (or Drizzle) — ORM for PostgreSQL
- **TypeScript** — First-class support

## Local Development

**How it runs**: `npm run dev` (or `pnpm dev` / `yarn dev`). Remix uses Vite under the hood; dev server runs (default port 5173). Single process: server and frontend together. Prisma connects to PostgreSQL (local install, Docker, or cloud).

**Typical flow**: Install Node, run `npm install`, set `DATABASE_URL` in `.env`, run `npx prisma migrate dev`, then `npm run dev`. Open http://localhost:5173.

**Mac vs Windows**: Works identically. Node, npm, Vite, and Prisma are cross-platform. No known platform-specific issues. PostgreSQL can run locally or via Docker on both.

## Server / Deploy

**Primary fit**: **Long-running Node server**. Remix is designed to run as a Node process (or on Deno/Cloudflare Workers). Not serverless-first like Next.js on Vercel.

**AWS options**:
- **ECS / Fargate / App Runner** — Strong fit. Build with `npm run build`, run `npm run start`. Single Node process. Straightforward container image; works well with standard Node base images.
- **Lambda** — Possible via adapters (e.g. `@remix-run/architect`, community adapters). More config than ECS; cold starts apply.
- **Amplify** — Can host Remix with some setup; ECS/App Runner is often simpler.

**Summary**: Best fit is containers (ECS, Fargate, App Runner) or any Node hosting. Serverless is supported but secondary. Very portable across cloud providers.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Fast. `create-remix` scaffolds; add Prisma + admin layout in minutes |
| **Hot Reload** | Good. Vite-based dev server with HMR |
| **Adding a New Model** | Loaders/actions pattern. DB → loader → component. Clear flow |
| **Admin Area** | Route-based; separate layout for `/admin` with loader auth checks |
| **Local Dev** | Single command; same on Mac and Windows |
| **Learning Curve** | Moderate. Loaders/actions and nested routes are core concepts |
| **Web Standards** | Forms, fetches, progressive enhancement built in |

## Cons

| Area | Notes |
|------|-------|
| **API Layer** | Remix is page-centric. For pure API endpoints you add resource routes or separate backend |
| **Convention** | File-based routing; some teams prefer explicit routing |
| **Ecosystem** | Smaller than Next.js; fewer third-party integrations |

## Evaluation Against Criteria

*All scores 1–5; higher = better.*

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 5 | Minutes: Remix scaffold + Prisma + admin layout + loader auth |
| Level of Scaffolding | 3 | Prisma migrate; loaders/actions hand-written; no admin UI generator |
| Hot Reload Quality | 5 | Vite HMR; changes reflect immediately |
| Adding a New Model | 4 | Loaders/actions; page-centric; no separate API scaffolding |
| Admin Area Setup | 4 | Layout + loader auth; straightforward |
| Local Dev + Cross-Platform | 5 | `npm run dev`; identical on Mac and Windows |
| Learning Curve | 4 | Loaders, actions, nested routes to learn |
| Convention vs Config | 4 | File-based routing; explicit wiring |
| TypeScript Support | 5 | Native |
| AWS Deployment Options | 5 | Strong fit for ECS/Fargate/App Runner; Lambda possible with adapters |

## Best For

- Teams that value web standards and progressive enhancement
- Apps where forms and mutations are central
- Full-stack React with a different philosophy than Next.js

## Demo Fit

- **Hello World**: Root route + loader returning data
- **Admin**: `/admin` route with layout; loader checks auth
- **AdminUser model**: Prisma schema; separate from `User`
- **New model (e.g. Submission)**: Schema → migrate → loaders/actions → form + list. Admin route for CRUD.

## Getting Started

```bash
npx create-remix@latest
```

Use Vite, TypeScript, and Prisma (or Drizzle). Set `DATABASE_URL` to your PostgreSQL instance (local, Docker, or cloud).
