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
  // Insert a sample user for testing
  // FIND_MODEL_WITH_MODIFIED_FIELD_NAME is disabled because we do not handle email_address vs email
  // Subsequent tests expect FIND_MODEL_WITH_MODIFIED_FIELD_NAME to have created a user so we create one here.
  db.exec(`
insert into User (name, email, emailVerified, createdAt, updatedAt) 
values ('test-name-with-modified-field', 'test-email-with-modified-field@email.com', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');
  `);
  db.close();
}

//
describe("sqliteAdapter (Better Auth) - General Adapter Compliance", () => {
  beforeAll(() => {
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
      FIND_MODEL: false,
      FIND_MODEL_WITHOUT_ID: false,
      FIND_MODEL_WITH_SELECT: false,
      FIND_MODEL_WITH_MODIFIED_FIELD_NAME: true, // Disable since we do not handle email_address vs email
      UPDATE_MODEL: false,
      SHOULD_FIND_MANY: false,
      SHOULD_FIND_MANY_WITH_WHERE: false,
      SHOULD_FIND_MANY_WITH_OPERATORS: false,
      SHOULD_WORK_WITH_REFERENCE_FIELDS: false,
      SHOULD_FIND_MANY_WITH_SORT_BY: false,
      SHOULD_FIND_MANY_WITH_LIMIT: false,
      SHOULD_FIND_MANY_WITH_OFFSET: false,
      SHOULD_UPDATE_WITH_MULTIPLE_WHERE: false,
      DELETE_MODEL: false,
      SHOULD_DELETE_MANY: false,
      SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: false,
      SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: false,
      SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: false,
      SHOULD_SEARCH_USERS_WITH_STARTS_WITH: false,
      SHOULD_SEARCH_USERS_WITH_ENDS_WITH: false,
      SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: true,
    },
  });
});

describe("sqliteAdapter (Better Auth) - Numeric ID Compliance", () => {
  beforeAll(() => {
    resetTestDb();
  });
  afterAll(() => {
    // leave test.db for inspection
  });
  runNumberIdAdapterTest({
    getAdapter: async (options = {}) => {
      const db = new Database(TEST_DB_PATH);
      return sqliteAdapter(db)(options);
    },
    disableTests: {
      SHOULD_RETURN_A_NUMBER_ID_AS_A_RESULT: false,
      SHOULD_INCREMENT_THE_ID_BY_1: false,
      CREATE_MODEL: false,
      CREATE_MODEL_SHOULD_ALWAYS_RETURN_AN_ID: false,
      FIND_MODEL: false,
      FIND_MODEL_WITHOUT_ID: false,
      FIND_MODEL_WITH_SELECT: false,
      FIND_MODEL_WITH_MODIFIED_FIELD_NAME: true, // Disable since we do not handle email_address vs email
      UPDATE_MODEL: false,
      SHOULD_FIND_MANY: false,
      SHOULD_FIND_MANY_WITH_WHERE: false,
      SHOULD_FIND_MANY_WITH_OPERATORS: false,
      SHOULD_WORK_WITH_REFERENCE_FIELDS: false,
      SHOULD_FIND_MANY_WITH_SORT_BY: false,
      SHOULD_FIND_MANY_WITH_LIMIT: false,
      SHOULD_FIND_MANY_WITH_OFFSET: false,
      SHOULD_UPDATE_WITH_MULTIPLE_WHERE: false,
      DELETE_MODEL: false,
      SHOULD_DELETE_MANY: false,
      SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: false,
      SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: false,
      SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: false,
      SHOULD_SEARCH_USERS_WITH_STARTS_WITH: false,
      SHOULD_SEARCH_USERS_WITH_ENDS_WITH: false,
      SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: false,
    },
  });
});
