# Neon Palace Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the metaincognita landing page as a modern-casino floor — neon, chrome, a zoned mosaic of glowing game cabinets, an LED ticker, and opt-in ambient floor audio — while the copy stays dry and mathematical.

**Architecture:** Data-driven. `app/data/catalog.ts` becomes zone-shaped; `index.vue` renders zones → a CSS-grid mosaic → `GameCabinet` components. Audio is a client-side singleton composable (`useFloorAudio`) shared by `TheDoors` (which supplies the browser-mandated user gesture) and `SoundSwitch`. All decoration is CSS — no images, no new fonts.

**Tech Stack:** Nuxt 4, Nuxt UI 4, Tailwind CSS v4 (`@theme static` tokens), TypeScript, Vitest + `@nuxt/test-utils`, static prerender via `nitro.preset = 'netlify_static'`.

**Spec:** `docs/superpowers/specs/2026-07-13-neon-palace-redesign-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Never call `HTMLAudioElement.play()` outside a user-gesture handler.** Browsers reject it; it is also a WCAG 1.4.2 failure. Audio starts only from `TheDoors` or `SoundSwitch` click handlers.
- **Audio is `preload="none"`.** Nothing is fetched until sound is actually enabled. First paint must be identical whether audio is on or off.
- **Never animate `box-shadow`, `filter`, or any layout property** (`height`, `width`, `top`, `margin`, …). This applies to **`transition:` lists exactly as much as to `@keyframes`** — a `transition: box-shadow .4s` paired with a different `:hover` value animates box-shadow just as hard as a keyframe does, and a 70px-blur shadow re-rasterises the whole card every frame. Nine cabinets render at once.
  - **Movement and glow must ride on `transform` and `opacity`.** A shadow that never changes costs one paint; an animated one costs one per frame.
  - Cheap paint-only transitions (`color`, `border-color`, `background-color`) **are** allowed — they don't trigger layout or blur, and the UI would feel dead without them.
  - **Auditing this means grepping `transition:` too, not just `@keyframes`.** An audit that only looks inside keyframe blocks has a blind spot big enough to ship a bug through — it already did once here.
- **No new fonts, no images.** Sora + Geist Mono only (already self-hosted by `@nuxt/fonts` inside Nuxt UI 4). CSP is `img-src 'self' data:` and `font-src 'self'`.
- **Icons are lucide** (`i-lucide-<name>`), never emoji. Emoji render inconsistently and are noisy for screen readers.
- **`prefers-reduced-motion: reduce` must kill:** wordmark flicker, bulb chase (bulbs stay lit), ticker scroll, zone-sign breathe, backdrop sweep + suit drift, status pulse, equaliser bars, door bob, smooth scroll, cursor spotlight.
- **Badges are non-numeric.** Never print a house-edge percentage we cannot source from the app itself.
- **Contrast:** every text/background pair must pass WCAG AA (4.5:1 normal text).
- **Targets:** Lighthouse performance ≥ 95, accessibility 100.
- Package manager is **pnpm**. Node 22 (`.nvmrc`).
- Commit messages must **not** contain an AI co-author trailer.

---

### Task 1: Test harness

**Files:**
- Create: `vitest.config.ts`
- Create: `test/harness.spec.ts`
- Modify: `package.json` (devDependencies + `test` script)

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm test` runs Vitest in a Nuxt environment with auto-imports (`useState`, `ref`, `onMounted`) and a DOM. Later tasks rely on `mountSuspended` from `@nuxt/test-utils/runtime`.

- [ ] **Step 1: Install the test dependencies**

```bash
pnpm add -D vitest @nuxt/test-utils @vue/test-utils happy-dom
```

- [ ] **Step 2: Add the `test` script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: { domEnvironment: 'happy-dom' }
    }
  }
})
```

- [ ] **Step 4: Write a smoke test that proves the harness boots**

Create `test/harness.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, ref } from 'vue'

describe('test harness', () => {
  it('mounts a component with Nuxt auto-imports available', async () => {
    const Probe = defineComponent({
      setup() {
        const n = ref(41)
        return () => h('span', n.value + 1)
      }
    })
    const wrapper = await mountSuspended(Probe)
    expect(wrapper.text()).toBe('42')
  })

  it('provides a DOM', () => {
    expect(typeof document.createElement).toBe('function')
  })
})
```

- [ ] **Step 5: Run the tests**

Run: `pnpm test`
Expected: PASS — 2 passed.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts test/harness.spec.ts
git commit -m "test: add vitest + @nuxt/test-utils harness"
```

---

### Task 2: Zone-shaped catalog data

**Files:**
- Rewrite: `app/data/catalog.ts`
- Create: `test/catalog.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Span = 'std' | 'wide' | 'feature' | 'banner'`
  - `interface CatalogItem { title, description, domain, icon, accent, badge, badgeNote, span }` — all `string`, `span: Span`
  - `interface Zone { id: 'pit' | 'machines' | 'mind', sign, color, title, sub, unit: string, items: CatalogItem[] }`
  - `export const zones: Zone[]`
  - `export const allItems: CatalogItem[]` — `zones.flatMap(z => z.items)`, floor order, used for JSON-LD.
  - The old `simulations` / `tools` exports are **removed**.

- [ ] **Step 1: Write the failing test**

Create `test/catalog.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { zones, allItems, type Span } from '~/data/catalog'

const SPANS: Span[] = ['std', 'wide', 'feature', 'banner']

describe('catalog', () => {
  it('has exactly three zones in floor order', () => {
    expect(zones.map(z => z.id)).toEqual(['pit', 'machines', 'mind'])
  })

  it('carries all nine apps', () => {
    expect(allItems).toHaveLength(9)
    expect(zones.map(z => z.items.length)).toEqual([4, 4, 1])
  })

  it('gives every item a complete, non-empty record', () => {
    for (const item of allItems) {
      expect(item.title, item.domain).toBeTruthy()
      expect(item.description, item.domain).toBeTruthy()
      expect(item.icon, item.domain).toBeTruthy()
      expect(item.badge, item.domain).toBeTruthy()
      expect(item.badgeNote, item.domain).toBeTruthy()
      expect(SPANS, item.domain).toContain(item.span)
      expect(item.accent, item.domain).toMatch(/^#[0-9a-f]{6}$/i)
      expect(item.domain).toMatch(/^[a-z]+\.metaincognita\.com$/)
    }
  })

  it('never prints a house-edge percentage on a badge', () => {
    // The whole point: we do not ship numbers we cannot source from the apps.
    for (const item of allItems) {
      expect(item.badge, item.domain).not.toMatch(/\d/)
      expect(item.badge, item.domain).not.toContain('%')
    }
  })

  it('lays out the mosaic so each zone fills its grid', () => {
    const pit = zones[0]!.items.map(i => i.span)
    const machines = zones[1]!.items.map(i => i.span)
    // DOM order matters — the grid placement rules in main.css assume it.
    expect(pit).toEqual(['feature', 'std', 'std', 'wide'])
    expect(machines).toEqual(['std', 'std', 'wide', 'feature'])
    expect(zones[2]!.items.map(i => i.span)).toEqual(['banner'])
  })

  it('uses unique domains', () => {
    const domains = allItems.map(i => i.domain)
    expect(new Set(domains).size).toBe(domains.length)
  })
})
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test test/catalog.spec.ts`
Expected: FAIL — `zones` is not exported from `~/data/catalog`.

- [ ] **Step 3: Rewrite `app/data/catalog.ts`**

