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
  gap: 10px;
  min-height: 44px;
  padding: 0 14px;
  cursor: pointer;
  border: 1px solid var(--color-rule);
  background: transparent;
  font: inherit;
  font-size: 15px;
  color: var(--color-mute);
}
.snd[aria-pressed="true"] { color: var(--color-paper); border-color: var(--color-paper); }
.snd:hover { color: var(--color-paper); border-color: var(--color-paper); }

.eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
.eq i {
  width: 2px;
  /* full height, scaled down — scaleY is composited; animating `height` is not */
  height: 100%;
  transform: scaleY(0.25);
  transform-origin: bottom;
  background: currentColor;
  /* silence must look silent: `enabled` (the preference) can be true while
     `playing` (reality) is false, so only `playing` animates */
}
.snd.live .eq i { animation: eq 0.9s ease-in-out infinite; }
.snd.live .eq i:nth-child(2) { animation-delay: 0.15s; }
.snd.live .eq i:nth-child(3) { animation-delay: 0.3s; }
.snd.live .eq i:nth-child(4) { animation-delay: 0.45s; }
</style>
