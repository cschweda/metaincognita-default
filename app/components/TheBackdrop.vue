<script setup lang="ts">
// Purely decorative. Fixed behind all content; no interactivity.
// Graph paper, not card suits: the collection is a workshop now, and the casino is
// one room in it. Drafting crosshairs mark a few intersections, like a layout sheet.
const marks = [
  { top: '12%', left: '8%' },
  { top: '30%', left: '88%' },
  { top: '68%', left: '6%' },
  { top: '84%', left: '80%' }
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

    <!-- the graph paper: fine squares, a heavier rule every fifth line -->
    <div class="paper" />

    <span
      v-for="(m, i) in marks"
      :key="i"
      class="cross"
      :style="{ top: m.top, left: m.left }"
    />

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

.paper {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 214, 255, 0.085) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 214, 255, 0.085) 1px, transparent 1px),
    linear-gradient(rgba(0, 214, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 214, 255, 0.035) 1px, transparent 1px);
  background-size: 120px 120px, 120px 120px, 24px 24px, 24px 24px;
  background-position: -1px -1px;
  /* strongest across the middle of the sheet, falling away toward the edges */
  mask-image: radial-gradient(120% 90% at 50% 40%, #000 30%, transparent 85%);
}

/* a drafting crosshair: two hairlines and a ring, centred on its point */
.cross {
  position: absolute;
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  border-radius: 999px;
  border: 1px solid rgba(0, 214, 255, 0.14);
  background:
    linear-gradient(rgba(0, 214, 255, 0.2), rgba(0, 214, 255, 0.2)) center / 1px 100% no-repeat,
    linear-gradient(rgba(0, 214, 255, 0.2), rgba(0, 214, 255, 0.2)) center / 100% 1px no-repeat;
}
</style>