```ts
/** Footprint on a zone's mosaic grid. DOM order matters — see main.css. */
export type Span = 'std' | 'wide' | 'feature' | 'banner'

export interface CatalogItem {
  /** Display name shown on the cabinet. */
  title: string
  /** One-line description, lifted from each app's own metadata. */
  description: string
  /** Bare hostname; the cabinet's live-link affordance. */
  domain: string
  /** lucide icon name (rendered as `i-lucide-<icon>`). Never an emoji. */
  icon: string
  /** Per-item neon accent driving the glow, bulb strip, ring and icon tint. */
  accent: string
  /**
   * The gold chip: the *method* by which this app exposes the edge.
   * Deliberately non-numeric — we do not print house-edge percentages we
   * cannot source from the app itself. See the design spec.
   */
  badge: string
  /** Caption beneath the chip. */
  badgeNote: string
  span: Span
}

export interface Zone {
  /** Scroll anchor and grid modifier (`.floor-<id>`). */
  id: 'pit' | 'machines' | 'mind'
  /** Text inside the neon tube sign. */
  sign: string
  /** Zone neon colour. */
  color: string
  title: string
  sub: string
  /** Singular noun; ZoneSign pluralises it by count. */
  unit: string
  items: CatalogItem[]
}

export const zones: Zone[] = [
  {
    id: 'pit',
    sign: 'The Pit',
    color: '#2fe58f',
    title: 'Play the house at its own game.',
    sub: 'Table games rebuilt as open-source simulations — true odds, basic strategy, and the exact house edge, all out in the open. No money, no sign-up.',
    unit: 'table',
    items: [
      {
        title: 'Blackjack Trainer',
        description: 'Basic-strategy coaching and Hi-Lo card counting on rules taken straight from official casino documents.',
        domain: 'blackjack.metaincognita.com',
        icon: 'spade',
        accent: '#2fe58f',
        badge: 'Basic strategy',
        badgeNote: 'plus the hi-lo count',
        span: 'feature'
      },
      {
        title: 'No-Limit Hold’em',
        description: 'Texas Hold’em against intelligent bots, with live equity, outs, pot odds and hand ranges as you play.',
        domain: 'holdem.metaincognita.com',
        icon: 'club',
        accent: '#8a8cff',
        badge: 'Live equity',
        badgeNote: 'odds as you play',
        span: 'std'
      },
      {
        title: 'Craps Simulator',
        description: 'A browser craps table for learning the line, the odds bets and where the edge really hides.',
        domain: 'craps.metaincognita.com',
        icon: 'dice-5',
        accent: '#35baff',
        badge: 'True odds',
        badgeNote: 'where the edge hides',
        span: 'std'
      },
      {
        title: 'Roulette Trainer',
        description: 'A real forward-physics wheel, proven fair by simulation — see exactly why you can’t beat it.',
        domain: 'roulette.metaincognita.com',
        icon: 'disc-3',
        accent: '#ff4d63',
        badge: 'Real physics',
        badgeNote: 'proven fair',
        span: 'wide'
      }
    ]
  },
  {
    id: 'machines',
    sign: 'The Machines',
    color: '#ff1ba6',
    title: 'Where the edge hides in plain sight.',
    sub: 'Reels, pins and multipliers. The loudest machines on any floor — and the ones that take the most. Here is exactly how.',
    unit: 'cabinet',
    items: [
      {
        title: 'Slots Simulator',
        description: 'Reel strips, virtual-reel weights and the exact-enumeration house edge across eight machine archetypes.',
        domain: 'slots.metaincognita.com',
        icon: 'cherry',
        accent: '#ffb62e',
        badge: 'Exact odds',
        badgeNote: 'every reel weight',
        span: 'std'
      },
      {
        title: 'Video Poker Trainer',
        description: 'Optimal play, pay-table literacy and bankroll management — taught one hand at a time.',
        domain: 'videopoker.metaincognita.com',
        icon: 'diamond',
        accent: '#c46bff',
        badge: 'Optimal play',
        badgeNote: 'pay-table literacy',
        span: 'std'
      },
      {
        title: 'Pachinko Parlor',
        description: 'Ball-drop physics and payout pockets, with the odds behind the pins laid bare.',
        domain: 'pachinko.metaincognita.com',
        icon: 'circle-dot',
        accent: '#ff5bb0',
        badge: 'Ball physics',
        badgeNote: 'the odds behind the pins',
        span: 'wide'
      },
      {
        title: 'Flameout',
        description: 'Watch the multiplier climb, cash out before the crash — then see why the house always wins.',
        domain: 'flameout.metaincognita.com',
        icon: 'flame',
        accent: '#ff7a3d',
        badge: 'The crash curve',
        badgeNote: 'why the house wins',
        span: 'feature'
      }
    ]
  },
  {
    id: 'mind',
    sign: 'The Mind',
    color: '#2ff0d8',
    title: 'Tools for the mind.',
    sub: 'Utilities that sharpen memory and recall — open source, like everything here. Starting with one; more on the way.',
    unit: 'tool',
    items: [
      {
        title: 'PAO Speed Trainer',
        description: 'Drill the Person–Action–Object system across all 52 cards until each triplet fires as a single reflex.',
        domain: 'pao.metaincognita.com',
        icon: 'brain',
        accent: '#2ff0d8',
        badge: 'All fifty-two cards',
        badgeNote: 'no edge — it’s a tool',
        span: 'banner'
      }
    ]
  }
]

/** Every item on the floor, in floor order. Drives the JSON-LD ItemList. */
export const allItems: CatalogItem[] = zones.flatMap(z => z.items)
```

- [ ] **Step 4: Run the tests**

Run: `pnpm test test/catalog.spec.ts`
Expected: PASS — 6 passed.

- [ ] **Step 5: Commit**

```bash
git add app/data/catalog.ts test/catalog.spec.ts
git commit -m "feat: reshape the catalog into zones with non-numeric badges"
```

---

### Task 3: Design tokens and motion

**Files:**
- Rewrite: `app/assets/css/main.css`

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind tokens `ink-{950,900,850,800,700}`, `gold-{100..600}`, `cyan-{300,400,500}`, `magenta-{300,400,500}`, `bone-{100,300,500}`. Global classes `.grain`, `.reveal`, `.eyebrow`, `.text-neon-cyan`, `.text-neon-magenta`, `.floor`, `.floor-pit`, `.floor-machines`, `.floor-mind`. Keyframes `reveal`, `tape`, `chase`, `breathe`, `flick`, `spin`, `drift`, `eq`, `livepulse`. A single `prefers-reduced-motion` block later tasks rely on.

> **Note:** the mosaic grid placement lives here (global) rather than in `GameCabinet`'s scoped block, because the rules are parent-driven (`.floor-pit .cab-feature`). `GameCabinet` still puts `.cab` and `.cab-<span>` on its root, so these selectors match.

- [ ] **Step 1: Rewrite `app/assets/css/main.css`**

```css
@import "tailwindcss";
@import "@nuxt/ui";

/* ----------------------------------------------------------------------------
   metaincognita — neon palace
   Violet-black canvas · cyan architecture · magenta energy · gold money.
   Loud eyes, quiet voice: the design screams, the copy stays mathematical.
   Type: Sora (display + body) · Geist Mono (labels). No new fonts.
---------------------------------------------------------------------------- */
@theme static {
  --font-sans: "Sora", "Helvetica Neue", Arial, ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SFMono-Regular", monospace;

  /* ink — the dark, tinted violet */
  --color-ink-950: #06050c;
  --color-ink-900: #0a0813;
  --color-ink-850: #0d0b17;
  --color-ink-800: #131020;
  --color-ink-700: #1c1830;

  /* cyan — the architecture: zone signs, structural rules, ghost CTA */
  --color-cyan-300: #7fe9ff;
  --color-cyan-400: #00d6ff;
  --color-cyan-500: #00a8cc;

  /* magenta — the energy: the wordmark, The Machines */
  --color-magenta-300: #ff8ad8;
  --color-magenta-400: #ff1ba6;
  --color-magenta-500: #cc1585;

  /* gold — the money: ticker, badges, primary CTA */
  --color-gold-100: #ffe9a8;
  --color-gold-200: #ffd98a;
  --color-gold-300: #ffcf4d;
  --color-gold-400: #ffb92e;
  --color-gold-500: #e59a10;
  --color-gold-600: #b8790a;

  /* bone — the type, cooled to sit under neon */
  --color-bone-100: #eef1fa;
  --color-bone-300: #b9c0d4;
  --color-bone-500: #8891ab;
}

:root {
  color-scheme: dark;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--color-ink-950);
  color: var(--color-bone-100);
  font-family: var(--font-sans);
  font-feature-settings: "ss01", "cv01";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

::selection {
  background: rgba(255, 27, 166, 0.32);
  color: #fff;
}

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: var(--color-ink-950); }
::-webkit-scrollbar-thumb {
  background: var(--color-ink-700);
  border-radius: 999px;
  border: 2px solid var(--color-ink-950);
}
::-webkit-scrollbar-thumb:hover { background: var(--color-gold-500); }

/* ---- type helpers ---------------------------------------------------------- */
.font-display {
  font-family: var(--font-sans);
  letter-spacing: -0.015em;
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--color-cyan-400);
  text-shadow: 0 0 12px rgba(0, 214, 255, 0.7);
}

/* the two neon inks, as text */
.text-neon-cyan {
  color: #f2fbff;
  text-shadow: 0 0 4px #fff, 0 0 14px #7fe9ff, 0 0 40px #00d6ff, 0 0 90px rgba(0, 150, 255, 0.75);
}
.text-neon-magenta {
  color: #ffe4f6;
  text-shadow: 0 0 4px #fff, 0 0 14px #ff8ad8, 0 0 42px #ff1ba6, 0 0 96px rgba(255, 0, 127, 0.7);
}

/* ---- the mosaic ------------------------------------------------------------
   Parent-driven grid placement. GameCabinet supplies `.cab` + `.cab-<span>`;
   the zone supplies `.floor-<id>`. The feature tile mirrors between zones so
   the eye never settles.
---------------------------------------------------------------------------- */
.floor {
  margin-top: 2.2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.floor-pit .cab-feature { grid-column: span 2; grid-row: span 2; }
.floor-pit .cab-wide { grid-column: span 2; }
.floor-machines .cab-feature { grid-column: 3 / span 2; grid-row: 1 / span 2; }
.floor-machines .cab-wide { grid-column: 1 / span 2; }
.floor-mind .cab-banner { grid-column: span 4; }

@media (max-width: 980px) {
  .floor { grid-template-columns: repeat(2, 1fr); }
  .floor-pit .cab-feature,
  .floor-machines .cab-feature,
  .floor-pit .cab-wide,
  .floor-machines .cab-wide,
  .floor-mind .cab-banner {
    grid-column: span 2;
    grid-row: auto;
  }
}
@media (max-width: 620px) {
  .floor { grid-template-columns: 1fr; }
  .floor-pit .cab-feature,
  .floor-machines .cab-feature,
  .floor-pit .cab-wide,
  .floor-machines .cab-wide,
  .floor-mind .cab-banner {
    grid-column: span 1;
  }
}

/* ---- atmosphere: film grain ------------------------------------------------ */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.045;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ---- motion — opacity and transform only, so it all stays on the compositor - */
@keyframes reveal {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal {
  opacity: 0;
  animation: reveal 0.9s cubic-bezier(0.22, 0.68, 0.18, 1) forwards;
}

/* the ticker tape: the tape holds two copies of the list, so -50% loops seamlessly */
@keyframes tape {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* the bulb chase: a 1Hz alternation, far below WCAG 2.3.1's three-flashes threshold */
@keyframes chase {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
}

@keyframes breathe {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.86; }
}

@keyframes flick {
  0%, 95%, 100% { opacity: 1; }
  96% { opacity: 0.5; }
  97% { opacity: 1; }
  98% { opacity: 0.72; }
}

@keyframes spin { to { transform: rotate(360deg); } }

@keyframes drift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}

/* scaleY, not height — height would trigger layout on every frame, forever,
   on an always-visible element. transform-origin: bottom makes it grow upward. */
@keyframes eq {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}

/* an expanding ring drawn on a pseudo-element, not an animated box-shadow.
   The dot keeps a *static* glow; only the ring moves. */
@keyframes livepulse {
  0% { transform: scale(1); opacity: 0.5; }
  70%, 100% { transform: scale(2.6); opacity: 0; }
}

/* ---- the one place motion is switched off ---------------------------------- */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { animation: none; opacity: 1; }
  *,
  *::before,
  *::after {
    /* `animation: none` (not the 0.01ms idiom) is deliberate: 0.01ms would run
       each animation once and land on its END keyframe, which for `chase` is
       opacity 0.3 — dark bulbs. `none` reverts to the static value instead. */
    animation: none !important;
    /* 0.01ms rather than `none` so any transitionend listener still fires. */
    transition-duration: 0.01ms !important;
  }
  /* bulbs stop chasing but stay lit — the cabinet must not look broken */
  .cab::before { opacity: 1 !important; }
  /* the pulse ring collapses to nothing; the dot's static glow carries it */
  .live-dot::after { opacity: 0 !important; }
}
```

