import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { createProject, inviteFellow, sendMasterMessage } from "../api/platform.js";
import { approveRegistration, listRegistrations, rejectRegistration } from "../api/auth.js";

const OPENER =
  "I am the master consultant. Before we go further, tell me the problem you are trying to solve";

function makeOpenerMessages() {
  return [{ role: "master", text: OPENER }];
}

function emptyDetails(overrides = {}) {
  return {
    stage: "Discovery",
    completion: 0,
    milestones: [],
    nextTodos: ["Clarify the problem with the master consultant"],
    stakeholders: [],
    sections: [
      { id: "s1", title: "Problem framing", body: "What decision is actually on the table?" },
      { id: "s2", title: "Stakeholders", body: "Who decides, who influences, who is affected?" },
      { id: "s3", title: "Next moves", body: "What should happen this week?" },
    ],
    ...overrides,
  };
}

const starterProjects = [
  {
    id: "p-restaurant",
    title: "Opening a restaurant",
    objective: "Launch a neighborhood restaurant with a clear concept, budget, and opening plan.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Concept & planning",
      completion: 35,
      milestones: [
        { id: "m1", label: "Define cuisine and positioning", done: true },
        { id: "m2", label: "Draft startup budget", done: true },
        { id: "m3", label: "Shortlist locations", done: false },
        { id: "m4", label: "Secure permits and licensing", done: false },
      ],
      nextTodos: [
        "Visit top 3 locations with a contractor",
        "Model 90-day cash flow",
        "Interview two prospective chefs",
      ],
      stakeholders: ["Founder (you)", "Chef partner", "Landlord", "Investor"],
      sections: [
        { id: "s1", title: "Concept", body: "Casual Mediterranean, 60 seats, dinner-focused." },
        { id: "s2", title: "Budget", body: "Target build-out under $450k; soft opening in Q3." },
        { id: "s3", title: "Risks", body: "Permitting delays and labor availability." },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I want to open a neighborhood restaurant and need help structuring the plan.",
      },
      {
        role: "master",
        text: "Good. Let's lock the concept, budget envelope, and location criteria before we invite Fellows.",
      },
    ],
  },
  {
    id: "p-prep",
    title: "Preparing for a client meeting",
    objective: "Arrive with the right questions and a sharper framing of the client's problem.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Briefing",
      completion: 55,
      milestones: [
        { id: "m1", label: "Gather prior notes", done: true },
        { id: "m2", label: "Draft problem statement", done: true },
        { id: "m3", label: "Prepare question list", done: false },
        { id: "m4", label: "Align on ask / next step", done: false },
      ],
      nextTodos: [
        "Tighten the one-paragraph problem framing",
        "List decisions the client must make",
        "Prep a 10-minute walkthrough",
      ],
      stakeholders: ["You", "Client sponsor", "Client ops lead"],
      sections: [
        {
          id: "s1",
          title: "Problem framing",
          body: "What decision is actually on the table in this meeting?",
        },
        {
          id: "s2",
          title: "Stakeholders",
          body: "Who decides, who influences, who is affected?",
        },
        {
          id: "s3",
          title: "Questions to ask",
          body: "Master will help draft these from prior patterns.",
        },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I have a stakeholder meeting next week and need a sharper problem statement.",
      },
      {
        role: "master",
        text: "Understood. Confirm whether the immediate output is a meeting brief, a project charter, or a decision memo.",
      },
    ],
  },
  {
    id: "p-college",
    title: "Selecting a college for undergrad",
    objective: "Choose an undergrad program that fits academics, cost, and long-term goals.",
    status: "Active",
    owner: "You",
    ...emptyDetails({
      stage: "Research",
      completion: 20,
      milestones: [
        { id: "m1", label: "Clarify priorities (major, cost, location)", done: true },
        { id: "m2", label: "Build a long list of schools", done: false },
        { id: "m3", label: "Compare aid / net cost", done: false },
        { id: "m4", label: "Visit or attend info sessions", done: false },
      ],
      nextTodos: [
        "Rank must-haves vs nice-to-haves",
        "Shortlist 8–12 schools",
        "Note application deadlines",
      ],
      stakeholders: ["Student", "Parents / guardians", "Counselor"],
      sections: [
        {
          id: "s1",
          title: "Priorities",
          body: "Major interest, budget ceiling, preferred region, campus size.",
        },
        {
          id: "s2",
          title: "Long list",
          body: "Mix of reach, match, and safety schools.",
        },
        {
          id: "s3",
          title: "Decision criteria",
          body: "Net cost, academic fit, outcomes, culture.",
        },
      ],
    }),
    messages: [
      { role: "master", text: OPENER },
      {
        role: "fellow",
        text: "I need help choosing the right college for undergrad.",
      },
      {
        role: "master",
        text: "Let's start with constraints: budget, geography, intended field of study, and what 'success' looks like in four years.",
      },
    ],
  },
];

