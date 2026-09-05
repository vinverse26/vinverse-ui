import { useEffect, useState } from 'react'
import * as adminService from '../services/adminService'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [invitations, setInvitations] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('intelligence_fellow')
  const [sending, setSending] = useState(false)

  const load = () => {
    adminService.listUsers().then(setUsers)
    adminService.listInvitations().then(setInvitations)
  }

  useEffect(() => {
    load()
  }, [])

  const sendInvite = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    try {
      await adminService.createInvitation(email, role)
      setEmail('')
      load()
    } finally {
      setSending(false)
    }
  }

  const revoke = async (id) => {
    await adminService.revokeInvitation(id)
    load()
  }

  return (
    <div>
      <div className="top-bar">
        <h2>Users &amp; Invitations</h2>
      </div>

      <div className="card">
        <h3>Invite a new user</h3>
        <form onSubmit={sendInvite} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div className="field" style={{ marginBottom: 0, flex: 1 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Starting role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="intelligence_fellow">Intelligence Fellow</option>
              <option value="project_manager">Project Manager</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} disabled={sending}>
            {sending ? 'Sending...' : 'Send invite'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Pending &amp; sent invitations</h3>
        {invitations.length === 0 && <p style={{ color: '#8892b0' }}>No invitations yet.</p>}
        {invitations.map((inv) => (
          <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #232c4a' }}>
            <div>
              {inv.email} <span className="badge">{inv.role}</span>{' '}
              <span className="badge" style={{ background: inv.accepted ? '#1e3a2a' : '#3a2f1e', color: inv.accepted ? '#8fe3a8' : '#e3c98f' }}>
                {inv.accepted ? 'accepted' : 'pending'}
              </span>
            </div>
            {!inv.accepted && <button className="link-btn" onClick={() => revoke(inv.id)}>Revoke</button>}
          </div>
        ))}
      </div>

      <div className="card">
        <h3>All users</h3>
        {users.map((u) => (
          <div key={u.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid #232c4a' }}>
            {u.display_name} <span style={{ color: '#8892b0' }}>({u.email})</span> <span className="badge">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
