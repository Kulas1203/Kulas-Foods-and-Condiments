// Small API client. In dev, Vite proxies /api to the Express server; in
// production the frontend is served by Express itself, so relative URLs
// work everywhere. Set VITE_API_URL to point at a remote backend instead.
const API_BASE = import.meta.env.VITE_API_URL || '';

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const sendContact = (payload) => postJSON('/api/contact', payload);
export const joinNewsletter = (email) => postJSON('/api/newsletter', { email });
