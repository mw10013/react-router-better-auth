import { unstable_createContext } from "react-router";
import type { AppLoadContext } from "react-router";
import type { createAuth } from "./auth";

declare module "react-router" {
  interface AppLoadContext {
    auth: ReturnType<typeof createAuth>;
  }
}

export const appLoadContext = unstable_createContext<AppLoadContext>();