function titleFromText(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 8) return null;
  const clipped = cleaned.length > 72 ? `${cleaned.slice(0, 69)}…` : cleaned;
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

function extractListItems(text, labelRegex) {
  const match = text.match(labelRegex);
  if (!match) return null;
  const chunk = match[1] || match[0];
  const parts = chunk
    .split(/[\n•;]|,\s+/)
    .map((p) => p.replace(/^[-*\d.)\s]+/, "").trim())
    .filter((p) => p.length > 2 && p.length < 120);
  return parts.length ? parts.slice(0, 6) : null;
}

/** Heuristic live updates from the latest user message (+ optional master reply). */
function deriveProjectPatch(project, userText, masterText = "") {
  const blob = `${userText}\n${masterText}`;
  const patch = {};

  const looksGeneric =
    !project.title ||
    /^new project$/i.test(project.title) ||
    /^untitled/i.test(project.title);

  if (looksGeneric) {
    const titled = titleFromText(userText);
    if (titled) patch.title = titled;
  }

  if (!project.objective || /define the problem/i.test(project.objective)) {
    patch.objective = userText.trim().slice(0, 280);
  }

  const stageMatch = blob.match(
    /\b(?:stage|phase)\s*(?:is|:)?\s*([A-Za-z][A-Za-z0-9 &\-/]{1,40})/i
  );
  if (stageMatch) patch.stage = stageMatch[1].trim();
  else if (/budget|financ/i.test(blob)) patch.stage = "Planning";
  else if (/implement|build|launch|open/i.test(blob)) patch.stage = "Execution";
  else if (/research|explore|discover|consider/i.test(blob)) patch.stage = "Discovery";
  else if (project.completion === 0) patch.stage = project.stage || "Discovery";

  const pctMatch = blob.match(/(\d{1,3})\s*%\s*(?:complete|done|progress)?/i);
  if (pctMatch) {
    patch.completion = Math.min(100, Math.max(0, Number(pctMatch[1])));
  } else if (project.completion < 15) {
    patch.completion = Math.min(40, (project.completion || 0) + 10);
  }

  const milestones = extractListItems(
    blob,
    /(?:milestones?|phases?)[:\s]+([\s\S]{0,400})/i
  );
  if (milestones) {
    patch.milestones = milestones.map((label, i) => ({
      id: `m-${Date.now()}-${i}`,
      label,
      done: false,
    }));
  }

  const todos = extractListItems(
    blob,
    /(?:next\s+(?:steps?|todos?|actions?)|todos?|action items?)[:\s]+([\s\S]{0,400})/i
  );
  if (todos) patch.nextTodos = todos;

  const stakeholders = extractListItems(
    blob,
    /(?:stakeholders?|who(?:'s| is) involved)[:\s]+([\s\S]{0,300})/i
  );
  if (stakeholders) patch.stakeholders = stakeholders;

  if (userText.trim().length > 20) {
    const sections = (project.sections || []).map((s) => ({ ...s }));
    if (sections[0] && /problem framing/i.test(sections[0].title)) {
      sections[0] = {
        ...sections[0],
        body: userText.trim().slice(0, 400),
      };
    }
    patch.sections = sections;
  }

  if (project.status === "Draft" && (patch.title || userText.length > 40)) {
    patch.status = "Active";
  }

  return patch;
}

function ChatPanel({
  messages,
  draft,
  setDraft,
  onSend,
  sending,
  footer,
  header,
}) {
  return (
    <div className="chat">
      {header || null}
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
          disabled={sending}
        />
        <button className="btn" type="button" onClick={onSend} disabled={sending}>
          {sending ? "…" : "Send"}
        </button>
      </div>
      {footer || null}
    </div>
  );
}

function ProjectOverview({ project, onEdit, onInvite, onSearchFellows }) {
  if (!project) return null;
  return (
    <div className="workspace project-overview">
      <div className="ws-head">
        <div>
          <h2>{project.title}</h2>
          <p className="lede">{project.objective}</p>
        </div>
        <button className="btn" type="button" onClick={onEdit}>
          Edit project
        </button>
      </div>

      <div className="chip-row">
        <span className="chip">Status: {project.status}</span>
        <span className="chip">Stage: {project.stage || "—"}</span>
        <span className="chip">{project.completion ?? 0}% complete</span>
        <span className="chip">Owner: {project.owner || "You"}</span>
      </div>

      <div className="overview-grid">
        <section className="card overview-card">
          <h3>Milestones</h3>
          {(project.milestones || []).length === 0 ? (
            <p className="muted-line">No milestones yet.</p>
          ) : (
            <ul className="overview-list">
              {project.milestones.map((m) => (
                <li key={m.id} className={m.done ? "done" : ""}>
                  {m.done ? "✓ " : "○ "}
                  {m.label}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card overview-card">
          <h3>Next todos</h3>
          {(project.nextTodos || []).length === 0 ? (
            <p className="muted-line">No todos yet.</p>
          ) : (
            <ul className="overview-list">
              {project.nextTodos.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="card overview-card">
          <h3>Stakeholders</h3>
          {(project.stakeholders || []).length === 0 ? (
            <p className="muted-line">None listed yet.</p>
          ) : (
            <ul className="overview-list">
              {project.stakeholders.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(project.sections || []).length > 0 ? (
        <div className="overview-sections">
          <h3>Sections</h3>
          {project.sections.map((s) => (
            <article className="card" key={s.id}>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="chip-row overview-actions">
        <button
          className="chip chip-btn"
          type="button"
          onClick={() => onInvite("General")}
        >
          Invite Fellows
        </button>
        <span className="chip">Assign tasks</span>
        <button className="chip chip-btn" type="button" onClick={onSearchFellows}>
          Search Fellows
        </button>
      </div>
    </div>
  );
}

export default function Platform() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("chat");
  const [projects, setProjects] = useState(starterProjects);
  const [activeId, setActiveId] = useState(null);
  const [projectMode, setProjectMode] = useState("overview"); // overview | edit
  const [draft, setDraft] = useState("");
  const [editDraft, setEditDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [globalMessages, setGlobalMessages] = useState(makeOpenerMessages);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachTarget, setAttachTarget] = useState("new"); // new | existing
  const [attachExistingId, setAttachExistingId] = useState("");
  const [livePanelOpen, setLivePanelOpen] = useState(true);

  const active = useMemo(
    () => projects.find((p) => p.id === activeId) || null,
    [projects, activeId]
  );

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

  function updateProject(id, updater) {
    setProjects((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        return typeof updater === "function" ? updater(p) : { ...p, ...updater };
      })
    );
  }

  async function decideRegistration(id, action) {
    setActionBusyId(id);
    setRequestsError("");
    try {
      const fn = action === "approve" ? approveRegistration : rejectRegistration;
      const res = await fn(id);
      const nextStatus =
        res.registration?.status || (action === "approve" ? "approved" : "rejected");
      setRegistrations((list) =>
        list.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
      );
    } catch (err) {
      setRequestsError(err.message || "Could not update that request.");
    } finally {
      setActionBusyId(null);
    }
  }

  async function sendGlobal() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    const history = globalMessages;
    setGlobalMessages((m) => [...m, { role: "fellow", text }]);
    try {
      const reply = await sendMasterMessage({
        projectId: activeId || "global",
        message: text,
        history,
      });
      setGlobalMessages((m) => [...m, { role: "master", text: reply }]);
    } finally {
      setSending(false);
    }
  }

  async function sendProjectEdit() {
    const text = editDraft.trim();
    if (!text || !active || sending) return;
    setSending(true);
    setEditDraft("");
    const history = active.messages || makeOpenerMessages();
    updateProject(active.id, (p) => ({
      ...p,
      messages: [...(p.messages || []), { role: "fellow", text }],
    }));
    try {
      const reply = await sendMasterMessage({
        projectId: active.id,
        message: text,
        history,
      });
      updateProject(active.id, (p) => {
        const patch = deriveProjectPatch(p, text, reply);
        return {
          ...p,
          ...patch,
          messages: [...(p.messages || []), { role: "master", text: reply }],
        };
      });
    } finally {
      setSending(false);
    }
  }

  async function handleCreateProject() {
    const created = await createProject({
      title: "New project",
      objective: "Define the problem with the master consultant.",
      owner: user?.name || "You",
    });
    const next = {
      ...emptyDetails(),
      id: created.id || `p-${Date.now()}`,
      title: created.title || "New project",
      objective:
        created.objective || "Define the problem with the master consultant.",
      status: created.status || "Draft",
      owner: created.owner || user?.name || "You",
      messages: makeOpenerMessages(),
    };
    setProjects((list) => [next, ...list]);
    setActiveId(next.id);
    setProjectMode("edit");
    setEditDraft("");
    setLivePanelOpen(true);
    setTab("projects");
  }

  function openProjectOverview(id) {
    setActiveId(id);
    setProjectMode("overview");
    setTab("projects");
  }

  function handleSaveProject() {
    if (!active) return;
    updateProject(active.id, (p) => ({
      ...p,
      status: p.status === "Draft" ? "Active" : p.status,
    }));
    setProjectMode("overview");
  }

  function handleEditProject() {
    if (!active) return;
    setProjectMode("edit");
    setEditDraft("");
    setLivePanelOpen(true);
  }

  async function handleAttachToProject() {
    const history = globalMessages.map((m) => ({ ...m }));
    if (attachTarget === "new") {
      const created = await createProject({
        title: "New project",
        objective: "Continued from master consultant chat.",
        owner: user?.name || "You",
      });
      const firstUser = history.find((m) => m.role === "fellow");
      const base = {
        ...emptyDetails(),
        id: created.id || `p-${Date.now()}`,
        title: created.title || "New project",
        objective:
          created.objective || "Continued from master consultant chat.",
        status: created.status || "Draft",
        owner: created.owner || user?.name || "You",
        messages: history.length ? history : makeOpenerMessages(),
      };
      const seeded = firstUser
        ? { ...base, ...deriveProjectPatch(base, firstUser.text) }
        : base;
      setProjects((list) => [seeded, ...list]);
      setActiveId(seeded.id);
    } else {
      const targetId = attachExistingId || projects[0]?.id;
      if (!targetId) return;
      updateProject(targetId, (p) => {
        const merged = [...(p.messages || []), ...history.filter((m) => m.text !== OPENER || !(p.messages || []).some((x) => x.text === OPENER))];
        const firstUser = history.find((m) => m.role === "fellow");
        const patch = firstUser ? deriveProjectPatch(p, firstUser.text) : {};
        return { ...p, ...patch, messages: merged };
      });
      setActiveId(targetId);
    }
    setAttachOpen(false);
    setProjectMode("edit");
    setEditDraft("");
    setLivePanelOpen(true);
    setTab("projects");
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
            // Admin-only on the backend (ADMIN_EMAILS) -- hidden here too so
            // a non-admin Fellow doesn't see a tab that just 403s.
            ...(user?.isAdmin ? [["requests", "Access requests"]] : []),
            ["profile", "Profile"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "on" : ""}
              type="button"
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </aside>

        <section className="app-main">
          {tab === "chat" && (
            <ChatPanel
              messages={globalMessages}
              draft={draft}
              setDraft={setDraft}
              onSend={sendGlobal}
              sending={sending}
              footer={
                <div className="chat-attach">
                  {!attachOpen ? (
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => {
                        setAttachOpen(true);
                        setAttachTarget("new");
                        setAttachExistingId(projects[0]?.id || "");
                      }}
                    >
                      Add chat to a project
                    </button>
                  ) : (
                    <div className="attach-panel card">
                      <strong>Attach this chat to a project</strong>
                      <div className="attach-options">
                        <label>
                          <input
                            type="radio"
                            name="attachTarget"
                            checked={attachTarget === "new"}
                            onChange={() => setAttachTarget("new")}
                          />{" "}
                          New project
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="attachTarget"
                            checked={attachTarget === "existing"}
                            onChange={() => setAttachTarget("existing")}
                          />{" "}
                          Existing project
                        </label>
                      </div>
                      {attachTarget === "existing" ? (
                        <select
                          value={attachExistingId}
                          onChange={(e) => setAttachExistingId(e.target.value)}
                        >
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <div className="actions" style={{ marginTop: "0.75rem" }}>
                        <button className="btn" type="button" onClick={handleAttachToProject}>
                          Attach &amp; open edit chat
                        </button>
                        <button
                          className="btn ghost"
                          type="button"
                          onClick={() => setAttachOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
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
                    onClick={() => openProjectOverview(p.id)}
                  >
                    <strong>{p.title}</strong>
                    <span>
                      {p.status}
                      {typeof p.completion === "number" ? ` · ${p.completion}%` : ""}
                    </span>
                  </button>
                ))}
              </div>

              {!active ? (
                <div className="workspace">
                  <h2>Projects</h2>
                  <p className="lede">
                    Select a project to view its overview, or create one to start a master
                    consultant edit chat.
                  </p>
                </div>
              ) : projectMode === "edit" ? (
                <div className="project-edit">
                  <div className="project-edit-toolbar">
                    <div>
                      <h2>{active.title}</h2>
                      <p className="lede muted-line">
                        Editing with the master consultant · {active.stage || "Discovery"} ·{" "}
                        {active.completion ?? 0}%
                      </p>
                    </div>
                    <div className="actions">
                      <button className="btn" type="button" onClick={handleSaveProject}>
                        Save project
                      </button>
                      <button
                        className="btn ghost"
                        type="button"
                        onClick={() => setLivePanelOpen((v) => !v)}
                      >
                        {livePanelOpen ? "Hide details" : "Show details"}
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      livePanelOpen ? "project-edit-body with-side" : "project-edit-body"
                    }
                  >
                    <ChatPanel
                      messages={active.messages || makeOpenerMessages()}
                      draft={editDraft}
                      setDraft={setEditDraft}
                      onSend={sendProjectEdit}
                      sending={sending}
                    />
                    {livePanelOpen ? (
                      <aside className="live-details card">
                        <h3>Live project details</h3>
                        <label className="ws-block">
                          Name
                          <input
                            className="plain"
                            value={active.title}
                            onChange={(e) =>
                              updateProject(active.id, { title: e.target.value })
                            }
                          />
                        </label>
                        <label className="ws-block">
                          Objective
                          <textarea
                            value={active.objective || ""}
                            onChange={(e) =>
                              updateProject(active.id, { objective: e.target.value })
                            }
                          />
                        </label>
                        <label className="ws-block">
                          Stage
                          <input
                            className="plain"
                            value={active.stage || ""}
                            onChange={(e) =>
                              updateProject(active.id, { stage: e.target.value })
                            }
                          />
                        </label>
                        <label className="ws-block">
                          Completion %
                          <input
                            className="plain"
                            type="number"
                            min={0}
                            max={100}
                            value={active.completion ?? 0}
                            onChange={(e) =>
                              updateProject(active.id, {
                                completion: Number(e.target.value) || 0,
                              })
                            }
                          />
                        </label>
                        <div className="ws-block">
                          <span>Milestones</span>
                          <ul className="overview-list">
                            {(active.milestones || []).map((m) => (
                              <li key={m.id}>{m.label}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="ws-block">
                          <span>Next todos</span>
                          <ul className="overview-list">
                            {(active.nextTodos || []).map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="ws-block">
                          <span>Sections</span>
                          {(active.sections || []).map((s) => (
                            <article className="card" key={s.id} style={{ marginTop: "0.5rem" }}>
                              <strong>{s.title}</strong>
                              <p>{s.body}</p>
                            </article>
                          ))}
                        </div>
                      </aside>
                    ) : null}
                  </div>
                </div>
              ) : (
                <ProjectOverview
                  project={active}
                  onEdit={handleEditProject}
                  onInvite={(expertise) =>
                    inviteFellow({ projectId: active.id, expertise })
                  }
                  onSearchFellows={() => setTab("fellows")}
                />
              )}
            </div>
          )}

          {tab === "fellows" && (
            <div>
              <h2>Find matching Fellows</h2>
              <p className="lede">
                The master consultant will suggest expertise after the problem is framed.
              </p>
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
                      onClick={() =>
                        inviteFellow({
                          projectId: activeId || projects[0]?.id,
                          expertise: t,
                        })
                      }
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
                Approving a request adds that email to the sign-in allow-list right away — no
                redeploy needed.
              </p>

              {requestsError ? (
                <p className="auth-note auth-note-alert" style={{ marginTop: "1rem" }}>
                  {requestsError}
                </p>
              ) : null}

              {requestsLoading ? (
                <p className="auth-note" style={{ marginTop: "1rem" }}>
                  Loading…
                </p>
              ) : registrations.length === 0 ? (
                <p className="auth-note" style={{ marginTop: "1rem" }}>
                  No requests yet.
                </p>
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
                Profiles are optional. Add industry, function, and missions so the platform can
                match you to work.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
