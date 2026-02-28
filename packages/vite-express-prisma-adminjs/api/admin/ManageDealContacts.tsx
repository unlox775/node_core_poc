import React, { useEffect, useState } from "react";

type Contact = { id: string; name: string; email: string; phone: string };
type Deal = { id: string; name: string; contacts?: Contact[] };

const box = { padding: "1.5rem" };
const dangerBtn = { padding: "0.25rem 0.5rem", fontSize: "0.875rem", background: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer" };

const ManageDealContacts: React.FC<{
  record: { id?: string };
}> = ({ record }) => {
  const dealId = record?.id;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dealId) return;
    Promise.all([
      fetch(`/api/deals/${dealId}`).then((r) => r.json()),
      fetch("/api/contacts").then((r) => r.json()),
    ])
      .then(([d, contacts]: [Deal, Contact[]]) => {
        setDeal(d);
        setAllContacts(contacts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dealId]);

  const contacts = deal?.contacts ?? [];
  const availableToAdd = allContacts.filter((c) => !contacts.some((x) => x.id === c.id));

  const addContact = (contactId: string) => {
    fetch(`/api/deals/${dealId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId }),
      credentials: "include",
    }).then(() => {
      const c = allContacts.find((x) => x.id === contactId);
      if (c) setDeal((prev) => (prev ? { ...prev, contacts: [...(prev.contacts ?? []), c] } : null));
    });
  };

  const removeContact = (contactId: string) => {
    fetch(`/api/deals/${dealId}/contacts/${contactId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() =>
      setDeal((prev) =>
        prev ? { ...prev, contacts: (prev.contacts ?? []).filter((c) => c.id !== contactId) } : null
      )
    );
  };

  if (loading) return <div style={box}>Loading…</div>;
  if (!deal) return <div style={box}>Deal not found.</div>;

  return (
    <div style={box}>
      <h2>Contacts on this deal</h2>
      <div style={{ marginBottom: "1.5rem" }}>
        {contacts.length === 0 ? (
          <p>No contacts linked yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {contacts.map((c) => (
              <li key={c.id} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>
                  {c.name} ({c.email})
                </span>
                <button type="button" style={dangerBtn} onClick={() => removeContact(c.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {availableToAdd.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Add existing contact</label>
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (v) {
                addContact(v);
                e.target.value = "";
              }
            }}
            style={{ padding: "0.5rem", minWidth: 200 }}
          >
            <option value="">— Select contact —</option>
            {availableToAdd.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ManageDealContacts;