- [ ] **Step 2: Verify the tokens compile and the dev server boots**

Run: `pnpm dev` (note the port it picks — 3000 may be taken)
Expected: server starts, no Tailwind "unknown utility" errors in the output.

Then stop it.

- [ ] **Step 3: Verify the production build still succeeds**

Run: `pnpm generate`
Expected: exit 0, `dist/` written.

> The page will look half-migrated at this point — `AppCard` and `SectionHeading` still reference the old design. That is expected; they are deleted in Task 10.

- [ ] **Step 4: Commit**

```bash
git add app/assets/css/main.css
git commit -m "feat: neon palace design tokens, mosaic grid and motion"
```

---

### Task 4: `useFloorAudio` composable

**Files:**
- Create: `app/composables/useFloorAudio.ts`
- Create: `test/useFloorAudio.spec.ts`

**Interfaces:**
- Consumes: `public/audio/casino-floor.webm` and `public/audio/casino-floor.m4a` (already committed).
- Produces: `useFloorAudio(): { enabled: Ref<boolean>, playing: Ref<boolean>, enter(withSound: boolean): void, toggle(): void }`
  - `enabled` is the **preference**, not "is currently audible".
  - `enter()` is called by `TheDoors`; `toggle()` by `SoundSwitch`. Both run inside click handlers, so a gesture is always present.
  - The `<audio>` element is a **module-level singleton** — every caller shares one element.

- [ ] **Step 1: Write the failing test**

Create `test/useFloorAudio.spec.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useFloorAudio } from '~/composables/useFloorAudio'

let api: ReturnType<typeof useFloorAudio>

const Harness = defineComponent({
  setup() {
    api = useFloorAudio()
    return () => h('div')
  }
})

function spyPlay() {
  return vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
}

describe('useFloorAudio', () => {
  beforeEach(() => {
    localStorage.clear()
    document.querySelectorAll('audio').forEach(a => a.remove())
    vi.restoreAllMocks()
  })

  it('NEVER calls play() on mount — audio must wait for a user gesture', async () => {
    const play = spyPlay()
    await mountSuspended(Harness)
    expect(play).not.toHaveBeenCalled()
  })

  it('defaults the preference to ON', async () => {
    await mountSuspended(Harness)
    expect(api.enabled.value).toBe(true)
  })

  it('honours a stored OFF preference', async () => {
    localStorage.setItem('mi-floor-audio', 'off')
    await mountSuspended(Harness)
    expect(api.enabled.value).toBe(false)
  })

  it('enter(true) starts playback and persists ON', async () => {
    const play = spyPlay()
    await mountSuspended(Harness)
    api.enter(true)
    expect(play).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('mi-floor-audio')).toBe('on')
  })

  it('enter(false) persists OFF and never plays', async () => {
    const play = spyPlay()
    await mountSuspended(Harness)
    api.enter(false)
    expect(play).not.toHaveBeenCalled()
    expect(api.enabled.value).toBe(false)
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
  })

  it('toggle() flips the preference and persists it', async () => {
    spyPlay()
    await mountSuspended(Harness)
    expect(api.enabled.value).toBe(true)
    api.toggle()
    expect(api.enabled.value).toBe(false)
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
    api.toggle()
    expect(api.enabled.value).toBe(true)
    expect(localStorage.getItem('mi-floor-audio')).toBe('on')
  })

  it('builds one <audio> element with opus first and an aac fallback', async () => {
    spyPlay()
    await mountSuspended(Harness)
    api.enter(true)
    const els = document.querySelectorAll('audio')
    expect(els).toHaveLength(1)
    const el = els[0]!
    expect(el.loop).toBe(true)
    expect(el.preload).toBe('none')
    const sources = [...el.querySelectorAll('source')].map(s => s.getAttribute('src'))
    expect(sources).toEqual(['/audio/casino-floor.webm', '/audio/casino-floor.m4a'])
  })

  it('survives a rejected play() — the autoplay policy must not throw', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValue(new DOMException('blocked', 'NotAllowedError'))
    await mountSuspended(Harness)
    expect(() => api.enter(true)).not.toThrow()
    await new Promise(r => setTimeout(r, 0))
    expect(api.playing.value).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test test/useFloorAudio.spec.ts`
Expected: FAIL — cannot resolve `~/composables/useFloorAudio`.

- [ ] **Step 3: Write the composable**

Create `app/composables/useFloorAudio.ts`:

