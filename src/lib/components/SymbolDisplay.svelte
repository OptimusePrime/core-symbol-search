<script lang="ts">
  interface Props {
    symbol: string | null;
    rotationDeg: string | null;
    size?: "sm" | "md" | "lg";
  }

  let { symbol, rotationDeg, size = "md" }: Props = $props();

  const sizeClasses = {
    sm: "text-2xl w-12 h-12",
    md: "text-4xl w-16 h-16",
    lg: "text-5xl w-20 h-20",
  };
</script>

{#if symbol}
  <span
    class="symbol-display {sizeClasses[size]}"
    style="transform: rotate({rotationDeg ?? 0}deg)"
  >
    {symbol}
  </span>
{:else}
  <span
    class="symbol-display {sizeClasses[size]} text-[var(--color-text-muted)]"
  >
    NEMA
  </span>
{/if}
