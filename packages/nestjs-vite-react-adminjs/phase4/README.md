# Phase 4: Add Contact Model

This folder contains patch files to apply and unapply the Phase 4 (Contact model) changes. The base codebase is Phase 3 only — no Contact, DealContact, or contacts UI.

**Manual edits**: If you prefer to apply changes by hand instead of `git apply`, see [phase4-manual-patch.md](./phase4-manual-patch.md) for file-by-file, line-by-line instructions with copy-paste code blocks.

## Apply Phase 4

From the **repo root**:

```bash
git apply packages/nestjs-vite-react/phase4/phase4.patch
```

Then:

```bash
cd packages/nestjs-vite-react
npm run db:reseed   # schema changed — reseed
npm run dev
```

## Revert (back to Phase 3)

From the **repo root**:

```bash
git apply -R packages/nestjs-vite-react/phase4/phase4.patch
```

Then reseed and run again (schema back to Phase 3):

```bash
cd packages/nestjs-vite-react
npm run db:reseed
npm run dev
```

## What Phase 4 Adds

- **Schema**: Contact model, DealContact join table, Deal.contacts relation
- **API**: ContactsModule, add/remove contacts endpoints on DealsController
- **UI**: Primary contact on public deal form, AdminContacts page, contact management on deal edit
