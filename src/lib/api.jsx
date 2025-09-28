export const API_BASE = import.meta.env.VITE_API_BASE;

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  // Always parse JSON
  const data = await res.json().catch(() => ({}));

  // Include HTTP status in the response for easier handling
  return { status: res.status, ok: res.ok, ...data };
}
