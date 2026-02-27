import { Link, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { CREATE_DEAL_MUTATION } from 'src/graphql/mutations'

const NewDealPage = () => {
  const [createDeal, { loading }] = useMutation(CREATE_DEAL_MUTATION, {
    onCompleted: () => navigate('/thank-you'),
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = {
      name: (form.name as HTMLInputElement).value,
      description: (form.description as HTMLTextAreaElement).value,
      address: (form.address as HTMLInputElement).value,
    }
    createDeal({ variables: { input } })
  }

  return (
    <main>
      <h1>Ben's Cranes — Submit a New Deal</h1>
      <p>
        <Link to="/">← Back to home</Link>
      </p>
      <form onSubmit={onSubmit}>
        <h2>Deal</h2>
        <div>
          <label>Deal / Customer name</label>
          <input name="name" required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Deal'}
        </button>
      </form>
    </main>
  )
}

export default NewDealPage
