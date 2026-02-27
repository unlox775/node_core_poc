import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main>
      <h1>Thank you</h1>
      <p>We&apos;ve received your request and will get back to you soon.</p>
      <p><Link href="/">Return to home</Link></p>
    </main>
  );
}
