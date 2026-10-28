import { useNavigate } from "react-router-dom";
import { useProjects } from "../../platform/ProjectsContext.jsx";

export default function ProjectsList() {
  const navigate = useNavigate();
  const { projects, handleCreateProject } = useProjects();

  async function onCreate() {
    const id = await handleCreateProject();
    navigate(`/platform/projects/${id}?mode=edit`);
  }

  return (
    <div className="projects-home">
      <div className="projects-home-head">
        <div>
          <h2>Projects</h2>
          <p className="lede">All of your engagements in one place.</p>
        </div>
        <button className="btn" type="button" onClick={onCreate}>
          Create project
        </button>
      </div>
      <div className="project-cards">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            className="project-card"
            onClick={() => navigate(`/platform/projects/${p.id}`)}
          >
            <div className="project-card-top">
              <strong>{p.title}</strong>
              <span className="chip">{p.status}</span>
            </div>
            <p>{p.objective}</p>
            <div className="project-card-meta">
              <span>{p.stage}</span>
              <span>{p.completion}% complete</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
