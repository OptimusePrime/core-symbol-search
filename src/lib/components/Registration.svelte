<script lang="ts">
  interface Props {
    onSubmit: (
      name: string,
      className: string,
      measurementNumber: 1 | 2 | 3 | 4,
      group: "A" | "B",
    ) => void;
  }

  let { onSubmit }: Props = $props();

  let name = $state("");
  let className = $state("");
  let measurementNumber = $state<1 | 2 | 3 | 4>(1);
  let group = $state<"A" | "B">("A");

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (name.trim() && className.trim()) {
      onSubmit(name.trim(), className.trim(), measurementNumber, group);
    }
  }
</script>

<div class="card w-full max-w-md mx-auto">
  <h1
    class="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
  >
    Pretraživanje Simbola
  </h1>
  <p class="text-center text-[var(--color-text-muted)] mb-6">
    Test vizualne percepcije
  </p>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium mb-2"
        >Ime i prezime</label
      >
      <input
        type="text"
        id="name"
        bind:value={name}
        class="input-field"
        placeholder="Unesite svoje puno ime"
        required
      />
    </div>

    <div>
      <label for="className" class="block text-sm font-medium mb-2"
        >Razred</label
      >
      <input
        type="text"
        id="className"
        bind:value={className}
        class="input-field"
        placeholder="npr. 4.a"
        required
      />
    </div>

    <div>
      <label for="measurementNumber" class="block text-sm font-medium mb-2"
        >Broj mjerenja</label
      >
      <select
        id="measurementNumber"
        bind:value={measurementNumber}
        class="input-field"
      >
        <option value={1}>Probno mjerenje</option>
        <option value={2}>1. mjerenje</option>
        <option value={3}>2. mjerenje</option>
        <option value={4}>3. mjerenje</option>
      </select>
    </div>

    <div>
      <label for="group" class="block text-sm font-medium mb-2">Skupina</label>
      <select id="group" bind:value={group} class="input-field">
        <option value="A">A – Visoki glikemijski indeks</option>
        <option value="B">B – Niski glikemijski indeks</option>
      </select>
    </div>

    <button
      type="submit"
      class="btn-primary w-full"
      disabled={!name.trim() || !className.trim()}
    >
      Nastavi na upute
    </button>
  </form>
</div>
