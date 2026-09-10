const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";

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
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = { request, API_BASE, USE_MOCK };
