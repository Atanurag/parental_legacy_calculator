const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
};

export const calculate = (dob, save = true) => request('/api/calculations', {
  method: 'POST',
  body: JSON.stringify({ dob, save })
});

export const getHistory = () => request('/api/calculations');
export const deleteHistoryItem = (id) => request(`/api/calculations/${id}`, { method: 'DELETE' });
