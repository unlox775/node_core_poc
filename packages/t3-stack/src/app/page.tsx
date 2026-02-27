import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Ben&apos;s Cranes</h1>
      <p>Professional crane services when you need them. Moving pianos, roof trusses, heavy equipment — we&apos;ve got you covered.</p>
      <p>Ready to get a quote? <Link href="/deals/new">Submit a new deal</Link> and we&apos;ll get back to you.</p>
      <p><small><Link href="/admin">Admin</Link></small></p>
    </main>
  );
}
