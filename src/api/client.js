const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

const FRIENDLY_STATUS_MESSAGES = {
  400: "Something went wrong signing in. Please try again.",
  401: "Your Google sign-in couldn't be verified. Please try again.",
  403: "Your Google account isn't on the approved Fellows list yet.",
  500: "Something went wrong on our end. Please try again in a moment.",
};

async function request(path, options = {}) {
  if (USE_MOCK) {
    console.info("[API placeholder]", options.method || "GET", path, options.body || null);
    return null;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    console.error(`Request to ${path} failed: ${res.status}`);
    throw new Error(FRIENDLY_STATUS_MESSAGES[res.status] || "Something went wrong. Please try again.");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = { request, API_BASE, USE_MOCK };
