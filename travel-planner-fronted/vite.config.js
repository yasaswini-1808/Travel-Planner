import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("react-router") ||
            id.includes("react-dom") ||
            id.includes("react/")
          ) {
            return "react-core";
          }

          if (id.includes("leaflet") || id.includes("react-leaflet")) {
            return "maps";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("react-slick") || id.includes("slick-carousel")) {
            return "carousel";
          }

          if (id.includes("axios")) {
            return "http";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
