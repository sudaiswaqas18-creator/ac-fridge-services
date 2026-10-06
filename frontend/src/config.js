const localDevApiBase = 'http://localhost:5000';

export const API_BASE = `${(
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? localDevApiBase : window.location.origin)
).replace(/\/$/, '')}/api`;

export default API_BASE;
