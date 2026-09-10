import { api } from "./client.js";

export async function sendMasterMessage({ projectId, message, history }) {
  const remote = await api.request("/orchestrator/chat", {
    method: "POST",
    body: JSON.stringify({ projectId, message, history }),
  });
  if (remote?.reply) return remote.reply;
  return "Understood. I will treat that as working context. Confirm: is the immediate output a meeting brief, a project charter, or a decision memo? Once you confirm, I will structure the workspace and suggest Fellow expertise to invite.";
}

export async function createProject(payload) {
  const remote = await api.request("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return (
    remote || {
      id: "p-" + Date.now(),
      title: payload.title || "New project",
      objective: payload.objective || "Define the problem with the master consultant.",
      status: "Draft",
      owner: payload.owner || "You",
    }
  );
}

export async function inviteFellow(payload) {
  await api.request("/projects/invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return { ok: true };
}
