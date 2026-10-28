import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ChatPanel from "../../platform/ChatPanel.jsx";
import ProjectOverview from "../../platform/ProjectOverview.jsx";
import { useProjects } from "../../platform/ProjectsContext.jsx";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    getProject,
    editDraft,
    setEditDraft,
    sending,
    sendProjectEdit,
    handleSaveProject,
    livePanelOpen,
    setLivePanelOpen,
    invite,
  } = useProjects();

  const project = getProject(projectId);
  const mode = params.get("mode") === "edit" ? "edit" : "overview";

  if (!project) {
    return (
      <div className="card">
        <h2>Project not found</h2>
        <p className="lede">That project is not in your list.</p>
        <Link className="btn" to="/platform/projects">
          Back to projects
        </Link>
      </div>
    );
  }

  if (mode === "edit") {
    return (
      <div className="project-edit">
        <div className="project-edit-toolbar">
          <div>
            <p className="num">Editing with master consultant</p>
            <h2>{project.title}</h2>
            <p className="lede">{project.objective}</p>
            <div className="chip-row" style={{ marginTop: "0.6rem" }}>
              <span className="chip">Stage: {project.stage}</span>
              <span className="chip">{project.completion}% complete</span>
              <span className="chip">{project.saved ? "Saved" : "Unsaved"}</span>
              <button className="btn ghost" type="button" onClick={() => setLivePanelOpen((v) => !v)}>
                {livePanelOpen ? "Hide details" : "Show details"}
              </button>
            </div>
          </div>
          <div className="chip-row">
            <button
              className="btn"
              type="button"
              onClick={() => {
                handleSaveProject(project.id);
                setParams({});
              }}
            >
              Save project
            </button>
            <button className="btn ghost" type="button" onClick={() => setParams({})}>
              View overview
            </button>
          </div>
        </div>
        <div className={livePanelOpen ? "project-edit-body with-side" : "project-edit-body"}>
          <ChatPanel
            messages={project.messages || []}
            draft={editDraft}
            setDraft={setEditDraft}
            onSend={() => sendProjectEdit(project.id)}
            sending={sending}
          />
          {livePanelOpen ? (
            <aside className="card live-details">
              <h3>Live project details</h3>
              <p>
                <strong>Name:</strong> {project.title}
              </p>
              <p>
                <strong>Objective:</strong> {project.objective}
              </p>
              <p>
                <strong>Stage:</strong> {project.stage}
              </p>
              <p>
                <strong>Completion:</strong> {project.completion}%
              </p>
              <p className="muted-line">These update as you chat with the master consultant.</p>
            </aside>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <ProjectOverview
      project={project}
      onEdit={() => setParams({ mode: "edit" })}
      onInvite={() => invite(project.id, "General")}
      onSearchFellows={() => navigate("/platform/fellows")}
    />
  );
}
