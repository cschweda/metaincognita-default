<script setup lang="ts">
import type { CatalogItem } from '~/data/catalog'

const props = defineProps<{ item: CatalogItem }>()

const href = computed(() => `https://${props.item.domain}`)

// Every span but `std` has room to fill — on a std cabinet either would just crowd
// the copy. Where a bespoke scene exists it supersedes the watermark glyph, which
// stays as the fallback for a roomy cabinet that has not been drawn yet.
const hasRoom = computed(() => props.item.span !== 'std')
const hasMark = computed(() => hasRoom.value && !props.item.art)

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
    class="cab"
    :class="`cab-${item.span}`"
    :style="{ '--ac': item.accent }"
    @mousemove="onMove"
  >
    <span class="spotlight" aria-hidden="true" />
    <CabinetArt v-if="hasRoom && item.art" :art="item.art" />
    <UIcon
      v-if="hasMark"
      :name="`i-lucide-${item.icon}`"
      class="mark"
      aria-hidden="true"
    />

    <div class="cab-top">
      <span class="ico">
        <UIcon :name="`i-lucide-${item.icon}`" aria-hidden="true" />
      </span>
      <span class="badge">
        <b>{{ item.badge }}</b>
        <span>{{ item.badgeNote }}</span>
      </span>
    </div>

    <h3 class="cab-title">{{ item.title }}</h3>
    <p class="cab-desc">{{ item.description }}</p>

    <div class="dom">
      <span class="truncate">{{ item.domain }}</span>
      <UIcon name="i-lucide-arrow-up-right" class="arrow shrink-0" aria-hidden="true" />
    </div>
    <span class="sr-only"> — opens in a new tab</span>
  </a>
</template>

<style scoped>
.cab {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  isolation: isolate;
  min-height: 15rem;
  padding: 1.6rem 1.4rem 1.3rem;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--ac) 26%, rgba(255, 255, 255, 0.09));
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--ac) 9%, transparent), rgba(0, 0, 0, 0.3) 52%),
    var(--color-ink-850);
  /* static — a shadow that never animates costs one paint, not one per frame */
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ac) 40%, transparent),
    0 26px 60px -28px color-mix(in srgb, var(--ac) 85%, transparent);
  transition:
    transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.4s ease;
}

.cab:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--ac) 60%, transparent);
}

.cab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ac) 85%, transparent);
  outline-offset: 3px;
}

/* the bulb strip — the one dose of kitsch. 1Hz, well under WCAG 2.3.1. */
.cab::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-image: radial-gradient(
    circle,
    #fffbe8 0 1.6px,
    color-mix(in srgb, var(--ac) 85%, transparent) 1.6px 2.6px,
    transparent 3px
  );
  background-size: 14px 10px;
  background-repeat: repeat-x;
  filter: drop-shadow(0 0 4px var(--ac));
  animation: chase 1.1s steps(1) infinite;
}
.cab:nth-child(even)::before { animation-delay: 0.55s; }

/* chrome hairline under the bulbs */
.cab::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 8%;
  right: 8%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
}

.spotlight {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
  background: radial-gradient(
    320px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--ac) 24%, transparent),
    transparent 60%
  );
}
.cab:hover .spotlight { opacity: 1; }

.cab-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.ico {
  display: grid;
  place-items: center;
  flex: none;
  width: 3rem;
  height: 3rem;
  border-radius: 11px;
  font-size: 1.5rem;
  color: #fff;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--ac) 45%, transparent),
    color-mix(in srgb, var(--ac) 14%, transparent)
  );
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--ac) 70%, transparent),
    0 0 22px color-mix(in srgb, var(--ac) 55%, transparent);
}

.badge { flex: none; text-align: right; max-width: 12rem; }
.badge b {
  display: inline-block;
  /* the chip is a physical label — never let it break across two lines */
  white-space: nowrap;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #170f02;
  background: linear-gradient(180deg, #ffe9a8, #ffb92e 60%, #e59a10);
  padding: 0.28rem 0.55rem;
  border-radius: 4px;
  box-shadow: 0 0 16px rgba(255, 185, 46, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.75);
}
.badge span {
  display: block;
  margin-top: 0.4rem;
  font-family: var(--font-mono);
  /* the caption tier's floor: nothing on the page renders below 0.66rem */
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-bone-500);
}

.cab-title {
  margin-top: 1.2rem;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--color-bone-100);
}
.cab-desc {
  margin-top: 0.6rem;
  flex: 1;
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--color-bone-300);
}

.dom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.2rem;
  padding-top: 0.9rem;
  border-top: 1px solid color-mix(in srgb, var(--ac) 20%, rgba(255, 255, 255, 0.06));
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-bone-500);
  transition: color 0.4s ease;
}
.cab:hover .dom { color: color-mix(in srgb, var(--ac) 65%, var(--color-bone-300)); }

.arrow { font-size: 0.95rem; transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1); }
.cab:hover .arrow { transform: translate(3px, -3px); }

/* the feature cabinet — bigger type, and a watermark of its own glyph.
   It spans two grid rows, so with our short one-line copy it has slack to spare.
   Rather than let the description stretch and leave a dead gap above the domain,
   sink the whole text block to the floor: emblem up top, information at the base,
   and the negative space in the middle where the watermark can own it. */
.cab-feature { min-height: 22rem; padding: 2rem 1.8rem 1.5rem; }
.cab-feature .ico { width: 4rem; height: 4rem; font-size: 2.1rem; border-radius: 14px; }
.cab-feature .cab-title { margin-top: auto; padding-top: 2rem; font-size: 1.85rem; }
.cab-feature .cab-desc { margin-top: 0.8rem; flex: none; font-size: 0.95rem; max-width: 32rem; }
.cab-feature .badge b { font-size: 0.8rem; padding: 0.34rem 0.7rem; }

/* The watermark bleeds off the right edge into the space the sunken text block
   opens up — it fills the void rather than hiding behind the copy. */
.mark {
  position: absolute;
  right: -2.5rem;
  top: 2.5rem;
  z-index: -1;
  font-size: 14rem;
  line-height: 1;
  color: color-mix(in srgb, var(--ac) 14%, transparent);
  pointer-events: none;
}

/* the banner is short and wide — keep its glyph tucked to the right, not overhead */
.cab-banner { min-height: 11rem; }
.cab-banner .mark { top: auto; bottom: -3rem; right: 1.5rem; font-size: 11rem; }

/* The banner spans the whole floor, so an uncapped copy box runs ~1100px — a measure
   no one should read, and one that reaches right across the art on the right-hand side.
   Cap it at the art's edge. (`.cab-feature .cab-desc` is capped for the same reason.) */
.cab-banner .cab-title,
.cab-banner .cab-desc { max-width: 44rem; }

/* The wide reads like a short banner: copy capped left, scene owning the right.
   Same reasoning, same mechanism — measured so the fade in CabinetArt.vue clears it. */
.cab-wide .cab-title,
.cab-wide .cab-desc { max-width: 21rem; }

/* watermark fallback for a wide that has no scene yet — tucked right, like the banner */
.cab-wide .mark { top: auto; bottom: -2.5rem; right: 0.5rem; font-size: 10rem; }
</style>
