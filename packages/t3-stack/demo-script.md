# Demo Script — T3 Stack (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

---

## Phase 0: Framework Tour

**One server.** Next.js (App Router) on port 3000. tRPC runs inside Next; no separate API server.

**Where logic lives:**
- **Data layer** — `src/server/api/routers/`. tRPC routers: `deal.ts`, `admin.ts`. Each router defines procedures (queries, mutations) that use Prisma. Type-safe end-to-end.
- **Pages** — `src/app/`. App Router: `page.tsx` per route (`/`, `/deals/new`, `/admin`, `/admin/deals`, etc.). Pages use `api.deal` or `api.admin` via tRPC React hooks.
- **Entry** — `src/app/layout.tsx`; tRPC provider wraps the app.
- **No REST** — Frontend calls tRPC procedures, not `/api/...`. One `/api/trpc/[trpc]` route handles all tRPC.

**Admin area** — Pages under `src/app/admin/`. tRPC `admin` router for list/edit/delete. Hand-built UI.

**Production build** — `next build` → `.next/`. `next start` runs one process.

**AWS (typical)** — Load balancer; single EC2/ECS or Vercel. RDS for Postgres. Single deployment unit.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL** (if not running):
   ```bash
   ./bin/start_postgresql.sh
   ```
   (From repo root.)

2. **Create the database** (one-time):
   ```bash
   createdb -h localhost bens_cranes_t3
   ```

3. **Go to the package and setup**:
   ```bash
   cd packages/t3-stack
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and use your Mac username in `DATABASE_URL` (run `whoami`).

4. **Push schema and seed**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the app**:
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:3000

7. **You should see**: Ben's Cranes homepage with marketing copy and "Submit a new deal" link. No public deal list.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**.

9. Fill in a dummy deal, e.g.:
   - Deal / Customer name: `Jane's Furniture`
   - Description: `Move couch on April 15`
   - Address: `789 Elm St, Salt Lake City, UT`

10. Click **Submit Deal**.

11. **You should see**: Thank-you page. No deal list on the public side.

---

## Phase 3: Admin Area

12. Navigate to **http://localhost:3000/admin**.

13. Log in: **ethan** / **123qwe**.

14. **You should see**: Deals list — Bob's Pianos, Bob Jones — Roof Trusses, plus the deal you just submitted.

15. Click **Edit** on the deal you submitted. Change **Status** to `accepted`, click **Save**.

16. Click **Delete** on that deal. **Confirm** it's gone.

---

## Phase 4: Add Contact Model

### Phase 4 Plan

**Why this stack**: T3 Stack (Next.js + tRPC + Prisma) gives you end-to-end type safety. Add a Prisma model, add a tRPC router, and your React components get typed queries and mutations automatically. No OpenAPI, no manual types. Phase 4 is: schema → migrate → contact router → admin pages. The tradeoff: you write the admin UI (list, form, edit) by hand — T3 doesn't scaffold admin. But the data layer is fast and type-safe.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation.
2. **tRPC router** — contact.list, contact.create; extend deal router with addContact/removeContact.
3. **Admin pages** — AdminContacts (list + create); AdminEditDeal (add/remove contacts).
4. **NewDeal form** — Optional primary contact fields (name, email, phone).
5. **Seed** — Reseed to apply schema and reset data.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md) for step-by-step edit instructions with copy-paste code blocks.

**To apply Phase 4** (from repo root):

```bash
git apply packages/t3-stack/phase4/phase4.patch
cd packages/t3-stack
npm run db:reseed
npm run dev
```

Or run `./packages/t3-stack/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/t3-stack/phase4/phase4.patch
cd packages/t3-stack
npm run db:reseed
```

**With Phase 4 applied:**

1. Go to http://localhost:3000/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal with its contact. Click **Contacts** to list all contacts. Edit a deal to add/remove contacts.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info).

4. In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
