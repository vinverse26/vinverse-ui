import { api } from "./client.js";

export async function registerFellow(payload) {
  const remote = await api.request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (remote) return remote;
  return { status: "pending", message: "Request recorded. Admin approval required." };
}

export async function exchangeGoogleCredential(credential) {
  const remote = await api.request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
  if (remote) return remote;

  if (credential && credential.includes(".")) {
    const payload = JSON.parse(atob(credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      token: "mock-session-token",
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub,
        provider: "google",
        role: "intelligence_fellow",
      },
    };
  }

  return {
    token: "mock-session-token",
    user: {
      name: "Intelligence Fellow",
      email: "fellow@vinverse.ai",
      picture: "",
      sub: "google-placeholder",
      provider: "google",
      role: "intelligence_fellow",
    },
  };
}

export async function getSession() {
  const remote = await api.request("/auth/session");
  return remote;
}

export async function logoutSession() {
  await api.request("/auth/logout", { method: "POST" });
  return { ok: true };
}

// --- Registration review, for an already-approved Fellow ---
// Backed by GET/POST /api/auth/register(/{id}/approve|reject) on the MCP
// server (see vinverse-mcp/storage.py) -- approving adds the email to the
// live Google Sign-In allow-list immediately, no redeploy needed.

export async function listRegistrations() {
  const remote = await api.request("/auth/register");
  if (remote) return remote;
  return { registrations: [] };
}

export async function approveRegistration(id) {
  const remote = await api.request(`/auth/register/${id}/approve`, { method: "POST" });
  if (remote) return remote;
  return { status: "approved", registration: { id, status: "approved" } };
}

export async function rejectRegistration(id) {
  const remote = await api.request(`/auth/register/${id}/reject`, { method: "POST" });
  if (remote) return remote;
  return { status: "rejected", registration: { id, status: "rejected" } };
}
