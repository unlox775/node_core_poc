"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = api.admin.login.useMutation({
    onSuccess: (r) => {
      if (r.success) {
        sessionStorage.setItem("admin", "1");
        router.push("/admin/deals");
      } else setError("Invalid credentials");
    },
  });

  return (
    <main>
      <h1>Admin Login</h1>
      <p><Link href="/">← Back to home</Link></p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          login.mutate({ username, password });
        }}
      >
        <div>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={login.isPending}>Log in</button>
      </form>
      <p><small>Demo: ethan / 123qwe</small></p>
    </main>
  );
}
