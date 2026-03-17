const rawBase =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const API_BASE_URL = String(rawBase).replace(/\/+$/, "");

export const apiUrl = (path) => {
  const normalizedPath = String(path || "");
  return `${API_BASE_URL}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
};
