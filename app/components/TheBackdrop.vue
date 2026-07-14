<script setup lang="ts">
// Purely decorative. Fixed behind all content; no interactivity.
// The suits are now glowing outlines rather than near-invisible fills.
const suits = [
  { glyph: '♠', top: '8%', left: '5%', size: '15rem', stroke: 'rgba(0,214,255,0.09)', delay: '0s' },
  { glyph: '♥', top: '54%', left: '86%', size: '15rem', stroke: 'rgba(255,27,166,0.09)', delay: '-4s' },
  { glyph: '♦', top: '80%', left: '10%', size: '11rem', stroke: 'rgba(255,185,46,0.07)', delay: '-8s' },
  { glyph: '♣', top: '26%', left: '74%', size: '12rem', stroke: 'rgba(124,60,255,0.10)', delay: '-11s' }
]
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- the room: magenta from the door, cyan from the far wall, violet haze underfoot -->
    <div
      class="absolute inset-0"
      style="background:
        radial-gradient(58% 42% at 14% -4%, rgba(255,27,166,0.30), transparent 60%),
        radial-gradient(52% 46% at 92% 34%, rgba(0,214,255,0.20), transparent 62%),
        radial-gradient(70% 50% at 50% 104%, rgba(124,60,255,0.20), transparent 65%);"
    />

    <!-- a slow rotating floor light -->
    <div class="sweep" />

    <span
      v-for="s in suits"
      :key="s.glyph"
      class="suit"
      :style="{
        top: s.top,
        left: s.left,
        fontSize: s.size,
        '-webkit-text-stroke-color': s.stroke,
        animationDelay: s.delay
      }"
    >{{ s.glyph }}</span>

    <!-- vignette, to seat everything in the dark -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(130% 115% at 50% 36%, transparent 48%, rgba(0,0,0,0.72) 100%);"
    />
  </div>
</template>

<style scoped>
.sweep {
  position: absolute;
  top: -40%;
  left: 50%;
  width: 140vw;
  height: 140vw;
  margin-left: -70vw;
  background: conic-gradient(
    from 0deg,
    transparent 0 78%,
    rgba(0, 214, 255, 0.055) 84%,
    transparent 90% 100%
  );
  animation: spin 44s linear infinite;
}

.suit {
  position: absolute;
  line-height: 1;
  font-weight: 800;
  user-select: none;
  color: transparent;
  -webkit-text-stroke-width: 2px;
  animation: drift 14s ease-in-out infinite;
}
</style>
