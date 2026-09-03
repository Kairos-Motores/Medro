// Bundle de impressão do laudo — servido isolado, renderizado pelo pdf-worker.
// Chama a API do Medro (rotas /api/laudos-gen/*, restritas ao DPT). O token JWT
// do usuário chega pela query string `t` (o worker o repassa); é usado como
// Bearer nas chamadas à API.
const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const API_BASE_URL = `${API_ORIGIN}/api/laudos-gen`;

export const AUTH_TOKEN = (() => {
  try {
    return new URLSearchParams(window.location.search).get("t") || "";
  } catch {
    return "";
  }
})();

/** fetch com o Bearer do usuário já embutido. */
export function apiFetch(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (AUTH_TOKEN) headers.set("Authorization", `Bearer ${AUTH_TOKEN}`);
  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}
