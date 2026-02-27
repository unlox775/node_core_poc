# Phase 4: Manual Patch Instructions

If you prefer to apply the changes manually instead of `git apply`, follow these edits.
Line numbers and context help you locate each change.

## File: `api/index.ts`

### Edit (edit 1/2): around line 52
**After the line** containing `app.put("/api/deals/:id", requireAdmin, async (req, res) ...`:

**Replace:**
```typescript
  const { name, description, address } = req.body;
  const deal = await prisma.deal.create({ data: { name, description, address, status: "pending" } });
  res.json(deal);
  const deals = await prisma.deal.findMany({ orderBy: { createdAt: "desc" } });
  res.json(deals);
```

**With:**
```typescript
  const { name, description, address, contact } = req.body;
  const data: {
    name: string;
    description: string;
    address: string;
    status: string;
    contacts?: { create: { contact: { create: { name: string; email: string; phone: string } } }[] };
  } = {
    name,
    description,
    address,
    status: "pending",
  };
  if (contact?.name && contact?.email && contact?.phone) {
    data.contacts = {
      create: [{ contact: { create: { name: contact.name, email: contact.email, phone: contact.phone } } }],
    };
  }
  const deal = await prisma.deal.create({ data, include: { contacts: { include: { contact: true } } } });
  res.json({ ...deal, contacts: deal.contacts.map((dc) => dc.contact) });
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { contacts: { include: { contact: true } } },
  });
  const mapped = deals.map((d) => ({
    ...d,
    contacts: d.contacts.map((dc) => dc.contact),
  }));
  res.json(mapped);
```

### Edit (edit 2/2): around line 75
**After the line** containing `app.listen(PORT, () => console.log(`API on http://localho...`:

**Add these lines:**
```typescript
app.post("/api/deals/:id/contacts", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { contactId } = req.body;
  await prisma.dealContact.create({ data: { dealId: id, contactId } });
  res.json({ ok: true });
});

app.delete("/api/deals/:dealId/contacts/:contactId", requireAdmin, async (req, res) => {
  const { dealId, contactId } = req.params;
  await prisma.dealContact.delete({ where: { dealId_contactId: { dealId, contactId } } });
  res.json({ ok: true });
});

app.get("/api/contacts", requireAdmin, async (_req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { name: "asc" } });
  res.json(contacts);
});

app.post("/api/contacts", requireAdmin, async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = await prisma.contact.create({ data: { name, email, phone } });
  res.json(contact);
});

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

## File: `src/App.tsx`

### Edit (edit 1/2): around line 5
**After the line** containing `return (`:

**Add these lines:**
```typescript
import AdminContacts from "./pages/AdminContacts";
```

### Edit (edit 2/2): around line 15
**After the line** containing `}`:

**Add these lines:**
```typescript
      <Route path="/admin/contacts" element={<AdminContacts />} />
```

## File: `src/pages/AdminContacts.tsx`

**Create this file** with the following content:

```typescript
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Contact = { id: string; name: string; email: string; phone: string };

