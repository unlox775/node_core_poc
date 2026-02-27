import { Link, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { ADMIN_LOGIN_MUTATION } from 'src/graphql/mutations'
import { useState } from 'react'

const AdminPage = () => {
  const [error, setError] = useState('')
  const [adminLogin] = useMutation(ADMIN_LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.adminLogin.success) {
        if (typeof window !== 'undefined') sessionStorage.setItem('admin', '1')
        navigate('/admin/deals')
      } else setError('Invalid credentials')
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form = e.target as HTMLFormElement
    adminLogin({
      variables: {
        username: (form.username as HTMLInputElement).value,
        password: (form.password as HTMLInputElement).value,
      },
    })
  }

  return (
    <main>
      <h1>Admin Login</h1>
      <p>
        <Link to="/">← Back to home</Link>
      </p>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label>
          <input name="username" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Log in</button>
      </form>
      <p>
        <small>Demo: ethan / 123qwe</small>
      </p>
    </main>
  )
}

export default AdminPage