```ts
const STORAGE_KEY = 'mi-floor-audio'
const TARGET_VOLUME = 0.45
const FADE_IN_MS = 1600
const FADE_OUT_MS = 500
const FADE_TICK_MS = 40

/**
 * Client-side singletons. One <audio> for the whole app no matter how many
 * components call this composable — otherwise TheDoors and SoundSwitch would
 * each build their own element and we'd hear the floor twice.
 */
let el: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof setInterval> | null = null

export function useFloorAudio() {
  /**
   * The *preference*. This says nothing about whether sound is currently
   * audible: browsers reject play() until a user gesture has occurred, which
   * is exactly what TheDoors exists to supply.
   */
  const enabled = useState('floor-audio-enabled', () => true)
  const playing = useState('floor-audio-playing', () => false)

  function persist(on: boolean) {
    if (!import.meta.client) return
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  }

  function ensureEl(): HTMLAudioElement {
    if (el) {
      // Re-attach if something detached it (and it keeps the tests honest —
      // the element is a module singleton that outlives any one component).
      if (!el.isConnected) document.body.appendChild(el)
      return el
    }
    el = document.createElement('audio')
    el.loop = true
    // Nothing is fetched until we actually play — first paint is untouched.
    el.preload = 'none'
    el.volume = 0

    const opus = document.createElement('source')
    opus.src = '/audio/casino-floor.webm'
    opus.type = 'audio/webm; codecs=opus'

    const aac = document.createElement('source')
    aac.src = '/audio/casino-floor.m4a'
    aac.type = 'audio/mp4; codecs=mp4a.40.2'

    el.append(opus, aac)
    document.body.appendChild(el)
    return el
  }

  function fadeTo(target: number, ms: number) {
    const a = ensureEl()
    if (fadeTimer) clearInterval(fadeTimer)
    const steps = Math.max(1, Math.round(ms / FADE_TICK_MS))
    const from = a.volume
    let i = 0
    fadeTimer = setInterval(() => {
      i += 1
      a.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)))
      if (i < steps) return
      if (fadeTimer) clearInterval(fadeTimer)
      fadeTimer = null
      if (target === 0) {
        a.pause()
        playing.value = false
      }
    }, FADE_TICK_MS)
  }

  /** MUST be called from inside a user-gesture handler. */
  function play() {
    const a = ensureEl()
    a.play()
      .then(() => {
        playing.value = true
        fadeTo(TARGET_VOLUME, FADE_IN_MS)
      })
      .catch(() => {
        // The autoplay policy said no. Stay silent and wait for the next gesture.
        playing.value = false
      })
  }

  /** TheDoors: the gesture that lets the floor come alive. */
  function enter(withSound: boolean) {
    enabled.value = withSound
    persist(withSound)
    if (withSound) play()
  }

  /** SoundSwitch: always inside a click handler, so a gesture is present. */
  function toggle() {
    enabled.value = !enabled.value
    persist(enabled.value)
    if (enabled.value) play()
    else fadeTo(0, FADE_OUT_MS)
  }

  function onVisibility() {
    if (!el) return
    if (document.hidden) {
      el.pause()
      playing.value = false
    } else if (enabled.value) {
      el.play().then(() => { playing.value = true }).catch(() => {})
    }
  }

  onMounted(() => {
    // Read the stored preference. Note: we do NOT start playing here — that
    // would be an autoplay attempt, and the browser would reject it anyway.
    enabled.value = window.localStorage.getItem(STORAGE_KEY) !== 'off'
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { enabled, playing, enter, toggle }
}
```

- [ ] **Step 4: Run the tests**

Run: `pnpm test test/useFloorAudio.spec.ts`
Expected: PASS — 8 passed.

- [ ] **Step 5: Commit**

```bash
git add app/composables/useFloorAudio.ts test/useFloorAudio.spec.ts
git commit -m "feat: useFloorAudio — gesture-gated, lazy, single-element floor ambience"
```

---

### Task 5: SoundSwitch + TheStatusBar

**Files:**
- Create: `app/components/SoundSwitch.vue`
- Rewrite: `app/components/TheStatusBar.vue`
- Create: `test/SoundSwitch.spec.ts`

**Interfaces:**
- Consumes: `useFloorAudio()` from Task 4.
- Produces: `<SoundSwitch />`, a `<button aria-pressed>` hosted by `TheStatusBar`.

- [ ] **Step 1: Write the failing test**

Create `test/SoundSwitch.spec.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SoundSwitch from '~/components/SoundSwitch.vue'

describe('SoundSwitch', () => {
  beforeEach(() => {
    localStorage.clear()
    document.querySelectorAll('audio').forEach(a => a.remove())
    vi.restoreAllMocks()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  it('is a real button that reports its state to assistive tech', async () => {
    const w = await mountSuspended(SoundSwitch)
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-pressed')).toBe('true')
    expect(btn.attributes('aria-label')).toBe('Floor audio')
  })

  it('flips aria-pressed and its label when clicked', async () => {
    const w = await mountSuspended(SoundSwitch)
    expect(w.text()).toContain('on')
    await w.find('button').trigger('click')
    expect(w.find('button').attributes('aria-pressed')).toBe('false')
    expect(w.text()).toContain('off')
  })
})
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test test/SoundSwitch.spec.ts`
Expected: FAIL — cannot resolve `~/components/SoundSwitch.vue`.

- [ ] **Step 3: Create `app/components/SoundSwitch.vue`**

```vue
<script setup lang="ts">
const { enabled, toggle } = useFloorAudio()
</script>

<template>
  <button
    class="snd"
    :aria-pressed="enabled"
    aria-label="Floor audio"
    @click="toggle"
  >
    <span class="eq" aria-hidden="true"><i /><i /><i /><i /></span>
    <span>Floor audio · {{ enabled ? 'on' : 'off' }}</span>
  </button>
</template>

<style scoped>
.snd {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.34rem 0.8rem;
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border: 1px solid color-mix(in srgb, var(--color-gold-400) 50%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 10%, transparent);
  color: var(--color-gold-200);
  box-shadow: 0 0 16px rgba(255, 185, 46, 0.28);
  transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.snd[aria-pressed="false"] {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-bone-500);
  box-shadow: none;
}
.snd:hover { border-color: var(--color-gold-400); color: #fff; }
.snd:focus-visible {
  outline: 2px solid var(--color-gold-300);
  outline-offset: 2px;
}

.eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 11px; }
.eq i {
  width: 2px;
  /* full height, scaled down — scaleY is composited; animating `height` is not */
  height: 100%;
  transform: scaleY(0.25);
  transform-origin: bottom;
  background: currentColor;
  border-radius: 1px;
  animation: eq 0.9s ease-in-out infinite;
}
.eq i:nth-child(2) { animation-delay: 0.15s; }
.eq i:nth-child(3) { animation-delay: 0.3s; }
.eq i:nth-child(4) { animation-delay: 0.45s; }
.snd[aria-pressed="false"] .eq i { animation: none; transform: scaleY(0.25); }
</style>
```

- [ ] **Step 4: Rewrite `app/components/TheStatusBar.vue`**

```vue
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
        <!-- the visible label hides below sm to make room for the sound switch,
             so the anchor needs its own accessible name -->
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
```

- [ ] **Step 5: Run the tests**

Run: `pnpm test test/SoundSwitch.spec.ts`
Expected: PASS — 2 passed.

- [ ] **Step 6: Commit**

```bash
git add app/components/SoundSwitch.vue app/components/TheStatusBar.vue test/SoundSwitch.spec.ts
git commit -m "feat: floor-audio switch in a neon status bar"
```

---

### Task 6: TheDoors

**Files:**
- Create: `app/components/TheDoors.vue`
- Create: `test/TheDoors.spec.ts`

**Interfaces:**
- Consumes: `useFloorAudio()` from Task 4.
- Produces: `<TheDoors />`, mounted once in `app.vue` (Task 10). Sets `sessionStorage['mi-entered'] = '1'` on close so it gates once per session, not per navigation.

> **Why this exists:** browsers reject `play()` until the user has interacted with the page. The Doors supply that gesture. It is a real `role="dialog"` with real buttons, focus management, `Escape` handling and a two-node focus trap — it must never become a keyboard trap or an unlabelled overlay.

- [ ] **Step 1: Write the failing test**

Create `test/TheDoors.spec.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TheDoors from '~/components/TheDoors.vue'

describe('TheDoors', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  it('opens as a labelled modal dialog on a fresh session', async () => {
    await mountSuspended(TheDoors)
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog!.getAttribute('aria-modal')).toBe('true')
    const labelledBy = dialog!.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelledBy)?.textContent).toContain('Step onto the floor')
  })

  it('does not re-gate a session that has already entered', async () => {
    sessionStorage.setItem('mi-entered', '1')
    await mountSuspended(TheDoors)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('offers a real button to enter with sound, and one to enter silently', async () => {
    await mountSuspended(TheDoors)
    const buttons = [...document.querySelectorAll('[role="dialog"] button')]
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.textContent).toContain('Step onto the floor')
    expect(buttons[1]!.textContent).toContain('Enter silently')
  })

  it('entering with sound starts playback and closes the dialog', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    await mountSuspended(TheDoors)
    const enter = document.querySelectorAll('[role="dialog"] button')[0] as HTMLButtonElement
    enter.click()
    await new Promise(r => setTimeout(r, 0))
    expect(play).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('mi-entered')).toBe('1')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('entering silently closes the dialog and never plays', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    await mountSuspended(TheDoors)
    const quiet = document.querySelectorAll('[role="dialog"] button')[1] as HTMLButtonElement
    quiet.click()
    await new Promise(r => setTimeout(r, 0))
    expect(play).not.toHaveBeenCalled()
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test test/TheDoors.spec.ts`
Expected: FAIL — cannot resolve `~/components/TheDoors.vue`.

- [ ] **Step 3: Create `app/components/TheDoors.vue`**

```vue
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

onMounted(() => {
  // Gate once per session, not on every in-session navigation.
  if (window.sessionStorage.getItem(SESSION_KEY) === '1') return
  open.value = true
  nextTick(() => primary.value?.focus())
})

function close(withSound: boolean) {
  window.sessionStorage.setItem(SESSION_KEY, '1')
  open.value = false
  enter(withSound)
}

/** Two-node focus trap. `aria-modal` promises focus stays inside; keep the promise. */
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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="doors"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doors-title"
      @keydown="onKeydown"
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
```

