<script lang="ts">
  import type { Task } from "$lib/types";
  import SymbolDisplay from "./SymbolDisplay.svelte";

  interface Props {
    tasks: Task[];
    onComplete: (score: number, total: number) => void;
  }

  let { tasks, onComplete }: Props = $props();

  let currentTaskIndex = $state(0);
  let score = $state(0);
  let timeLeft = $state(60);
  let isRunning = $state(true);

  const currentTask = $derived(tasks[currentTaskIndex]);
  const timerClass = $derived(
    timeLeft <= 10 ? "critical" : timeLeft <= 20 ? "warning" : "",
  );

  // Timer
  $effect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        isRunning = false;
        onComplete(score, currentTaskIndex);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  function isCorrectAnswer(optionIndex: number): boolean {
    const option = currentTask.options[optionIndex];

    if (option.symbol === null) {
      // NEMA is correct if no objective appears in options
      const anyObjectiveInOptions = currentTask.objectives.some((obj) =>
        currentTask.options.some(
          (opt) =>
            opt.symbol === obj.symbol && opt.rotationDeg === obj.rotationDeg,
        ),
      );
      return !anyObjectiveInOptions;
    }

    // Check if option matches any objective
    return currentTask.objectives.some(
      (obj) =>
        obj.symbol === option.symbol && obj.rotationDeg === option.rotationDeg,
    );
  }

  function handleSelect(index: number) {
    if (!isRunning) return;

    if (isCorrectAnswer(index)) {
      score++;
    }

    // Move to next task
    if (currentTaskIndex < tasks.length - 1) {
      currentTaskIndex++;
    } else {
      // All tasks completed
      isRunning = false;
      onComplete(score, tasks.length);
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <!-- Header with timer and progress -->
  <div class="flex justify-between items-center mb-6">
    <div class="text-[var(--color-text-muted)]">
      Zadatak: <span class="text-white font-semibold"
        >{currentTaskIndex + 1}</span
      >
      <span class="text-sm">/ {tasks.length}</span>
    </div>
    <div class="timer {timerClass}">
      {formatTime(timeLeft)}
    </div>
    <div class="text-[var(--color-text-muted)]">
      Bodovi: <span class="text-[var(--color-success)] font-semibold"
        >{score}</span
      >
    </div>
  </div>

  <div class="card">
    <!-- Objectives -->
    <div class="mb-6">
      <p
        class="text-sm font-medium text-[var(--color-text-muted)] mb-2 text-center"
      >
        Pronađite:
      </p>
      <div class="flex justify-center gap-4">
        {#each currentTask.objectives as objective}
          <div class="bg-[var(--color-bg)] rounded-xl p-4">
            <SymbolDisplay
              symbol={objective.symbol}
              rotationDeg={objective.rotationDeg}
              size="lg"
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Options -->
    <div class="grid grid-cols-3 gap-3">
      {#each currentTask.options as option, index}
        <button class="option-btn" onclick={() => handleSelect(index)}>
          <SymbolDisplay
            symbol={option.symbol}
            rotationDeg={option.rotationDeg}
          />
        </button>
      {/each}
    </div>
  </div>

  <!-- Quick tip -->
  <p class="text-center text-sm text-[var(--color-text-muted)] mt-4">
    Kliknite simbol iz cilja ili "NEMA" ako nije prisutan
  </p>
</div>
