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

## Phase 4: Add Contact Model

Phase 4 is delivered as a **patch** you apply and revert. The base code is Phase 3 only. See `phase4/README.md` for details.

To apply manually instead of `git apply`, see [phase4/phase4-manual-patch.md](phase4/phase4-manual-patch.md) for step-by-step edit instructions with copy-paste code blocks.

**To apply Phase 4** (from repo root):

```bash
git apply packages/redwoodjs/phase4/phase4.patch
cd packages/redwoodjs
yarn rw prisma db push --force-reset
yarn rw prisma db seed
yarn rw dev
```

Or run `./packages/redwoodjs/phase4/apply.sh` from repo root.

**To revert** (back to Phase 3):

```bash
git apply -R packages/redwoodjs/phase4/phase4.patch
cd packages/redwoodjs
yarn rw prisma db push --force-reset
yarn rw prisma db seed
```

**With Phase 4 applied:**

1. Go to http://localhost:8910/deals/new. Submit a deal **with** a primary contact (name, email, phone).

2. Log in to admin. See the new deal with its contact. Click **Contacts** to list all. Edit a deal to add/remove contacts.

---

## Phase 5: Verify End-to-End

(Requires Phase 4 applied.)

3. Submit a new deal from the public form (with contact info). In admin, confirm the new deal and contact appear. Verify the full flow.

---

**Demo complete.**