- [ ] **Step 4: Run the tests**

Run: `pnpm test test/TheDoors.spec.ts`
Expected: PASS — 5 passed.

- [ ] **Step 5: Commit**

```bash
git add app/components/TheDoors.vue test/TheDoors.spec.ts
git commit -m "feat: the doors — an arrival curtain that supplies the audio gesture"
```

---

### Task 7: GameCabinet

**Files:**
- Create: `app/components/GameCabinet.vue`
- Create: `test/GameCabinet.spec.ts`

**Interfaces:**
- Consumes: `CatalogItem` from Task 2.
- Produces: `<GameCabinet :item="CatalogItem" />`. Root element is `<a class="cab cab-<span>">` carrying `--ac: <accent>`. The mosaic rules in `main.css` (Task 3) target `.cab-feature` / `.cab-wide` / `.cab-banner`.

- [ ] **Step 1: Write the failing test**

Create `test/GameCabinet.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GameCabinet from '~/components/GameCabinet.vue'
import type { CatalogItem } from '~/data/catalog'

const item: CatalogItem = {
  title: 'Blackjack Trainer',
  description: 'Basic-strategy coaching and Hi-Lo card counting.',
  domain: 'blackjack.metaincognita.com',
  icon: 'spade',
  accent: '#2fe58f',
  badge: 'Basic strategy',
  badgeNote: 'plus the hi-lo count',
  span: 'feature'
}

describe('GameCabinet', () => {
  it('links out safely, in a new tab, and says so to screen readers', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    const a = w.find('a')
    expect(a.attributes('href')).toBe('https://blackjack.metaincognita.com')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    expect(w.find('.sr-only').text()).toContain('opens in a new tab')
  })

  it('carries its span class so the mosaic can place it', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('a').classes()).toContain('cab-feature')

    const std = await mountSuspended(GameCabinet, { props: { item: { ...item, span: 'std' } } })
    expect(std.find('a').classes()).toContain('cab-std')
  })

  it('publishes its accent as the --ac custom property', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('a').attributes('style')).toContain('--ac: #2fe58f')
  })

  it('shows the badge and its caption', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.text()).toContain('Basic strategy')
    expect(w.text()).toContain('plus the hi-lo count')
  })

  it('titles the cabinet with an h3, under the zone h2', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('h3').text()).toBe('Blackjack Trainer')
  })
})
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `pnpm test test/GameCabinet.spec.ts`
Expected: FAIL — cannot resolve `~/components/GameCabinet.vue`.

- [ ] **Step 3: Create `app/components/GameCabinet.vue`**

```vue
<script setup lang="ts">
import type { CatalogItem } from '~/data/catalog'

const props = defineProps<{ item: CatalogItem }>()

const href = computed(() => `https://${props.item.domain}`)
const isFeature = computed(() => props.item.span === 'feature')

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
    <UIcon
      v-if="isFeature"
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
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ac) 30%, transparent),
    0 22px 52px -30px color-mix(in srgb, var(--ac) 75%, transparent);
  transition:
    transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}

.cab:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--ac) 60%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--ac) 55%, transparent),
    0 30px 70px -28px color-mix(in srgb, var(--ac) 95%, transparent);
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

.badge { flex: none; text-align: right; max-width: 9.5rem; }
.badge b {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.68rem;
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
  font-size: 0.56rem;
  letter-spacing: 0.1em;
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
  font-size: 0.62rem;
  color: var(--color-bone-500);
  transition: color 0.4s ease;
}
.cab:hover .dom { color: color-mix(in srgb, var(--ac) 65%, var(--color-bone-300)); }

.arrow { font-size: 0.95rem; transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1); }
.cab:hover .arrow { transform: translate(3px, -3px); }

/* the feature cabinet — bigger type, and a watermark of its own glyph */
.cab-feature { min-height: 22rem; padding: 2rem 1.8rem 1.5rem; }
.cab-feature .ico { width: 4rem; height: 4rem; font-size: 2.1rem; border-radius: 14px; }
.cab-feature .cab-title { margin-top: 1.6rem; font-size: 1.85rem; }
.cab-feature .cab-desc { margin-top: 0.8rem; font-size: 0.95rem; max-width: 30rem; }
.cab-feature .badge b { font-size: 0.8rem; padding: 0.34rem 0.7rem; }

.mark {
  position: absolute;
  right: -1.5rem;
  bottom: -2.5rem;
  z-index: -1;
  font-size: 13rem;
  line-height: 1;
  color: color-mix(in srgb, var(--ac) 12%, transparent);
  pointer-events: none;
}

.cab-banner { min-height: 11rem; }
</style>
```

- [ ] **Step 4: Run the tests**

Run: `pnpm test test/GameCabinet.spec.ts`
Expected: PASS — 5 passed.

- [ ] **Step 5: Commit**

```bash
git add app/components/GameCabinet.vue test/GameCabinet.spec.ts
git commit -m "feat: game cabinet — bulb strip, neon icon, gold method badge"
```

---

### Task 8: ZoneSign + TheTicker

**Files:**
- Create: `app/components/ZoneSign.vue`
- Create: `app/components/TheTicker.vue`
- Create: `test/ZoneSign.spec.ts`
- Create: `test/TheTicker.spec.ts`

**Interfaces:**
- Consumes: nothing beyond tokens.
- Produces:
  - `<ZoneSign :sign :color :title :sub :count :unit />` — renders the neon tube, an `h2`, the sub, and a pluralised zero-padded count (`04 tables`, `01 tool`).
  - `<TheTicker />` — the LED marquee. Tape is `aria-hidden`; the pause control is a real labelled `<button>` (WCAG 2.2.2).

- [ ] **Step 1: Write the failing tests**

Create `test/ZoneSign.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ZoneSign from '~/components/ZoneSign.vue'

const base = {
  sign: 'The Pit',
  color: '#2fe58f',
  title: 'Play the house at its own game.',
  sub: 'Table games rebuilt as open-source simulations.',
  count: 4,
  unit: 'table'
}

describe('ZoneSign', () => {
  it('renders the zone title as an h2', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('h2').text()).toBe('Play the house at its own game.')
  })

  it('zero-pads and pluralises the count', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.text()).toContain('04 tables')
  })

  it('keeps a count of one singular', async () => {
    const w = await mountSuspended(ZoneSign, { props: { ...base, count: 1, unit: 'tool' } })
    expect(w.text()).toContain('01 tool')
    expect(w.text()).not.toContain('01 tools')
  })

  it('publishes the zone colour as --zc', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('header').attributes('style')).toContain('--zc: #2fe58f')
  })
})
```

Create `test/TheTicker.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TheTicker from '~/components/TheTicker.vue'

describe('TheTicker', () => {
  it('hides the moving tape from assistive tech — it is decoration', async () => {
    const w = await mountSuspended(TheTicker)
    expect(w.find('.tape').attributes('aria-hidden')).toBe('true')
  })

  it('carries the thesis, not invented numbers', async () => {
    const w = await mountSuspended(TheTicker)
    const text = w.text()
    expect(text).toContain('The house always wins')
    expect(text).toContain('Every edge is published')
    expect(text).not.toMatch(/\d+(\.\d+)?%/)
  })

  it('offers a real pause control — WCAG 2.2.2', async () => {
    const w = await mountSuspended(TheTicker)
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-label')).toBe('Pause the scrolling ticker')
  })

  it('pauses and relabels when the control is used', async () => {
    const w = await mountSuspended(TheTicker)
    await w.find('button').trigger('click')
    expect(w.find('.ticker').classes()).toContain('paused')
    expect(w.find('button').attributes('aria-label')).toBe('Resume the scrolling ticker')
  })
})
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `pnpm test test/ZoneSign.spec.ts test/TheTicker.spec.ts`
Expected: FAIL — neither component resolves.

- [ ] **Step 3: Create `app/components/ZoneSign.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{
  sign: string
  color: string
  title: string
  sub: string
  count: number
  unit: string
}>()

const countLabel = computed(() => {
  const n = String(props.count).padStart(2, '0')
  return `${n} ${props.unit}${props.count === 1 ? '' : 's'}`
})
</script>

<template>
  <header :style="{ '--zc': color }">
    <div class="zone-head">
      <span class="sign">{{ sign }}</span>
      <span class="bar" aria-hidden="true" />
      <span class="count">{{ countLabel }}</span>
    </div>
    <h2 class="zone-title">{{ title }}</h2>
    <p class="zone-sub">{{ sub }}</p>
  </header>
</template>

<style scoped>
.zone-head {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
}

/* the neon tube */
.sign {
  padding: 0.42rem 1.2rem;
  border-radius: 999px;
  border: 2px solid var(--zc);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 10px var(--zc);
  box-shadow:
    0 0 10px var(--zc),
    0 0 34px color-mix(in srgb, var(--zc) 45%, transparent),
    inset 0 0 16px color-mix(in srgb, var(--zc) 30%, transparent);
  animation: breathe 4s ease-in-out infinite;
}

.bar {
  flex: 1;
  height: 1px;
  min-width: 2rem;
  background: linear-gradient(90deg, color-mix(in srgb, var(--zc) 55%, transparent), transparent);
}

.count {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-bone-500);
}

.zone-title {
  margin-top: 1.5rem;
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--color-bone-100);
}

.zone-sub {
  margin-top: 0.85rem;
  max-width: 34rem;
  font-size: 0.97rem;
  line-height: 1.6;
  color: var(--color-bone-300);
}
</style>
```

