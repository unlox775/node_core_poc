# Demo Script — Remix (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

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

Phase 4 is delivered as a **patch** you apply and revert. The base code is Phase 3 only. See `phase4/README.md` for details.

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
