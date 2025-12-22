import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/exam-navigator/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // Ensure esbuild and Vite build target a modern JS version so top-level await is supported
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022"
    }
  },
  esbuild: {
    target: "es2022"
  },
  build: {
    target: "es2022"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
