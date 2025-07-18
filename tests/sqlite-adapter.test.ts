//
import { describe, afterAll, beforeAll, beforeEach, test } from "vitest";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import {
  runAdapterTest,
  runNumberIdAdapterTest,
} from "better-auth/adapters/test";
import { sqliteAdapter } from "../app/lib/sqlite-adapter";

const TEST_DB_PATH = path.resolve(__dirname, "../test.db");
const SCHEMA_PATH = path.resolve(
  __dirname,
  "../better-auth_migrations/schema.sql"
);

function resetTestDb() {
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
  const db = new Database(TEST_DB_PATH);
  const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
  db.exec(schema);
  db.close();
}

//
describe("sqliteAdapter (Better Auth) - General Adapter Compliance", () => {
  beforeAll(() => {
    resetTestDb();
  });
  beforeEach(() => {
    resetTestDb();
  });
  afterAll(() => {
    // leave test.db for inspection
  });
  runAdapterTest({
    getAdapter: async (options = {}) => {
      const db = new Database(TEST_DB_PATH);
      return sqliteAdapter(db)(options);
    },
  });
});
// describe("sqliteAdapter (Better Auth) - Numeric ID Compliance", () => {
//   beforeAll(() => {
//     resetTestDb();
//   });
//   beforeEach(() => {
//     resetTestDb();
//   });
//   afterAll(() => {
//     // leave test.db for inspection
//   });
//   runNumberIdAdapterTest({
//     getAdapter: async (options = {}) => {
//       const db = new Database(TEST_DB_PATH);
//       return sqliteAdapter(db)(options);
//     },
//   });
// });
