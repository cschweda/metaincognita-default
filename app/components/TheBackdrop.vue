<script setup lang="ts">
// Purely decorative. Fixed behind all content; no interactivity.
const suits = [
  { glyph: '♠', top: '12%', left: '8%', size: '15rem', delay: '0s', dur: '13s' },
  { glyph: '♥', top: '58%', left: '84%', size: '12rem', delay: '-3s', dur: '15s' },
  { glyph: '♦', top: '78%', left: '14%', size: '10rem', delay: '-6s', dur: '12s' },
  { glyph: '♣', top: '26%', left: '72%', size: '13rem', delay: '-9s', dur: '16s' }
]
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <!-- gold glow from above -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(120% 78% at 50% -12%, rgba(212,175,55,0.12), transparent 58%);"
    />
    <!-- felt-green pooled at the foot of the page -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(85% 55% at 50% 118%, rgba(31,143,99,0.08), transparent 60%);"
    />
    <!-- drifting suit glyphs -->
    <span
      v-for="s in suits"
      :key="s.glyph"
      class="font-display drift absolute select-none leading-none text-bone-100/[0.022]"
      :style="{
        top: s.top,
        left: s.left,
        fontSize: s.size,
        animation: `drift ${s.dur} ease-in-out ${s.delay} infinite`
      }"
    >{{ s.glyph }}</span>
    <!-- vignette to seat everything in the dark -->
    <div
      class="absolute inset-0"
      style="background: radial-gradient(130% 120% at 50% 38%, transparent 52%, rgba(0,0,0,0.62) 100%);"
    />
  </div>
</template>
