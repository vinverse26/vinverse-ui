import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createProject, inviteFellow, sendMasterMessage } from "../api/platform.js";
import { approveRegistration, listRegistrations, rejectRegistration } from "../api/auth.js";

const starterProjects = [
  {
    id: "p-prep",
    title: "Prepare for a client meeting",
    objective: "Arrive with the right questions and a sharper framing of the client's problem.",
    status: "Active",
    owner: "You",
  },
];

export default function Platform() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("chat");
  const [projects, setProjects] = useState(starterProjects);
  const [activeId, setActiveId] = useState(starterProjects[0].id);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "master",
      text: "I am the master consultant. Before we go further, tell me the problem you are trying to solve, who the stakeholders are, and what a good outcome would look like.",
    },
  ]);
  const [workspace, setWorkspace] = useState({
    context: "Stakeholder meeting next week. Need a sharper problem statement.",
    objective: "Walk in prepared: questions, risks, and a proposed workplan.",
    sections: [
      { id: "s1", title: "Problem framing", body: "What decision is actually on the table?" },
      { id: "s2", title: "Stakeholders", body: "Who decides, who influences, who is affected?" },
      { id: "s3", title: "Questions to ask", body: "Master will help draft these from prior patterns." },
    ],
    versions: [{ id: "v1", label: "v0.1 — opened by you", at: "just now" }],
  });

  const active = useMemo(() => projects.find((p) => p.id === activeId), [projects, activeId]);

  const [registrations, setRegistrations] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [actionBusyId, setActionBusyId] = useState(null);

  useEffect(() => {
    if (tab !== "requests") return undefined;
    let cancelled = false;
    setRequestsLoading(true);
    setRequestsError("");
    listRegistrations()
      .then((res) => {
        if (!cancelled) setRegistrations(res.registrations || []);
      })
      .catch((err) => {
        if (!cancelled) setRequestsError(err.message || "Could not load requests.");
      })
      .finally(() => {
        if (!cancelled) setRequestsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function decideRegistration(id, action) {
    setActionBusyId(id);
    setRequestsError("");
    try {
      const fn = action === "approve" ? approveRegistration : rejectRegistration;
      const res = await fn(id);
      const nextStatus = res.registration?.status || (action === "approve" ? "approved" : "rejected");
      setRegistrations((list) => list.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
    } catch (err) {
      setRequestsError(err.message || "Could not update that request.");
    } finally {
      setActionBusyId(null);
    }
  }

  async function send() {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((m) => [...m, { role: "fellow", text }]);
    const reply = await sendMasterMessage({
      projectId: activeId,
      message: text,
      history: messages,
    });
    setMessages((m) => [...m, { role: "master", text: reply }]);
  }

  async function handleCreateProject() {
    const next = await createProject({
      title: "New project",
      objective: "Define the problem with the master consultant.",
      owner: user?.name || "You",
    });
    setProjects((list) => [next, ...list]);
    setActiveId(next.id);
    setTab("projects");
  }

  function addSection() {
    setWorkspace((w) => ({
      ...w,
      sections: w.sections.concat({
        id: "s" + Date.now(),
        title: "New section",
        body: "Write or ask the master to draft this section.",
      }),
      versions: [{ id: "v" + Date.now(), label: "Section added", at: "just now" }, ...w.versions],
    }));
  }

  return (
    <div className="app-shell">
      <header className="app-bar">
        <div className="app-brand">
          <Link to="/" className="logo" aria-label="Vinverse home">
            <img src="/images/vinverse-mark.png" alt="" className="logo-mark" />
            <span className="logo-word">Vinverse</span>
          </Link>
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
          {[
            ["chat", "Master consultant"],
            ["projects", "Projects"],
            ["fellows", "Fellows"],
            ["requests", "Access requests"],
            ["profile", "Profile"],
          ].map(([id, label]) => (
            <button key={id} className={tab === id ? "on" : ""} type="button" onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </aside>

        <section className="app-main">
          {tab === "chat" && (
            <div className="chat">
              <div className="chat-log">
                {messages.map((m, i) => (
                  <div key={i} className={`bubble ${m.role}`}>
                    <small>{m.role === "master" ? "Master consultant" : "You"}</small>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Describe the problem, a client meeting, or the outcome you need…"
                />
                <button className="btn" type="button" onClick={send}>
                  Send
                </button>
              </div>
            </div>
          )}

          {tab === "projects" && (
            <div className="project-layout">
              <div className="project-list">
                <button className="btn" type="button" onClick={handleCreateProject}>
                  Create project
                </button>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={p.id === activeId ? "plist on" : "plist"}
                    onClick={() => setActiveId(p.id)}
                  >
                    <strong>{p.title}</strong>
                    <span>{p.status}</span>
                  </button>
                ))}
              </div>
              {active ? (
                <div className="workspace">
                  <h2>{active.title}</h2>
                  <p className="lede">{active.objective}</p>
                  <div className="chip-row">
                    <span className="chip">Owner: {active.owner}</span>
                    <span className="chip">Invite Fellows</span>
                    <span className="chip">Clone as sub-project</span>
                    <span className="chip">Assign</span>
                  </div>
                  <label className="ws-block">
                    Context
                    <textarea
                      value={workspace.context}
                      onChange={(e) => setWorkspace({ ...workspace, context: e.target.value })}
                    />
                  </label>
                  <label className="ws-block">
                    Objective
                    <textarea
                      value={workspace.objective}
                      onChange={(e) => setWorkspace({ ...workspace, objective: e.target.value })}
                    />
                  </label>
                  <div className="ws-head">
                    <h3>Rendered outcome</h3>
                    <button className="btn ghost" type="button" onClick={addSection}>
                      Add section
                    </button>
                  </div>
                  {workspace.sections.map((s) => (
                    <article className="card" key={s.id}>
                      <input
                        className="plain"
                        value={s.title}
                        onChange={(e) =>
                          setWorkspace({
                            ...workspace,
                            sections: workspace.sections.map((x) =>
                              x.id === s.id ? { ...x, title: e.target.value } : x
                            ),
                          })
                        }
                      />
                      <textarea
                        value={s.body}
                        onChange={(e) =>
                          setWorkspace({
                            ...workspace,
                            sections: workspace.sections.map((x) =>
                              x.id === s.id ? { ...x, body: e.target.value } : x
                            ),
                          })
                        }
                      />
                    </article>
                  ))}
                  <h3>Versions</h3>
                  <ul className="version-list">
                    {workspace.versions.map((v) => (
                      <li key={v.id}>
                        {v.label} · {v.at}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}

          {tab === "fellows" && (
            <div>
              <h2>Find matching Fellows</h2>
              <p className="lede">The master consultant will suggest expertise after the problem is framed.</p>
              <div className="grid-3" style={{ marginTop: "1.2rem" }}>
                {[
                  ["Strategy", "Problem framing and decision architecture"],
                  ["Finance", "Investment, pricing, and financial impact"],
                  ["Operations", "Operating model and delivery risk"],
                ].map(([t, d]) => (
                  <article className="card" key={t}>
                    <h3>{t}</h3>
                    <p>{d}</p>
                    <p
                      className="card-cta"
                      role="button"
                      onClick={() => inviteFellow({ projectId: activeId, expertise: t })}
                    >
                      Invite to project
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "requests" && (
            <div>
              <h2>Access requests</h2>
              <p className="lede">
                Approving a request adds that email to the sign-in allow-list right away — no redeploy needed.
              </p>

              {requestsError ? <p className="auth-note auth-note-alert" style={{ marginTop: "1rem" }}>{requestsError}</p> : null}

              {requestsLoading ? (
                <p className="auth-note" style={{ marginTop: "1rem" }}>Loading…</p>
              ) : registrations.length === 0 ? (
                <p className="auth-note" style={{ marginTop: "1rem" }}>No requests yet.</p>
              ) : (
                <div className="grid-3" style={{ marginTop: "1.2rem" }}>
                  {registrations.map((r) => (
                    <article className="card" key={r.id}>
                      <h3>{r.name || r.email}</h3>
                      <p>{r.email}</p>
                      {r.phone ? <p>{r.phone}</p> : null}
                      <p className="chip" style={{ display: "inline-block", marginTop: "0.6rem" }}>
                        {r.status}
                      </p>
                      {r.status === "pending" ? (
                        <div className="actions" style={{ marginTop: "0.9rem" }}>
                          <button
                            className="btn"
                            type="button"
                            disabled={actionBusyId === r.id}
                            onClick={() => decideRegistration(r.id, "approve")}
                          >
                            {actionBusyId === r.id ? "Working…" : "Approve"}
                          </button>
                          <button
                            className="btn ghost"
                            type="button"
                            disabled={actionBusyId === r.id}
                            onClick={() => decideRegistration(r.id, "reject")}
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="card" style={{ maxWidth: "28rem" }}>
              <p className="num">Intelligence Fellow</p>
              <h3>{user?.name || "Fellow"}</h3>
              <p>{user?.email}</p>
              <p style={{ marginTop: "0.8rem" }}>
                Profiles are optional. Add industry, function, and missions so the platform can match you to work.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
