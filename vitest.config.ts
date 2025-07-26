import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  return {
    plugins: [tsconfigPaths()],
    test: {
      setupFiles: ["./tests/setup.ts"],
      environment: "jsdom",
      env: loadEnv(mode, process.cwd(), ""),
      // sequence: {
      //   concurrent: false,
      // },
    },
  };
});
