<script lang="ts">
  import type { PageData } from "./$types";
  import Registration from "$lib/components/Registration.svelte";
  import Instructions from "$lib/components/Instructions.svelte";
  import Game from "$lib/components/Game.svelte";
  import Results from "$lib/components/Results.svelte";

  let { data }: { data: PageData } = $props();

  type GameState = "registration" | "instructions" | "game" | "results";

  let gameState = $state<GameState>("registration");
  let userName = $state("");
  let userClass = $state("");
  let finalScore = $state(0);
  let totalTasks = $state(0);
  let isSaving = $state(false);
  let saveError = $state<string | null>(null);

  // First 2 tasks are for practice, rest are for the actual game
  const practiceTasks = $derived(data.tasks.slice(0, 2));
  const gameTasks = $derived(data.tasks.slice(2));

  function handleRegistration(name: string, className: string) {
    userName = name;
    userClass = className;
    gameState = "instructions";
  }

  function handleInstructionsComplete() {
    gameState = "game";
  }

  async function handleGameComplete(score: number, total: number) {
    finalScore = score;
    totalTasks = total;
    gameState = "results";
    isSaving = true;
    saveError = null;

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          class: userClass,
          score: score,
          totalTasks: total,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save results");
      }
    } catch (error) {
      saveError = error instanceof Error ? error.message : "Unknown error";
    } finally {
      isSaving = false;
    }
  }
</script>

{#if gameState === "registration"}
  <Registration onSubmit={handleRegistration} />
{:else if gameState === "instructions"}
  <Instructions {practiceTasks} onComplete={handleInstructionsComplete} />
{:else if gameState === "game"}
  <Game tasks={gameTasks} onComplete={handleGameComplete} />
{:else if gameState === "results"}
  <Results
    score={finalScore}
    total={totalTasks}
    name={userName}
    {isSaving}
    {saveError}
  />
{/if}
