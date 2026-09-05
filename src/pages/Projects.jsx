import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as projectService from '../services/projectService'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [problem, setProblem] = useState('')
  const [creating, setCreating] = useState(false)

  const load = () => projectService.listProjects().then(setProjects).catch(() => {})

  useEffect(() => {
    load()
  }, [])

  const createProject = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    try {
      await projectService.createProject(name, problem)
      setName('')
      setProblem('')
      load()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="top-bar">
        <h2>My Projects</h2>
      </div>

      <div className="card">
        <h3>New project</h3>
        <form onSubmit={createProject}>
          <div className="field">
            <label>Project name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Problem statement (optional — you can also define this with the Master Consultant)</label>
            <textarea rows={2} value={problem} onChange={(e) => setProblem(e.target.value)} />
          </div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} disabled={creating}>
            {creating ? 'Creating...' : 'Create project'}
          </button>
        </form>
      </div>

      <div className="card">
        {projects.length === 0 && <p style={{ color: '#8892b0' }}>No projects yet.</p>}
        {projects.map((p) => (
          <div key={p.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid #232c4a' }}>
            <Link to={`/projects/${p.id}`}>{p.name}</Link>
            <span className="badge">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
