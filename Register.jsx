import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, password, displayName)
      navigate('/home')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo">VINVERSE</div>
        <div className="tagline">Registration is invite-only</div>
        {error && <div className="error-text">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Invited email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Display name (optional)</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" type="submit">Create account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#8892b0' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
