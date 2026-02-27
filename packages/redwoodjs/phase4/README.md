# Phase 4: Add Contact Model

This folder contains patch files to apply and unapply the Phase 4 (Contact model) changes. The base codebase is Phase 3 only — no Contact, DealContact, or contacts UI.

**Manual edits**: If you prefer to apply changes by hand instead of `git apply`, see [phase4-manual-patch.md](./phase4-manual-patch.md) for file-by-file, line-by-line instructions with copy-paste code blocks.

## Apply Phase 4

From the **repo root**:

```bash
git apply packages/redwoodjs/phase4/phase4.patch
```

Then:

```bash
cd packages/redwoodjs
yarn rw prisma db push --force-reset
yarn rw prisma db seed
yarn rw dev
```

## Revert (back to Phase 3)

From the **repo root**:

```bash
git apply -R packages/redwoodjs/phase4/phase4.patch
```

Then reseed and run again (schema back to Phase 3):

```bash
cd packages/redwoodjs
yarn rw prisma db push --force-reset
yarn rw prisma db seed
yarn rw dev
```

## What Phase 4 Adds

- **Schema**: Contact model, DealContact join table, Deal.contacts relation
- **API**: Contact GraphQL types, contacts service, add/remove mutations
- **UI**: Primary contact on public deal form, AdminContactsPage, contact management on deal edit
