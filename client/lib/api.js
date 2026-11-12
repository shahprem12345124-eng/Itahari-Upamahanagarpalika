const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || `अनुरोध असफल भयो (${response.status})`);
  }

  return result;
}

export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const serverBase = API_BASE.replace(/\/api\/?$/, "");
  return `${serverBase}${path.startsWith("/") ? path : `/${path}`}`;
}
