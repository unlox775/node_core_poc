# Demo Standard — Ben's Cranes

All stack demos in this monorepo follow this standard. When this file is updated, each package's demo script and implementation should be updated to match.

**Philosophy**: This standard describes *what* the demo does, not *how*. Each framework should follow its own conventions, naming, and patterns. Don't force one approach onto another.

---

## App Identity

- **App name**: Ben's Cranes
- Each stack names the app/package in whatever way is conventional for that framework

---

## Database

- **Database names** (one per stack, for easy identification in a DB IDE):
  - `bens_cranes_t3`
  - `bens_cranes_remix`
  - `bens_cranes_vite_express`
  - `bens_cranes_redwoodjs`
  - `bens_cranes_nestjs`
- **PostgreSQL**: All stacks use PostgreSQL. How you run it (Docker, local, etc.) is up to the stack.

---

## Models

### Deal (required from start)

Must have these fields (use whatever types and naming convention the framework prefers):

- **name** — string
- **description** — string  
- **address** — string
- **status** — string (e.g. pending, accepted, completed)

Use the framework's standard pattern for primary keys, timestamps, etc. Don't prescribe column names beyond these four.

### Admin User (required from start)

Not prescriptive. You need *some* way to have an admin user who can log into the admin area. No schema requirements.

**Demo credentials** (same for all stacks):

- Username: `ethan` (lowercase)
- Password: `123qwe`

### Contact (added during demo — Phase 4)

Added in the "Add New Model" step. Must have:

- **name** — string
- **email** — string
- **phone** — string

Relationship: **Deal ↔ Contact** (many-to-many). Implementation is whatever the framework's pattern is (join table, implicit many-to-many, etc.).

---

## Seed Data

### Default Deals (2)

1. **Bob's Pianos**
   - Description: Need the new piano moved on March 31st at 8pm
   - Address: 123 Main Street, Saratoga Springs, UT
   - Status: pending

2. **Bob Jones — Roof Trusses**
   - Description: New roof trusses for his new house
   - Address: 456 Oak Avenue, Provo, UT
   - Status: pending

### Default Admin User

- Username: `ethan`
- Password: `123qwe`

### Seed / Reseed

Each stack needs a way to:

1. **Seed** — Populate the database with the default deals and admin user. Safe to run after migrations.
2. **Reseed** — Wipe the database, re-run schema, and seed. Full reset for a clean slate.

Use whatever commands and conventions that framework uses (e.g. Prisma `db seed`, Redwood `prisma db seed`, NestJS custom script). Document the actual commands in that stack's README and demo script.

---

## Homepage & Public UI

- **Homepage**: Welcome / marketing style. "Ben's Cranes" — here are our crane services, you should use us, etc. No deal listing.
- **One action**: Submit a new deal (essentially a contact form). Anyone can submit.
- **After submit**: Thank-you page ("We'll get back to you" or similar). No redirect to a deal list.
- **Deals are not public** — they only exist in the backend and admin area. The public flow is a transparent contact form.

---

## Admin Area

- **Path**: Whatever is standard for that framework. Could be `/admin`, `/dashboard`, `/manage`, etc. Don't prescribe.
- **Login**: Separate from any public user system. Credentials: `ethan` / `123qwe`.
- **Features**:
  - List deals
  - Edit deal (fields, status)
  - Delete deal
  - After Contact model exists: manage contacts, associate with deals, etc.

---

## Authentication & Authorization

Demos must implement a **sane auth pattern** appropriate to the framework. The pattern must be visible and verifiable — not just a login form with no backend enforcement.

### Public (unauthenticated)

- **Submit a new deal** — Anyone can submit via the public form. This is the contact-form flow.
- Homepage, thank-you page — public.

### Admin (authenticated only)

- **List deals** — Requires admin session.
- **Edit deal** — Requires admin session.
- **Delete deal** — Requires admin session.
- **Contacts** (list, create, add/remove from deals) — Requires admin session.

### Implementation

- Use whatever is idiomatic for that framework: sessions, JWT, middleware guards, etc.
- Admin login must establish a verified session/token.
- All admin API routes must reject unauthenticated requests (401/403).
- The demo should show that an unauthenticated `DELETE /api/deals/:id` (or equivalent) fails.

### Verification

In the demo flow, optionally: try to hit an admin endpoint without logging in (e.g. via curl or devtools) and confirm it returns 401 or 403.

---

## Demo Flow

### Phase 1: Startup & Homepage

1. Open the stack's README.
2. Follow startup instructions (whatever that framework uses).
3. Server starts; navigate to the homepage.
4. See the welcome page: Ben's Cranes, marketing copy, link/button to submit a new deal.

### Phase 2: Public Deal Flow (Contact Form)

5. Click to submit a new deal.
6. Fill in a dummy deal (name, description, address).
7. Submit — saved to database.
8. Land on thank-you page. No deal list on the public side.

### Phase 3: Admin Area

9. Navigate to the admin area (path per that framework).
10. Log in as `ethan` / `123qwe`.
11. See deals list — the two seeded deals plus the one just submitted.
12. Edit the new deal: change status, edit a field, save.
13. Delete the new deal.
14. Confirm it's gone.

### Phase 4: Add New Model (Contacts)

15. Add the Contact model in whatever way that framework does it:
    - Schema / migration (or equivalent)
    - API routes or data layer for contacts
    - Admin UI for contacts (scaffolded or manual — document the steps)
    - Update the deal submission form to capture at least one contact when creating a deal
16. Run migration (or equivalent). Reseed if needed.
17. Run the app again.
18. Submit a new deal with contact info — contact is created with the deal.
19. In admin — see contacts, add a second contact to a deal, assign existing contact to another deal, etc.

Do it the way that framework expects. If it's mostly manual, the demo script should walk through each step. If it's scaffolded, document the commands.

### Phase 5: Verify End-to-End

20. Go back to the app (restart if needed, or rely on hot reload — whatever that stack does).
21. Submit a new deal from the public form.
22. Go to admin and confirm the new deal (and contact, if applicable) appears.
23. Verify the full flow works. The goal is to show that the stack supports this workflow, not to prescribe how.

---

## Demo Script per Stack

Each package has a `demo-script.md` (or equivalent) that:

1. Mirrors the structure of this DEMO_STANDARD.
2. Uses **that framework's** commands, paths, and conventions.
3. For Phase 4 (Add New Model): provides the actual steps — whether that's copy-paste code blocks, CLI commands, or both.
4. Does not impose cross-framework patterns. What Prisma does is Prisma; what Redwood does is Redwood.

When DEMO_STANDARD.md is updated, each `demo-script.md` should be updated to stay in sync.
