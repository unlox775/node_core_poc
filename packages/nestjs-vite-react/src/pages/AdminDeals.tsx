import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Deal = { id: string; name: string; description: string; address: string; status: string };

export default function AdminDeals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin") !== "1") {
      navigate("/admin");
      return;
    }
    fetch("/api/deals").then((r) => r.json()).then(setDeals).finally(() => setLoading(false));
  }, [navigate]);

  const del = (id: string) => {
    fetch(`/api/deals/${id}`, { method: "DELETE" }).then(() =>
      setDeals((d) => d.filter((x) => x.id !== id))
    );
  };

  return (
    <main>
      <h1>Admin — Deals</h1>
      <p><Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link></p>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {deals.map((d) => (
            <li key={d.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem", borderRadius: 4 }}>
              <strong>{d.name}</strong>
              <p>{d.description}</p>
              <p><small>{d.address} · Status: {d.status}</small></p>
              <p>
                <Link to={`/admin/deals/${d.id}`}>Edit</Link>
                {" · "}
                <button onClick={() => del(d.id)} style={{ background: "#c00", padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>Delete</button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
