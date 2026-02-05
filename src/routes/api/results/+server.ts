import type { RequestHandler } from "./$types";
import { saveResult } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { GameResult } from "$lib/types";

export const POST: RequestHandler = async ({ request }) => {
  const result: GameResult = await request.json();
  
  try {
    saveResult(result);
    return json({ success: true });
  } catch (error) {
    console.error("Error saving result:", error);
    return json({ success: false, error: "Failed to save result" }, { status: 500 });
  }
};
