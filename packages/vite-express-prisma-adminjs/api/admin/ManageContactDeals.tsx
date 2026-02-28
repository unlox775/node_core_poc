import React, { useEffect, useState } from "react";

type Deal = { id: string; name: string; description?: string };
type Contact = { id: string; name: string; email: string; deals?: Deal[] };

const box = { padding: "1.5rem" };
const dangerBtn = { padding: "0.25rem 0.5rem", fontSize: "0.875rem", background: "#dc3545", color: "white", border: "none", borderRadius: 4, cursor: "pointer" };

const ManageContactDeals: React.FC<{
  record: { id?: string };
}> = ({ record }) => {
  const contactId = record?.id;
  const [contact, setContact] = useState<Contact | null>(null);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId) return;
    Promise.all([
      fetch(`/api/contacts/${contactId}`).then((r) => r.json()),
      fetch("/api/deals").then((r) => r.json()),
    ])
      .then(([c, deals]: [Contact, Deal[]]) => {
        setContact(c);
        setAllDeals(deals);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contactId]);

  const deals = contact?.deals ?? [];
  const availableToAdd = allDeals.filter((d) => !deals.some((x) => x.id === d.id));

  const addDeal = (dealId: string) => {
    fetch(`/api/deals/${dealId}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId }),
      credentials: "include",
    }).then(() => {
      const d = allDeals.find((x) => x.id === dealId);
      if (d) setContact((prev) => (prev ? { ...prev, deals: [...(prev.deals ?? []), d] } : null));
    });
  };

  const removeDeal = (dealId: string) => {
    fetch(`/api/deals/${dealId}/contacts/${contactId}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() =>
      setContact((prev) =>
        prev ? { ...prev, deals: (prev.deals ?? []).filter((d) => d.id !== dealId) } : null
      )
    );
  };

  if (loading) return <div style={box}>Loading…</div>;
  if (!contact) return <div style={box}>Contact not found.</div>;

  return (
    <div style={box}>
      <h2>Deals for this contact</h2>
      <div style={{ marginBottom: "1.5rem" }}>
        {deals.length === 0 ? (
          <p>No deals linked yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {deals.map((d) => (
              <li key={d.id} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{d.name}</span>
                <button type="button" style={dangerBtn} onClick={() => removeDeal(d.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {availableToAdd.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>Add to deal</label>
          <select
            onChange={(e) => {
              const v = e.target.value;
              if (v) {
                addDeal(v);
                e.target.value = "";
              }
            }}
            style={{ padding: "0.5rem", minWidth: 200 }}
          >
            <option value="">— Select deal —</option>
            {availableToAdd.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ManageContactDeals;