- [ ] **Step 4: Create `app/components/TheTicker.vue`**

```vue
<script setup lang="ts">
/**
 * The LED marquee — the threshold between the hero and the floor.
 * It carries the thesis, never a house-edge number we cannot source.
 */
const LINES = [
  'The house always wins',
  'Every edge is published',
  'No real money',
  'No accounts',
  'No AI',
  'Read the source',
  'The math is the point',
  'Nothing here is rigged — it doesn’t need to be'
]

// Two copies, so translateX(-50%) wraps with no seam.
const tape = [...LINES, ...LINES]

const paused = ref(false)
</script>

<template>
  <div class="ticker" :class="{ paused }">
    <div class="rail">
      <div class="tape" aria-hidden="true">
        <span v-for="(line, i) in tape" :key="i" class="item">
          <span class="dia">◆</span>{{ line }}
        </span>
      </div>
    </div>
    <button
      class="pause"
      :aria-label="paused ? 'Resume the scrolling ticker' : 'Pause the scrolling ticker'"
      @click="paused = !paused"
    >
      <UIcon :name="paused ? 'i-lucide-play' : 'i-lucide-pause'" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.ticker {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, var(--color-gold-400) 35%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-gold-400) 35%, transparent);
  background: linear-gradient(180deg, #0a0710, #05040a);
  box-shadow: inset 0 0 40px rgba(255, 140, 0, 0.14);
}

.rail { flex: 1; overflow: hidden; }

.tape {
  display: inline-block;
  white-space: nowrap;
  padding: 0.62rem 0;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-300);
  text-shadow: 0 0 10px rgba(255, 170, 0, 0.9);
  animation: tape 40s linear infinite;
}
.ticker.paused .tape { animation-play-state: paused; }

.dia { margin: 0 1.1rem; color: var(--color-magenta-300); }

.pause {
  flex: none;
  width: 2.4rem;
  cursor: pointer;
  border: 0;
  border-left: 1px solid color-mix(in srgb, var(--color-gold-400) 30%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 8%, transparent);
  color: var(--color-gold-300);
  font-size: 0.75rem;
}
.pause:hover { background: color-mix(in srgb, var(--color-gold-400) 18%, transparent); }
.pause:focus-visible { outline: 2px solid var(--color-gold-300); outline-offset: -2px; }
</style>
```

- [ ] **Step 5: Run the tests**

Run: `pnpm test test/ZoneSign.spec.ts test/TheTicker.spec.ts`
Expected: PASS — 8 passed.

- [ ] **Step 6: Commit**

```bash
git add app/components/ZoneSign.vue app/components/TheTicker.vue test/ZoneSign.spec.ts test/TheTicker.spec.ts
git commit -m "feat: neon zone signs and the LED thesis ticker"
```

---

### Task 9: TheHero, TheBackdrop, TheFooter

**Files:**
- Rewrite: `app/components/TheHero.vue`
- Rewrite: `app/components/TheBackdrop.vue`
- Rewrite: `app/components/TheFooter.vue`

**Interfaces:**
- Consumes: tokens and `.text-neon-cyan` / `.text-neon-magenta` from Task 3.
- Produces: `<TheHero />`, `<TheBackdrop />`, `<TheFooter />`. The hero's CTA anchors are `#pit` and `#mind` — the zone ids from Task 2.

- [ ] **Step 1: Rewrite `app/components/TheHero.vue`**

```vue
<script setup lang="ts">
// Presentational. The wordmark gets a polished-floor reflection beneath it —
// the cheapest possible way to say "casino lobby".
</script>

<template>
  <section class="relative flex min-h-[74vh] flex-col items-center justify-center px-6 pt-24 pb-10 text-center">
    <div class="reveal flex items-center gap-4" style="animation-delay: 0.05s">
      <span class="hidden h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/60 sm:block" />
      <span class="eyebrow">simulations · not gambling</span>
      <span class="hidden h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/60 sm:block" />
    </div>

    <h1 class="wordmark font-display reveal mt-7" style="animation-delay: 0.12s">
      <span class="text-neon-cyan">meta</span><span class="i text-neon-magenta">incognita</span>
    </h1>

    <div class="wordmark reflect reveal" aria-hidden="true" style="animation-delay: 0.12s">
      <span class="rm">meta</span><span class="ri">incognita</span>
    </div>

    <p
      class="font-display reveal mt-7 text-[clamp(1.3rem,3vw,2.1rem)] font-normal leading-snug tracking-tight text-bone-100"
      style="animation-delay: 0.36s"
    >
      The house edge, revealed.
    </p>

    <p
      class="reveal mt-5 max-w-2xl text-base leading-relaxed text-bone-300 sm:text-lg"
      style="animation-delay: 0.46s"
    >
      Open-source casino simulations that reveal the math the floor never shows —
      no money, no accounts, no AI. Plus a tool or two for the mind that plays them.
    </p>

    <div class="reveal mt-10 flex flex-wrap items-center justify-center gap-4" style="animation-delay: 0.56s">
      <a href="#pit" class="btn-gold">
        Take the floor
        <UIcon name="i-lucide-arrow-down" class="text-[0.95em]" aria-hidden="true" />
      </a>
      <a href="#mind" class="btn-ghost">Tooling</a>
    </div>

    <ul class="reveal mt-9 flex flex-wrap items-center justify-center gap-2.5" style="animation-delay: 0.66s">
      <li class="chip">No real money</li>
      <li class="chip">No accounts</li>
      <li class="chip">No login</li>
      <li class="chip">No AI</li>
      <li class="chip chip-gold">
        <UIcon name="i-lucide-git-fork" class="text-[0.9em]" aria-hidden="true" />
        Open source
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wordmark {
  font-size: clamp(2.6rem, 10vw, 7.4rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}

.wordmark .i { animation: flick 6s infinite; }

/* the polished floor */
.reflect {
  margin-top: -0.1em;
  height: 0.55em;
  overflow: hidden;
  opacity: 0.22;
  filter: blur(3px);
  transform: scaleY(-1);
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, transparent 42%, #000 100%);
  mask-image: linear-gradient(to bottom, transparent 42%, #000 100%);
}
.reflect .rm { color: var(--color-cyan-300); }
.reflect .ri { color: var(--color-magenta-300); }

.btn-gold,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.7rem;
  font-size: 0.93rem;
  font-weight: 700;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.35s ease,
    color 0.35s ease;
}

.btn-gold {
  color: #180f00;
  background: linear-gradient(180deg, #ffe3a0, #ffb92e 55%, #e79608);
  box-shadow:
    0 0 24px rgba(255, 185, 46, 0.55),
    0 0 60px rgba(255, 140, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
.btn-gold:hover { transform: translateY(-2px); }

.btn-ghost {
  color: #d8f7ff;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-cyan-400) 55%, transparent);
  box-shadow: 0 0 14px rgba(0, 214, 255, 0.28), inset 0 0 14px rgba(0, 214, 255, 0.1);
}
.btn-ghost:hover { transform: translateY(-2px); color: #fff; }

.btn-gold:focus-visible,
.btn-ghost:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.03);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-bone-300);
}

.chip-gold {
  border-color: color-mix(in srgb, var(--color-gold-400) 50%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 8%, transparent);
  color: var(--color-gold-200);
  box-shadow: 0 0 14px rgba(255, 185, 46, 0.2);
}
</style>
```

- [ ] **Step 2: Rewrite `app/components/TheBackdrop.vue`**

```vue
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
```

- [ ] **Step 3: Rewrite `app/components/TheFooter.vue`**

```vue
<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-10 mt-24 border-t border-white/[0.08] px-6 py-14">
    <div class="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <a href="#top" class="font-display foot-wm">
          <span class="m">meta</span><span class="i">incognita</span>
        </a>
        <p class="eyebrow mt-3">the house edge, revealed</p>
      </div>

      <div class="font-mono text-xs leading-relaxed text-bone-500 sm:text-right">
        <p>Open-source simulations · no real money, no accounts, no AI.</p>
        <p class="mt-1.5">© {{ year }} metaincognita</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.foot-wm {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.foot-wm .m { color: #f2fbff; text-shadow: 0 0 10px rgba(0, 214, 255, 0.7); }
.foot-wm .i { color: #ffe4f6; text-shadow: 0 0 10px rgba(255, 27, 166, 0.75); }
.foot-wm:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
  border-radius: 4px;
}
</style>
```

