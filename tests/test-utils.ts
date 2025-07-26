import Database from "better-sqlite3";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { afterAll } from "vitest";

// export function resetTestDb(initDb?: (db: Database.Database) => void) {
//   const dbFile = process.env.DB_FILENAME;
//   if (!dbFile) throw new Error("DB_FILENAME env var must be set");
//   const db = new Database(dbFile);
//   db.exec("pragma foreign_keys = off");
//   const tables = db
//     .prepare(
//       `select name from sqlite_master where type = 'table' and name not like 'sqlite_%'`
//     )
//     .all() as Array<{ name: string }>;
//   for (const { name } of tables) {
//     db.exec(`drop table if exists "${name}"`);
//   }
//   const indexes = db
//     .prepare(
//       `select name from sqlite_master where type = 'index' and name not like 'sqlite_%'`
//     )
//     .all() as Array<{ name: string }>;
//   for (const { name } of indexes) {
//     db.exec(`drop index if exists "${name}"`);
//   }
//   db.exec("pragma foreign_keys = on");
//   const schema = fs.readFileSync(
//     path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
//     "utf8"
//   );
//   db.exec(schema);
//   if (initDb) initDb(db);

//   // Force a checkpoint to commit all changes before closing.
//   db.pragma("wal_checkpoint(RESTART)");
//   db.close();
// }

export async function getTestContext({
  initDb,
}: { initDb?: (db: Database.Database) => void } = {}) {
  await fs.mkdir(".db", { recursive: true });
  const dbName = `./.db/test-${randomUUID()}.db`;
  const db = new Database(dbName);
  const schema = await fs.readFile(
    path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
    "utf8"
  );
  db.exec(schema);
  if (initDb) initDb(db);
  afterAll(async () => {
    await fs.unlink(dbName);
  });
  return { db };
}
