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
