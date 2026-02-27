import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NewDeal() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const body: { name: string; description: string; address: string; contact?: { name: string; email: string; phone: string } } = {
      name,
      description,
      address,
    };
    if (contactName && contactEmail && contactPhone) {
      body.contact = { name: contactName, email: contactEmail, phone: contactPhone };
    }
    fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(() => navigate("/thank-you"))
      .finally(() => setLoading(false));
  };

  return (
    <main>
      <h1>Ben's Cranes — Submit a New Deal</h1>
      <p><Link to="/">← Back to home</Link></p>
      <form onSubmit={submit}>
        <h2>Deal</h2>
        <div><label>Deal / Customer name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
        <div><label>Address</label><input value={address} onChange={(e) => setAddress(e.target.value)} required /></div>
        <h2>Primary Contact (optional)</h2>
        <div><label>Contact name</label><input value={contactName} onChange={(e) => setContactName(e.target.value)} /></div>
        <div><label>Contact email</label><input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></div>
        <div><label>Contact phone</label><input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></div>
        <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Deal"}</button>
      </form>
    </main>
  );
}
