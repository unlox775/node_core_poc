# Demo Script — Remix (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

---

## Phase 0: Framework Tour

**One server.** Remix runs a single Node process (port 5173 in dev). No separate API; routes are the data layer.

**Where logic lives:**
- **Routes** — `app/routes/`. File-based: `deals.new.tsx` = `/deals/new`, `admin.deals.$id.tsx` = `/admin/deals/:id`. Each route exports `loader` (fetch data) and `action` (mutations). Loaders/actions run on the server; they call Prisma directly.
- **Entry** — `app/root.tsx` (layout); `app/entry.server.tsx` / `app/entry.client.tsx` (hydration).
- **No REST API** — The frontend doesn't call `/api/*`. It uses Remix loaders/actions; forms submit to the current route's action.

**Admin area** — Routes under `app/routes/admin.*`. Same pattern: loaders fetch, actions mutate. Session auth in `admin.tsx` layout.

**Production build** — `remix vite:build` → `build/`. Run with `remix-serve`. One process, one port.

**AWS (typical)** — Load balancer; single EC2/ECS or Lambda (adapter-dependent). RDS for Postgres. Lighter than two-server setups.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL** (if not running): `./bin/start_postgresql.sh` (from repo root).

2. **Create the database** (one-time): `createdb -h localhost bens_cranes_remix`

3. **Setup**:
   ```bash
   cd packages/remix
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and use your Mac username in `DATABASE_URL` (run `whoami`).

4. **Push schema and seed**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the app**: `npm run dev`

6. **Open** http://localhost:5173

7. **You should see**: Ben's Cranes homepage with marketing copy and "Submit a new deal" link. No public deal list.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**. Fill in a dummy deal (name, description, address). Click **Submit Deal**.

9. **You should see**: Thank-you page. No deal list on the public side.

---

## Phase 3: Admin Area

10. Navigate to **http://localhost:5173/admin**. Log in: **ethan** / **123qwe**.

11. **You should see**: Deals list — Bob's Pianos, Bob Jones — Roof Trusses, plus the deal you submitted.

12. Click **Edit** on your deal. Change **Status** to `accepted`, click **Save**. Click **Delete** on that deal. **Confirm** it's gone.

---

## Phase 4: Add Contact Model

### Phase 4 Plan

**Why this stack**: Remix is page-centric — loaders fetch data, actions handle mutations. There's no separate API layer; your routes *are* the data layer. Phase 4 adds Contact via loaders and actions in route files. Each admin page (contacts list, deal edit) has its own loader/action. The tradeoff: you write each route by hand, but the model is simple and explicit. Web standards (forms, fetches) are built in. No scaffolding, but the patterns are clear.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation.
2. **admin.contacts._index** — Loader lists contacts; action creates contact.
3. **admin.deals.$id** — Loader includes contacts and available-to-add; actions for addContact/removeContact.
4. **admin.deals._index** — Loader includes contacts on deals.
5. **deals.new** — Action accepts optional contact; create deal with nested contact.
6. **NewDeal form** — Optional primary contact fields (name, email, phone).
7. **Seed** — Reseed to apply schema and reset data.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md) for step-by-step edit instructions with copy-paste code blocks.

**To apply Phase 4** (from repo root):

```bash
git apply packages/remix/phase4/phase4.patch
cd packages/remix
npm run db:reseed
npm run dev
```

Or run `./packages/remix/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/remix/phase4/phase4.patch
cd packages/remix
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
