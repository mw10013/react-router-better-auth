import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { sqliteAdapter } from "./sqlite-adapter";

const db = new Database(process.env.DB_FILENAME || "./sqlite.db");

export const auth = betterAuth({
  database: sqliteAdapter(db),
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
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
});
