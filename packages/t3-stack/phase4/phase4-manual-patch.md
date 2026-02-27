# Phase 4: Manual Patch Instructions

If you prefer to apply the changes manually instead of `git apply`, follow these edits.
Line numbers and context help you locate each change.

## File: `prisma/schema.prisma`

### Edit (edit 1/2): around line 17
**After the line** containing `name        String`:

**Add these lines:**
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

### Edit (edit 2/2): around line 25
**After the line** containing `}`:

**Add these lines:**
```prisma
  contacts    DealContact[]
}

model DealContact {
  dealId    String
  contactId String
  deal      Deal    @relation(fields: [dealId], references: [id], onDelete: Cascade)
  contact   Contact @relation(fields: [contactId], references: [id], onDelete: Cascade)
  @@id([dealId, contactId])
```

## File: `src/app/admin/contacts/page.tsx`

**Create this file** with the following content:

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function AdminContactsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setAuthed(sessionStorage.getItem("admin") === "1");
  }, []);

  const { data: contacts, refetch } = api.contact.list.useQuery();
  const createContact = api.contact.create.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setPhone("");
      void refetch();
    },
  });

  if (authed === null) return <p>Loading...</p>;
  if (!authed) {
    router.push("/admin");
    return null;
  }

  return (
    <main>
      <h1>Admin — Contacts</h1>
      <p><Link href="/admin">← Back to admin</Link> | <Link href="/admin/deals">Deals</Link> | <Link href="/">Home</Link></p>
      <h2>Create contact</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createContact.mutate({ name, email, phone });
        }}
      >
        <div><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
        <button type="submit" disabled={createContact.isPending}>Create</button>
      </form>
      <h2>All contacts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts?.map((c) => (
          <li key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem", borderRadius: 4 }}>
            <strong>{c.name}</strong>
            <p><small>{c.email} · {c.phone}</small></p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

## File: `src/app/admin/deals/[id]/page.tsx`

### Edit (edit 1/3): around line 5
**After the line** containing `const params = useParams();`:

**Add these lines:**
```typescript
type Contact = { id: string; name: string; email: string; phone: string };

```

### Edit (edit 2/3): around line 19
**After the line** containing `if (deal) {`:

**Replace:**
```typescript
  const { data: deals, refetch } = api.deal.list.useQuery();
```

**With:**
```typescript
  const { data: deals, refetch: refetchDeals } = api.deal.list.useQuery();
  const { data: allContacts } = api.contact.list.useQuery();
  const contacts = deal?.contacts?.map((dc: { contact: Contact }) => dc.contact) ?? [];
  const availableToAdd = (allContacts ?? []).filter((c) => !contacts.some((x: Contact) => x.id === c.id));
  const addContact = api.contact.addToDeal.useMutation({
    onSuccess: () => void refetchDeals(),
  });
  const removeContact = api.contact.removeFromDeal.useMutation({
    onSuccess: () => void refetchDeals(),
  });
```

### Edit (edit 3/3): around line 74
**After the line** containing `}`:

**Add these lines:**
```typescript
      <h2>Contacts on this deal</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((c: Contact) => (
          <li key={c.id} style={{ marginBottom: "0.5rem" }}>
            {c.name} ({c.email}) — <button type="button" onClick={() => removeContact.mutate({ dealId: id, contactId: c.id })} style={{ fontSize: "0.875rem" }}>Remove</button>
          </li>
        ))}
      </ul>
      {availableToAdd.length > 0 && (
        <>
          <h3>Add existing contact</h3>
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (v) addContact.mutate({ dealId: id, contactId: v });
              e.target.value = "";
            }}
          >
            <option value="">— Select contact —</option>
            {availableToAdd.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </>
      )}
```

## File: `src/app/admin/deals/page.tsx`

### Edit (edit 1/2): around line 26
**After the line** containing `) : (`:

**Replace:**
```typescript
      <p><Link href="/admin">← Back to admin</Link> | <Link href="/">Home</Link></p>
```

**With:**
```typescript
      <p><Link href="/admin">← Back to admin</Link> | <Link href="/admin/contacts">Contacts</Link> | <Link href="/">Home</Link></p>
```

### Edit (edit 2/2): around line 36
**After the line** containing `{" · "}`:

**Add these lines:**
```typescript
              {d.contacts && d.contacts.length > 0 && (
                <p><small>Contacts: {d.contacts.map((dc: { contact: { name: string } }) => dc.contact.name).join(", ")}</small></p>
              )}
```

## File: `src/app/deals/new/page.tsx`

### Edit (edit 1/3): around line 10
**After the line** containing `onSuccess: () => router.push("/thank-you"),`:

**Add these lines:**
```typescript
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
```

### Edit (edit 2/3): around line 22
**After the line** containing `<h2>Deal</h2>`:

**Replace:**
```typescript
          createDeal.mutate({ name, description, address });
```

**With:**
```typescript
          const payload: { name: string; description: string; address: string; contact?: { name: string; email: string; phone: string } } = {
            name,
            description,
            address,
          };
          if (contactName && contactEmail && contactPhone) {
            payload.contact = { name: contactName, email: contactEmail, phone: contactPhone };
          }
          createDeal.mutate(payload);
```

### Edit (edit 3/3): around line 38
**After the line** containing `</button>`:

**Add these lines:**
```typescript
        <h2>Primary Contact (optional)</h2>
        <div>
          <label>Contact name</label>
          <input value={contactName} onChange={(e) => setContactName(e.target.value)} />
        </div>
        <div>
          <label>Contact email</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        </div>
        <div>
          <label>Contact phone</label>
          <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        </div>
```

## File: `src/server/api/root.ts`

### Edit: around line 1
**After the line** containing `export type AppRouter = typeof appRouter;`:

**Add these lines:**
```typescript
import { contactRouter } from "~/server/api/routers/contact";
  contact: contactRouter,
```

## File: `src/server/api/routers/contact.ts`

**Create this file** with the following content:

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.contact.findMany({ orderBy: { name: "asc" } })
  ),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string(), phone: z.string() }))
    .mutation(({ ctx, input }) => ctx.db.contact.create({ data: input })),

  addToDeal: publicProcedure
    .input(z.object({ dealId: z.string(), contactId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.dealContact.create({ data: { dealId: input.dealId, contactId: input.contactId } })
    ),

  removeFromDeal: publicProcedure
    .input(z.object({ dealId: z.string(), contactId: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.dealContact.delete({
        where: { dealId_contactId: { dealId: input.dealId, contactId: input.contactId } },
      })
    ),
});
```

## File: `src/server/api/routers/deal.ts`

### Edit: around line 3
**After the line** containing `.input(z.object({`:

**Replace:**
```typescript
    ctx.db.deal.findMany({ orderBy: { createdAt: "desc" } })
    .input(z.object({ name: z.string(), description: z.string(), address: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.deal.create({ data: { ...input, status: "pending" } })
    ),
```

**With:**
```typescript
    ctx.db.deal.findMany({
      orderBy: { createdAt: "desc" },
      include: { contacts: { include: { contact: true } } },
    })
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        address: z.string(),
        contact: z.object({ name: z.string(), email: z.string(), phone: z.string() }).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { contact, ...dealData } = input;
      const data: Parameters<typeof ctx.db.deal.create>[0]["data"] = { ...dealData, status: "pending" };
      if (contact) {
        data.contacts = {
          create: [{ contact: { create: contact } }],
        };
      }
      return ctx.db.deal.create({
        data,
        include: { contacts: { include: { contact: true } } },
      });
    }),
```
