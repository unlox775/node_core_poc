# Phase 4: Add Contact Model (Scaffolding)

Phase 4 uses **Redwood scaffolding** to add the Contact model, then an integration patch for Deal-Contact relations and admin pages.

## Apply Phase 4

From the **repo root**:

```bash
./packages/redwoodjs/phase4/apply.sh
```

Or run the steps manually:

1. **Schema**: `git apply packages/redwoodjs/phase4/phase4-schema-initial.patch`
2. **DB push**: `cd packages/redwoodjs && yarn rw prisma db push --force-reset` (or `npx rw`)
3. **Scaffold Contact**: `yarn rw generate scaffold Contact` (or `npx rw generate scaffold Contact`)
4. **Integration**: `git apply packages/redwoodjs/phase4/phase4-integration.patch`
5. **DB push + seed**: `yarn rw prisma db push --force-reset && yarn rw prisma db seed`

If the scaffold step fails (e.g. yarn/network), run it manually from `packages/redwoodjs`, then:

```bash
./packages/redwoodjs/phase4/apply.sh --skip-scaffold
```

## Revert (back to Phase 3)

From the **repo root**:

```bash
./packages/redwoodjs/phase4/revert.sh
```

This reverts the integration patch, removes scaffold-generated files, reverts the schema, and reseeds.

## What Phase 4 Adds

- **Scaffolding**: Contact model + `yarn rw generate scaffold Contact` → SDL, service, components, pages
- **Integration patch**: DealContact join table, Deal.contacts relation, admin/contacts route, deal form contact fields, add/remove contacts on deal edit

## Manual edits

If you prefer to apply changes by hand, see [phase4-manual-patch.md](./phase4-manual-patch.md) for step-by-step instructions (needs update for scaffolding flow).
