# NestJS + Vite React + AdminJS

**Philosophy**: Same as NestJS + Vite React, but with **AdminJS** for the admin area. AdminJS integrates with NestJS via `@adminjs/nestjs` and reads Prisma models to generate full CRUD (list, create, edit, delete) — similar to ActiveAdmin (Rails) or Kaffy (Phoenix).

## Components

- **NestJS** — Structured Node.js backend
- **Vite** — React dev server and build
- **Prisma** — ORM for PostgreSQL
- **AdminJS** — Auto-generated admin panel from Prisma models (`@adminjs/nestjs`)
- **TypeScript** — First-class everywhere

## Local Development

**How it runs**: Same as nestjs-vite-react — two processes. NestJS on 3000, Vite on 5173. AdminJS is mounted via NestJS `AdminModule` at `/admin`. Vite proxies `/admin` to the backend.

**Typical flow**: Same setup — PostgreSQL, `db:push`, `db:seed`, `npm run dev`. Admin area at `/admin` (AdminJS).

## Server / Deploy

Same as nestjs-vite-react. AdminJS runs inside the NestJS process.

## Pros

| Area | Notes |
|------|-------|
| **Time to Working Admin Area** | Fast. Add AdminModule, register Prisma models — full CRUD with auth |
| **Admin Area** | AdminJS generates admin UI from Prisma; fits NestJS structure |
| **Adding a New Model** | Prisma schema → migrate → add to AdminJS resources — done |
| **NestJS Integration** | AdminModule follows Nest patterns; DI-compatible |

## Cons

| Area | Notes |
|------|-------|
| **AdminJS + Nest** | Slightly more setup than plain Express |
| **Separate Admin UX** | AdminJS has its own look/feel |

## Evaluation Against Criteria

| Criterion | Score | Notes |
|-----------|-------|-------|
| Time to Working Admin Area | 5 | AdminJS: register models, get full admin |
| Level of Scaffolding | 5 | AdminJS generates admin UI from Prisma models |
| Adding a New Model | 5 | Schema → migrate → add to AdminJS resources |
| Admin Area Setup | 5 | AdminModule + Prisma resources; auth via authenticate |

## Best For

- Teams that want NestJS structure plus "add a few lines, get full admin"
- CRUD-heavy apps with backend rigor

## Getting Started

```bash
# Same as nestjs-vite-react, plus:
npm install adminjs @adminjs/nestjs @adminjs/prisma

# In app.module.ts:
import { Module } from '@nestjs/common'
import { AdminModule } from '@adminjs/nestjs'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import AdminJS from 'adminjs'
import { PrismaService } from './prisma.service'

AdminJS.registerAdapter({ Database, Resource })

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: (prisma: PrismaService) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            { resource: { model: getModelByName('Deal'), client: prisma }, options: {} },
            { resource: { model: getModelByName('AdminUser'), client: prisma }, options: {} },
          ],
        },
      }),
      inject: [PrismaService],
    }),
  ],
})
export class AppModule {}
```

Add auth via AdminJS options. See [AdminJS Nest.js plugin docs](https://docs.adminjs.co/installation/plugins/nest).
