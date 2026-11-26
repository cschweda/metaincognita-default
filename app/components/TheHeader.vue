<script setup lang="ts">
import { zones } from '~/data/catalog'

// The top bar: the wordmark and the six rooms, numbered in floor order. On a wide
// screen the rooms sit in a row; below 1200px they fold into a menu behind a button.
const links = zones.map((z, i) => ({ id: z.id, label: z.nav, n: String(i + 1).padStart(2, '0') }))

const open = ref(false)
const button = ref<HTMLButtonElement | null>(null)

function close(returnFocus = false) {
  open.value = false
  if (returnFocus) button.value?.focus()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close(true)
}

// Widening past the breakpoint shows the row again, so the folded menu must not
// stay open behind it.
let wide: MediaQueryList | undefined
function onWide(e: MediaQueryListEvent) {
  if (e.matches) close()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  wide = window.matchMedia('(min-width: 1200px)')
  wide.addEventListener('change', onWide)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  wide?.removeEventListener('change', onWide)
})
</script>

<template>
  <header class="site-header">
    <div class="wrap bar">
      <a href="#top" class="wm">metaincognita</a>

      <nav class="row" aria-label="Sections">
        <ul>
          <li v-for="l in links" :key="l.id">
            <a :href="`#${l.id}`"><span class="n">{{ l.n }}</span> {{ l.label }}</a>
          </li>
        </ul>
      </nav>

      <button
        ref="button"
        type="button"
        class="menu-btn"
        :aria-expanded="open"
        aria-controls="site-menu"
        @click="open = !open"
      >
        <UIcon :name="open ? 'i-lucide-x' : 'i-lucide-menu'" class="text-[1.25rem]" aria-hidden="true" />
        <span>Menu</span>
      </button>
    </div>

    <nav v-show="open" id="site-menu" class="panel" aria-label="Sections">
      <ul class="wrap">
        <li v-for="l in links" :key="l.id">
          <a :href="`#${l.id}`" @click="close()"><span class="n">{{ l.n }}</span> {{ l.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--color-ink);
  border-bottom: 1px solid var(--color-rule);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 72px;
}

.wm {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-paper);
  padding: 12px 0;
}

.n { color: var(--color-mute); font-variant-numeric: tabular-nums; }

/* the row: wide screens only */
.row { display: none; }
.row ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0 26px;
  font-size: 15px;
}
.row a {
  display: inline-block;
  padding: 12px 0;
  color: var(--color-paper);
}
.row a:hover { text-decoration: underline; text-underline-offset: 4px; }

/* the button: narrow screens only */
.menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--color-rule);
  background: transparent;
  color: var(--color-paper);
  font: inherit;
  font-size: 15px;
  cursor: pointer;
}
.menu-btn:hover { border-color: var(--color-paper); }

.panel {
  border-top: 1px solid var(--color-rule);
  background: var(--color-ink);
}
.panel ul { padding-block: 8px 24px; }
.panel li + li { border-top: 1px solid var(--color-rule); }
.panel a {
  display: block;
  padding: 14px 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-paper);
}
.panel a:hover { text-decoration: underline; text-underline-offset: 5px; }

@media (min-width: 1200px) {
  .row { display: block; }
  .menu-btn { display: none; }
  /* the row is showing; a menu left open must not linger under it */
  .panel { display: none !important; }
}
</style>
