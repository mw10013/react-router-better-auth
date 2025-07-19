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
    disableTests: {
      CREATE_MODEL: false,
      CREATE_MODEL_SHOULD_ALWAYS_RETURN_AN_ID: false,
      FIND_MODEL: true,
      FIND_MODEL_WITHOUT_ID: true,
      FIND_MODEL_WITH_SELECT: true,
      FIND_MODEL_WITH_MODIFIED_FIELD_NAME: true,
      UPDATE_MODEL: true,
      SHOULD_FIND_MANY: true,
      SHOULD_FIND_MANY_WITH_WHERE: true,
      SHOULD_FIND_MANY_WITH_OPERATORS: true,
      SHOULD_WORK_WITH_REFERENCE_FIELDS: true,
      SHOULD_FIND_MANY_WITH_SORT_BY: true,
      SHOULD_FIND_MANY_WITH_LIMIT: true,
      SHOULD_FIND_MANY_WITH_OFFSET: true,
      SHOULD_UPDATE_WITH_MULTIPLE_WHERE: true,
      DELETE_MODEL: true,
      SHOULD_DELETE_MANY: true,
      SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: true,
      SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: true,
      SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: true,
      SHOULD_SEARCH_USERS_WITH_STARTS_WITH: true,
      SHOULD_SEARCH_USERS_WITH_ENDS_WITH: true,
      SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: true,
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
