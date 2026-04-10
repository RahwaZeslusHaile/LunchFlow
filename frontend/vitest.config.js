import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
    include: ["test/unit/frontend/**/*.unit.test.{js,jsx,ts,tsx}"],
  },
});
