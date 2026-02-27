# T3 Stack

**Philosophy**: Full-stack, opinionated, type-safe. Minimal decisions, maximum productivity.

## Components

- **Next.js** — React framework with API routes and SSR
- **tRPC** — End-to-end typesafe APIs (no OpenAPI/Swagger needed)
- **Prisma** — ORM with migrations, introspection, and Prisma Studio
- **TypeScript** — First-class everywhere
- **Tailwind CSS** — Utility-first styling (optional but common)

## Local Development

**How it runs**: `npm run dev` (or `pnpm dev` / `yarn dev`). Next.js dev server runs on port 3000. Single process: frontend and API routes are served together. Prisma connects to PostgreSQL (local install, Docker, or cloud).

**Typical flow**: Install Node, run `npm install`, set `DATABASE_URL` in `.env`, run `npx prisma migrate dev`, then `npm run dev`. Open http://localhost:3000.

**Mac vs Windows**: Works identically. Node, npm, and Prisma behave the same. Path differences in scripts are rare; Prisma and Next.js are cross-platform. Most teams run PostgreSQL via Docker or a local install on both.

## Server / Deploy

**Primary fit**: **Vercel** (serverless) — Next.js is made by Vercel. Deploy with `vercel` CLI or Git integration. API routes and pages run as serverless functions. Prisma works with connection pooling (e.g. Prisma Data Proxy or PgBouncer for serverless).

**AWS options**:
- **Amplify (Gen 2)** — Serverless; supports Next.js SSR and API routes. Simple Git-based deploy.
- **Lambda + adapter** — Next.js has `@vercel/next` and adapters (e.g. OpenNext for SST) to run on Lambda. Works but more config.
- **ECS / Fargate / App Runner** — Run Next.js as a long-running Node server. Use `next start` in production. Straightforward if you’re comfortable with containers; no serverless cold starts. Requires `standalone` output or similar for smaller images.

**Summary**: Best fit is serverless (Vercel or AWS Amplify/Lambda). Container deploy (ECS/Fargate) is possible and often simpler operationally if you prefer a single long-running process.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Fast. T3 scaffolds full stack; add Prisma models + NextAuth/admin routes in minutes |
| **Hot Reload** | Excellent. Next.js and tRPC both support HMR |
| **Adding a New Model** | Prisma schema → `prisma migrate` → tRPC router. Very few steps |
| **Admin Area** | Next.js middleware + separate routes. Auth via NextAuth.js or simple JWT |
| **Local Dev** | Single command; same on Mac and Windows |
| **Learning Curve** | Moderate. Next.js + tRPC + Prisma are popular; docs are strong |
| **Type Safety** | Best-in-class. Types flow from DB → API → frontend automatically |

## Cons

| Area | Notes |
|------|-------|
| **Convention** | Opinionated. May feel limiting if you want custom structure |
| **Next.js Lock-in** | tRPC is Next.js-friendly; using another frontend is awkward |
| **Serverless vs Containers** | Next.js leans serverless; container deploy works but is less documented than Vercel |

## Evaluation Against Criteria

*All scores 1–5; higher = better.*

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 5 | Minutes: T3 scaffold + Prisma models + admin routes + NextAuth |
| Level of Scaffolding | 4 | Prisma migrate + tRPC router; no admin UI generator; type-safe |
| Hot Reload Quality | 5 | Strong HMR; changes reflect immediately |
| Adding a New Model | 5 | Schema → migrate → router; few steps, full type flow |
| Admin Area Setup | 4 | NextAuth or custom middleware; straightforward |
| Local Dev + Cross-Platform | 5 | `npm run dev`; identical on Mac and Windows |
| Learning Curve | 4 | Popular; docs strong; some concepts to learn |
| Convention vs Config | 3 | Opinionated; less structural control |
| TypeScript Support | 5 | Native; types DB → API → frontend |
| AWS Deployment Options | 4 | Serverless (Amplify/Lambda) or containers (ECS/App Runner) both work |

## Best For

- Rapid development with strong type safety
- Teams that prefer opinionated stacks and fewer choices
- Apps that need SSR or hybrid rendering

## Demo Fit

- **Hello World**: Next.js page + tRPC query
- **Admin**: Separate `/admin` routes + middleware for auth
- **AdminUser model**: Prisma schema; `AdminUser` separate from `User`
- **New model (e.g. Submission)**: Schema → migrate → tRPC router → React form + admin CRUD

## Getting Started

```bash
npx create-t3-app@latest
```

Select: Next.js, tRPC, Prisma, Tailwind. Set `DATABASE_URL` to your PostgreSQL instance (local, Docker, or cloud).
