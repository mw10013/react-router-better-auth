import Database from "better-sqlite3";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { betterAuth } from "better-auth";

// node --experimental-strip-types tests/script.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await fs.mkdir(".db", { recursive: true });
const databaseName = `./.db/test-${randomUUID()}.db`;
let database;
try {
  const schema = await fs.readFile(
    path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
    "utf8"
  );
  database = new Database(databaseName);
  database.exec(schema);
  console.log("Database created and schema applied:", databaseName);
  console.log("Database ready for testing.");
  const auth = betterAuth({
    database,
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
      sendOnSignUp: true,
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
    },
    advanced: {
      database: {
        generateId: false,
        useNumberId: true,
      },
    },
  });
  console.log("Better Auth set up with test database.");
  const res = await auth.api.signUpEmail({
    body: {
      email: "email@test.com",
      password: "password",
      // name: "Test Name",
      name: "",
      // image: "https://picsum.photos/200",
    },
  });
  console.log("User signed up:", res);
  console.log("Token:", res.token);
} catch (err) {
  console.error("Error:", err);
} finally {
  if (database) {
    database.close();
    await fs.unlink(databaseName);
  }
}
