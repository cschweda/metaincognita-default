<script setup lang="ts">
/**
 * The LED marquee — the threshold between the hero and the floor.
 * It carries the thesis, never a house-edge number we cannot source.
 */
const LINES = [
  'The house always wins',
  'Every edge is published',
  'No real money',
  'No accounts',
  'No AI',
  'Read the source',
  'The math is the point',
  "Nothing here is rigged — it doesn’t need to be"
]

// Two copies, so translateX(-50%) wraps with no seam.
const tape = [...LINES, ...LINES]

const paused = ref(false)
</script>

<template>
  <div class="ticker" :class="{ paused }">
    <div class="rail">
      <div class="tape" aria-hidden="true">
        <span v-for="(line, i) in tape" :key="i" class="item">
          <span class="dia">◆</span>{{ line }}
        </span>
      </div>
    </div>
    <button
      class="pause"
      :aria-label="paused ? 'Resume the scrolling ticker' : 'Pause the scrolling ticker'"
      @click="paused = !paused"
    >
      <UIcon :name="paused ? 'i-lucide-play' : 'i-lucide-pause'" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.ticker {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, var(--color-gold-400) 35%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-gold-400) 35%, transparent);
  background: linear-gradient(180deg, #0a0710, #05040a);
  box-shadow: inset 0 0 40px rgba(255, 140, 0, 0.14);
}

.rail { flex: 1; overflow: hidden; }

.tape {
  display: inline-block;
  white-space: nowrap;
  padding: 0.62rem 0;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-300);
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.9);
  animation: tape 40s linear infinite;
}
.ticker.paused .tape { animation-play-state: paused; }

.dia { margin: 0 1.1rem; color: var(--color-magenta-300); }

.pause {
  flex: none;
  width: 2.4rem;
  cursor: pointer;
  border: 0;
  border-left: 1px solid color-mix(in srgb, var(--color-gold-400) 30%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 8%, transparent);
  color: var(--color-gold-300);
  font-size: 0.75rem;
}
.pause:hover { background: color-mix(in srgb, var(--color-gold-400) 18%, transparent); }
.pause:focus-visible { outline: 2px solid var(--color-gold-300); outline-offset: -2px; }
</style>
