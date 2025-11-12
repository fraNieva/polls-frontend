/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
    server: {
      port: 3000,
      // Only use proxy in development when API_URL is not set to external URL
      ...(mode === "development" &&
        env.VITE_API_URL?.includes("localhost") && {
          proxy: {
            "/api": {
              target:
                env.VITE_API_URL?.replace("/api/v1", "") ||
                "http://localhost:8000",
              changeOrigin: true,
            },
          },
        }),
    },
  };
});
