# Vite + Express + Prisma

**Philosophy**: Split-stack, minimal magic, maximum control. Frontend and backend are clearly separated.

## Components

- **Vite** — Fast React dev server and build tool
- **Express** — Node.js HTTP server
- **Prisma** — ORM for PostgreSQL
- **TypeScript** — Both frontend and backend

## Local Development

**How it runs**: Two processes. (1) Backend: `npm run dev` in backend folder (often `tsx watch` or `nodemon` for Express). (2) Frontend: `npm run dev` in frontend folder (Vite). Backend on one port (e.g. 3001), frontend on another (e.g. 5173). Vite proxies API requests to the backend in dev. PostgreSQL runs separately (local, Docker, or cloud).

**Typical flow**: Install Node. Start PostgreSQL. In backend: `npm install`, `npx prisma migrate dev`, `npm run dev`. In frontend: `npm install`, `npm run dev`. Open http://localhost:5173. Some setups use `concurrently` or a root script to run both.

**Mac vs Windows**: Works identically. Node, Vite, Express, and Prisma are cross-platform. Path handling in scripts is usually fine; watch for line endings in shell scripts if you share them. PostgreSQL is the same on both.

## Server / Deploy

**Primary fit**: **Traditional Node + static assets**. Build frontend (`npm run build`), serve static files from Express or a CDN. Backend runs as a long-running Node process.

**AWS options**:
- **ECS / Fargate / App Runner** — Strong fit. One container for backend; serve built frontend from Express or put assets on S3 + CloudFront. Very common pattern.
- **EC2** — Same idea; you manage the VM.
- **Lambda + API Gateway** — Possible for API-only; frontend on S3/CloudFront. Requires adapting Express to Lambda (e.g. serverless-express). More work than containers.
- **Amplify** — Can host backend + frontend; ECS/App Runner is often simpler for full control.

**Summary**: Best fit is containers (ECS, Fargate, App Runner) or EC2. Clear separation of frontend and backend; deployment is straightforward. No framework-specific deploy assumptions.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Moderate. Minimal boilerplate; you wire auth, admin routes, Prisma yourself |
| **Hot Reload** | Excellent. Vite HMR for frontend; nodemon/tsx for backend |
| **Adding a New Model** | Prisma schema → migrate → Express routes → React components. Explicit steps |
| **Admin Area** | Express middleware for auth; separate `/admin/*` routes. Full control |
| **Local Dev** | Two terminals or one script; same on Mac and Windows |
| **Learning Curve** | Low. Express and Vite are widely known |
| **Convention vs Config** | Maximum control. No framework magic |

## Cons

| Area | Notes |
|------|-------|
| **No End-to-End Types** | No tRPC; types don’t flow automatically. Can use OpenAPI + codegen |
| **More Wiring** | You set up CORS, auth, API structure, etc. |
| **Boilerplate** | More manual glue than full-stack frameworks |

## Evaluation Against Criteria

*All scores 1–5; higher = better.*

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 3 | Longer: manual wiring of auth, admin routes, CORS; no scaffold |
| Level of Scaffolding | 2 | Prisma migrate only; routes and UI hand-written; no codegen |
| Hot Reload Quality | 5 | Vite + nodemon/tsx; changes reflect immediately |
| Adding a New Model | 4 | Explicit: schema → migrate → Express routes → React; no magic |
| Admin Area Setup | 5 | Full control; middleware and routes; straightforward |
| Local Dev + Cross-Platform | 5 | Two processes; identical on Mac and Windows |
| Learning Curve | 5 | Familiar tech; minimal new concepts |
| Convention vs Config | 5 | Maximum control; no framework magic |
| TypeScript Support | 4 | Good; manual type sharing across frontend/backend |
| AWS Deployment Options | 5 | Standard Node + static; fits ECS, App Runner, EC2 very well |

## Best For

- Teams that want minimal abstraction and full control
- Engineers comfortable with Express and React
- Environments where framework lock-in is a concern

## Demo Fit

- **Hello World**: Express route + React fetch
- **Admin**: Express `/admin` routes + middleware for session/JWT
- **AdminUser model**: Prisma schema; separate from `User`
- **New model (e.g. Submission)**: Schema → migrate → Express CRUD routes → React form + list + admin UI

## Getting Started

```bash
# Frontend
npm create vite@latest frontend -- --template react-ts

# Backend
mkdir backend && cd backend && npm init -y && npm i express prisma @prisma/client
npx prisma init
```

Wire CORS, add routes, set `DATABASE_URL`. Run backend and frontend (separate terminals or a root script).
