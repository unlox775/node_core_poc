# NestJS + Vite React

**Philosophy**: Backend-heavy, scalable, clear separation. NestJS provides structure; React frontend is a separate app.

## Components

- **NestJS** — Structured Node.js backend (modules, services, controllers)
- **Vite** — React dev server and build
- **Prisma** (or TypeORM) — ORM for PostgreSQL
- **TypeScript** — First-class everywhere

## Local Development

**How it runs**: Two processes. (1) Backend: `npm run start:dev` in backend folder (NestJS in watch mode). (2) Frontend: `npm run dev` in frontend folder (Vite). Backend on one port (e.g. 3000), frontend on another (e.g. 5173). Vite proxies API requests to the backend in dev. PostgreSQL runs separately (local, Docker, or cloud).

**Typical flow**: Install Node. Start PostgreSQL. In backend: `npm install`, `npx prisma migrate dev`, `npm run start:dev`. In frontend: `npm install`, `npm run dev`. Open http://localhost:5173. Use `concurrently` or a root script to run both if desired.

**Mac vs Windows**: Works identically. Node, NestJS, Vite, and Prisma are cross-platform. NestJS has broad adoption; no known platform-specific issues. PostgreSQL is the same on both.

## Server / Deploy

**Primary fit**: **Long-running Node + static assets**. NestJS runs as a Node process. Frontend is built and served as static files (from NestJS, Nginx, or a CDN).

**AWS options**:
- **ECS / Fargate / App Runner** — Strong fit. NestJS has official Docker guidance. One container for backend; serve built frontend from NestJS or put on S3 + CloudFront. Common enterprise pattern.
- **EC2** — Same idea; you manage the VM.
- **Lambda** — Possible with adapters (e.g. `@nestjs/platform-aws-lambda`). Cold starts; more config than containers. Less common for full NestJS apps.
- **Amplify** — Can host; ECS/App Runner is often preferred for control.

**Summary**: Best fit is containers (ECS, Fargate, App Runner) or EC2. NestJS is commonly deployed as a long-running service. Official Docker support; well-suited to team workflows.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Moderate. More structure; modules, guards, admin controller to add |
| **Hot Reload** | Good. Vite for frontend; NestJS `--watch` for backend |
| **Adding a New Model** | Module → service → controller → DTO. Clear pattern; more files |
| **Admin Area** | NestJS guards + admin controller; frontend admin routes |
| **Local Dev** | Two processes; same on Mac and Windows |
| **Learning Curve** | Moderate–high. Modules, dependency injection, decorators |
| **Scalability** | Strong. Good for larger teams and complex domains |

## Cons

| Area | Notes |
|------|-------|
| **Boilerplate** | More files and structure than lighter stacks |
| **Heavier Backend** | NestJS is more than “Express + structure” |
| **Slower Iteration** | Adding a model involves several layers |

## Evaluation Against Criteria

*All scores 1–5; higher = better.*

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 3 | Longer: Nest structure, modules, guards, admin controller to add |
| Level of Scaffolding | 2 | Nest CLI can generate modules; migrations, routes, admin UI hand-written |
| Hot Reload Quality | 4 | Vite + Nest watch; changes reflect; occasional full restart |
| Adding a New Model | 3 | Module, service, controller, DTO; more boilerplate |
| Admin Area Setup | 4 | Guards + admin controller; clear pattern; straightforward |
| Local Dev + Cross-Platform | 5 | Two processes; identical on Mac and Windows |
| Learning Curve | 3 | NestJS DI, modules, decorators to learn |
| Convention vs Config | 4 | Structured but configurable |
| TypeScript Support | 5 | Native; Nest is TypeScript-first |
| AWS Deployment Options | 5 | Strong fit for ECS/Fargate/App Runner; official Docker docs |

## Best For

- Teams that value backend structure and separation of concerns
- Larger or growing codebases
- Projects with multiple engineers and stricter architecture needs

## Demo Fit

- **Hello World**: NestJS controller + React fetch
- **Admin**: NestJS admin module + guards; React admin routes
- **AdminUser model**: Prisma/TypeORM entity; separate from `User`
- **New model (e.g. Submission)**: Entity → migration → module → service → controller → React form + list + admin CRUD

## Getting Started

```bash
# Backend
npx @nestjs/cli new backend

# Frontend
npm create vite@latest frontend -- --template react-ts
```

Add Prisma (or TypeORM), wire CORS, set `DATABASE_URL`. Run backend and frontend (separate terminals or a root script). NestJS has official Docker guidance if you want container-based deploy.
