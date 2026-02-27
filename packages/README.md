# Packages — Stack Implementations

Each subfolder in `packages/` is a full-stack app (React + Node + PostgreSQL) using a different framework or stack.

## Structure (per stack)

```
packages/
├── t3-stack/              # T3 Stack (Next.js + tRPC + Prisma)
├── remix/                 # Remix + Prisma
├── vite-express-prisma/   # Vite + Express + Prisma
├── redwoodjs/             # RedwoodJS
└── nestjs-vite-react/     # NestJS + Vite React
```

Each stack folder should contain:

- `README.md` — How to run, what ports are used, and how to connect to the DB
- Source code for frontend, backend, and migrations
- Optional: scripts or config for local PostgreSQL

## Running a stack

```bash
cd packages/<stack-name>
# Follow that stack's README (e.g. npm run dev)
```

Then open the app (and optionally admin UI) in the browser. Connect a DB tool (pgAdmin, DBeaver, TablePlus, etc.) to PostgreSQL per the stack’s docs.

## Adding a new stack

1. Create a new folder under `packages/`
2. Implement the [standard features](../../framework-recommendations/README.md#standard-features-each-stack-must-demonstrate)
3. Document how to run locally (Mac + Windows) and how to deploy to AWS
4. Document in this README and in the root README