- [ ] **Step 4: Run the whole suite (nothing should regress)**

Run: `pnpm test`
Expected: PASS — all suites green.

- [ ] **Step 5: Commit**

```bash
git add app/components/TheHero.vue app/components/TheBackdrop.vue app/components/TheFooter.vue
git commit -m "feat: neon hero with floor reflection, glowing backdrop, restyled footer"
```

---

### Task 10: Wire the floor together

**Files:**
- Rewrite: `app/pages/index.vue`
- Modify: `app/app.vue`
- Delete: `app/components/AppCard.vue`
- Delete: `app/components/SectionHeading.vue`
- Modify: `nuxt.config.ts` (`theme-color`, `bodyAttrs` background)

**Interfaces:**
- Consumes: `zones` and `allItems` (Task 2); `ZoneSign`, `TheTicker` (Task 8); `GameCabinet` (Task 7); `TheDoors` (Task 6); `TheHero`, `TheBackdrop`, `TheFooter` (Task 9).
- Produces: the finished page.

- [ ] **Step 1: Rewrite `app/pages/index.vue`**

```vue
<script setup lang="ts">
import { zones, allItems } from '~/data/catalog'

// Stagger the cabinet reveals a touch past the hero's entrance.
const cabDelay = (i: number) => `${(i * 0.06).toFixed(2)}s`

// Structured data: the site plus every simulation/tool as a free web application.
const SITE = 'https://metaincognita.com'
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'metaincognita',
      url: SITE,
      description: 'Open-source casino simulations and trainers that reveal the math behind every game — no real money, no accounts, no AI.',
      inLanguage: 'en'
    },
    {
      '@type': 'ItemList',
      name: 'metaincognita simulations & tools',
      numberOfItems: allItems.length,
      itemListElement: allItems.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'WebApplication',
          name: item.title,
          url: `https://${item.domain}`,
          description: item.description,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Web',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        }
      }))
    }
  ]
}

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }]
})
</script>

<template>
  <div>
    <TheHero />
    <TheTicker />

    <main class="relative z-10 mx-auto max-w-[1180px] px-6">
      <section
        v-for="zone in zones"
        :id="zone.id"
        :key="zone.id"
        class="scroll-mt-16 pt-16 pb-6 sm:pt-20"
      >
        <ZoneSign
          :sign="zone.sign"
          :color="zone.color"
          :title="zone.title"
          :sub="zone.sub"
          :count="zone.items.length"
          :unit="zone.unit"
        />

        <div class="floor" :class="`floor-${zone.id}`">
          <GameCabinet
            v-for="(item, i) in zone.items"
            :key="item.domain"
            class="reveal"
            :style="{ animationDelay: cabDelay(i) }"
            :item="item"
          />
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
```

- [ ] **Step 2: Mount `TheDoors` in `app/app.vue`**

```vue
<template>
  <UApp>
    <!-- pb clears the fixed status bar so footer content is never hidden -->
    <div id="top" class="grain pb-[3.5rem]">
      <TheBackdrop />
      <NuxtPage />
    </div>
    <TheStatusBar />
    <TheDoors />
  </UApp>
</template>
```

- [ ] **Step 3: Delete the superseded components**

```bash
git rm app/components/AppCard.vue app/components/SectionHeading.vue
```

- [ ] **Step 4: Update `nuxt.config.ts` for the new base colour**

Change these two lines (the page base moved from `#08080a` to `#06050c`):

```ts
      bodyAttrs: { style: 'background-color:#06050c' },
```

```ts
        { name: 'theme-color', content: '#06050c' },
```

- [ ] **Step 5: Verify nothing references the deleted components**

Run: `grep -rn "AppCard\|SectionHeading\|simulations\b\|\btools\b" app/ --include=*.vue --include=*.ts`
Expected: no hits for `AppCard` or `SectionHeading`. Hits for the words "simulations"/"tools" inside copy strings are fine; there must be **no import** of the old `simulations` / `tools` exports.

- [ ] **Step 6: Run the full suite and build**

Run: `pnpm test && pnpm generate`
Expected: all tests PASS; build exits 0.

- [ ] **Step 7: Commit**

```bash
git add -A app/ nuxt.config.ts
git commit -m "feat: assemble the floor — zones, mosaic, ticker, doors"
```

---

### Task 11: Verification gate

**Files:** none (verification only). Any failure here is fixed in the component it came from, then re-verified.

**Interfaces:**
- Consumes: the whole built site.
- Produces: evidence. Do **not** claim this task complete without pasting the actual tool output.

- [ ] **Step 0: Audit every animated property — keyframes AND transitions**

The earlier audit only looked inside `@keyframes` blocks, which let a
`transition: box-shadow .4s` slip through on nine cabinets. Check both surfaces:

```bash
# (a) keyframe bodies
awk '/@keyframes/,/^}/' app/assets/css/main.css \
  | grep -nE 'box-shadow|filter|height|width|top:|left:|margin|padding'

# (b) transition lists — the blind spot
grep -rn -A5 'transition:' app/components/*.vue app/assets/css/main.css \
  | grep -E 'box-shadow|filter|height|width|margin|padding'
```

Expected: **no output from either.** `color`, `border-color` and `background-color`
in a transition list are fine; `box-shadow`, `filter` and any layout property are not.

- [ ] **Step 1: Start the dev server and note the port**

Run: `pnpm dev`
Ports 3000/3001 are frequently taken on this machine — read the actual port from the output. Call it `$PORT`.

> ### ⚠ Scan the page with the doors DISMISSED
>
> `TheDoors` sets native `inert` on every other child of `<body>` while it is open. That
> removes the `<h1>` and all nine cabinets from the accessibility tree. **A Lighthouse or
> axe run against the curtain-up state audits a document that is 95% inert — the score is
> meaningless, and `page-has-heading-one` will fire spuriously.**
>
> Before every a11y/perf scan, dismiss the doors by pre-seeding the session flag:
>
> ```js
> // via chrome-devtools evaluate_script, BEFORE the audit run
> () => { sessionStorage.setItem('mi-entered', '1'); location.reload() }
> ```
>
> For tools that can't run script first (lightcap/axecap take a URL), the doors' own
> accessibility is already covered by the 11 unit tests in `test/TheDoors.spec.ts`
> (labelled dialog, focus trap both directions, Escape from anywhere, background inert).
> Audit the *site* with the curtain down; trust those tests for the curtain itself.

- [ ] **Step 2: Screenshot the full page**

Use the `viewcap` MCP: `take_screenshot` with `url: http://localhost:$PORT`, `fullPage: true`, `waitFor: 3000`.

Confirm by eye: the doors overlay appears; behind it the neon wordmark with reflection, the ticker, and three zones whose feature cabinets sit on **opposite sides** (Blackjack left in The Pit, Flameout right in The Machines).

- [ ] **Step 3: Contrast — every pair must pass AA**

Use the `contrastcap` MCP: `check_page_contrast` on `http://localhost:$PORT`.

Expected: zero failures at AA.

> **Known risk:** `bone-500` was set to `#8891ab` (lightened from the original `#737b96`, which computed to only ≈4.64:1 on `ink-850`). It is used for the badge caption at 0.56rem and the domain line at 0.62rem. **If contrastcap reports any failure, lighten `--color-bone-500` in `main.css` until it passes, then re-run.**

- [ ] **Step 4: Accessibility — must be 100**

Use the `lightcap` MCP: `run_a11y` on `http://localhost:$PORT`.
Also use the `axecap` MCP: `audit_url` on `http://localhost:$PORT`.

Expected: Lighthouse a11y = 100; axe reports zero violations.

Watch specifically for: the dialog is labelled; the ticker pause button has a name; `SoundSwitch` has a name; heading order is h1 → h2 → h3; colour contrast.

- [ ] **Step 5: Performance — must be ≥ 95**

Use the `lightcap` MCP: `run_audit` on `http://localhost:$PORT`.

Expected: performance ≥ 95.

> If it dips, the first suspects are the many simultaneous `box-shadow` glows (paint cost) and the `filter: drop-shadow` on nine bulb strips. Neither is animated, so they cost once. Reduce blur radii before reducing the design.

- [ ] **Step 6: Prove audio never autoplays**

Use the `chrome-devtools` MCP. Open `http://localhost:$PORT` in a new page, then `evaluate_script`:

```js
() => {
  const els = [...document.querySelectorAll('audio')]
  return {
    audioElements: els.length,          // expect 0 — nothing built until a gesture
    doorsPresent: !!document.querySelector('[role="dialog"]'),  // expect true
    networkAudio: performance.getEntriesByType('resource')
      .filter(e => /casino-floor/.test(e.name)).length          // expect 0 — preload="none"
  }
}
```

