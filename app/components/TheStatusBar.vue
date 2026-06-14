<script setup lang="ts">
// Fixed bottom status bar: signals these are open-source projects and links the
// GitHub account they all live under.
</script>

<template>
  <aside class="status-bar">
    <div class="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
      <div class="flex items-center gap-2.5">
        <span class="live-dot" aria-hidden="true" />
        <span class="label">Open source</span>
      </div>

      <a
        class="repo"
        href="https://github.com/cschweda?tab=repositories&q=metaincognita&type=&language=&sort="
        target="_blank"
        rel="noopener noreferrer"
      >
        <UIcon name="i-lucide-github" class="text-[0.95em]" />
        github.com/cschweda
      </a>

      <span class="meta hidden sm:inline">MIT · free to use · fork · self-host</span>
    </div>
  </aside>
</template>

<style scoped>
.status-bar {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 40;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  background: color-mix(in srgb, var(--color-ink-950) 76%, transparent);
  backdrop-filter: blur(10px) saturate(140%);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--color-bone-500);
}

.label {
  color: var(--color-bone-300);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #33b07a;
  box-shadow: 0 0 0 0 rgba(51, 176, 122, 0.5);
  animation: livepulse 2.6s ease-out infinite;
}

@keyframes livepulse {
  0% { box-shadow: 0 0 0 0 rgba(51, 176, 122, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(51, 176, 122, 0); }
  100% { box-shadow: 0 0 0 0 rgba(51, 176, 122, 0); }
}

.repo {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-bone-300);
  transition: color 0.3s ease;
}
.repo:hover {
  color: var(--color-gold-200);
}

@media (prefers-reduced-motion: reduce) {
  .live-dot { animation: none; }
}
</style>