export default function AdminContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const load = () => fetch("/api/contacts", { credentials: "include" }).then((r) => r.json()).then(setContacts);

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "1") {
      navigate("/admin");
      return;
    }
    load().finally(() => setLoading(false));
  }, [navigate]);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, phone }),
    }).then((r) => r.ok && (() => {
      setName("");
      setEmail("");
      setPhone("");
      load();
    })());
  };

  return (
    <main>
      <h1>Admin — Contacts</h1>
      <p>
        <Link to="/admin">← Back to admin</Link> | <Link to="/admin/deals">Deals</Link> | <Link to="/">Home</Link>
        {" · "}
        <button type="button" onClick={() => { fetch("/api/admin/logout", { method: "POST", credentials: "include" }); sessionStorage.removeItem("admin"); navigate("/"); }} style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>Log out</button>
      </p>
      <h2>Create contact</h2>
      <form onSubmit={create}>
        <div><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
        <button type="submit">Create</button>
      </form>
      <h2>All contacts</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {contacts.map((c) => (
            <li key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem", borderRadius: 4 }}>
              <strong>{c.name}</strong>
              <p><small>{c.email} · {c.phone}</small></p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

## File: `src/pages/AdminDeals.tsx`

### Edit (edit 1/3): around line 1
**After the line** containing `const navigate = useNavigate();`:

**Replace:**
```typescript
type Deal = { id: string; name: string; description: string; address: string; status: string };
```

**With:**
```typescript
type Contact = { id: string; name: string; email: string; phone: string };
type Deal = { id: string; name: string; description: string; address: string; status: string; contacts?: Contact[] };
```

### Edit (edit 2/3): around line 34
**After the line** containing `</p>`:

**Replace:**
```typescript
        <Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link>
```

**With:**
```typescript
        <Link to="/admin">← Back to admin</Link> | <Link to="/admin/contacts">Contacts</Link> | <Link to="/">Home</Link>
```

### Edit (edit 3/3): around line 45
**After the line** containing `{" · "}`:

**Add these lines:**
```typescript
              {d.contacts && d.contacts.length > 0 && (
                <p><small>Contacts: {d.contacts.map((c) => c.name).join(", ")}</small></p>
              )}
```

## File: `src/pages/AdminEditDeal.tsx`

### Edit (edit 1/5): around line 1
**After the line** containing `const navigate = useNavigate();`:

**Replace:**
```typescript
type Deal = { id: string; name: string; description: string; address: string; status: string };
```

**With:**
```typescript
type Contact = { id: string; name: string; email: string; phone: string };
type Deal = { id: string; name: string; description: string; address: string; status: string; contacts: Contact[] };
```

### Edit (edit 2/5): around line 10
**After the line** containing `useEffect(() => {`:

**Add these lines:**
```typescript
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
```

### Edit (edit 3/5): around line 17
**After the line** containing `const save = (e: React.FormEvent) => {`:

**Replace:**
```typescript
    fetch("/api/deals", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((deals: Deal[]) => {
        const d = deals.find((x) => x.id === id);
        if (d) {
          setName(d.name);
          setDescription(d.description);
          setAddress(d.address);
          setStatus(d.status);
        }
      })
      .finally(() => setLoading(false));
```

**With:**
```typescript
    Promise.all([
      fetch("/api/deals", { credentials: "include" }),
      fetch("/api/contacts", { credentials: "include" }),
    ]).then(([dr, cr]) => {
      if (dr.status === 401 || cr.status === 401) {
        sessionStorage.removeItem("admin");
        navigate("/admin");
        return;
      }
      return Promise.all([dr.json(), cr.json()]);
    }).then((data) => {
      if (!data) return;
      const [deals, contactsList]: [Deal[], Contact[]] = data;
      const d = deals.find((x) => x.id === id);
      if (d) {
        setName(d.name);
        setDescription(d.description);
        setAddress(d.address);
        setStatus(d.status);
        setContacts(d.contacts || []);
      }
      setAllContacts(contactsList);
    }).catch(() => {}).finally(() => setLoading(false));
```

### Edit (edit 4/5): around line 41
**After the line** containing `return (`:

**Add these lines:**
```typescript
  const addContact = (contactId: string) => {
    fetch(`/api/deals/${id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ contactId }),
    }).then((r) => r.ok && (() => {
      const c = allContacts.find((x) => x.id === contactId);
      if (c) setContacts((prev) => [...prev, c]);
    })());
  };

  const removeContact = (contactId: string) => {
    fetch(`/api/deals/${id}/contacts/${contactId}`, { method: "DELETE", credentials: "include" }).then((r) =>
      r.ok && setContacts((prev) => prev.filter((c) => c.id !== contactId))
    );
  };

  const availableToAdd = allContacts.filter((c) => !contacts.some((x) => x.id === c.id));

```

### Edit (edit 5/5): around line 65
**After the line** containing `}`:

**Add these lines:**
```typescript
      <h2>Contacts on this deal</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((c) => (
          <li key={c.id} style={{ marginBottom: "0.5rem" }}>
            {c.name} ({c.email}) — <button type="button" onClick={() => removeContact(c.id)} style={{ fontSize: "0.875rem" }}>Remove</button>
          </li>
        ))}
      </ul>
      {availableToAdd.length > 0 && (
        <>
          <h3>Add existing contact</h3>
          <select onChange={(e) => { const v = e.target.value; if (v) addContact(v); e.target.value = ""; }}>
            <option value="">— Select contact —</option>
            {availableToAdd.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </>
      )}
```

## File: `src/pages/NewDeal.tsx`

### Edit (edit 1/2): around line 6
**After the line** containing `.finally(() => setLoading(false));`:

**Replace:**
```typescript
      body: JSON.stringify({ name, description, address }),
```

**With:**
```typescript
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
    const body: { name: string; description: string; address: string; contact?: { name: string; email: string; phone: string } } = {
      name,
      description,
      address,
    };
    if (contactName && contactEmail && contactPhone) {
      body.contact = { name: contactName, email: contactEmail, phone: contactPhone };
    }
      body: JSON.stringify(body),
```

### Edit (edit 2/2): around line 29
**After the line** containing `</main>`:

**Add these lines:**
```typescript
        <h2>Primary Contact (optional)</h2>
        <div><label>Contact name</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} /></div>
        <div><label>Contact email</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
        <div><label>Contact phone</label><input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></div>
```
