import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export function resetTestDb(initDb?: (db: Database.Database) => void) {
  const dbFile = process.env.DB_FILENAME;
  if (!dbFile) throw new Error("DB_FILENAME env var must be set");
  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
  const db = new Database(dbFile);
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../better-auth_migrations/schema.sql"),
    "utf8"
  );
  db.exec(schema);
  if (initDb) initDb(db);
  db.close();
}
