import Database from "better-sqlite3";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { afterAll } from "vitest";
import { createAuth } from "../app/lib/auth";

export async function getTestContext({
  initDb,
}: { initDb?: (db: Database.Database) => void } = {}) {
  await fs.mkdir(".db", { recursive: true });
  const databaseName = `./.db/test-${randomUUID()}.db`;
  const database = new Database(databaseName);
  const schema = await fs.readFile(
    path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
    "utf8"
  );
  database.exec(schema);
  if (initDb) initDb(database);
  afterAll(async () => {
    await fs.unlink(databaseName);
  });
  return {
    auth: createAuth({ database }),
    database,
  };
}
