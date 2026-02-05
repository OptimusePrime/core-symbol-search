<script lang="ts">
  interface Props {
    score: number;
    total: number;
    name: string;
    isSaving: boolean;
    saveError: string | null;
  }

  let { score, total, name, isSaving, saveError }: Props = $props();

  const percentage = $derived(
    total > 0 ? Math.round((score / total) * 100) : 0,
  );
</script>

<div class="card w-full max-w-md mx-auto text-center">
  <div class="mb-6">
    <div
      class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
    >
      <span class="text-4xl font-bold">{score}</span>
    </div>
    <h2 class="text-2xl font-bold mb-2">Završeno!</h2>
    <p class="text-[var(--color-text-muted)]">
      {name}, riješili ste {score} od {total} zadataka ({percentage}%)
    </p>
  </div>

  {#if isSaving}
    <div
      class="flex items-center justify-center gap-2 text-[var(--color-text-muted)]"
    >
      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Spremanje rezultata...</span>
    </div>
  {:else if saveError}
    <div
      class="bg-red-900/30 border border-[var(--color-error)] rounded-xl p-4"
    >
      <p class="text-[var(--color-error)]">Greška pri spremanju: {saveError}</p>
    </div>
  {:else}
    <div
      class="bg-green-900/30 border border-[var(--color-success)] rounded-xl p-4"
    >
      <p class="text-[var(--color-success)]">✓ Rezultat uspješno spremljen!</p>
    </div>
  {/if}

  <p class="mt-6 text-sm text-[var(--color-text-muted)]">
    Možete zatvoriti ovu stranicu.
  </p>
</div>
