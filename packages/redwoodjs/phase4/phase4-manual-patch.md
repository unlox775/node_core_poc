# Phase 4: Manual Patch Instructions

If you prefer to apply the changes manually instead of `git apply`, follow these edits.
Line numbers and context help you locate each change.

## File: `api/db/schema.prisma`

### Edit (edit 1/2): around line 16
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

### Edit (edit 2/2): around line 24
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

## File: `api/src/graphql/deals.sdl.ts`

### Edit (edit 1/3): around line 1
**After the line** containing `name: String!`:

**Add these lines:**
```typescript
  type Contact {
    id: String!
    name: String!
    email: String!
    phone: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

```

### Edit (edit 2/3): around line 7
**After the line** containing `input UpdateDealInput {`:

**Add these lines:**
```typescript
    contacts: [Contact!]!
    contacts: [Contact!]!
  }

  input CreateContactInput {
    name: String!
    email: String!
    phone: String!
    contact: CreateContactInput
```

### Edit (edit 3/3): around line 34
**After the line** containing ```:

**Add these lines:**
```typescript
    createContact(input: CreateContactInput!): Contact!
    addContactToDeal(dealId: String!, contactId: String!): Deal!
    removeContactFromDeal(dealId: String!, contactId: String!): Deal!
```

## File: `api/src/services/contacts/contacts.ts`

**Create this file** with the following content:

```typescript
import { db } from 'api/src/lib/db'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const contacts: QueryResolvers['contacts'] = () => {
  return db.contact.findMany({ orderBy: { name: 'asc' } })
}

export const createContact: MutationResolvers['createContact'] = ({ input }) => {
  return db.contact.create({ data: input })
}
```

## File: `api/src/services/deals/deals.ts`

### Edit (edit 1/2): around line 2
**After the line** containing `export const updateDeal: MutationResolvers['updateDeal'] ...`:

**Replace:**
```typescript
  return db.deal.findMany({ orderBy: { createdAt: 'desc' } })
  return db.deal.create({ data: { ...input, status: 'pending' } })
```

**With:**
```typescript
  return db.deal.findMany({
    orderBy: { createdAt: 'desc' },
    include: { contacts: { include: { contact: true } } },
  }).then((deals) =>
    deals.map((d) => ({ ...d, contacts: d.contacts.map((dc) => dc.contact) }))
  )
  const { contact, ...dealData } = input
  const data: Parameters<typeof db.deal.create>[0]['data'] = { ...dealData, status: 'pending' }
  if (contact) {
    data.contacts = {
      create: [{ contact: { create: contact } }],
    }
  }
  return db.deal.create({
    data,
    include: { contacts: { include: { contact: true } } },
  }).then((d) => ({ ...d, contacts: d.contacts.map((dc) => dc.contact) }))
```

### Edit (edit 2/2): around line 16
**After the line** containing `}`:

**Add these lines:**
```typescript

export const addContactToDeal: MutationResolvers['addContactToDeal'] = async ({ dealId, contactId }) => {
  await db.dealContact.create({ data: { dealId, contactId } })
  const deal = await db.deal.findUnique({
    where: { id: dealId },
    include: { contacts: { include: { contact: true } } },
  })
  if (!deal) throw new Error('Deal not found')
  return { ...deal, contacts: deal.contacts.map((dc) => dc.contact) }
}

export const removeContactFromDeal: MutationResolvers['removeContactFromDeal'] = async ({ dealId, contactId }) => {
  await db.dealContact.delete({ where: { dealId_contactId: { dealId, contactId } } })
  const deal = await db.deal.findUnique({
    where: { id: dealId },
    include: { contacts: { include: { contact: true } } },
  })
  if (!deal) throw new Error('Deal not found')
  return { ...deal, contacts: deal.contacts.map((dc) => dc.contact) }
}
```

## File: `web/src/Routes.tsx`

### Edit: around line 9
**After the line** containing `)`:

**Add these lines:**
```typescript
      <Route path="/admin/contacts" page={AdminContactsPage} name="adminContacts" />
```

## File: `web/src/graphql/mutations.ts`

### Edit: around line 12
**After the line** containing `updateDeal(id: $id, input: $input) {`:

**Add these lines:**
```typescript
export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      name
      email
      phone
    }
  }
`

export const ADD_CONTACT_TO_DEAL_MUTATION = gql`
  mutation AddContactToDeal($dealId: String!, $contactId: String!) {
    addContactToDeal(dealId: $dealId, contactId: $contactId) {
      id
    }
  }
`

export const REMOVE_CONTACT_FROM_DEAL_MUTATION = gql`
  mutation RemoveContactFromDeal($dealId: String!, $contactId: String!) {
    removeContactFromDeal(dealId: $dealId, contactId: $contactId) {
      id
    }
  }
`

```

## File: `web/src/graphql/queries.ts`

### Edit: around line 8
**After the line** containing ```:

**Add these lines:**
```typescript
      contacts {
        id
        name
        email
        phone
      }
    }
  }
