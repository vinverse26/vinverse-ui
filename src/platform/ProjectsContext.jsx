import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createProject, inviteFellow, sendMasterMessage } from "../api/platform.js";
import {
  deriveProjectPatch,
  emptyDetails,
  makeOpenerMessages,
  starterProjects,
} from "./projectModel.js";
import { useAuth } from "../auth/AuthContext.jsx";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState(starterProjects);
  const [globalMessages, setGlobalMessages] = useState(makeOpenerMessages);
  const [draft, setDraft] = useState("");
  const [editDraft, setEditDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachTarget, setAttachTarget] = useState("new");
  const [attachExistingId, setAttachExistingId] = useState("");
  const [livePanelOpen, setLivePanelOpen] = useState(true);

  const updateProject = useCallback((id, updater) => {
    setProjects((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        return typeof updater === "function" ? updater(p) : { ...p, ...updater };
      })
    );
  }, []);

  async function sendGlobal() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setDraft("");
    const history = globalMessages;
    setGlobalMessages((m) => [...m, { role: "fellow", text }]);
    try {
      const reply = await sendMasterMessage({ projectId: null, message: text, history });
      setGlobalMessages((m) => [...m, { role: "master", text: reply }]);
    } catch {
      setGlobalMessages((m) => [
        ...m,
        {
          role: "master",
          text: "Understood. Capture the problem in one sentence, who is affected, and what good looks like.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function sendProjectEdit(projectId) {
    const text = editDraft.trim();
    if (!text || sending || !projectId) return;
    setSending(true);
    setEditDraft("");
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      setSending(false);
      return;
    }
    const history = project.messages || makeOpenerMessages();
    updateProject(projectId, { messages: [...history, { role: "fellow", text }] });
    try {
      const reply = await sendMasterMessage({ projectId, message: text, history });
      updateProject(projectId, (p) => {
        const messages = [...(p.messages || []), { role: "master", text: reply }];
        const patch = deriveProjectPatch(p, text, reply);
        return { ...p, ...patch, messages };
      });
    } catch {
      updateProject(projectId, (p) => ({
        ...p,
        messages: [
          ...(p.messages || []),
          {
            role: "master",
            text: "Noted. Keep going - I will refine the project name and details as we talk.",
          },
        ],
      }));
    } finally {
      setSending(false);
    }
  }

  async function handleCreateProject() {
    const next = await createProject({
      title: "New project",
      objective: "Define the problem with the master consultant.",
      owner: user?.name || "You",
    });
    const full = {
      ...emptyDetails(),
      ...next,
      title: next.title || "New project",
      status: next.status || "Draft",
      owner: next.owner || user?.name || "You",
      messages: makeOpenerMessages(),
      saved: false,
    };
    setProjects((list) => [full, ...list]);
    setEditDraft("");
    setLivePanelOpen(true);
    return full.id;
  }

  function handleSaveProject(projectId) {
    updateProject(projectId, (p) => ({
      ...p,
      saved: true,
      status: p.status === "Draft" ? "Active" : p.status,
    }));
  }

  async function handleAttachToProject(newName = "") {
    if (attachTarget === "new") {
      const id = await handleCreateProject();
      updateProject(id, { messages: [...globalMessages] });
      const fellow = [...globalMessages].reverse().find((m) => m.role === "fellow");
      const master = [...globalMessages].reverse().find((m) => m.role === "master");
      if (fellow) {
        updateProject(id, (p) => ({
          ...p,
          ...deriveProjectPatch(p, fellow.text, master?.text || ""),
        }));
      }
      const name = newName.trim();
      if (name) updateProject(id, { title: name });
      setAttachOpen(false);
      return { id, mode: "edit" };
    }
    const id = attachExistingId;
    if (!id) return null;
    updateProject(id, (p) => ({
      ...p,
      messages: [...(p.messages || []), ...globalMessages],
    }));
    setAttachOpen(false);
    return { id, mode: "edit" };
  }

  async function invite(projectId, expertise) {
    await inviteFellow({ projectId, expertise });
  }

  const value = useMemo(
    () => ({
      projects,
      globalMessages,
      draft,
      setDraft,
      editDraft,
      setEditDraft,
      sending,
      attachOpen,
      setAttachOpen,
      attachTarget,
      setAttachTarget,
      attachExistingId,
      setAttachExistingId,
      livePanelOpen,
      setLivePanelOpen,
      updateProject,
      sendGlobal,
      sendProjectEdit,
      handleCreateProject,
      handleSaveProject,
      handleAttachToProject,
      invite,
      getProject: (id) => projects.find((p) => p.id === id) || null,
    }),
    [
      projects,
      globalMessages,
      draft,
      editDraft,
      sending,
      attachOpen,
      attachTarget,
      attachExistingId,
      livePanelOpen,
      updateProject,
    ]
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
