import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5174, // Exposes on 0.0.0.0 for network access
  },
  preview: {
    host: true, // For production preview on network
  },
});
