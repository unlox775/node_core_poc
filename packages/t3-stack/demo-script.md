# Demo Script — T3 Stack (Ben's Cranes)

Complete step-by-step demo. Everything you need is here.

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

Phase 4 is delivered as a **patch** you apply and revert. The base code is Phase 3 only. See `phase4/README.md` for details.

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
