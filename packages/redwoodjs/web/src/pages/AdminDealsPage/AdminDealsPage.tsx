import { useEffect } from 'react'
import { Link, navigate } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { DEALS_QUERY } from 'src/graphql/queries'
import { DELETE_DEAL_MUTATION } from 'src/graphql/mutations'

const AdminDealsPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin') !== '1') {
      navigate('/admin')
    }
  }, [])

  const { data, loading, refetch } = useQuery(DEALS_QUERY)
  const [deleteDeal] = useMutation(DELETE_DEAL_MUTATION, { onCompleted: () => refetch() })

  if (loading) return <p>Loading...</p>

  return (
    <main>
      <h1>Admin — Deals</h1>
      <p>
        <Link to="/admin">← Back to admin</Link> | <Link to="/">Home</Link>
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.deals?.map((d: { id: string; name: string; description: string; address: string; status: string }) => (
          <li
            key={d.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '0.5rem',
              borderRadius: 4,
            }}
          >
            <strong>{d.name}</strong>
            <p>{d.description}</p>
            <p>
              <small>
                {d.address} · Status: {d.status}
              </small>
            </p>
            <p>
              <Link to={`/admin/deals/${d.id}`}>Edit</Link>
              {' · '}
              <button
                onClick={() => deleteDeal({ variables: { id: d.id } })}
                style={{
                  background: '#c00',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  border: 'none',
                  color: 'white',
                }}
              >
                Delete
              </button>
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default AdminDealsPage
