# Phase 4: Manual Patch — Vite + Express + Prisma + AdminJS

If you prefer to apply Phase 4 by hand instead of `git apply`, follow these steps. The base code is Phase 3 only (Deal + AdminUser, no Contact).

## 1. Prisma schema

**File:** `prisma/schema.prisma`

After the `AdminUser` model (before `model Deal {`), add the Contact model. In the Deal model add `contacts DealContact[]`. After the Deal model add the DealContact model (dealId, contactId, relations, @@id([dealId, contactId])).

## 2. AdminJS resources

**File:** `api/index.ts`

In the `resources` array of `new AdminJS({ ... })`, add Contact and DealContact (getModelByName("Contact"), getModelByName("DealContact")).

## 3. POST /api/deals

**File:** `api/index.ts`

Change the handler to read `contact` from req.body. Build a `data` object with optional `contacts: { create: [{ contact: { create: { name, email, phone } } }] }` when contact has name, email, phone. Use `prisma.deal.create({ data, include: { contacts: { include: { contact: true } } } })` and return the deal with contacts mapped to the contact objects.

## 4. NewDeal form

**File:** `src/pages/NewDeal.tsx`

Add state for contactName, contactEmail, contactPhone. In submit, add optional `contact` to the body when all three are set. Add "Primary Contact (optional)" section with three inputs.

---

After editing, run:

```bash
npm run db:push
npm run dev
```
