<script setup lang="ts">
// Fixed bottom status bar: signals these are open-source projects, links the
// GitHub account they all live under, and hosts the floor-audio switch.
</script>

<template>
  <aside class="status-bar">
    <div class="mx-auto flex h-12 max-w-[1180px] items-center justify-between gap-3 px-5 sm:px-6">
      <div class="flex items-center gap-2.5">
        <span class="live-dot" aria-hidden="true" />
        <span class="label">Open source</span>
      </div>

      <a
        class="repo"
        aria-label="GitHub"
        href="https://github.com/cschweda?tab=repositories&q=metaincognita&type=&language=&sort="
        target="_blank"
        rel="noopener noreferrer"
      >
        <UIcon name="i-lucide-github" class="text-[0.95em]" aria-hidden="true" />
        <span class="hidden sm:inline">GitHub</span>
      </a>

      <SoundSwitch />
    </div>
  </aside>
</template>

<style scoped>
.status-bar {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 40;
  border-top: 1px solid color-mix(in srgb, var(--color-cyan-400) 22%, transparent);
  background: color-mix(in srgb, var(--color-ink-950) 86%, transparent);
  backdrop-filter: blur(10px) saturate(140%);
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-bone-500);
}

.label { color: var(--color-bone-300); }

.live-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #2fe58f;
  /* static glow — a shadow that never animates costs nothing per frame */
  box-shadow: 0 0 10px #2fe58f;
}

/* the pulse is an expanding ring on a pseudo-element: transform + opacity only.
   Animating the dot's own box-shadow spread would repaint it every frame, forever. */
.live-dot::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #2fe58f;
  opacity: 0;
  animation: livepulse 2.6s ease-out infinite;
}

.repo {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-bone-300);
  transition: color 0.3s ease;
}
.repo:hover { color: var(--color-gold-300); }
.repo:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
  border-radius: 4px;
}
</style>
