import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Bundle de impressão do laudo. Servido estático (Vercel/Render static) e
// aberto pelo pdf-worker em `/admin?os=<OS>&print=true&t=<jwt>`.
export default defineConfig({
  plugins: [react()],
  server: { port: 5180 },
  build: { outDir: "dist", sourcemap: false, chunkSizeWarningLimit: 1500 },
});
