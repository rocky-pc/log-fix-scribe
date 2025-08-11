import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: './', // ✅ relative paths so it works when opening index.html directly
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000, // default is 500 KB; raise for large builds
    assetsInlineLimit: 4096 * 10, // inline limit for base64 URLs (default 4 KB)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'] // split vendor code if needed
        }
      }
    }
  }
}));
