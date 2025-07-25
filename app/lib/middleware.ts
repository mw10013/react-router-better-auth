import { unstable_createContext } from "react-router";
import type { AppLoadContext } from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    test: string;
  }
}

export const appLoadContext = unstable_createContext<AppLoadContext>();
