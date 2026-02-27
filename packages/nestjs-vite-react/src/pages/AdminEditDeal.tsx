import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

type Deal = { id: string; name: string; description: string; address: string; status: string };

export default function AdminEditDeal() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "1") {
      navigate("/admin");
      return;
    }
    fetch("/api/deals")
      .then((r) => r.json())
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
  }, [id, navigate]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/deals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, address, status }),
    }).then(() => navigate("/admin/deals"));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main>
      <h1>Edit Deal</h1>
      <p><Link to="/admin/deals">← Back to deals</Link></p>
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
    </main>
  );
}
