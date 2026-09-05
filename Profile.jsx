import { useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [bio, setBio] = useState('')
  const [expertise, setExpertise] = useState('')
  const [saved, setSaved] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    await api.put('/auth/me/profile', { display_name: displayName, bio, expertise })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="top-bar">
        <h2>Profile</h2>
      </div>
      <div className="card">
        <form onSubmit={save}>
          <div className="field">
            <label>Display name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="field">
            <label>Bio</label>
            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="field">
            <label>Expertise (comma-separated)</label>
            <input value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="AI strategy, healthcare, market analysis" />
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>Save</button>
          {saved && <span style={{ marginLeft: '1rem', color: '#8892b0' }}>Saved.</span>}
        </form>
      </div>
      <div className="card">
        <h3>Account</h3>
        <p style={{ color: '#8892b0' }}>Email: {user?.email}</p>
        <p style={{ color: '#8892b0' }}>Role: {user?.role}</p>
      </div>
    </div>
  )
}
