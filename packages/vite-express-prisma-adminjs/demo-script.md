# Demo Script — Vite + Express + Prisma + AdminJS (Ben's Cranes)

Admin area is **AdminJS** — auto-generated from Prisma models. Login uses "ethan" in the email field, "123qwe" for password.

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

12. **You should see**: AdminJS dashboard with **Deal** and **AdminUser** resources. Full CRUD is auto-generated — list, create, edit, delete.

13. Click **Deal** → see the deals (seeded + the one you submitted). Edit, delete, or create new from AdminJS.

14. **Adding a new model**: Add to Prisma schema → migrate → add to AdminJS `resources` in `api/index.ts` → done. AdminJS generates the admin UI.

---

**Demo complete.**
