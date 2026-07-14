<script setup lang="ts">
const { enabled, playing, toggle } = useFloorAudio()
</script>

<template>
  <button class="snd" :class="{ live: playing }" :aria-pressed="enabled" @click="toggle">
    <span class="eq" aria-hidden="true"><i /><i /><i /><i /></span>
    <span>Floor audio · {{ enabled ? 'on' : 'off' }}</span>
  </button>
</template>

<style scoped>
.snd {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.34rem 0.8rem;
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: 1px solid color-mix(in srgb, var(--color-gold-400) 50%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 10%, transparent);
  color: var(--color-gold-200);
  box-shadow: 0 0 16px rgba(255, 185, 46, 0.28);
  transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.snd[aria-pressed="false"] {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-bone-500);
  box-shadow: none;
}
.snd:hover { border-color: var(--color-gold-400); color: #fff; }
.snd:focus-visible {
  outline: 2px solid var(--color-gold-300);
  outline-offset: 2px;
}

.eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
.eq i {
  width: 2px;
  /* full height, scaled down — scaleY is composited; animating `height` is not */
  height: 100%;
  transform: scaleY(0.25);
  transform-origin: bottom;
  background: currentColor;
  border-radius: 1px;
  /* no animation by default — silence must look silent, and `enabled` (the
     preference) can be true while `playing` (reality) is false */
}
.snd.live .eq i { animation: eq 0.9s ease-in-out infinite; }
.snd.live .eq i:nth-child(2) { animation-delay: 0.15s; }
.snd.live .eq i:nth-child(3) { animation-delay: 0.3s; }
.snd.live .eq i:nth-child(4) { animation-delay: 0.45s; }
</style>