Expected: `{ audioElements: 0, doorsPresent: true, networkAudio: 0 }`.

**This is the load-bearing check.** If any audio was fetched or any `<audio>` exists before the user clicked, the autoplay guarantee is broken.

- [ ] **Step 7: Prove reduced-motion is honoured**

Use the `chrome-devtools` MCP `emulate` to force `prefers-reduced-motion: reduce`, reload, then `evaluate_script`:

```js
() => {
  const tape = document.querySelector('.tape')
  const cab = document.querySelector('.cab')
  return {
    tape: getComputedStyle(tape).animationName,               // expect 'none'
    bulbs: getComputedStyle(cab, '::before').animationName,   // expect 'none'
    bulbsVisible: getComputedStyle(cab, '::before').opacity   // expect '1' — lit, not dark
  }
}
```

Expected: animations `none`, bulbs still lit at opacity 1.

- [ ] **Step 8: Commit any fixes made during verification**

```bash
git add -A
git commit -m "fix: verification-gate corrections (contrast/a11y/perf)"
```

(If nothing needed fixing, skip the commit and say so.)

---

### Task 12: Documentation

**Files:**
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: everything.
- Produces: reproducible audio pipeline, credits, and a released changelog entry.

- [ ] **Step 1: Keep the 9.4 MB of raw source MP3s out of git**

Append to `.gitignore`:

```
# raw audio sources — the compressed loops in public/audio/ are what ship.
# Regenerate them with the ffmpeg pipeline in README.md.
audio/
```

- [ ] **Step 2: Add an Audio section to `README.md`**

```markdown
## Floor audio

The landing page plays an optional ambient casino loop. It is **opt-in by gesture**:
browsers reject `play()` until the user has interacted with the page, so `TheDoors`
supplies that interaction. The preference defaults to on, persists in `localStorage`
(`mi-floor-audio`), and is toggleable from the status bar. Nothing is downloaded
until sound is actually enabled (`preload="none"`).

**Shipped assets** (in `public/audio/`):

| File | Codec | Size |
|---|---|---|
| `casino-floor.webm` | Opus 40k stereo | 451 KB |
| `casino-floor.m4a` | AAC 48k mono | 563 KB |

Both are a seamless 93.944s loop.

### Regenerating them

The raw source is a freesound_community upload via Pixabay
(Pixabay Content License — commercial use, no attribution required; credited here
anyway). It is 98s, stereo, 24 kHz, 160 kbps, and has a **mean volume of −32.5 dB
with peaks at 0.0 dB** — a quiet crowd bed with full-scale transients buried in it.
Untreated it is either inaudible or it spikes, so it must be compressed before it can
work as a background loop.

Normalise **first**, then loop, so the crossfade blends already-levelled audio:

```bash
SRC=audio/freesound_community-bruit-2-casino-56939.mp3

# 1. high-pass the sub-60Hz rumble, compress, normalise → mean −21.8 dB, peak −1.2 dB
ffmpeg -i "$SRC" -af "highpass=f=60,loudnorm=I=-18:TP=-1.5:LRA=7" -ar 24000 -ac 2 norm.wav

# 2. seamless loop: crossfade the tail into the head. D=97.944, X=4 → L=93.944
ffmpeg -i norm.wav -filter_complex "\
[0:a]atrim=0:4,asetpts=N/SR/TB[head];\
[0:a]atrim=4:93.944,asetpts=N/SR/TB[body];\
[0:a]atrim=93.944:97.944,asetpts=N/SR/TB[tail];\
[tail][head]acrossfade=d=4:c1=tri:c2=tri[xf];\
[xf][body]concat=n=2:v=0:a=1[out]" -map "[out]" -ar 24000 -ac 2 loop.wav

# 3. encode
ffmpeg -i loop.wav -c:a libopus -b:a 40k -vbr on -application audio -ac 2 \
  public/audio/casino-floor.webm
ffmpeg -i loop.wav -c:a aac -b:a 48k -ac 1 -ar 24000 -movflags +faststart \
  public/audio/casino-floor.m4a
```

### Credits

Ambient casino beds by the **freesound_community** on
[Pixabay](https://pixabay.com/sound-effects/).
```

- [ ] **Step 3: Add the 2.0.0 entry to `CHANGELOG.md`**

Insert directly beneath the `## [1.0.0]` heading's preamble — i.e. as the newest entry, above 1.0.0:

```markdown
## [2.0.0] - 2026-07-13

A ground-up visual rebuild: from restrained "casino noir" to a modern casino floor.

### Added
- **Neon Palace design language** — violet-black canvas, cyan architecture, magenta
  energy, gold money. Neon wordmark with a polished-floor reflection.
- **The Doors** — an arrival curtain that supplies the user gesture browsers require
  before audio may play. Real `role="dialog"`, focus-managed, Escape-dismissible.
- **Floor audio** — an opt-in ambient casino loop (Opus 451 KB / AAC 563 KB, seamless
  94s). Preference defaults to on, persists, and is toggleable from the status bar.
  `preload="none"`, so first paint is untouched for every visitor.
- **The Ticker** — an LED marquee carrying the site's thesis, with a real pause control
  (WCAG 2.2.2).
- **Zoned mosaic floor** — The Pit / The Machines / The Mind, each with a glowing neon
  sign and a varied-size cabinet grid whose feature tile mirrors between zones.
- **Game cabinets** — chasing bulb strip, neon icon, and a gold badge naming the
  *method* each app uses to expose the edge.
- Vitest + `@nuxt/test-utils` test suite.

### Changed
- `catalog.ts` is now zone-shaped (`zones`, `allItems`); `simulations` / `tools` removed.
- Per-item accents saturated for neon.
- Status bar restyled and now hosts the audio switch.

### Removed
- `AppCard.vue` (superseded by `GameCabinet.vue`).
- `SectionHeading.vue` (superseded by `ZoneSign.vue`).

### Notes
- **Badges are deliberately non-numeric.** We do not print house-edge percentages we
  cannot source from the apps themselves — the roulette wheel's zero count, Flameout's
  real edge, and the video-poker pay table are all unconfirmed. The badge is a plain
  string in `catalog.ts`; swap it once each figure is verified.
```

- [ ] **Step 4: Bump the version in `package.json`**

```json
"version": "2.0.0",
```

- [ ] **Step 5: Commit**

```bash
git add README.md CHANGELOG.md package.json .gitignore
git commit -m "docs: audio pipeline, credits, and the 2.0.0 changelog"
```

---

## Self-Review

**Spec coverage.** Walked every spec section against the tasks:

| Spec section | Task |
|---|---|
| Palette, type, icons | 3 |
| The Doors | 6 |
| The Ticker | 8 |
| Zones + mosaic + span table | 2 (data), 3 (grid), 10 (render) |
| The Cabinet | 7 |
| Non-numeric badges | 2 (data + a test that forbids digits), 7 (render) |
| Autoplay reality + `useFloorAudio` | 4, 6, 11 (step 6 proves it) |
| Audio asset pipeline | already shipped; documented in 12 |
| Component inventory | 5, 6, 7, 8, 9, 10 |
| Data model | 2 |
| Accessibility | 6 (dialog), 8 (ticker), 5 (switch), 3 (reduced motion), 11 (verified) |
| Performance | 3 (compositor-only animation), 4 (lazy audio), 11 (verified) |
| Open items (raw audio in git, credits) | 12 |

No gaps.

**Placeholder scan.** No "TBD", no "add error handling", no "similar to Task N". Every
code step carries complete code. Task 11 has no code to write by design — it is a
verification gate, and each step names the exact tool, the exact input and the exact
expected output.

**Type consistency.** Checked across tasks:
- `CatalogItem` fields (`badge`, `badgeNote`, `span`, `accent`) — defined in Task 2, consumed identically in Task 7's test/props and Task 10's render.
- `Zone` fields (`id`, `sign`, `color`, `title`, `sub`, `unit`, `items`) — Task 2 → `ZoneSign` props in Task 8 → passed in Task 10. `unit` is **singular** in the data and pluralised in `ZoneSign`; the Task 2 test and Task 8 test agree.
- `useFloorAudio()` returns `{ enabled, playing, enter, toggle }` — Task 4 defines; Task 5 uses `enabled`/`toggle`; Task 6 uses `enabled`/`enter`. No drift.
- CSS contract: `GameCabinet` emits `.cab` + `.cab-<span>` (Task 7); `main.css` targets `.floor-<id> .cab-feature|.cab-wide|.cab-banner` (Task 3); `index.vue` emits `.floor-<id>` (Task 10). Consistent.
- `main.css` defines `--color-bone-500: #8891ab` (Task 3) — already the *lightened* value, with Task 11 step 3 flagged to lighten further only if contrastcap disagrees.
