import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <main>
      <h1>Thank you</h1>
      <p>We've received your request and will get back to you soon.</p>
      <p><Link to="/">Return to home</Link></p>
    </main>
  );
}
