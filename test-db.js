// Simple test to see if better-sqlite3 works
import Database from "better-sqlite3";

try {
  const db = new Database("./test.db");
  console.log("✅ better-sqlite3 is working!");
  db.close();
} catch (error) {
  console.error("❌ better-sqlite3 error:", error.message);
}
