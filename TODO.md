# Master TODO — Ben's Cranes POC

Single source for what's done and what **you** need to do. Each stack has a `demo-script.md` with the full walkthrough — **use that for the demo**, not this file. This file is the quick-reference and status.

---

## Prerequisites (Do Once)

- [ ] **Node.js 20.18.0** — asdf: `asdf install nodejs 20.18.0`. Root `.tool-versions` sets it.
- [ ] **PostgreSQL** — Local. Mac: `brew install postgresql`, `./bin/start_postgresql.sh`, `createdb -h localhost bens_cranes_<stack>`. Use your Mac user in `.env` (run `whoami`).
- [ ] **Yarn** — For Redwood only: `corepack enable` then `corepack prepare yarn@stable --activate`.

---

## Demo Phases (All Stacks)

| Phase | What you do |
|-------|-------------|
| **1** | Startup: start PostgreSQL, create DB, `cp .env.example .env`, `db:push`, `db:seed`, `dev`. Open homepage. |
| **2** | Public deal flow: Click submit → fill form → submit → thank-you page. |
| **3** | Admin: `/admin` → login ethan/123qwe → list deals → edit one (change status) → delete one → confirm gone. |
| **4** | Add Contact model: **Redwood** — run `./packages/redwoodjs/phase4/apply.sh` (scaffolding + patch). **Other stacks** — apply patch from `phase4/`. Manual: `phase4/phase4-manual-patch.md`. |
| **5** | Verify E2E: Submit deal (with contact) → confirm in admin. |

---

## vite-express-prisma

**Location**: `packages/vite-express-prisma/`  
**Demo script**: `packages/vite-express-prisma/demo-script.md`

**Quick start**:
```bash
./bin/start_postgresql.sh
createdb -h localhost bens_cranes_vite_express
cd packages/vite-express-prisma
cp .env.example .env
# Edit .env: use your Mac username in DATABASE_URL if Homebrew
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:5173. API on 3001. Admin: ethan / 123qwe.

**Phase 4**: Apply patch. From repo root: `git apply packages/vite-express-prisma/phase4/phase4.patch`. Then reseed and dev. See `phase4/README.md`.

---

## t3-stack

**Location**: `packages/t3-stack/`  
**Demo script**: `packages/t3-stack/demo-script.md`

**Quick start**:
```bash
createdb -h localhost bens_cranes_t3
cd packages/t3-stack
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:3000. Admin: ethan / 123qwe.

**Phase 4**: Apply patch. From repo root: `git apply packages/t3-stack/phase4/phase4.patch`. Then reseed and dev. See `phase4/README.md`.

---

## remix

**Location**: `packages/remix/`  
**Demo script**: `packages/remix/demo-script.md`

**Quick start**:
```bash
createdb -h localhost bens_cranes_remix
cd packages/remix
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:5173. Admin: ethan / 123qwe.

**Phase 4**: Apply patch. From repo root: `git apply packages/remix/phase4/phase4.patch`. Then reseed and dev. See `phase4/README.md`.

---

## redwoodjs

**Location**: `packages/redwoodjs/`  
**Demo script**: `packages/redwoodjs/demo-script.md`

**Quick start**:
```bash
createdb -h localhost bens_cranes_redwoodjs
cd packages/redwoodjs
yarn install   # or npm install
cp .env.example .env
yarn rw prisma db push
yarn rw prisma db seed
yarn rw dev
```
Open http://localhost:8910. Admin: ethan / 123qwe. Node 20.x.

**Phase 4**: Scaffolding + patch. Run `./packages/redwoodjs/phase4/apply.sh` from repo root (runs `yarn rw generate scaffold Contact` + integration patch). See `phase4/README.md`.

---

## nestjs-vite-react

**Location**: `packages/nestjs-vite-react/`  
**Demo script**: `packages/nestjs-vite-react/demo-script.md`

**Quick start**:
```bash
createdb -h localhost bens_cranes_nestjs
cd packages/nestjs-vite-react
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:5173. API on 3000. Admin: ethan / 123qwe.

**Phase 4**: Apply patch. From repo root: `git apply packages/nestjs-vite-react/phase4/phase4.patch`. Then reseed and dev. See `phase4/README.md`.

---

## Ports & DBs

| Stack               | App        | DB Name                  |
|---------------------|-----------|---------------------------|
| t3-stack            | 3000      | bens_cranes_t3            |
| remix               | 5173      | bens_cranes_remix         |
| vite-express-prisma | 5173, 3001| bens_cranes_vite_express  |
| redwoodjs           | 8910      | bens_cranes_redwoodjs     |
| nestjs-vite-react   | 5173, 3000| bens_cranes_nestjs        |
