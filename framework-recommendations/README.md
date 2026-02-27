# Framework & Stack Recommendations

This folder documents candidate stacks for the Node Core POC monorepo. Each stack must satisfy the common requirements (React frontend, Node backend, PostgreSQL) while we evaluate which is **simplest for rapid development**.

## Evaluation Criteria

All stacks are scored against the same criteria. **Scores are 1–5: higher = better** (5 = fastest/easiest/best, 1 = slowest/hardest/poor).

| Criterion | 5 = Best | 1 = Worst | Why it matters |
|-----------|----------|-----------|----------------|
| **Time to Working Admin Area** | Minutes to get admin login, models, and frontend+backend connected | Hours or more; lots of manual wiring | Real minimum viable demo |
| **Level of Scaffolding** | One command generates model, migrations, routes, and admin UI | Everything hand-written; no codegen | Rapid model creation |
| **Hot Reload Quality** | Changes reflect immediately with no restart | Frequent restarts; slow feedback | Rapid iteration |
| **Adding a New Model** | Few steps; scaffolding or strong conventions | Many manual steps; boilerplate | Core demo flow |
| **Admin Area Setup** | Built-in or trivial to add | Custom auth, guards, layouts from scratch | Required feature |
| **Local Dev + Cross-Platform** | Simple startup; works identically on Mac and Windows | Fragile; platform-specific quirks | Team productivity |
| **Learning Curve** | Familiar tech; minimal new concepts | Framework-specific concepts to learn | Onboarding speed |
| **Convention vs Configuration** | Your preference: high = more control; low = more magic | — | Predictability vs productivity |
| **TypeScript Support** | First-class, end-to-end types | Bolt-on or weak | Type safety and DX |
| **AWS Deployment Options** | Clear path; fits serverless, ECS, Fargate, or App Runner | Awkward or unsupported | Production readiness |

### Local vs Deploy

Each recommendation includes a **Local Development** and **Server / Deploy** section:

- **Local development**: How do you run it? (e.g. `npm run dev`, `yarn dev`) What’s the typical flow? Mac vs Windows parity?
- **Server / deploy**: What AWS options fit best? Serverless (Lambda, etc.) vs containers (ECS, Fargate, App Runner)? What do teams usually use?

### Scaffolding

**Scaffolding** = ability to generate a new model and automatically get: migrations, routes/API, admin UI. Higher score = more code is generated for you; lower = more hand-written. Examples:

- **5**: `redwood generate scaffold Submission` → model, migrations, CRUD API, admin pages
- **3**: Prisma migrate + manual routes + manual React components
- **1**: Write migrations, routes, and UI entirely by hand

## Standard Features Each Stack Must Demonstrate

To keep comparisons meaningful, every stack in `packages/` must implement:

1. **Working Admin Area** — Admin login, models, frontend and backend connected (minimum viable demo)
2. **PostgreSQL** — At least `User` and `AdminUser` models
3. **Admin Login** — Separate login flow for admin (not regular users)
4. **Admin Area** — Protected routes for admin-only CRUD
5. **New Model Demo** — Add a new entity (e.g. `Submission`) with:
   - DB model + migration
   - API endpoints
   - Public form to create/view entries
   - Admin UI to create, update, delete
6. **Hot Reload** — Frontend and backend updates without manual restarts

## Philosophy Categories

Stacks fall into roughly three buckets:

- **Full-stack frameworks** — Tight integration of frontend + backend (e.g. Next.js, Remix, RedwoodJS)
- **Split-stack + glue** — Separate React app + Express/Fastify, wired together (e.g. Vite + Express + Prisma)
- **Backend-heavy frameworks** — Strong backend structure, frontend as separate app (e.g. NestJS + Vite React)

## Individual Recommendations

| Stack | Philosophy | Best For | Doc |
|-------|------------|----------|-----|
| **T3 Stack** | Full-stack | Rapid dev, type-safe, opinionated | [t3-stack.md](./t3-stack.md) |
| **Remix** | Full-stack | Web standards, progressive enhancement | [remix.md](./remix.md) |
| **Vite + Express + Prisma** | Split-stack | Minimal magic, full control | [vite-express-prisma.md](./vite-express-prisma.md) |
| **Vite + Express + Prisma + AdminJS** | Split-stack | Same + AdminJS (ActiveAdmin-style admin) | [vite-express-prisma-adminjs.md](./vite-express-prisma-adminjs.md) |
| **RedwoodJS** | Full-stack | Convention over config, batteries included | [redwoodjs.md](./redwoodjs.md) |
| **NestJS + Vite React** | Backend-heavy | Scalable teams, clear separation | [nestjs-vite-react.md](./nestjs-vite-react.md) |
| **NestJS + Vite React + AdminJS** | Backend-heavy | Same + AdminJS (ActiveAdmin-style admin) | [nestjs-vite-react-adminjs.md](./nestjs-vite-react-adminjs.md) |

## Next Steps

1. Read each recommendation file (including Local vs Deploy sections)
2. Pick one (or two) stacks to prototype
3. Add a `packages/<stack-name>/` folder with full implementation
4. Run the demo flow and compare against the criteria above
