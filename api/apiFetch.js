import { authHeaders } from "./authHeaders.js";

const BASE = "http://localhost:3000";

export { BASE };

export async function apiFetch(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Array.isArray(err.message) ? err.message[0] : (err.message || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return res.json();
}
