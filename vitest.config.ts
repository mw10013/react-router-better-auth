import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), DB_FILENAME: "./test.db" };
  return {
    test: {
      setupFiles: ["./tests/setup.ts"],
      environment: "jsdom",
      env,
      sequence: {
        concurrent: false,
      },
    },
  };
});
