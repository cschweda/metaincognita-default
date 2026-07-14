<script setup lang="ts">
import type { ArtKey } from '~/data/catalog'

const props = defineProps<{ art: ArtKey }>()

/**
 * Each scene is drawn on the same substrate — a perspective floor receding to a
 * vanishing point, a bloom, and a hero object in neon line-art — and NOT ONE OF
 * THEM NAMES A COLOUR. Every stroke resolves through `currentColor`, which the
 * cabinet sets to its own `--ac`. That is the whole trick: blackjack comes out
 * green, flameout orange and pao teal without a single per-scene decision, so
 * the three cannot drift apart. (It is also exactly what the apps' og:images
 * could not do — each carried its own baked-in palette, so three of them side
 * by side read as three brands. See the design spec.)
 *
 * No <defs>: SVG ids are document-global, and two cabinets on one page would
 * collide over them. Glow is a CSS drop-shadow, depth is opacity.
 */
interface Scene {
  /** viewBox, in the rough proportion of the cabinet that carries it. */
  w: number
  h: number
  /** Vanishing point the floor recedes to. */
  vx: number
  vy: number
  /** Half-width of the floor plane where it reaches the viewer. */
  spread: number
  /** Drives the fade: a feature tile fades upward off its title, a banner leftward off its copy. */
  shape: 'feature' | 'banner'
  /**
   * A feature tile stays near-square at every width, so it can `slice` (cover) safely.
   * The banner cannot: it is 5:1 on desktop and barely 4.5:1 at 1024, so a fixed viewBox
   * under `slice` crops a different amount at every width — which lopped the right-hand
   * columns clean off the lattice. `meet` anchored to xMax fits the whole scene in and
   * pins it to the right, where the banner's dead space actually is.
   */
  par: string
}

/**
 * Each viewBox is the measured size of the cabinet that carries it — a feature tile
 * is 558×556 (all but square) and the banner 1132×227 — so `slice` scales ~1:1 and a
 * unit here IS a pixel there. That matters: it is what lets the scenes be composed
 * against real landmarks rather than against a guess. On a feature tile the icon row
 * ends at y≈105 and the sunken title starts at y≈355, so the dead band worth filling
 * is y 105–355, and every hero object is placed inside it.
 */
const SCENES: Record<ArtKey, Scene> = {
  blackjack: { w: 560, h: 558, vx: 330, vy: 120, spread: 760, shape: 'feature', par: 'xMidYMid slice' },
  flameout: { w: 560, h: 558, vx: 300, vy: 120, spread: 760, shape: 'feature', par: 'xMidYMid slice' },
  pao: { w: 1100, h: 220, vx: 900, vy: 6, spread: 1000, shape: 'banner', par: 'xMaxYMid meet' }
}

/** Where the floor plane stops — short of the copy, not at the foot of the box. */
const FLOOR_END: Record<ArtKey, number> = { blackjack: 350, flameout: 350, pao: 220 }

const scene = computed(() => SCENES[props.art])
const floorEnd = computed(() => FLOOR_END[props.art])
const viewBox = computed(() => `0 0 ${scene.value.w} ${scene.value.h}`)

/** Rays fanning out of the vanishing point toward the viewer. */
const rays = computed(() => {
  const { vx, vy, spread } = scene.value
  return Array.from({ length: 13 }, (_, i) => ({
    x1: vx,
    y1: vy,
    x2: vx + ((i - 6) / 6) * spread,
    y2: floorEnd.value
  }))
})

/** Depth lines. Spaced by the square of their distance, so the plane reads as receding. */
const depths = computed(() => {
  const { vy } = scene.value
  return Array.from({ length: 6 }, (_, i) => vy + (floorEnd.value - vy) * ((i + 1) / 6) ** 2)
})

/**
 * The 52-card lattice: thirteen ranks by four suits, which is the literal claim
 * on PAO's badge. Three cells light up and link — person, action, object.
 */
const LATTICE = { x: 770, y: 50, cw: 18, ch: 24, gx: 7, gy: 8 }
const cells = computed(() =>
  Array.from({ length: 52 }, (_, i) => {
    const col = i % 13
    const row = Math.floor(i / 13)
    return {
      i,
      x: LATTICE.x + col * (LATTICE.cw + LATTICE.gx),
      y: LATTICE.y + row * (LATTICE.ch + LATTICE.gy)
    }
  })
)
/**
 * The lit triplet, by lattice index — a chevron across rows 3, 1, 3. Row 0 is off
 * limits: the badge's right-aligned caption sits over it, and a lit node there put a
 * glowing teal disc straight through the words "no edge — it's a tool".
 */
const TRIPLET = [40, 18, 49]
const isLit = (i: number) => TRIPLET.includes(i)
const nodes = computed(() =>
  TRIPLET.map((i) => {
    const c = cells.value[i]!
    return { x: c.x + LATTICE.cw / 2, y: c.y + LATTICE.ch / 2 }
  })
)
const link = computed(() => nodes.value.map((n, i) => `${i ? 'L' : 'M'} ${n.x} ${n.y}`).join(' '))
</script>

