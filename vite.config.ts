import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { createSecurityMiddleware } from "./server/security";

const securityPlugin = {
  name: "security-middleware",
  configureServer(server: any) {
    server.middlewares.use(createSecurityMiddleware());
  },
};

export default defineConfig({
  plugins: [react(), securityPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
