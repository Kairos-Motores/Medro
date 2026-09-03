import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { API_BASE_URL, AUTH_TOKEN } from "./config";

// Bundle isolado de impressão: injeta o Bearer do usuário (recebido via query
// string `t`) em toda chamada à API do Medro, sem tocar nos ~40 call sites.
if (AUTH_TOKEN) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input?.url ?? "";
    if (url.startsWith(API_BASE_URL)) {
      const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
      if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${AUTH_TOKEN}`);
      return nativeFetch(input, { ...init, headers });
    }
    return nativeFetch(input, init);
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
