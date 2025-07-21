import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export function resetTestDb(initDb?: (db: Database.Database) => void) {
  const dbFile = process.env.DB_FILENAME;
  if (!dbFile) throw new Error("DB_FILENAME env var must be set");
  const db = new Database(dbFile);
  db.exec("pragma foreign_keys = off");
  const tables = db
    .prepare(
      `select name from sqlite_master where type = 'table' and name not like 'sqlite_%'`
    )
    .all() as Array<{ name: string }>;
  for (const { name } of tables) {
    db.exec(`drop table if exists "${name}"`);
  }
  const indexes = db
    .prepare(
      `select name from sqlite_master where type = 'index' and name not like 'sqlite_%'`
    )
    .all() as Array<{ name: string }>;
  for (const { name } of indexes) {
    db.exec(`drop index if exists "${name}"`);
  }
  db.exec("pragma foreign_keys = on");
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
    "utf8"
  );
  db.exec(schema);
  if (initDb) initDb(db);
  db.close();
}
