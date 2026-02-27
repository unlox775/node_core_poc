# Phase 4: Add Contact Model

This folder contains the patch that adds the Contact model (and DealContact join table) to the Vite + Express + Prisma + AdminJS stack. **The default codebase is Phase 3 only** — Deal and AdminUser, no Contact. Phase 4 demonstrates what it takes to add a new model with this stack.

## Apply Phase 4

From the **repo root**:

```bash
git apply packages/vite-express-prisma-adminjs/phase4/phase4.patch
```

Then:

```bash
cd packages/vite-express-prisma-adminjs
npm run db:push   # apply new schema (seed unchanged)
npm run dev
```

## Revert (back to Phase 3)

From the **repo root**:

```bash
git apply -R packages/vite-express-prisma-adminjs/phase4/phase4.patch
```

Then:

```bash
cd packages/vite-express-prisma-adminjs
npm run db:push   # schema back to Phase 3
```

## What Phase 4 Adds

- **Schema**: Contact model, DealContact join table, Deal.contacts relation
- **AdminJS**: Contact and DealContact resources (auto-generated CRUD)
- **API**: POST /api/deals accepts optional contact
- **UI**: Primary contact (optional) on public deal form

## Manual apply

If you prefer not to use `git apply`, see [phase4-manual-patch.md](./phase4-manual-patch.md) for step-by-step edits.
