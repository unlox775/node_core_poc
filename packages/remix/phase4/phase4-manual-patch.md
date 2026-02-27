# Phase 4: Manual Patch Instructions

If you prefer to apply the changes manually instead of `git apply`, follow these edits.
Line numbers and context help you locate each change.

## File: `app/routes/admin.contacts._index.tsx`

**Create this file** with the following content:

```typescript
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/db.server";
import { isAdminLoggedIn } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const contacts = await db.contact.findMany({ orderBy: { name: "asc" } });
  return { contacts };
}

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isAdminLoggedIn(request))) return redirect("/admin");
  const form = await request.formData();
  const intent = form.get("intent");
  if (intent === "create") {
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    if (name && email && phone) {
      await db.contact.create({ data: { name, email, phone } });
    }
  }
  return redirect("/admin/contacts");
}

export default function AdminContacts() {
  const { contacts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <main>
      <h1>Admin — Contacts</h1>
      <p><Link to="/admin">← Back to admin</Link> | <Link to="/admin/deals">Deals</Link> | <Link to="/">Home</Link></p>
      <h2>Create contact</h2>
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="create" />
        <div><label>Name</label><input name="name" required /></div>
        <div><label>Email</label><input type="email" name="email" required /></div>
        <div><label>Phone</label><input name="phone" required /></div>
        <button type="submit" disabled={fetcher.state === "submitting"}>Create</button>
      </fetcher.Form>
      <h2>All contacts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((c) => (
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

## File: `app/routes/admin.deals.$id.tsx`

### Edit (edit 1/3): around line 6
**After the line** containing `export async function action({ request, params }: ActionF...`:

**Replace:**
```typescript
  const deal = await db.deal.findUnique({ where: { id: params.id! } });
  return { deal };
```

**With:**
```typescript
  const [deal, allContacts] = await Promise.all([
    db.deal.findUnique({
      where: { id: params.id! },
      include: { contacts: { include: { contact: true } } },
    }),
    db.contact.findMany({ orderBy: { name: "asc" } }),
  ]);
  const contacts = deal.contacts.map((dc) => dc.contact);
  const availableToAdd = allContacts.filter((c) => !contacts.some((x) => x.id === c.id));
  return { deal: { ...deal, contacts }, availableToAdd };
```

### Edit (edit 2/3): around line 28
**After the line** containing `return (`:

**Replace:**
```typescript
  const { deal } = useLoaderData<typeof loader>();
```

**With:**
```typescript
  if (intent === "addContact") {
    const contactId = form.get("contactId") as string;
    if (contactId) await db.dealContact.create({ data: { dealId, contactId } });
  }
  if (intent === "removeContact") {
    const contactId = form.get("contactId") as string;
    if (contactId) await db.dealContact.delete({ where: { dealId_contactId: { dealId, contactId } } });
  }
  const { deal, availableToAdd } = useLoaderData<typeof loader>();
```

### Edit (edit 3/3): around line 54
**After the line** containing `}`:

**Add these lines:**
```typescript
      <h2>Contacts on this deal</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {deal.contacts.map((c) => (
          <li key={c.id} style={{ marginBottom: "0.5rem" }}>
            {c.name} ({c.email}) —{" "}
            <fetcher.Form method="post" style={{ display: "inline" }}>
              <input type="hidden" name="intent" value="removeContact" />
              <input type="hidden" name="contactId" value={c.id} />
              <button type="submit" style={{ fontSize: "0.875rem" }}>Remove</button>
            </fetcher.Form>
          </li>
        ))}
      </ul>
      {availableToAdd.length > 0 && (
        <>
          <h3>Add existing contact</h3>
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="addContact" />
            <select name="contactId" required>
              <option value="">— Select contact —</option>
              {availableToAdd.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
            <button type="submit">Add</button>
          </fetcher.Form>
        </>
      )}
```

## File: `app/routes/admin.deals._index.tsx`

### Edit (edit 1/3): around line 6
**After the line** containing `export async function action({ request }: ActionFunctionA...`:

**Replace:**
```typescript
  const deals = await db.deal.findMany({ orderBy: { createdAt: "desc" } });
  return { deals };
```

**With:**
```typescript
  const deals = await db.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { contacts: { include: { contact: true } } },
  });
  return { deals: deals.map((d) => ({ ...d, contacts: d.contacts.map((dc) => dc.contact) })) };
```

### Edit (edit 2/3): around line 32
**After the line** containing `{deals.map((d) => (`:

**Replace:**
```typescript
      <p><Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link></p>
```

**With:**
```typescript
      <p><Link to="/admin">← Back to admin</Link> | <Link to="/admin/contacts">Contacts</Link> | <Link to="/">Home</Link></p>
```

### Edit (edit 3/3): around line 40
**After the line** containing `{" · "}`:

**Add these lines:**
```typescript
            {d.contacts?.length > 0 && <p><small>Contacts: {d.contacts.map((c: { name: string }) => c.name).join(", ")}</small></p>}
```

## File: `app/routes/deals.new.tsx`

### Edit (edit 1/2): around line 8

**Replace:**
```typescript
  await db.deal.create({ data: { name, description, address, status: "pending" } });
```

**With:**
```typescript
  const contactName = form.get("contactName") as string;
  const contactEmail = form.get("contactEmail") as string;
  const contactPhone = form.get("contactPhone") as string;
  const data: { name: string; description: string; address: string; status: string; contacts?: { create: { contact: { create: { name: string; email: string; phone: string } } }[] } } = {
    name,
    description,
    address,
    status: "pending",
  };
  if (contactName && contactEmail && contactPhone) {
    data.contacts = {
      create: [{ contact: { create: { name: contactName, email: contactEmail, phone: contactPhone } } }],
    };
  }
  await db.deal.create({ data });
```

### Edit (edit 2/2): around line 27
**After the line** containing `</form>`:

**Add these lines:**
```typescript
        <h2>Primary Contact (optional)</h2>
        <div><label>Contact name</label><input name="contactName" /></div>
        <div><label>Contact email</label><input type="email" name="contactEmail" /></div>
        <div><label>Contact phone</label><input type="tel" name="contactPhone" /></div>
```

## File: `prisma/schema.prisma`

### Edit (edit 1/2): around line 15
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

### Edit (edit 2/2): around line 23
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
