<script setup lang="ts">
import type { CatalogItem } from '~/data/catalog'

const props = defineProps<{
  item: CatalogItem
  index: number
}>()

const num = computed(() => String(props.index + 1).padStart(2, '0'))
const href = computed(() => `https://${props.item.domain}`)

// Cursor-following glow. Skipped for users who prefer reduced motion.
let allowSpotlight = true
onMounted(() => {
  allowSpotlight = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
function onMove(e: MouseEvent) {
  if (!allowSpotlight) return
  const el = e.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :style="{ '--accent': item.accent }"
    :aria-label="`${item.title} — opens ${item.domain} in a new tab`"
    class="card group"
    @mousemove="onMove"
  >
    <span class="spotlight" aria-hidden="true" />

    <div class="flex items-start justify-between">
      <span class="icon-tile">
        <UIcon :name="`i-lucide-${item.icon}`" />
      </span>
      <span class="index">{{ num }}</span>
    </div>

    <div class="mt-6 flex-1">
      <h3 class="font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-bone-100">
        {{ item.title }}
      </h3>
      <p class="mt-2.5 text-[0.94rem] leading-relaxed text-bone-300">
        {{ item.description }}
      </p>
    </div>

    <div class="domain">
      <span class="truncate">{{ item.domain }}</span>
      <UIcon name="i-lucide-arrow-up-right" class="arrow shrink-0" />
    </div>
  </a>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 16rem;
  padding: 1.6rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 42%),
    var(--color-ink-850);
  overflow: hidden;
  isolation: isolate;
  transition:
    transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.45s ease,
    box-shadow 0.45s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--accent) 42%, transparent);
  box-shadow:
    inset 0 1px 0 0 color-mix(in srgb, var(--accent) 28%, transparent),
    0 26px 60px -30px color-mix(in srgb, var(--accent) 65%, transparent);
}

.card:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 75%, transparent);
  outline-offset: 3px;
}

.spotlight {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
  background: radial-gradient(
    300px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--accent) 22%, transparent),
    transparent 60%
  );
}
.card:hover .spotlight { opacity: 1; }

.icon-tile {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  font-size: 1.45rem;
  border-radius: 0.8rem;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 13%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 24%, transparent);
  transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.45s ease;
}
.card:hover .icon-tile {
  transform: scale(1.06) rotate(-4deg);
  background: color-mix(in srgb, var(--accent) 20%, transparent);
}

.index {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.18em;
  color: var(--color-bone-500);
}

.domain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.02em;
  color: var(--color-bone-500);
  transition: color 0.4s ease;
}
.card:hover .domain { color: color-mix(in srgb, var(--accent) 60%, var(--color-bone-300)); }

.arrow {
  font-size: 0.95rem;
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.card:hover .arrow { transform: translate(3px, -3px); }
</style>
