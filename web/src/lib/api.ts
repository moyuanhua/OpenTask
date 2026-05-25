const API_URL = 'http://localhost:3001/api/v1';

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  post: async (path: string, data: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  patch: async (path: string, data: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  delete: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }
};