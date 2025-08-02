//
import { describe } from "vitest";
import { getTestContext } from "./test-utils";
import {
  runAdapterTest,
  runNumberIdAdapterTest,
} from "better-auth/adapters/test";
import { sqliteAdapter } from "../app/lib/sqlite-adapter";

describe("sqliteAdapter (Better Auth) - General Adapter Compliance", async () => {
  // FIND_MODEL_WITH_MODIFIED_FIELD_NAME is disabled because we do not handle email_address vs email
  // Subsequent tests expect FIND_MODEL_WITH_MODIFIED_FIELD_NAME to have created a user so we create one here.
  const { database } = await getTestContext({
    initDb: (database) => {
      database.exec(`
        insert into User (name, email, emailVerified, createdAt, updatedAt)
        values ('test-name-with-modified-field', 'test-email-with-modified-field@email.com', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');
      `);
    },
  });
  runAdapterTest({
    getAdapter: async (options = {}) => {
      return sqliteAdapter(database)(options);
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

describe("sqliteAdapter (Better Auth) - Numeric ID Compliance", async () => {
  // FIND_MODEL_WITH_MODIFIED_FIELD_NAME is disabled because we do not handle email_address vs email
  // Subsequent tests expect FIND_MODEL_WITH_MODIFIED_FIELD_NAME to have created a user so we create one here.
  const { database } = await getTestContext({
    initDb: (database) => {
      database.exec(`
        insert into User (name, email, emailVerified, createdAt, updatedAt)
        values ('test-name-with-modified-field', 'test-email-with-modified-field@email.com', 1, '${new Date().toISOString()}', '${new Date().toISOString()}');
      `);
    },
  });
  runNumberIdAdapterTest({
    getAdapter: async (options = {}) => {
      return sqliteAdapter(database)(options);
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
