import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import MasterConsultantPanel from '../components/MasterConsultantPanel'

const TABS = ['Workspace', 'Documents', 'Team', 'Chat', 'History']

const STATE_FIELD_ORDER = [
  'problem', 'objective', 'desired_outcome', 'stakeholders', 'decision_makers',
  'constraints', 'assumptions', 'key_questions', 'evidence', 'hypotheses',
  'analysis', 'alternatives', 'recommendations', 'decisions', 'actions',
]

function renderValue(value) {
  if (Array.isArray(value)) {
    return (
      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {value.map((v, i) => <li key={i}>{typeof v === 'string' ? v : JSON.stringify(v)}</li>)}
      </ul>
    )
  }
  if (typeof value === 'object' && value !== null) {
    return <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
  }
  return <p style={{ margin: 0, color: '#cfd6ee' }}>{String(value)}</p>
}

export default function ProjectDetail() {
  const { projectId } = useParams()
  const [tab, setTab] = useState('Workspace')
  const [project, setProject] = useState(null)
  const [projectState, setProjectState] = useState(null)
  const [documents, setDocuments] = useState([])
  const [members, setMembers] = useState([])
  const [history, setHistory] = useState([])

  const [newDocName, setNewDocName] = useState('')
  const [newDocText, setNewDocText] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('participant')

  const loadState = () => api.get(`/projects/${projectId}/state`).then((res) => setProjectState(res.data)).catch(() => {})

  useEffect(() => {
    api.get(`/projects/${projectId}`).then((res) => setProject(res.data))
    loadState()
  }, [projectId])

  useEffect(() => {
    if (tab === 'Documents') {
      api.get(`/projects/${projectId}/documents`).then((res) => setDocuments(res.data))
    }
    if (tab === 'Team') {
      api.get(`/projects/${projectId}/members`).then((res) => setMembers(res.data))
    }
    if (tab === 'History') {
      api.get(`/projects/${projectId}/history`).then((res) => setHistory(res.data))
    }
  }, [tab, projectId])

  const addDocument = async (e) => {
    e.preventDefault()
    if (!newDocName.trim() || !newDocText.trim()) return
    await api.post(`/projects/${projectId}/documents`, { filename: newDocName, content_text: newDocText })
    setNewDocName('')
    setNewDocText('')
    api.get(`/projects/${projectId}/documents`).then((res) => setDocuments(res.data))
  }

  const addMember = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    try {
      await api.post(`/projects/${projectId}/members`, { email: inviteEmail, role: inviteRole })
      setInviteEmail('')
      api.get(`/projects/${projectId}/members`).then((res) => setMembers(res.data))
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not add member')
    }
  }

  if (!project) return <p>Loading...</p>

  return (
    <div>
      <div className="top-bar">
        <h2>{project.name}</h2>
      </div>

      <div className="project-tabs">
        {TABS.map((t) => (
          <div key={t} className={`project-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </div>
        ))}
      </div>

      {tab === 'Workspace' && (
        <div className="two-col">
          <div className="left">
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Project State <span className="badge">v{projectState?.version_number ?? 0}</span></h3>
              {STATE_FIELD_ORDER.filter((f) => projectState?.state?.[f]).map((field) => (
                <div className="workspace-section" key={field}>
                  <h4>{field.replace(/_/g, ' ')}</h4>
                  {renderValue(projectState.state[field])}
                </div>
              ))}
              {projectState && Object.keys(projectState.state || {}).length === 0 && (
                <p style={{ color: '#8892b0' }}>
                  No state yet — start a conversation with the Master Consultant to define the problem.
                </p>
              )}
            </div>
          </div>
          <div className="right">
            <MasterConsultantPanel projectId={projectId} onProposedChanges={() => {}} />
            <div style={{ marginTop: '0.5rem' }}>
              <button className="link-btn" onClick={loadState}>Refresh state ↻</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'Documents' && (
        <div className="card">
          <h3>Upload a document (paste extracted text for this prototype)</h3>
          <form onSubmit={addDocument}>
            <div className="field">
              <label>Filename</label>
              <input value={newDocName} onChange={(e) => setNewDocName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Content</label>
              <textarea rows={4} value={newDocText} onChange={(e) => setNewDocText(e.target.value)} required />
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>Add document</button>
          </form>
          <div style={{ marginTop: '1.5rem' }}>
            {documents.length === 0 && <p style={{ color: '#8892b0' }}>No documents yet.</p>}
            {documents.map((d) => (
              <div key={d.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #232c4a' }}>
                {d.filename}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Team' && (
        <div className="card">
          <h3>Add a member</h3>
          <form onSubmit={addMember} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div className="field" style={{ marginBottom: 0, flex: 1 }}>
              <label>Email (must already have a Vinverse account)</label>
              <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Role</label>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="manager">Manager</option>
                <option value="participant">Participant</option>
                <option value="fellow">Fellow</option>
                <option value="reviewer">Reviewer</option>
                <option value="observer">Observer</option>
              </select>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>Add</button>
          </form>
          {members.map((m) => (
            <div key={m.user_id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #232c4a' }}>
              {m.display_name || m.email} <span className="badge">{m.project_role}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'Chat' && (
        <MasterConsultantPanel projectId={projectId} />
      )}

      {tab === 'History' && (
        <div className="card">
          <h3>Version history</h3>
          {history.map((v) => (
            <div key={v.version_number} style={{ padding: '0.75rem 0', borderBottom: '1px solid #232c4a' }}>
              <strong>Version {v.version_number}</strong> — {v.change_summary}
              <div style={{ color: '#8892b0', fontSize: '0.8rem' }}>{new Date(v.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
