import { useEffect, useState } from 'react'
import { Link, navigate, useParams } from '@redwoodjs/router'
import { useQuery, useMutation } from '@redwoodjs/web'
import { DEALS_QUERY } from 'src/graphql/queries'
import { UPDATE_DEAL_MUTATION } from 'src/graphql/mutations'

const AdminEditDealPage = () => {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin') !== '1') {
      navigate('/admin')
    }
  }, [])

  const { data: dealsData } = useQuery(DEALS_QUERY)
  const deal = dealsData?.deals?.find((d: { id: string }) => d.id === id)

  const [updateDeal] = useMutation(UPDATE_DEAL_MUTATION, {
    onCompleted: () => navigate('/admin/deals'),
  })

  useEffect(() => {
    if (deal) {
      setName(deal.name)
      setDescription(deal.description)
      setAddress(deal.address)
      setStatus(deal.status)
    }
  }, [deal])

  if (!deal) return <p>Loading...</p>

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateDeal({
      variables: {
        id,
        input: { name, description, address, status },
      },
    })
  }

  return (
    <main>
      <h1>Edit Deal</h1>
      <p>
        <Link to="/admin/deals">← Back to deals</Link>
      </p>
      <form onSubmit={onSubmit}>
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
        <button type="submit">Save</button>
      </form>
    </main>
  )
}

export default AdminEditDealPage