<template>
  <span class="art" :class="`art-${scene.shape}`" aria-hidden="true">
    <span class="bloom" />

    <svg :viewBox="viewBox" :preserveAspectRatio="scene.par" focusable="false">
      <!-- substrate: the floor, receding -->
      <g class="floor">
        <line v-for="(r, i) in rays" :key="`r${i}`" :x1="r.x1" :y1="r.y1" :x2="r.x2" :y2="r.y2" />
        <line v-for="(y, i) in depths" :key="`d${i}`" :x1="-120" :y1="y" :x2="scene.w + 120" :y2="y" />
      </g>

      <!-- the felt, two cards and a chip stack -->
      <g v-if="art === 'blackjack'" class="hero">
        <path class="fill" d="M -20 275 A 300 100 0 0 1 580 275 L 580 558 L -20 558 Z" />
        <path class="rail" d="M -20 275 A 300 100 0 0 1 580 275" />
        <path class="hair dash" d="M 30 275 A 250 84 0 0 1 530 275" />

        <g transform="rotate(-10 271 228)">
          <rect class="fill stroke" x="240" y="185" width="62" height="87" rx="8" />
          <path
            class="glyph"
            transform="translate(271 228)"
            d="M 0 -13 C 0 -13 -13 -4 -13 3 C -13 8 -9 10 -6 10 C -4 10 -2 9 -1 8 L -3 14 L 3 14 L 1 8 C 2 9 4 10 6 10 C 9 10 13 8 13 3 C 13 -4 0 -13 0 -13 Z"
          />
        </g>
        <g transform="rotate(9 323 223)">
          <rect class="fill stroke" x="292" y="180" width="62" height="87" rx="8" />
          <path
            class="glyph"
            transform="translate(323 223)"
            d="M 0 11 C -9 4 -13 0 -13 -6 C -13 -11 -8 -13 -5 -13 C -2 -13 0 -11 0 -9 C 0 -11 2 -13 5 -13 C 8 -13 13 -11 13 -6 C 13 0 9 4 0 11 Z"
          />
        </g>

        <g class="chips">
          <ellipse class="fill stroke" cx="452" cy="268" rx="36" ry="11" />
          <ellipse class="fill stroke" cx="452" cy="255" rx="36" ry="11" />
          <ellipse class="fill stroke" cx="452" cy="242" rx="36" ry="11" />
          <ellipse class="hair dash" cx="452" cy="242" rx="23" ry="6.5" />
        </g>
      </g>

      <!-- the multiplier, climbing, and the thing waiting at the end of it -->
      <g v-else-if="art === 'flameout'" class="hero">
        <circle v-for="(s, i) in [[118, 168], [212, 134], [330, 196], [448, 126], [498, 254], [152, 286], [382, 154], [262, 224], [520, 202], [104, 224]]" :key="`s${i}`" class="star" :cx="s[0]" :cy="s[1]" r="2.4" />

        <path class="hair" d="M 80 130 L 80 330 M 80 330 L 552 330" />
        <path class="hair" d="M 70 305 h 20 M 70 272 h 20 M 70 235 h 20 M 70 192 h 20 M 70 150 h 20" />

        <path class="fill" d="M 80 328 C 240 325 336 310 404 268 C 458 234 500 178 536 108 L 560 62 L 560 332 L 80 332 Z" />
        <path class="curve" d="M 80 328 C 240 325 336 310 404 268 C 458 234 500 178 536 108" />

        <g class="rocket" transform="translate(490 185) rotate(36) scale(1.35)">
          <path class="flame" d="M -4 7 L 0 19 L 4 7 Z" />
          <path class="body" d="M -8 1 L -15 11 L -8 8 Z M 8 1 L 15 11 L 8 8 Z" />
          <path class="body" d="M 0 -18 C 6 -10 8 -2 8 6 L -8 6 C -8 -2 -6 -10 0 -18 Z" />
          <circle class="port" cx="0" cy="-5" r="3" />
        </g>
      </g>

      <!-- fifty-two cards; one triplet fires -->
      <g v-else class="hero">
        <rect
          v-for="c in cells"
          :key="c.i"
          :class="isLit(c.i) ? 'fill stroke' : 'hair'"
          :x="c.x"
          :y="c.y"
          :width="LATTICE.cw"
          :height="LATTICE.ch"
          rx="4"
        />
        <path class="curve" :d="link" />
        <circle v-for="(n, i) in nodes" :key="`n${i}`" class="node" :cx="n.x" :cy="n.y" r="7" />
      </g>
    </svg>
  </span>
</template>

