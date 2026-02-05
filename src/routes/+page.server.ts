import type { PageServerLoad } from "./$types";
import { tasks } from "$lib/tasks";

export const load: PageServerLoad = async () => {
  return { tasks };
};
