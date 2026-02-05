import Database from "better-sqlite3";
import type { GameResult } from "$lib/types";
import path from "path";

const dbPath = path.join(process.cwd(), "results.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_tasks INTEGER NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

export function saveResult(result: GameResult): void {
  const stmt = db.prepare(`
    INSERT INTO results (name, class, score, total_tasks, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(result.name, result.class, result.score, result.totalTasks, result.timestamp);
}

export function getAllResults(): GameResult[] {
  const stmt = db.prepare(`
    SELECT name, class, score, total_tasks as totalTasks, timestamp
    FROM results
    ORDER BY timestamp DESC
  `);
  return stmt.all() as GameResult[];
}
