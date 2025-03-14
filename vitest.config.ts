/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Exposes globals like `describe`, `it`, and `expect`
    environment: "jsdom", // Simulates a browser environment
    // Optional: a setup file for extending expect with jest-dom matchers:
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"], // Test file patterns
  },
});
