// Empty base = same domain as the site (Express serves React). Set VITE_API_URL for split hosting.
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export const CATEGORIES = [
  'Web Development', 'Mobile Apps', 'Design & Creative', 'Writing & Translation',
  'Digital Marketing', 'Video & Animation', 'Data & AI', 'Business',
];

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('pc_token');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
