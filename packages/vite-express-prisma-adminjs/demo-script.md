# Demo Script — Vite + Express + Prisma + AdminJS (Ben's Cranes)

Admin area is **AdminJS** — auto-generated from Prisma models. Login uses "ethan" in the email field, "123qwe" for password. **Default codebase is Phase 3 only** (Deal + AdminUser; no Contact). Phase 4 is delivered as a patch to show what it takes to add a new model.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL** (if not running): `./bin/start_postgresql.sh` (from repo root).

2. **Create the database** (one-time):
   ```bash
   createdb -h localhost bens_cranes_vite_express_adminjs
   ```

3. **Setup**:
   ```bash
   cd packages/vite-express-prisma-adminjs
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and replace `home_work` in `DATABASE_URL` with your Mac username.

4. **Push schema and seed**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the app**: `npm run dev`

6. **Open** http://localhost:5173

7. **You should see**: Ben's Cranes homepage with "Submit a new deal" and "Admin" links.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**. Fill in a dummy deal. Click **Submit Deal**.

9. **You should see**: Thank-you page. No public deal list.

---

## Phase 3: Admin Area (AdminJS)

10. Click **Admin** or go to **http://localhost:5173/admin**.

11. Log in: **ethan** / **123qwe** (use "ethan" in the email field).

12. **You should see**: AdminJS dashboard with **Deal** and **AdminUser** only. Full CRUD for deals. No Contact yet.

13. Click **Deal** → see the deals (seeded + the one you submitted). Edit, delete, or create new from AdminJS.

---

## Phase 4: Add Contact Model

### Phase 4 Plan

**Why this stack shines here**: Vite + Express + AdminJS is one of the smallest Phase 4 patches. Everything lives in one place: `api/index.ts` has your Express routes and AdminJS setup. Add Contact and DealContact to the schema, add two lines to the AdminJS `resources` array, and extend the POST /api/deals handler — that's it. No NestJS modules, no separate admin routes. AdminJS generates the admin UI from Prisma. The tradeoff: less structure than NestJS, but fewer files to touch.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation (in `prisma/schema.prisma`).
2. **AdminJS** — Add Contact resource; custom **Manage contacts** (on Deal) and **Manage deals** (on Contact) record actions. DealContact (join table) not exposed.
3. **API** — GET /api/deals, /api/deals/:id, /api/contacts, /api/contacts/:id, POST/DELETE for deal–contact links; POST /api/deals accepts optional `contact`.
4. **NewDeal form** — Optional primary contact fields (name, email, phone).

Seed is unchanged. Run `db:push` to apply the schema.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md).

**To apply Phase 4** (from repo root):

```bash
git apply packages/vite-express-prisma-adminjs/phase4/phase4.patch
cd packages/vite-express-prisma-adminjs
npm run db:push
npm run dev
```

Or run `./packages/vite-express-prisma-adminjs/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/vite-express-prisma-adminjs/phase4/phase4.patch
cd packages/vite-express-prisma-adminjs
npm run db:push
```

**With Phase 4 applied:**

1. Go to http://localhost:5173/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal. AdminJS now has **Contact** and **DealContact** resources — list, create, edit, delete. Manage deal–contact links from AdminJS.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info). In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
