"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function NewDealPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const createDeal = api.deal.create.useMutation({
    onSuccess: () => router.push("/thank-you"),
  });

  return (
    <main>
      <h1>Ben&apos;s Cranes — Submit a New Deal</h1>
      <p><Link href="/">← Back to home</Link></p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createDeal.mutate({ name, description, address });
        }}
      >
        <h2>Deal</h2>
        <div>
          <label>Deal / Customer name</label>
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
        <button type="submit" disabled={createDeal.isPending}>
          {createDeal.isPending ? "Submitting..." : "Submit Deal"}
        </button>
      </form>
    </main>
  );
}
