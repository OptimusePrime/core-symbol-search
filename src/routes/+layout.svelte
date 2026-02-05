<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <title>Pretraživanje Simbola</title>
</svelte:head>

<main class="min-h-screen flex items-center justify-center p-4">
  {@render children()}
</main>
