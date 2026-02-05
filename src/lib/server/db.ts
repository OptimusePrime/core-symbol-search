import { createClient } from "@libsql/client";
import type { GameResult } from "$lib/types";
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Initialize table (runs once on import)
await client.execute(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_tasks INTEGER NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

export async function saveResult(result: GameResult): Promise<void> {
  await client.execute({
    sql: `INSERT INTO results (name, class, score, total_tasks, timestamp) VALUES (?, ?, ?, ?, ?)`,
    args: [result.name, result.class, result.score, result.totalTasks, result.timestamp],
  });
}

export async function getAllResults(): Promise<GameResult[]> {
  const result = await client.execute(`
    SELECT name, class, score, total_tasks as totalTasks, timestamp
    FROM results
    ORDER BY timestamp DESC
  `);
  return result.rows as unknown as GameResult[];
}
