# Node Core POC — Monorepo

A proof-of-concept monorepo containing multiple full-stack application variants. Each variant demonstrates a different framework or stack while sharing core requirements. The goal is to evaluate options and identify the **simplest stack for rapid development**.

## Overview

- **Root**: Monorepo root (this folder)
- **Subpackages**: Each app lives in its own subfolder (e.g. `packages/t3-stack/`, `packages/remix-app/`)
- **Run model**: `cd packages/<stack-name>` → run the stack (each stack documents its own startup)

## Common Requirements (All Stacks)

| Component   | Tech               |
|------------|--------------------|
| Frontend   | React              |
| Backend    | Node.js            |
| Database   | PostgreSQL         |
| Target deployment | Amazon (AWS) |
| Local dev  | Run reliably on Mac and Windows with minimal setup differences |

### Must-Have Features

1. **Full-stack Hello World** — App starts end-to-end with minimal setup
2. **Admin area** — Separate admin interface and login (not the same as regular user login)
3. **Admin users model** — Dedicated `AdminUser` (or equivalent) model, distinct from regular `User`
4. **Hot reload** — Code changes auto-update the app (no manual restarts for typical edits)
5. **Browser preview** — App opens in a web browser when running
6. **Database browsing** — PostgreSQL reachable (localhost or similar) so a free DB tool (e.g. pgAdmin, DBeaver, TablePlus) can connect

### Demo Flow (Target)

1. Navigate to a stack folder and start the stack (per its README)
2. Show frontend, backend, and DB running
3. Connect a DB tool to browse schema and data
4. Log into the admin area (separate login flow)
5. **Rapid model demo**: Add a new model → add frontend (form + list) → see it in admin
6. Show full CRUD for the new model in both public UI and admin UI

### Cross-Platform

Two engineers: one on **Mac**, one on **Windows**. Stacks should run reliably on both with minimal differences. Each recommendation documents how local dev works and any platform-specific notes.

## Project Structure

```
node_core_poc/
├── README.md                      # This file
├── framework-recommendations/     # Stack evaluation and criteria
│   ├── README.md                  # Evaluation criteria and comparison
│   ├── t3-stack.md
│   ├── remix.md
│   ├── vite-express-prisma.md
│   ├── redwoodjs.md
│   └── nestjs-vite-react.md
└── packages/                      # Individual app stacks (implement as you go)
    ├── README.md
    ├── t3-stack/                  # (example) T3 Stack
    ├── remix-app/                 # (example) Remix
    └── ...
```

## Getting Started

1. Choose a stack from `framework-recommendations/`
2. `cd packages/<stack-name>`
3. Follow that stack’s README to run it
4. App and admin UI run in browser; DB reachable per stack docs

## Framework Recommendations

See **[framework-recommendations/README.md](./framework-recommendations/README.md)** for:

- Evaluation criteria for each stack
- Local development vs server/deploy for each
- Individual stack writeups and trade-offs

## Deployment

- **Local**: Run per stack (Node, npm scripts, etc.). Mac + Windows parity is the goal.
- **Production**: Deploy to AWS. Each recommendation covers which AWS options fit best (serverless, ECS, Fargate, App Runner, etc.).
