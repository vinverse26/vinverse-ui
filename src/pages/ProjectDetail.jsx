import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as projectService from '../services/projectService'
import MasterConsultantPanel from '../components/MasterConsultantPanel'

const TABS = ['Workspace', 'Components', 'Documents', 'Team', 'Proposals', 'Chat', 'History']

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
  const [components, setComponents] = useState([])
  const [perspectivesByComponent, setPerspectivesByComponent] = useState({})
  const [proposals, setProposals] = useState([])

  const [newDocName, setNewDocName] = useState('')
  const [newDocText, setNewDocText] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('participant')
  const [newComponentTitle, setNewComponentTitle] = useState('')
  const [assigneeName, setAssigneeName] = useState('')

  const loadState = () => projectService.getProjectState(projectId).then(setProjectState).catch(() => {})

  useEffect(() => {
    projectService.getProject(projectId).then(setProject)
    loadState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  useEffect(() => {
    if (tab === 'Documents') {
      projectService.listDocuments(projectId).then(setDocuments)
    }
    if (tab === 'Team') {
      projectService.listMembers(projectId).then(setMembers)
    }
    if (tab === 'History') {
      projectService.getHistory(projectId).then(setHistory)
    }
    if (tab === 'Components') {
      projectService.listComponents(projectId).then(async (comps) => {
        setComponents(comps)
        const persByComp = {}
        for (const c of comps) {
          if (c.assignees.length > 1) {
            persByComp[c.id] = await projectService.listPerspectives(c.id)
          }
        }
        setPerspectivesByComponent(persByComp)
      })
    }
    if (tab === 'Proposals') {
      projectService.listProposals(projectId).then(setProposals)
    }
  }, [tab, projectId])

  const addComponent = async (e) => {
    e.preventDefault()
    if (!newComponentTitle.trim()) return
    await projectService.createComponent(projectId, newComponentTitle)
    setNewComponentTitle('')
    projectService.listComponents(projectId).then(setComponents)
  }

  const assignToComponent = async (componentId) => {
    if (!assigneeName.trim()) return
    await projectService.assignComponent(projectId, componentId, assigneeName)
    setAssigneeName('')
    projectService.listComponents(projectId).then(setComponents)
  }

  const decideProposal = async (proposalId, decision) => {
    await projectService.reviewProposal(projectId, proposalId, decision)
    projectService.listProposals(projectId).then(setProposals)
    if (decision === 'accepted') loadState()
  }

  const addDocument = async (e) => {
    e.preventDefault()
    if (!newDocName.trim() || !newDocText.trim()) return
    await projectService.addDocument(projectId, newDocName, newDocText)
    setNewDocName('')
    setNewDocText('')
    projectService.listDocuments(projectId).then(setDocuments)
  }

  const addMember = async (e) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    try {
      await projectService.addMember(projectId, inviteEmail, inviteRole)
      setInviteEmail('')
      projectService.listMembers(projectId).then(setMembers)
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

      {tab === 'Components' && (
        <div className="card">
          <h3>Break the project into components</h3>
          <form onSubmit={addComponent} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div className="field" style={{ marginBottom: 0, flex: 1 }}>
              <label>New component title</label>
              <input value={newComponentTitle} onChange={(e) => setNewComponentTitle(e.target.value)} placeholder="e.g. Regulatory landscape" />
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>Add component</button>
          </form>

          {components.length === 0 && <p style={{ color: '#8892b0' }}>No components yet — the whole project is one workspace until you break it up.</p>}

          {components.map((c) => (
            <div key={c.id} style={{ padding: '1rem 0', borderBottom: '1px solid #232c4a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{c.title}</strong>
                <span className="badge">{c.status.replace('_', ' ')}</span>
              </div>
              <div style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#8892b0' }}>
                {c.assignees.length === 0 ? 'Unassigned' : c.assignees.map((a) => a.display_name).join(', ')}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  placeholder="Assign a fellow by name"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid #232c4a', background: '#0b1020', color: '#eef1f8' }}
                />
                <button className="link-btn" onClick={() => assignToComponent(c.id)}>Assign</button>
              </div>

              {perspectivesByComponent[c.id] && (
                <div className="proposed-changes">
                  <strong>Compare Perspectives</strong>
                  {perspectivesByComponent[c.id].map((p) => (
                    <div key={p.id} style={{ marginTop: '0.5rem' }}>
                      <div style={{ color: '#7aa2ff' }}>{p.fellow}</div>
                      <div style={{ fontSize: '0.85rem' }}>{p.summary}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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

      {tab === 'Proposals' && (
        <div className="card">
          <h3>Change Proposals</h3>
          <p style={{ color: '#8892b0' }}>
            A proposal is reviewable independently of the conversation that created it — anyone with
            manager/owner rights can accept or reject, not just the person who was chatting.
          </p>
          {proposals.length === 0 && <p style={{ color: '#8892b0' }}>No proposals yet.</p>}
          {proposals.map((p) => (
            <div key={p.id} style={{ padding: '1rem 0', borderBottom: '1px solid #232c4a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.what_changed}</strong>
                <span className="badge" style={{
                  background: p.status === 'accepted' ? '#1e3a2a' : p.status === 'rejected' ? '#3a1e1e' : '#1c2440',
                  color: p.status === 'accepted' ? '#8fe3a8' : p.status === 'rejected' ? '#e38f8f' : '#8892b0',
                }}>
                  {p.status}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cfd6ee', margin: '0.4rem 0' }}>
                <div><strong>Component:</strong> {p.component}</div>
                <div><strong>Why:</strong> {p.why}</div>
                <div><strong>Evidence:</strong> {p.evidence}</div>
                <div><strong>Author:</strong> {p.author} · <strong>Confidence:</strong> {p.confidence}</div>
              </div>
              {p.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="link-btn" onClick={() => decideProposal(p.id, 'accepted')}>Accept</button>
                  <button className="link-btn" style={{ color: '#e38f8f' }} onClick={() => decideProposal(p.id, 'rejected')}>Reject</button>
                </div>
              )}
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
