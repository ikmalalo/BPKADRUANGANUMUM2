const DEFAULT_API_BASE = "https://bpkadruanganumum-production.up.railway.app";

export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "") || DEFAULT_API_BASE;

if (!import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_API_URL is not set; defaulting API base URL to Railway backend:",
    DEFAULT_API_BASE
  );
}

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
