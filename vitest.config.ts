import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"],
    environment: "jsdom",
    env: {
      DB_FILENAME: "./test.db",
    },
    sequence: {
      concurrent: false,
    },
  },
});
