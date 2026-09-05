import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">VINVERSE</div>
        <div className="tagline">Collective Intelligence for Intelligence Fellows</div>
        {error && <div className="error-text">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" type="submit">Sign in</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#8892b0' }}>
          Invited but no account yet? <Link to="/register">Complete registration</Link>
        </p>
      </div>
    </div>
  )
}
