import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data)).catch(() => {})
  }, [])

  return (
    <div>
      <div className="top-bar">
        <h2>Welcome, {user?.display_name || user?.email}</h2>
      </div>

      <div className="card">
        <h3>Ask Master Consultant</h3>
        <p style={{ color: '#8892b0' }}>Start a new project by describing a problem, or jump into global chat.</p>
        <Link to="/chat" className="link-btn">Go to chat →</Link>
      </div>

      <div className="card">
        <h3>Recent Projects</h3>
        {projects.length === 0 && <p style={{ color: '#8892b0' }}>No projects yet. Create your first one.</p>}
        {projects.slice(0, 5).map((p) => (
          <div key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #232c4a' }}>
            <Link to={`/projects/${p.id}`}>{p.name}</Link>
            <span className="badge">{p.status}</span>
          </div>
        ))}
        <div style={{ marginTop: '0.75rem' }}>
          <Link to="/projects" className="link-btn">View all projects →</Link>
        </div>
      </div>

      <div className="card">
        <h3>Fellow Opportunities</h3>
        <p style={{ color: '#8892b0' }}>Projects matching your expertise will appear here.</p>
        <Link to="/opportunities" className="link-btn">View opportunities →</Link>
      </div>
    </div>
  )
}
