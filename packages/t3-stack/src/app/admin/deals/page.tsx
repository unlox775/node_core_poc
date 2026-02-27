"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function AdminDealsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("admin") === "1");
  }, []);

  const { data: deals, isLoading, refetch } = api.deal.list.useQuery();

  const deleteDeal = api.deal.delete.useMutation({ onSuccess: () => refetch() });

  if (authed === null) return <p>Loading...</p>;
  if (!authed) {
    router.push("/admin");
    return null;
  }

  return (
    <main>
      <h1>Admin — Deals</h1>
      <p><Link href="/admin">← Back to admin</Link> | <Link href="/">Home</Link></p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {deals?.map((d) => (
            <li key={d.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "0.5rem", borderRadius: 4 }}>
              <strong>{d.name}</strong>
              <p>{d.description}</p>
              <p><small>{d.address} · Status: {d.status}</small></p>
              <p>
                <Link href={`/admin/deals/${d.id}`}>Edit</Link>
                {" · "}
                <button
                  onClick={() => deleteDeal.mutate({ id: d.id })}
                  style={{ background: "#c00", padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                >
                  Delete
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
