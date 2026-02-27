import { Link } from '@redwoodjs/router'

const HomePage = () => (
  <main>
    <h1>Ben's Cranes</h1>
    <p>
      Professional crane services when you need them. Moving pianos, roof
      trusses, heavy equipment — we've got you covered.
    </p>
    <p>
      Ready to get a quote? <Link to="/deals/new">Submit a new deal</Link> and
      we'll get back to you.
    </p>
    <p>
      <small>
        <Link to="/admin">Admin</Link>
      </small>
    </p>
  </main>
)

export default HomePage