`

export const CONTACTS_QUERY = gql`
  query Contacts {
    contacts {
      id
      name
      email
      phone
```

## File: `web/src/pages/AdminContactsPage/AdminContactsPage.tsx`

**Create this file** with the following content:

```typescript
import { useEffect, useState } from 'react'
import { Link, navigate } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { CONTACTS_QUERY } from 'src/graphql/queries'
import { CREATE_CONTACT_MUTATION } from 'src/graphql/mutations'

const AdminContactsPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin') !== '1') {
      navigate('/admin')
    }
  }, [])

  const { data, loading, refetch } = useQuery(CONTACTS_QUERY)
  const [createContact] = useMutation(CREATE_CONTACT_MUTATION, {
    onCompleted: () => {
      setName('')
      setEmail('')
      setPhone('')
      refetch()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createContact({
      variables: {
        input: { name, email, phone },
      },
    })
  }

  if (loading) return <p>Loading...</p>

  return (
    <main>
      <h1>Admin — Contacts</h1>
      <p>
        <Link to="/admin">← Back to admin</Link> | <Link to="/admin/deals">Deals</Link> | <Link to="/">Home</Link>
      </p>
      <h2>Create contact</h2>
      <form onSubmit={onSubmit}>
        <div><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} required /></div>
        <button type="submit">Create</button>
      </form>
      <h2>All contacts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.contacts?.map((c: { id: string; name: string; email: string; phone: string }) => (
          <li key={c.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', borderRadius: 4 }}>
            <strong>{c.name}</strong>
            <p><small>{c.email} · {c.phone}</small></p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default AdminContactsPage
```

## File: `web/src/pages/AdminDealsPage/AdminDealsPage.tsx`

### Edit (edit 1/2): around line 20
**After the line** containing `style={{`:

**Replace:**
```typescript
        <Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link>
        {data?.deals?.map((d: { id: string; name: string; description: string; address: string; status: string }) => (
```

**With:**
```typescript
        <Link to="/admin">← Back to admin</Link> | <Link to="/admin/contacts">Contacts</Link> | <Link to="/">Home</Link>
        {data?.deals?.map((d: { id: string; name: string; description: string; address: string; status: string; contacts?: { name: string }[] }) => (
```

### Edit (edit 2/2): around line 40
**After the line** containing `{' · '}`:

**Add these lines:**
```typescript
            {d.contacts?.length > 0 && (
              <p><small>Contacts: {d.contacts.map((c: { name: string }) => c.name).join(', ')}</small></p>
            )}
```

## File: `web/src/pages/AdminEditDealPage/AdminEditDealPage.tsx`

### Edit (edit 1/3): around line 1
**After the line** containing `const { id } = useParams()`:

**Replace:**
```typescript
import { DEALS_QUERY } from 'src/graphql/queries'
import { UPDATE_DEAL_MUTATION } from 'src/graphql/mutations'
```

**With:**
```typescript
import { DEALS_QUERY, CONTACTS_QUERY } from 'src/graphql/queries'
import { UPDATE_DEAL_MUTATION, ADD_CONTACT_TO_DEAL_MUTATION, REMOVE_CONTACT_FROM_DEAL_MUTATION } from 'src/graphql/mutations'

type Contact = { id: string; name: string; email: string; phone: string }
```

### Edit (edit 2/3): around line 17
**After the line** containing `if (deal) {`:

**Replace:**
```typescript
  const { data: dealsData } = useQuery(DEALS_QUERY)
```

**With:**
```typescript
  const { data: dealsData, refetch: refetchDeals } = useQuery(DEALS_QUERY)
  const { data: contactsData } = useQuery(CONTACTS_QUERY)
  const contacts = (deal?.contacts ?? []) as Contact[]
  const allContacts = (contactsData?.contacts ?? []) as Contact[]
  const availableToAdd = allContacts.filter((c) => !contacts.some((x) => x.id === c.id))
  const [addContact] = useMutation(ADD_CONTACT_TO_DEAL_MUTATION, {
    onCompleted: () => refetchDeals(),
  })
  const [removeContact] = useMutation(REMOVE_CONTACT_FROM_DEAL_MUTATION, {
    onCompleted: () => refetchDeals(),
  })
```

### Edit (edit 3/3): around line 74
**After the line** containing `}`:

**Add these lines:**
```typescript
      <h2>Contacts on this deal</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map((c) => (
          <li key={c.id} style={{ marginBottom: '0.5rem' }}>
            {c.name} ({c.email}) —{' '}
            <button type="button" onClick={() => removeContact({ variables: { dealId: id, contactId: c.id } })} style={{ fontSize: '0.875rem' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {availableToAdd.length > 0 && (
        <>
          <h3>Add existing contact</h3>
          <select
            onChange={(e) => {
              const v = e.target.value
              if (v) addContact({ variables: { dealId: id, contactId: v } })
              e.target.value = ''
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

## File: `web/src/pages/NewDealPage/NewDealPage.tsx`

### Edit (edit 1/2): around line 2

**Replace:**
```typescript
  const [createDeal, { loading }] = useMutation(CREATE_DEAL_MUTATION, {
    const input = {
```

**With:**
```typescript
const CREATE_DEAL = CREATE_DEAL_MUTATION

  const [createDeal, { loading }] = useMutation(CREATE_DEAL, {
    const input: { name: string; description: string; address: string; contact?: { name: string; email: string; phone: string } } = {
    const cName = (form.contactName as HTMLInputElement).value
    const cEmail = (form.contactEmail as HTMLInputElement).value
    const cPhone = (form.contactPhone as HTMLInputElement).value
    if (cName && cEmail && cPhone) input.contact = { name: cName, email: cEmail, phone: cPhone }
```

### Edit (edit 2/2): around line 38
**After the line** containing `</button>`:

**Add these lines:**
```typescript
        <h2>Primary Contact (optional)</h2>
        <div>
          <label>Contact name</label>
          <input name="contactName" />
        </div>
        <div>
          <label>Contact email</label>
          <input type="email" name="contactEmail" />
        </div>
        <div>
          <label>Contact phone</label>
          <input type="tel" name="contactPhone" />
        </div>
```
