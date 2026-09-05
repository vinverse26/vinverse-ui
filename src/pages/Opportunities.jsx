import { useEffect, useState } from 'react'
import * as projectService from '../services/projectService'

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [volunteeredMsg, setVolunteeredMsg] = useState(null)

  const load = () => projectService.listOpportunities().then(setOpportunities)

  useEffect(() => {
    load()
  }, [])

  const handleVolunteer = async (id) => {
    await projectService.volunteer(id)
    setVolunteeredMsg('Volunteered — the project manager will be notified.')
    load()
    setTimeout(() => setVolunteeredMsg(null), 3000)
  }

  return (
    <div>
      <div className="top-bar">
        <h2>Opportunities</h2>
      </div>

      {volunteeredMsg && (
        <div className="card" style={{ borderColor: '#2a3560' }}>
          {volunteeredMsg}
        </div>
      )}

      <div className="card">
        <p style={{ color: '#8892b0', marginTop: 0 }}>
          Projects and components matching your profile's expertise tags, ranked by match score.
        </p>
        {opportunities.length === 0 && <p style={{ color: '#8892b0' }}>No open opportunities right now.</p>}
        {opportunities.map((op) => (
          <div key={op.id} style={{ padding: '1rem 0', borderBottom: '1px solid #232c4a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{op.project_name}</strong>
                <span className="badge">{op.component}</span>
              </div>
              <span className="badge" style={{ background: '#1e2f52', color: '#7aa2ff' }}>
                Match: {op.match_percent}%
              </span>
            </div>
            <div style={{ color: '#8892b0', fontSize: '0.85rem', margin: '0.4rem 0' }}>
              Required: {op.required_expertise.join(', ')}
            </div>
            {op.volunteered ? (
              <span style={{ color: '#8fe3a8', fontSize: '0.85rem' }}>Volunteered — awaiting response</span>
            ) : (
              <button className="link-btn" onClick={() => handleVolunteer(op.id)}>Volunteer →</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
