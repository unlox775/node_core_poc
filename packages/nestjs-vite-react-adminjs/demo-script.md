# Demo Script — NestJS + Vite React + AdminJS (Ben's Cranes)

Admin area is **AdminJS** — auto-generated from Prisma models. Login uses "ethan" in the email field, "123qwe" for password. **Default codebase is Phase 3 only** (Deal + AdminUser; no Contact). Phase 4 is delivered as a patch to show what it takes to add a new model.

---

## Phase 0: Framework Tour

**Two web servers.** Vite (frontend) on port 5173; NestJS (API) on port 3000. Vite proxies `/api` and `/admin` to Nest. User hits 5173 only.

**Where logic lives:**
- **API** — `api/src/`. `main.ts` bootstraps the app; AdminJS wired in there. Feature modules: `deals/` (controller, service, module), `contacts/` (Phase 4), `prisma/`. Controllers define routes; services hit Prisma.
- **Frontend** — `src/` (pages, components). React Router; Vite builds to `dist/`.
- **Entry** — `index.html` → `src/main.tsx`; API entry is `api/src/main.ts`.

**Admin area** — AdminJS is configured in `main.ts` and mounted on Nest. Custom action components in `api/src/admin/` (Phase 4).

**Production build** — Nest builds to `api/dist/`; Vite to `dist/`. Run Nest with `node api/dist/main.js`, serve static assets. Two processes in practice.

**AWS (typical)** — Load balancer; EC2/ECS for Nest API; S3 + CloudFront for frontend (optional) or serve both from one Node process. RDS for Postgres.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL** (if not running): `./bin/start_postgresql.sh` (from repo root).

2. **Create the database** (one-time):
   ```bash
   createdb -h localhost bens_cranes_nestjs_adminjs
   ```

3. **Setup**:
   ```bash
   cd packages/nestjs-vite-react-adminjs
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

**Why this stack shines here**: NestJS + AdminJS makes adding a new model very low-friction. AdminJS reads your Prisma schema and auto-generates full CRUD — there's no scaffolding step and no custom admin UI to build. You define the model, register it in AdminJS, and you're done. The tradeoff: you're writing backend code (schema, services, controller) and a couple lines in `main.ts`, but the admin panel appears for free. This is the "add a few lines, get full admin" workflow.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation.
2. **AdminJS** — Add Contact to `resources`; custom **Manage contacts** (on Deal) and **Manage deals** (on Contact) record actions for the many-to-many relation. DealContact (join table) is not exposed.
3. **Deals API** — Create accepts optional `contact`; add `addContact` / `removeContact` endpoints.
4. **DealsService** — Include contacts in `findAll`; create with nested contact; addContact/removeContact.
5. **NewDeal form** — Optional primary contact fields (name, email, phone).

Seed is unchanged — deals can exist without contacts. Run `db:push` to apply the schema.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md).

**To apply Phase 4** (from repo root):

```bash
git apply packages/nestjs-vite-react-adminjs/phase4/phase4.patch
cd packages/nestjs-vite-react-adminjs
npm run db:push
npm run dev
```

Or run `./packages/nestjs-vite-react-adminjs/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/nestjs-vite-react-adminjs/phase4/phase4.patch
cd packages/nestjs-vite-react-adminjs
npm run db:push
```

**With Phase 4 applied:**

1. Go to http://localhost:5173/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal. AdminJS now has a **Contact** resource — list, create, edit, delete. On **Deal** records use the **Manage contacts** action to add/remove contacts; on **Contact** records use **Manage deals** to add/remove deals. DealContact (join table) is not exposed. _First load of a custom action may take a few seconds while AdminJS bundles the component._

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info). In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
