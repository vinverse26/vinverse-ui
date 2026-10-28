export default function ProjectOverview({ project, onEdit, onInvite, onSearchFellows }) {
  if (!project) return null;
  return (
    <div className="workspace project-overview">
      <div className="project-overview-head">
        <div>
          <p className="num">Project overview</p>
          <h2>{project.title}</h2>
          <p className="lede">{project.objective}</p>
        </div>
        <div className="chip-row">
          <span className="chip">Status: {project.status}</span>
          <span className="chip">Stage: {project.stage}</span>
          <span className="chip">{project.completion}% complete</span>
          <button className="btn" type="button" onClick={onEdit}>
            Edit project
          </button>
        </div>
      </div>

      <div className="overview-grid">
        <article className="card overview-card">
          <h3>Key milestones</h3>
          <ul className="overview-list">
            {(project.milestones || []).map((m) => (
              <li key={m.id} className={m.done ? "done" : ""}>
                {m.label}
              </li>
            ))}
          </ul>
        </article>
        <article className="card overview-card">
          <h3>Next to-dos</h3>
          <ul className="overview-list">
            {(project.nextTodos || project.todos || []).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
        <article className="card overview-card">
          <h3>Progress</h3>
          <p className="progress-pct">{project.completion}%</p>
          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${project.completion || 0}%` }} />
          </div>
          <p className="muted-line">Current stage: {project.stage}</p>
        </article>
      </div>

      <article className="card">
        <div className="ws-head">
          <h3>Stakeholders</h3>
        </div>
        <ul className="overview-list">
          {(project.stakeholders || []).map((s, i) => (
            <li key={typeof s === "string" ? s : s.id || i}>
              {typeof s === "string" ? s : `${s.name} — ${s.role}`}
            </li>
          ))}
        </ul>
        <div className="chip-row" style={{ marginTop: "1rem" }}>
          <button className="btn ghost" type="button" onClick={onInvite}>
            Invite Fellows to the project
          </button>
          <button className="btn ghost" type="button" onClick={onSearchFellows}>
            Assign tasks / projects to Fellows
          </button>
          <button className="btn ghost" type="button" onClick={onSearchFellows}>
            Search for Fellows
          </button>
        </div>
      </article>
    </div>
  );
}