<style scoped>
.art {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  /* The fade is what keeps the copy readable — the scene has to die before the
     text starts, not merely sit behind it at low alpha. */
  -webkit-mask-image: var(--fade);
  mask-image: var(--fade);
}
.art-feature {
  --fade: linear-gradient(180deg, #000 0%, #000 54%, transparent 65%);
}
.art-banner {
  /* the banner's copy runs along the left, so this one fades sideways */
  --fade: linear-gradient(90deg, transparent 0%, transparent 60%, #000 74%);
}

/* Between 620 and 980 the feature tile stops being a 2×2 square and flattens into a
   wide, short strip — structurally a banner, not the near-square the scene is composed
   for. Left alone, `slice` fits a portrait viewBox to a 2.4:1 box by zooming until the
   cards crash into the badge. So give it the banner's treatment: pull the art box back
   to the right of the tile, which keeps it near-square (so `slice` barely crops), and
   fade it sideways off the copy that has sunk to the bottom-left. */
@media (max-width: 980px) {
  .art-feature {
    left: auto;
    width: 56%;
    --fade: linear-gradient(90deg, transparent 0%, transparent 22%, #000 54%);
  }

  /* The scene scales with the tile; the copy does not. So as the banner narrows, the
     lattice slides left underneath the description while the text stays put — and
     bone-300 sitting on a full-strength chevron stroke measures 1.03:1, which is not
     low contrast, it is invisible. No fade fixes this, because the thing that moves is
     the art. Hold it to ambient strength instead, where the worst case is ~5.5:1. */
  .art-banner {
    opacity: 0.3;
  }
}

/* One column: the tile is near-square again, but the copy wraps to fill most of it, so
   the band left to draw in is short and high up. Fade early to protect the copy — and
   pull the scene back rather than let the fade slice through it, which cropped the cards
   off at the waist and read as a clipping bug instead of a composition. A small tile
   should zoom out, not crop. */
@media (max-width: 620px) {
  .art-feature {
    left: 0;
    width: auto;
    --fade: linear-gradient(180deg, #000 0%, #000 30%, transparent 46%);
    /* One column leaves no clean band: the tile is copy-dense, and the only gap left is
       the one the badge's caption sits in. Lifting the scene into it puts "plus the hi-lo
       count" straight onto a chip stroke — and on Flameout, onto the crash curve, whose
       3.5px stroke at 0.9 measures ~4.0:1 against bone-500, under the 4.5 floor. Holding
       the whole scene at 0.3 takes the worst case to ~4.7:1, and at this size the art
       wants to read as ambient texture anyway. */
    opacity: 0.3;
  }
  /* Lift, don't shrink. Scaling the svg down exposed its own box edge as a hard-lit
     rectangle (the felt bleeds to the viewBox edge, so that edge becomes visible the
     moment the svg stops covering the tile). A translate has no such seam: the strip it
     uncovers at the foot of the tile lies inside the part the fade has already killed. */
  .art-feature svg {
    transform: translateY(-45px);
  }
}

.art svg {
  width: 100%;
  height: 100%;
  color: var(--ac);
}

.bloom {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    56% 44% at 56% 40%,
    color-mix(in srgb, var(--ac) 20%, transparent),
    transparent 70%
  );
  animation: breathe 7s ease-in-out infinite;
}
.art-banner .bloom {
  background: radial-gradient(
    40% 92% at 84% 50%,
    color-mix(in srgb, var(--ac) 20%, transparent),
    transparent 70%
  );
}

/* one stroke language across all three scenes */
.floor line {
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.1;
}
.hero {
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ac) 55%, transparent));
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.fill {
  fill: currentColor;
  fill-opacity: 0.1;
}
.stroke {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  fill: none;
  opacity: 0.62;
}
.fill.stroke {
  fill: currentColor;
  fill-opacity: 0.1;
  opacity: 1;
  stroke-opacity: 0.62;
}
.rail {
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  opacity: 0.5;
}
.hair {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  opacity: 0.26;
}
.dash {
  stroke-dasharray: 7 9;
}
.glyph {
  fill: currentColor;
  fill-opacity: 0.7;
}
.curve {
  fill: none;
  stroke: currentColor;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.9;
}
.star {
  fill: currentColor;
  fill-opacity: 0.35;
}
.flame {
  fill: currentColor;
  fill-opacity: 0.75;
}
.body {
  fill: color-mix(in srgb, var(--color-ink-900) 86%, var(--ac));
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-opacity: 0.75;
}
.port {
  fill: currentColor;
  fill-opacity: 0.55;
}
.node {
  fill: currentColor;
  fill-opacity: 0.85;
}

/* Parallax on hover — a few pixels, amplifying the lift the cabinet already has.
   Transform only, so it stays on the compositor. `prefers-reduced-motion` needs no
   code here: the global rule in main.css kills every animation, and the scene is
   composed to read correctly standing still. */
.cab:hover .hero {
  transform: translate(-8px, -6px) scale(1.02);
}
</style>
