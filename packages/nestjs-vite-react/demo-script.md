# Demo Script — NestJS + Vite React (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

---

## Phase 0: Framework Tour

**Two web servers.** Vite (frontend) on port 5173; NestJS (API) on port 3000. Vite proxies `/api` to Nest. User hits 5173 only.

**Frontend:** Classic **SPA**. React + React Router. Client-side routing.

**Client/server model:** Clear separation. Client (`src/`) runs in browser; server (`api/src/`) runs in Node. You call `fetch("/api/...")` from React. Explicit HTTP, two codebases.

**Where logic lives:**
- **API** — `api/src/`. Feature modules: `deals/` (controller, service), `admin/` (controller, service), `prisma/`. Controllers define routes; services hit Prisma.
- **Frontend** — `src/` (pages, components). React Router; Vite builds to `dist/`.
- **Entry** — `index.html` → `src/main.tsx`; API entry is `api/src/main.ts`.

**Admin area** — Hand-built. `admin.controller` serves admin API; `src/pages/Admin*.tsx` renders the UI. No AdminJS.

**Production build** — Nest to `api/dist/`; Vite to `dist/`. Two processes.

**AWS (typical)** — Load balancer; EC2/ECS for Nest; optional static hosting. RDS for Postgres.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL**: `./bin/start_postgresql.sh` (from repo root).

2. **Create the database**: `createdb -h localhost bens_cranes_nestjs`

3. **Setup**:
   ```bash
   cd packages/nestjs-vite-react
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and use your Mac username in `DATABASE_URL` (run `whoami`).

4. **Push schema and seed**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the app**: `npm run dev`

6. **Open** http://localhost:5173 (Vite). API runs on 3000.

7. **You should see**: Ben's Cranes homepage with marketing copy and "Submit a new deal" link. No public deal list.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**. Fill in a dummy deal. Click **Submit Deal**.

9. **You should see**: Thank-you page. No deal list on the public side.

---

## Phase 3: Admin Area

10. Navigate to **http://localhost:5173/admin**. Log in: **ethan** / **123qwe**.

11. **You should see**: Deals list — Bob's Pianos, Bob Jones — Roof Trusses, plus the deal you submitted.

12. Click **Edit** on your deal. Change **Status** to `accepted`, click **Save**. Click **Delete** on that deal. **Confirm** it's gone.

---

## Phase 4: Add Contact Model

### Phase 4 Plan

**Why this stack**: NestJS without AdminJS means you build every layer yourself — schema, module, service, controller, and admin UI. There's no scaffolding. The upside: clear separation, explicit patterns, strong typing. Every file has a purpose. The downside: more boilerplate. ContactsModule mirrors DealsModule; AdminContacts, AdminDeals, and AdminEditDeal are hand-written. If you value structure and control over speed, this is the tradeoff.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation.
2. **ContactsModule** — contacts.controller, contacts.service, contacts.module; register in AppModule.
3. **DealsController** — Accept optional `contact` on create; add `POST :id/contacts` and `DELETE :id/contacts/:contactId`.
4. **DealsService** — findAll includes contacts; create with nested contact; addContact/removeContact.
5. **AdminContacts** — New page: list contacts, create form.
6. **AdminDeals** — Link to contacts; show contact count.
7. **AdminEditDeal** — Add/remove contacts on deal edit page.
8. **NewDeal form** — Optional primary contact fields (name, email, phone).
9. **Seed** — Reseed to apply schema and reset data.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md) for step-by-step edit instructions with copy-paste code blocks.

**To apply Phase 4** (from repo root):

```bash
git apply packages/nestjs-vite-react/phase4/phase4.patch
cd packages/nestjs-vite-react
npm run db:reseed
npm run dev
```

Or run `./packages/nestjs-vite-react/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/nestjs-vite-react/phase4/phase4.patch
cd packages/nestjs-vite-react
npm run db:reseed
```

**With Phase 4 applied:**

1. Go to http://localhost:5173/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal with its contact. Click **Contacts** to list all. Edit a deal to add/remove contacts.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info). In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
