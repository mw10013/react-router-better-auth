import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ""), DB_FILENAME: "./test.db" };
  return {
    plugins: [tsconfigPaths()],
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
