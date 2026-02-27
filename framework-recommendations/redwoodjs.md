# RedwoodJS

**Philosophy**: Full-stack, convention over configuration, batteries included. Cells, Services, and GraphQL (or serverless functions) define the architecture.

## Components

- **RedwoodJS** — Full-stack framework (React + API layer)
- **Prisma** — ORM (built in)
- **GraphQL** (or serverless functions) — API layer
- **TypeScript** — First-class

## Local Development

**How it runs**: `yarn redwood dev` (or `npm run dev`). Redwood runs web (frontend) and api (backend) together. Default: web on 8910, api on 8911. Prisma connects to PostgreSQL (local, Docker, or cloud).

**Typical flow**: Install Node and Yarn. Run `yarn install`, set `DATABASE_URL` in `.env`, run `yarn redwood prisma migrate dev`, then `yarn redwood dev`. Open http://localhost:8910.

**Mac vs Windows**: Works well on both. Redwood and Prisma are cross-platform. Yarn is preferred; npm works. Some users report minor path issues on Windows in edge cases; generally solid.

## Server / Deploy

**Primary fit**: **Serverless (AWS Lambda)**. Redwood is built for serverless: API runs as Lambda functions, web can be static (S3 + CloudFront) or server-rendered via Lambda. Deploy with `yarn redwood deploy`.

**AWS options**:
- **Lambda + S3/CloudFront** — Native. `redwood deploy` targets AWS. API → Lambda, web → S3/CloudFront. Best-documented path.
- **ECS / Fargate** — Possible but not the default. You’d run api and web as containers; requires custom config. Some community approaches exist.
- **Railway, Render, Fly** — Redwood supports these; similar container-style deploy.

**Summary**: Best fit is serverless on AWS (Lambda). Strong CLI support and docs. Container deploy (ECS/Fargate) is possible but requires more setup than the built-in serverless path.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Fast. `create-redwood-app` + scaffold; add admin auth and routes |
| **Hot Reload** | Good. Dev server supports HMR |
| **Adding a New Model** | SDL + Prisma. `redwood generate scaffold` for CRUD. Very fast |
| **Admin Area** | Separate pages/routes; auth via Redwood’s auth setup |
| **Local Dev** | Single command; web + api together; same on Mac and Windows |
| **Learning Curve** | Moderate–high. Cells, services, SDL are Redwood-specific |
| **Scaffolding** | Strong. Generate CRUD from schema quickly |

## Cons

| Area | Notes |
|------|-------|
| **GraphQL Default** | GraphQL-first; REST needs custom setup |
| **Convention** | Strong conventions; less flexibility |
| **Ecosystem** | Smaller community than Next.js/Remix |
| **Container Deploy** | Optimized for serverless; ECS/Fargate needs custom setup |

## Evaluation Against Criteria

*All scores 1–5; higher = better.*

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 5 | Minutes: scaffold + auth; admin routes with Redwood patterns |
| Level of Scaffolding | 5 | `redwood generate scaffold` → model, migrations, SDL, cells, pages |
| Hot Reload Quality | 4 | Good HMR; some quirks with cells |
| Adding a New Model | 5 | Scaffold command generates most of CRUD |
| Admin Area Setup | 4 | Redwood auth + separate routes; some learning |
| Local Dev + Cross-Platform | 5 | `yarn redwood dev`; works on Mac and Windows |
| Learning Curve | 3 | Cells, services, SDL are framework-specific |
| Convention vs Config | 3 | Very opinionated; less flexibility |
| TypeScript Support | 5 | Native |
| AWS Deployment Options | 5 | Built for serverless (Lambda); container deploy needs more work |

## Best For

- Rapid CRUD-heavy apps with GraphQL
- Teams that like convention and scaffolding
- Projects targeting serverless on AWS

## Demo Fit

- **Hello World**: Redwood page + GraphQL query (or serverless function)
- **Admin**: Separate admin pages; Redwood auth for admin users
- **AdminUser model**: Prisma schema; separate from `User`
- **New model (e.g. Submission)**: Schema → `redwood generate scaffold` → cells for list/form → admin pages for CRUD

## Getting Started

```bash
yarn create redwood-app
```

Select PostgreSQL. Set `DATABASE_URL` to your instance (local, Docker, or cloud).
