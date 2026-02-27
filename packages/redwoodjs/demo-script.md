# Demo Script — RedwoodJS (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL**: `./bin/start_postgresql.sh` (from repo root).

2. **Create the database**: `createdb -h localhost bens_cranes_redwoodjs`

3. **Setup**:
   ```bash
   cd packages/redwoodjs
   yarn install   # or npm install
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and use your Mac username in `DATABASE_URL` (run `whoami`).

4. **Push schema and seed**:
   ```bash
   yarn rw prisma db push
   yarn rw prisma db seed
   ```

5. **Start the app**: `yarn rw dev`

6. **Open** http://localhost:8910

7. **You should see**: Ben's Cranes homepage with marketing copy and "Submit a new deal" link. No public deal list.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**. Fill in a dummy deal. Click **Submit Deal**.

9. **You should see**: Thank-you page. No deal list on the public side.

---

## Phase 3: Admin Area

10. Navigate to **http://localhost:8910/admin**. Log in: **ethan** / **123qwe**.

11. **You should see**: Deals list — Bob's Pianos, Bob Jones — Roof Trusses, plus the deal you submitted.

12. Click **Edit** on your deal. Change **Status** to `accepted`, click **Save**. Click **Delete** on that deal. **Confirm** it's gone.

---

## Phase 4: Add Contact Model (Scaffolding)

### Phase 4 Plan

**Why this stack**: RedwoodJS has the best scaffolding of the seven POCs. `yarn rw generate scaffold Contact` reads your Prisma schema and generates GraphQL SDL, service, cells, pages, and routes. You get a working CRUD UI in seconds. The tradeoff: Redwood is GraphQL-first and convention-heavy. You work *with* the framework, not around it. If you like batteries-included and fast iteration, this is the standout.

**What Phase 4 does** (CliffsNotes):

1. **Schema (initial patch)** — Add Contact model to Prisma (no DealContact yet).
2. **Scaffold** — `yarn rw generate scaffold Contact` → SDL, service, cells, pages, routes for `/contacts`.
3. **Integration patch** — DealContact join table; Deal.contacts relation; addContactToDeal/removeContactFromDeal mutations; admin Contacts page; primary contact on deal form; add/remove on deal edit.

**Why add the model to Prisma first?**

Redwood does **not** have a "generate model" command. The Prisma schema (`api/db/schema.prisma`) is the source of truth. You define models there; Prisma generates the client and migrations. Redwood's `generate scaffold` reads from the schema — it assumes the model already exists. So the flow is: define model → push schema → scaffold.

### Step 1: Add the Contact model to the schema

The **schema-initial patch** adds the Contact model to `api/db/schema.prisma`:

```prisma
model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

We add only Contact (no DealContact yet). If we added the Deal–Contact relation here, the scaffold would try to expose `Contact.deals` in GraphQL, which references DealContact — but DealContact would have no SDL, causing an "Unknown type DealContact" error. So we add Contact first, scaffold it, then add the join table in the integration step.

Apply the patch and push the schema:

```bash
git apply packages/redwoodjs/phase4/phase4-schema-initial.patch
cd packages/redwoodjs
yarn rw prisma db push --force-reset   # or: npx rw prisma db push --force-reset
```

### Step 2: Run the scaffold

`yarn rw generate scaffold Contact` reads the Contact model from the schema and generates:

| What | Where |
|------|-------|
| GraphQL SDL | `api/src/graphql/contacts.sdl.ts` — types, queries, mutations |
| Service | `api/src/services/contacts/contacts.ts` — CRUD resolvers |
| Cells & components | `web/src/components/Contact/*` — list, form, show |
| Pages | `web/src/pages/Contact/*` — list, new, edit, show |
| Layout | `web/src/layouts/ScaffoldLayout/` |
| Routes | Adds `/contacts`, `/contacts/new`, `/contacts/{id}`, `/contacts/{id}/edit` |

Run it:

```bash
yarn rw generate scaffold Contact   # or: npx rw generate scaffold Contact
```

If this fails (yarn/network), run it manually from `packages/redwoodjs`, then continue with `./packages/redwoodjs/phase4/apply.sh --skip-scaffold`.

### Step 3: Apply the integration patch

The integration patch adds:

- DealContact join table and Deal.contacts relation in the schema
- Contact on Deal in the GraphQL API
- Mutations: `addContactToDeal`, `removeContactFromDeal`
- Admin Contacts page at `/admin/contacts`
- Primary contact fields on the public deal form
- Add/remove contacts on the deal edit page

From repo root:

```bash
cd ../..
git apply packages/redwoodjs/phase4/phase4-integration.patch
cd packages/redwoodjs
yarn rw prisma db push --force-reset
yarn rw prisma db seed
yarn rw dev   # or: npx rw dev
```

### One-line apply

Or run everything at once (from repo root):

```bash
./packages/redwoodjs/phase4/apply.sh
```

### Revert (back to Phase 3)

```bash
./packages/redwoodjs/phase4/revert.sh
```

(Run as a script, not with `source`.)

### With Phase 4 applied

1. Go to http://localhost:8910/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal with its contact. Click **Contacts** to list all. Edit a deal to add/remove contacts.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info). In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
