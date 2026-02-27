# Demo Script — Vite + Express + Prisma (Ben's Cranes)

Complete step-by-step demo. No external references — everything you need is here.

---

## Phase 1: Startup & Homepage

1. **Start PostgreSQL** (if not running):
   ```bash
   ./bin/start_postgresql.sh
   ```
   (From repo root. Or start it however you normally do.)

2. **Create the database** (one-time):
   ```bash
   createdb -h localhost bens_cranes_vite_express
   ```

3. **Go to the package and setup**:
   ```bash
   cd packages/vite-express-prisma
   cp .env.example .env
   ```
   If using Homebrew PostgreSQL, edit `.env` and replace `home_work` in `DATABASE_URL` with your Mac username (run `whoami`).

4. **Push schema and seed**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the app**:
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:5173

7. **You should see**: Ben's Cranes homepage with marketing copy and a "Submit a new deal" link. No public deal list.

---

## Phase 2: Public Deal Flow

8. Click **"Submit a new deal"**.

9. Fill in a dummy deal, for example:
   - Deal / Customer name: `Jane's Furniture`
   - Description: `Move couch on April 15`
   - Address: `789 Elm St, Salt Lake City, UT`

10. Click **Submit Deal**.

11. **You should see**: Thank-you page ("We've received your request..."). No deal list on the public side.

---

## Phase 3: Admin Area

12. Navigate to **http://localhost:5173/admin**.

13. Log in: **ethan** / **123qwe**.

14. **You should see**: Deals list — the two seeded deals (Bob's Pianos, Bob Jones — Roof Trusses) plus the one you just submitted (Jane's Furniture).

15. Click **Edit** on the deal you just submitted.

16. Change **Status** to `accepted`, then click **Save**.

17. Go back to the deals list. Click **Delete** on that same deal.

18. **Confirm**: The deal is gone from the list.

18b. **Verify auth** (optional): Without logging in, run `curl -X DELETE http://localhost:3001/api/deals/any-id` — you should get `401 Unauthorized`. Admin routes (list, edit, delete deals; contacts) require a valid session.

---

## Phase 4: Add Contact Model

### Phase 4 Plan

**Why this stack**: Vite + Express + Prisma is the "minimal glue" option. No NestJS modules, no AdminJS — you add routes to `api/index.ts` and React pages to the frontend. Phase 4 is explicit: schema → Express CRUD routes → React forms and lists. No magic. The tradeoff: more manual wiring than T3 or Redwood, but full control. If you want to understand every line of code and avoid framework assumptions, this is it.

**What the patch adds** (CliffsNotes):

1. **Schema** — Contact model, DealContact join table, Deal.contacts relation.
2. **api/index.ts** — Extend POST /api/deals to accept optional `contact`; add GET/POST /api/contacts; add POST/DELETE for deal–contact links. All routes use `requireAdmin` where appropriate.
3. **App.tsx** — New AdminContacts route; update AdminDeals and AdminEditDeal with contact list and add/remove.
4. **NewDeal form** — Optional primary contact fields (name, email, phone).
5. **Seed** — Reseed to apply schema and reset data.

See `phase4/README.md` for details. To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md) for step-by-step edit instructions with copy-paste code blocks.

**To apply Phase 4** (from repo root):

```bash
git apply packages/vite-express-prisma/phase4/phase4.patch
cd packages/vite-express-prisma
npm run db:reseed
npm run dev
```

Or run `./packages/vite-express-prisma/phase4/apply.sh` from repo root. (Run it as a script, not with `source` — sourcing can close your terminal.)

**To revert** (back to Phase 3):

```bash
git apply -R packages/vite-express-prisma/phase4/phase4.patch
cd packages/vite-express-prisma
npm run db:reseed
```

Or run `./packages/vite-express-prisma/phase4/revert.sh` from repo root. (Run as a script, not with `source`.)

**With Phase 4 applied:**

1. Go to http://localhost:5173/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin (ethan / 123qwe). See the new deal **with** the contact listed.

3. Click **Contacts**. See all contacts including the one you just created.

4. Edit a deal. Use the dropdown to **add an existing contact** to that deal. Or **remove** a contact.

5. Confirm: you can add a second contact to a deal, and assign an existing contact to another deal.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

19. Go to http://localhost:5173

20. Submit a new deal from the public form (include contact info).

21. Go to admin. Confirm the new deal appears with its contact.

22. Verify the full flow: public submit → thank-you → admin list → edit → contacts work.

---

**Demo complete.**
