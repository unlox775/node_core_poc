# Vite + Express + Prisma + AdminJS

**Philosophy**: Same as Vite + Express + Prisma, but with **AdminJS** for the admin area. AdminJS reads your Prisma models and generates full CRUD (list, create, edit, delete) with forms and auth — similar to ActiveAdmin (Rails) or Kaffy (Phoenix).

## Components

- **Vite** — Fast React dev server and build tool
- **Express** — Node.js HTTP server
- **Prisma** — ORM for PostgreSQL
- **AdminJS** — Auto-generated admin panel from Prisma models
- **TypeScript** — Both frontend and backend

## Local Development

**How it runs**: Same as vite-express-prisma — two processes. Backend on 3001, frontend on 5173. AdminJS is mounted on Express at `/admin` and serves its own UI. Vite proxies `/admin` to the backend so users access http://localhost:5173/admin.

**Typical flow**: Same setup — PostgreSQL, `db:push`, `db:seed`, `npm run dev`. Admin area is at `/admin` (AdminJS).

## Server / Deploy

Same as vite-express-prisma. AdminJS is part of the Express app; no extra services.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Fast. Add AdminJS, register Prisma models — full CRUD with auth in a few lines |
| **Admin Area** | AdminJS reads models; generates list, create, edit, delete. Like ActiveAdmin |
| **Adding a New Model** | Prisma schema → migrate → add model to AdminJS `resources` — done |
| **Hot Reload** | Same as base stack |

## Cons

| Area | Notes |
|------|-------|
| **AdminJS Customization** | Default UI; customization takes more effort |
| **Separate Admin UX** | AdminJS has its own look/feel vs your React app |

## Evaluation Against Criteria

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 5 | AdminJS: register models, get full admin |
| Level of Scaffolding | 5 | AdminJS generates admin UI from Prisma models |
| Adding a New Model | 5 | Schema → migrate → add to AdminJS resources |
| Admin Area Setup | 5 | Few lines; auth + CRUD from models |

## Best For

- Teams that want the "add a few lines, get full admin" experience (Rails/Phoenix-style)
- CRUD-heavy apps where admin is mostly model management

## Getting Started

```bash
# Same as vite-express-prisma, plus:
npm install adminjs @adminjs/express @adminjs/prisma express-formidable

# In your Express app:
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
AdminJS.registerAdapter({ Database, Resource })

const admin = new AdminJS({
  resources: [
    { resource: { model: getModelByName('Deal'), client: prisma }, options: {} },
    { resource: { model: getModelByName('AdminUser'), client: prisma }, options: {} },
  ],
})

const adminRouter = AdminJSExpress.buildRouter(admin)
app.use(admin.options.rootPath, adminRouter)
```

Add auth via `AdminJSExpress.buildAuthenticatedRouter` and point `authenticate` at your AdminUser table.
