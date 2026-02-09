import { createClient } from "@libsql/client";
import type { GameResult } from "$lib/types";
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Initialize tables (runs once on import)
await client.execute(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    measurement_number INTEGER NOT NULL DEFAULT 1,
    group_code TEXT NOT NULL DEFAULT 'A',
    score INTEGER NOT NULL,
    total_tasks INTEGER NOT NULL,
    timestamp TEXT NOT NULL
  )
`);

await client.execute(`
  CREATE TABLE IF NOT EXISTS vas_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY (result_id) REFERENCES results(id)
  )
`);

export async function saveResult(result: GameResult): Promise<void> {
  // Insert the main result
  const res = await client.execute({
    sql: `INSERT INTO results (name, class, measurement_number, group_code, score, total_tasks, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      result.name,
      result.class,
      result.measurementNumber,
      result.group,
      result.score,
      result.totalTasks,
      result.timestamp,
    ],
  });

  const resultId = Number(res.lastInsertRowid);

  // Insert VAS responses
  for (const vas of result.vasResponses) {
    await client.execute({
      sql: `INSERT INTO vas_responses (result_id, question_id, value) VALUES (?, ?, ?)`,
      args: [resultId, vas.questionId, vas.value],
    });
  }
}

export async function getAllResults(): Promise<GameResult[]> {
  const result = await client.execute(`
    SELECT id, name, class, measurement_number as measurementNumber, group_code as "group", score, total_tasks as totalTasks, timestamp
    FROM results
    ORDER BY timestamp DESC
  `);

  const results: GameResult[] = [];

  for (const row of result.rows) {
    const vasResult = await client.execute({
      sql: `SELECT question_id as questionId, value FROM vas_responses WHERE result_id = ?`,
      args: [row.id as number],
    });

    results.push({
      name: row.name as string,
      class: row.class as string,
      measurementNumber: row.measurementNumber as 1 | 2 | 3,
      group: row.group as "A" | "B",
      score: row.score as number,
      totalTasks: row.totalTasks as number,
      vasResponses: vasResult.rows.map((v) => ({
        questionId: v.questionId as string,
        value: v.value as number,
      })),
      timestamp: row.timestamp as string,
    });
  }

  return results;
}
