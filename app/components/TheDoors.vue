<script setup lang="ts">
/**
 * The arrival curtain.
 *
 * Its real job is to supply the user gesture that browsers require before any
 * audio may play — "sound on by default" is not something a browser permits on
 * first load, so this is the closest honest version: the preference IS on, and
 * the floor comes alive the moment you step through.
 *
 * Its second job is that arriving through a door beats a page that merely exists.
 */
const { enabled, enter } = useFloorAudio()

const SESSION_KEY = 'mi-entered'
const open = ref(false)
const primary = ref<HTMLButtonElement | null>(null)
const quiet = ref<HTMLButtonElement | null>(null)
const dialogEl = ref<HTMLElement | null>(null)

function close(withSound: boolean) {
  window.sessionStorage.setItem(SESSION_KEY, '1')
  open.value = false
  document.removeEventListener('keydown', onKeydown)
  setBackgroundInert(false)
  enter(withSound)
}

/**
 * Two-node focus trap. `aria-modal` promises focus stays inside; keep the
 * promise. Bound on `document`, not the dialog subtree: a mouse user
 * clicking the (non-focusable) backdrop drops focus to `<body>`, and a
 * listener on the dialog `<div>` would never see the keydown again — Escape
 * would become unreachable the instant focus left the dialog.
 */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close(false)
    return
  }
  if (e.key !== 'Tab') return
  const nodes = [primary.value, quiet.value].filter(Boolean) as HTMLElement[]
  if (nodes.length < 2) return
  const first = nodes[0]!
  const last = nodes[nodes.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/**
 * Keeps `aria-modal="true"`'s promise for real: while open, every other
 * child of <body> (the live page, once mounted alongside it) is marked
 * `inert` so Tab can never wander out of the dialog.
 */
function setBackgroundInert(on: boolean) {
  for (const child of Array.from(document.body.children)) {
    if (child === dialogEl.value) continue
    if (on) child.setAttribute('inert', '')
    else child.removeAttribute('inert')
  }
}

onMounted(() => {
  // Gate once per session, not on every in-session navigation.
  if (window.sessionStorage.getItem(SESSION_KEY) === '1') return
  open.value = true
  document.addEventListener('keydown', onKeydown)
  // The dialog element must exist in the DOM before we can exclude it from
  // inertness, so wait for the v-if render to land.
  nextTick(() => {
    primary.value?.focus()
    setBackgroundInert(true)
  })
})

onBeforeUnmount(() => {
  // A leaked `inert` attribute (or a leaked document listener) would make
  // the whole page unusable, so always clean up regardless of how we got here.
  document.removeEventListener('keydown', onKeydown)
  setBackgroundInert(false)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="dialogEl"
      class="doors"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doors-title"
    >
      <div class="inner">
        <UIcon
          :name="enabled ? 'i-lucide-volume-2' : 'i-lucide-volume-x'"
          class="spk"
          aria-hidden="true"
        />
        <h2 id="doors-title" class="title">Step onto the floor</h2>
        <p v-if="enabled" class="sub">Sound is on</p>

        <button ref="primary" class="btn-enter" @click="close(enabled)">
          Step onto the floor
        </button>
        <button ref="quiet" class="btn-quiet" @click="close(false)">
          Enter silently instead
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.doors {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 2rem;
  text-align: center;
  background: radial-gradient(60% 60% at 50% 45%, rgba(10, 6, 20, 0.72), rgba(3, 2, 6, 0.94));
  backdrop-filter: blur(3px);
  animation: reveal 0.5s ease forwards;
}

.spk {
  font-size: 3rem;
  color: var(--color-gold-400);
  filter: drop-shadow(0 0 22px rgba(255, 185, 46, 0.85));
  animation: drift 2.6s ease-in-out infinite;
}

.title {
  margin-top: 1.2rem;
  font-size: clamp(1.5rem, 4vw, 2.3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 0 16px rgba(0, 214, 255, 0.7);
}

.sub {
  margin-top: 0.7rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-gold-300);
  text-shadow: 0 0 12px rgba(255, 185, 46, 0.7);
}

.btn-enter {
  display: inline-flex;
  margin-top: 2rem;
  cursor: pointer;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1.9rem;
  font: inherit;
  font-weight: 700;
  color: #180f00;
  background: linear-gradient(180deg, #ffe3a0, #ffb92e 55%, #e79608);
  box-shadow:
    0 0 24px rgba(255, 185, 46, 0.55),
    0 0 60px rgba(255, 140, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.btn-quiet {
  display: block;
  margin: 1.4rem auto 0;
  cursor: pointer;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-bone-300);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.btn-quiet:hover { color: #fff; }

.btn-enter:focus-visible,
.btn-quiet:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
}
</style>
