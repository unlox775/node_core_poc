import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          sessionStorage.setItem("admin", "1");
          navigate("/admin/deals");
        } else setError("Invalid credentials");
      });
  };

  return (
    <main>
      <h1>Admin Login</h1>
      <p><Link to="/">← Back to home</Link></p>
      <form onSubmit={login}>
        <div><label>Username</label><input value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
        <div><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p><small>Demo: ethan / 123qwe</small></p>
    </main>
  );
}
