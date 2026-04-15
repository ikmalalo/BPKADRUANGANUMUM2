import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],

  base: "./", // 🔥 WAJIB untuk deploy

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    allowedHosts: ["terina-undappled-stacy.ngrok-free.dev"],

    // 🔥 ini cuma buat LOCAL
    proxy: {
      "/api": {
        target: "http://localhost:59489",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:59489",
        changeOrigin: true,
      },
    },
  },
});