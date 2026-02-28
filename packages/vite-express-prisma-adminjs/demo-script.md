# Demo Script — Vite + Express + Prisma + AdminJS (Ben's Cranes)

Admin area is **AdminJS** — auto-generated from Prisma models. Login uses "ethan" in the email field, "123qwe" for password. **Default codebase is Phase 3 only** (Deal + AdminUser; no Contact). Phase 4 is delivered as a patch to show what it takes to add a new model.

---

## Phase 0: Framework Tour

**Two web servers.** Vite (frontend) on port 5173 serves the React SPA; Express (API) on port 3001 serves REST routes and AdminJS. In dev, Vite proxies `/api` and `/admin` to Express. User hits 5173 only.

**Frontend:** Classic **SPA** (single-page app). React + React Router. One HTML load; client-side routing, no full page reloads. All UI is React components. Vite builds to static JS/CSS; the browser runs it.

**Client/server model:** Clear separation. You write **client code** in `src/` (pages, components) — it runs in the browser. You write **server code** in `api/index.ts` — it runs in Node. The wire is plain HTTP: in your React component you do `fetch("/api/deals")`. You own the contract: you define the route, the JSON shape, the types. No magic — when you're coding the frontend, you're explicitly calling the backend. Two distinct codebases; CORS and proxies connect them.

**Where logic lives:**
- **API routes & AdminJS** — All in `api/index.ts`. One file: Express app, CORS, session, every route, AdminJS setup.
- **Frontend** — `src/` (pages, components). React Router; Vite builds to `dist/`.
- **Entry** — `index.html` → `src/main.tsx`; API entry is `api/index.ts`.

**Admin area** — AdminJS is mounted on Express at `/admin`. It generates CRUD from Prisma models. Custom actions live in `api/admin/` (Phase 4).

**Production build** — `npm run build` compiles API to `api/dist/`, frontend to `dist/`. You run `node api/dist/index.js` and serve `dist/` statically (or reverse-proxy). Two processes, or one process serving both.

**AWS (typical)** — Load balancer; EC2/ECS for API (Node); optional separate static hosting (S3 + CloudFront) for frontend, or serve both from one Node process. RDS for Postgres.

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
