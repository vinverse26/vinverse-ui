import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <div className="sidebar">
      <div className="logo">VINVERSE</div>
      <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
      <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Chat</NavLink>
      <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>My Projects</NavLink>
      <NavLink to="/opportunities" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Opportunities</NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Profile</NavLink>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1c2440' }}>
        <div style={{ fontSize: '0.8rem', color: '#8892b0', marginBottom: '0.5rem' }}>
          {user?.display_name || user?.email}
          <span className="badge">{user?.role}</span>
        </div>
        <button className="link-btn" onClick={logout}>Sign out</button>
      </div>
    </div>
  )
}
