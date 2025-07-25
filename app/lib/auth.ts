import { betterAuth, type BetterAuthOptions } from "better-auth";
import Database from "better-sqlite3";
import { sqliteAdapter } from "./sqlite-adapter";

// const db = new Database(process.env.DB_FILENAME || "./sqlite.db");

export function createAuth({
  database,
  ...options
}: Partial<BetterAuthOptions> = {}) {
  return betterAuth({
    // database: database ?? sqliteAdapter(db),
    database: database ?? new Database("./sqlite.db"),
    user: {
      modelName: "User",
    },
    session: {
      modelName: "Session",
    },
    account: {
      modelName: "Account",
    },
    verification: {
      modelName: "Verification",
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }, request) => {
        console.log("Stub: sendVerificationEmail", {
          to: user.email,
          url,
          token,
        });
      },
    },
    emailAndPassword: {
      enabled: true,
      // requireEmailVerification: true,
      // sendResetPassword: async ({ user, url, token }, request) => {
      //   console.log("Stub: sendResetPassword", { to: user.email, url, token });
      // },
      // onPasswordReset: async ({ user }, request) => {
      //   console.log(`Stub: Password for user ${user.email} has been reset.`);
      // },
    },
    advanced: {
      database: {
        generateId: false,
        useNumberId: true,
      },
    },
    ...options,
  });
}

export const auth = createAuth();
