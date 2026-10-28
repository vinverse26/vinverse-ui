import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ProjectsProvider } from "../platform/ProjectsContext.jsx";

const links = [
  ["chat", "Master consultant"],
  ["projects", "Projects"],
  ["fellows", "Fellows"],
  ["profile", "Profile"],
];

function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="app-bar">
        <div className="app-brand">
          <NavLink to="/" className="logo" aria-label="Vinverse home">
            <img src="/images/vinverse-mark.png" alt="" className="logo-mark" />
            <span className="logo-word">Vinverse</span>
          </NavLink>
          <span className="app-brand-divider" aria-hidden="true" />
          <span className="app-product-name">Collective Intelligence Platform</span>
        </div>
        <div className="app-user">
          <span>{user?.name || user?.email}</span>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-nav">
          {links.map(([id, label]) => (
            <NavLink
              key={id}
              to={`/platform/${id}`}
              end={id !== "projects"}
              className={({ isActive }) => (isActive ? "on" : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </aside>
        <section className="app-main">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default function PlatformLayout() {
  return (
    <ProjectsProvider>
      <Shell />
    </ProjectsProvider>
  );
}
