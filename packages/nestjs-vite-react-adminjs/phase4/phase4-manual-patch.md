# Phase 4: Manual Patch — NestJS + Vite React + AdminJS

If you prefer to apply Phase 4 by hand instead of `git apply`, follow these steps. The base code is Phase 3 only (Deal + AdminUser, no Contact).

## 1. Prisma schema

**File:** `prisma/schema.prisma`

After the `AdminUser` model (before `model Deal {`), add:

```prisma
model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deals     DealContact[]
}
```

In the `Deal` model, add the relation and then add the join model. Change `model Deal` to include:

```prisma
  contacts    DealContact[]
}

model DealContact {
  dealId    String
  contactId String
  deal      Deal    @relation(fields: [dealId], references: [id], onDelete: Cascade)
  contact   Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  @@id([dealId, contactId])
}
```

## 2. AdminJS resources

**File:** `api/src/main.ts`

In the `resources` array of `new AdminJS({ ... })`, add after AdminUser:

```ts
      { resource: { model: getModelByName('Contact'), client: prisma }, options: {} },
      { resource: { model: getModelByName('DealContact'), client: prisma }, options: {} },
```

## 3. Deals controller

**File:** `api/src/deals/deals.controller.ts`

- Change `create` body type to include `contact?: { name: string; email: string; phone: string }`.
- After the `remove` method, add:

```ts
  @Post(':id/contacts')
  addContact(@Param('id') dealId: string, @Body() body: { contactId: string }) {
    return this.deals.addContact(dealId, body.contactId);
  }

  @Delete(':id/contacts/:contactId')
  removeContact(@Param('id') dealId: string, @Param('contactId') contactId: string) {
    return this.deals.removeContact(dealId, contactId);
  }
```

## 4. Deals service

**File:** `api/src/deals/deals.service.ts`

- Add `import { Prisma } from '@prisma/client';`
- In `findAll()`, use `include: { contacts: { include: { contact: true } } }` and map deals to include `contacts: d.contacts.map((dc: { contact: unknown }) => dc.contact)`.
- In `create()`, accept optional `contact`, build `Prisma.DealCreateInput` with optional `contacts.create` when contact is present, and use `include: { contacts: { include: { contact: true } } }` and map result.
- Add methods: `addContact(dealId, contactId)` (dealContact.create) and `removeContact(dealId, contactId)` (dealContact.delete with `dealId_contactId`).

## 5. NewDeal form

**File:** `src/pages/NewDeal.tsx`

- Add state: `contactName`, `contactEmail`, `contactPhone`.
- In `submit`, build `body` with optional `contact: { name, email, phone }` when all three are set.
- In the form, add a "Primary Contact (optional)" section with three inputs (Contact name, Contact email, Contact phone).

---

After editing, run:

```bash
npm run db:push
npm run dev
```
