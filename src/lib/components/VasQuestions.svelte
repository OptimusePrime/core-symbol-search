<script lang="ts">
  import type { VasResponse } from "$lib/types";

  interface Props {
    onComplete: (responses: VasResponse[]) => void;
  }

  let { onComplete }: Props = $props();

  const questions = [
    {
      id: "hunger",
      question: "Koliko ste gladni upravo sada?",
      leftAnchor: "Uopće nisam gladan",
      rightAnchor: "Nikad nisam bio gladniji",
    },
    {
      id: "fullness",
      question: "Koliko se osjećate sitima/punima?",
      leftAnchor: "Uopće se ne osjećam sito",
      rightAnchor: "Potpuno sam sit(a)",
    },
    {
      id: "satiety",
      question: "Koliko se osjećate zadovoljeno?",
      leftAnchor: "Uopće nisam zadovoljen(a)",
      rightAnchor: "Potpuno sam zadovoljen(a)",
    },
    {
      id: "desire_to_eat",
      question: "Kolika je Vaša želja za jelom?",
      leftAnchor: "Vrlo slaba",
      rightAnchor: "Vrlo jaka",
    },
    {
      id: "prospective_consumption",
      question: "Što mislite, koliko biste hrane mogli pojesti upravo sada?",
      leftAnchor: "Ništa",
      rightAnchor: "Veliku količinu",
    },
  ];

  let currentIndex = $state(0);
  let values = $state<(number | null)[]>(questions.map(() => null));
  let touched = $state<boolean[]>(questions.map(() => false));

  const currentQuestion = $derived(questions[currentIndex]);
  const currentValue = $derived(values[currentIndex] ?? 50);
  const canContinue = $derived(touched[currentIndex]);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    values[currentIndex] = parseInt(target.value, 10);
    touched[currentIndex] = true;
  }

  function handleNext() {
    if (!canContinue) return;

    if (currentIndex < questions.length - 1) {
      currentIndex++;
    } else {
      const responses: VasResponse[] = questions.map((q, i) => ({
        questionId: q.id,
        value: values[i] ?? 0,
      }));
      onComplete(responses);
    }
  }
</script>

<div class="card w-full max-w-2xl mx-auto">
  <!-- Progress indicator -->
  <div class="flex justify-end items-center mb-6">
    <span
      class="text-sm font-medium text-[var(--color-text-muted)] tabular-nums"
    >
      {currentIndex + 1} / {questions.length}
    </span>
  </div>

  <!-- Question -->
  <h2 class="text-xl font-bold mb-1">{currentQuestion.question}</h2>
  <p class="text-sm text-[var(--color-text-muted)] mb-6">
    Povucite klizač na skali.
  </p>

  <!-- Slider -->
  <div class="mb-2">
    <div class="relative flex items-center gap-3">
      <div
        class="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-success)] text-white shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
          />
        </svg>
      </div>
      <div class="relative flex-1">
        <!-- Track background -->
        <div
          class="absolute inset-0 h-3 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-surface-light)]"
        ></div>
        <!-- Filled portion -->
        <div
          class="absolute left-0 h-3 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-success)] pointer-events-none transition-all duration-75"
          style="width: {currentValue}%"
        ></div>
        <!-- Range input -->
        <input
          type="range"
          min="0"
          max="100"
          value={currentValue}
          oninput={handleInput}
          class="vas-slider relative w-full"
        />
      </div>
    </div>
  </div>

  <!-- Anchors -->
  <div
    class="flex justify-between text-sm text-[var(--color-text-muted)] mb-8 pl-13"
  >
    <span>{currentQuestion.leftAnchor}</span>
    <span class="text-right">{currentQuestion.rightAnchor}</span>
  </div>

  <!-- Continue button -->
  <div class="flex justify-end">
    <button class="btn-primary" onclick={handleNext} disabled={!canContinue}>
      {currentIndex < questions.length - 1 ? "Nastavi »" : "Nastavi na upute »"}
    </button>
  </div>
</div>

<style>
  .vas-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    border-radius: 9999px;
    background: transparent;
    outline: none;
    cursor: pointer;
  }

  .vas-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-success);
    cursor: grab;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
  }

  .vas-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-success);
    cursor: grab;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .vas-slider::-moz-range-track {
    background: transparent;
    height: 12px;
  }

  .vas-slider:active::-webkit-slider-thumb {
    cursor: grabbing;
    transform: scale(1.15);
  }

  .vas-slider:active::-moz-range-thumb {
    cursor: grabbing;
    transform: scale(1.15);
  }

  .pl-13 {
    padding-left: 3.25rem;
  }
</style>
