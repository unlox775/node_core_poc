"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function AdminEditDealPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    setAuthed(sessionStorage.getItem("admin") === "1");
  }, []);

  const { data: deals, refetch } = api.deal.list.useQuery();
  const deal = deals?.find((d) => d.id === id);

  const updateDeal = api.deal.update.useMutation({
    onSuccess: () => router.push("/admin/deals"),
  });

  useEffect(() => {
    if (deal) {
      setName(deal.name);
      setDescription(deal.description);
      setAddress(deal.address);
      setStatus(deal.status);
    }
  }, [deal]);

  if (authed === null) return <p>Loading...</p>;
  if (!authed) {
    router.push("/admin");
    return null;
  }
  if (!deal) return <p>Deal not found</p>;

  return (
    <main>
      <h1>Edit Deal</h1>
      <p><Link href="/admin/deals">← Back to deals</Link></p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateDeal.mutate({ id, name, description, address, status });
        }}
      >
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <button type="submit" disabled={updateDeal.isPending}>Save</button>
      </form>
    </main>
  );
}
