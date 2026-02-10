<script lang="ts">
  import type { Task } from "$lib/types";
  import SymbolDisplay from "./SymbolDisplay.svelte";

  interface Props {
    practiceTasks: Task[];
    onComplete: () => void;
  }

  let { practiceTasks, onComplete }: Props = $props();

  let currentPractice = $state(0);
  let selectedOption = $state<number | null>(null);
  let showFeedback = $state(false);
  let isCorrect = $state(false);
  let practiceComplete = $state(false);

  const currentTask = $derived(practiceTasks[currentPractice]);

  function getCorrectOptions(): number[] {
    const correct: number[] = [];
    currentTask.options.forEach((option, index) => {
      if (option.symbol === null) {
        // Check if any objective is NOT in options
        const anyObjectiveInOptions = currentTask.objectives.some((obj) =>
          currentTask.options.some(
            (opt) =>
              opt.symbol === obj.symbol && opt.rotationDeg === obj.rotationDeg,
          ),
        );
        if (!anyObjectiveInOptions) {
          correct.push(index);
        }
      } else {
        // Check if this option matches any objective
        const matchesObjective = currentTask.objectives.some(
          (obj) =>
            obj.symbol === option.symbol &&
            obj.rotationDeg === option.rotationDeg,
        );
        if (matchesObjective) {
          correct.push(index);
        }
      }
    });
    return correct;
  }

  function handleSelect(index: number) {
    if (showFeedback) return;

    selectedOption = index;
    const correctOptions = getCorrectOptions();
    isCorrect = correctOptions.includes(index);
    showFeedback = true;
  }

  function handleNext() {
    if (currentPractice < practiceTasks.length - 1) {
      currentPractice++;
      selectedOption = null;
      showFeedback = false;
    } else {
      practiceComplete = true;
    }
  }
</script>

<div class="card w-full max-w-2xl mx-auto">
  {#if !practiceComplete}
    <h2 class="text-2xl font-bold text-center mb-4">Upute</h2>

    <div class="bg-[var(--color-bg)] rounded-xl p-4 mb-6 text-sm">
      <p class="mb-3">
        <strong>Cilj:</strong> Pronađite simbol iz cilja među ponuđenim opcijama.
      </p>
      <ul
        class="list-disc list-inside space-y-2 text-[var(--color-text-muted)]"
      >
        <li>
          Gornji dio prikazuje <strong>ciljne simbole</strong> koje tražite
        </li>
        <li>Donji dio prikazuje <strong>opcije</strong> za odabir</li>
        <li>Kliknite na opciju koja odgovara bilo kojem ciljnom simbolu</li>
        <li>
          Ako nijedan cilj nije prisutan u opcijama, kliknite <strong
            >"NEMA"</strong
          >
        </li>
      </ul>
    </div>

    <div class="text-center mb-4">
      <span class="text-sm text-[var(--color-text-muted)]">
        Vježba {currentPractice + 1} od {practiceTasks.length}
      </span>
    </div>

    <!-- Objectives -->
    <div class="mb-6">
      <p
        class="text-sm font-medium text-[var(--color-text-muted)] mb-2 text-center"
      >
        Ciljevi (pronađite jedan od ovih):
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
    <div class="mb-6">
      <p
        class="text-sm font-medium text-[var(--color-text-muted)] mb-2 text-center"
      >
        Opcije:
      </p>
      <div class="grid grid-cols-3 gap-3">
        {#each currentTask.options as option, index}
          <button
            class="option-btn {selectedOption === index
              ? isCorrect
                ? 'correct'
                : 'incorrect'
              : ''}"
            onclick={() => handleSelect(index)}
            disabled={showFeedback}
          >
            <SymbolDisplay
              symbol={option.symbol}
              rotationDeg={option.rotationDeg}
            />
          </button>
        {/each}
      </div>
    </div>

    <!-- Feedback -->
    {#if showFeedback}
      <div class="text-center mb-4">
        {#if isCorrect}
          <p class="text-[var(--color-success)] font-semibold text-lg">
            ✓ Točno!
          </p>
        {:else}
          <p class="text-[var(--color-error)] font-semibold text-lg">
            ✗ Netočno
          </p>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">
            Označeni simboli su točni odgovori.
          </p>
        {/if}
      </div>

      <button class="btn-primary w-full" onclick={handleNext}>
        {currentPractice < practiceTasks.length - 1
          ? "Sljedeća vježba"
          : "Završi vježbu"}
      </button>
    {/if}
  {:else}
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">Spreman za test!</h2>
      <p class="text-[var(--color-text-muted)] mb-6">
        Imate <strong class="text-white">60 sekundi</strong> da riješite što
        više zadataka.
        <br />
        Svaki točan odgovor donosi bod.
      </p>
      <button class="btn-primary" onclick={onComplete}> Započni test </button>
    </div>
  {/if}
</div>
