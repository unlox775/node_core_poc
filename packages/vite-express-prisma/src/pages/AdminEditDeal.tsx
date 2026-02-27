import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Contact = { id: string; name: string; email: string; phone: string };
type Deal = { id: string; name: string; description: string; address: string; status: string; contacts: Contact[] };

export default function AdminEditDeal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("pending");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "1") {
      navigate("/admin");
      return;
    }
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
  }, [id, navigate]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/deals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description, address, status }),
    }).then((r) => { if (r.status === 401) sessionStorage.removeItem("admin"); else if (r.ok) navigate("/admin/deals"); });
  };

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

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Edit Deal</h1>
      <p>
        <Link to="/admin/deals">← Back to deals</Link>
        {" · "}
        <button type="button" onClick={() => { fetch("/api/admin/logout", { method: "POST", credentials: "include" }); sessionStorage.removeItem("admin"); navigate("/"); }} style={{ background: "none", border: "none", color: "inherit", textDecoration: "underline", cursor: "pointer", font: "inherit" }}>Log out</button>
      </p>
      <form onSubmit={save}>
        <div><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
        <div><label>Address</label><input value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
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
    </main>
  );
}
