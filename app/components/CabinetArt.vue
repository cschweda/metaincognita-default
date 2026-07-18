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
  /** Drives the fade: a feature tile fades upward off its title, a banner or a
   *  wide leftward off its copy (a wide is structurally a short banner). */
  shape: 'feature' | 'banner' | 'wide'
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
  /* A wide is 558×240 at 1180 and ~3.6:1 when it spans the row — the banner's trap
     exactly, so the banner's answer exactly: `meet`, pinned to the dead right. */
  roulette: { w: 558, h: 240, vx: 448, vy: 10, spread: 700, shape: 'wide', par: 'xMaxYMid meet' },
  pachinko: { w: 558, h: 240, vx: 385, vy: 8, spread: 700, shape: 'wide', par: 'xMaxYMid meet' },
  pao: { w: 1100, h: 220, vx: 900, vy: 6, spread: 1000, shape: 'banner', par: 'xMaxYMid meet' },
  /* The slot-car oval is a banner too — same 1100×220 substrate as PAO, same rightward
     fade — so the two big banners stand on an identical floor. */
  slotcar: { w: 1100, h: 220, vx: 900, vy: 6, spread: 1000, shape: 'banner', par: 'xMaxYMid meet' }
}

/** Where the floor plane stops — short of the copy, not at the foot of the box. */
const FLOOR_END: Record<ArtKey, number> = { blackjack: 350, flameout: 350, roulette: 236, pachinko: 236, pao: 220, slotcar: 220 }

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

/**
 * The roulette wheel, squashed into the floor's perspective. The pegs — the frets
 * between pockets — run between two concentric ellipses; everything right of the
 * copy fade, so the wheel reads whole on desktop. The ball rides the outer track
 * at the solid end of the mask, never in the fade ramp where it would ghost.
 */
const WHEEL = { cx: 448, cy: 128 }
const PEGS = 20
const wheelPegs = computed(() =>
  Array.from({ length: PEGS }, (_, i) => {
    const t = (i / PEGS) * Math.PI * 2
    return {
      x1: WHEEL.cx + 104 * Math.cos(t),
      y1: WHEEL.cy + 42 * Math.sin(t),
      x2: WHEEL.cx + 88 * Math.cos(t),
      y2: WHEEL.cy + 36 * Math.sin(t)
    }
  })
)

/**
 * The pachinko pin field: staggered rows, like the real board. The ball's bounce
 * path kinks just above real pin positions — a polyline through empty space reads
 * as a glitch, one that clips pin after pin reads as physics. Composed right of
 * x≈417 so no bounce lands in the copy fade, and below y≈80 so nothing solid
 * crosses the badge caption that owns the tile's top-right band.
 */
const PINFIELD = { x: 245, y: 88, dx: 38, dy: 32, cols: 8, rows: 4 }
const pins = computed(() =>
  Array.from({ length: PINFIELD.cols * PINFIELD.rows }, (_, i) => {
    const col = i % PINFIELD.cols
    const row = Math.floor(i / PINFIELD.cols)
    return {
      i,
      x: PINFIELD.x + col * PINFIELD.dx + (row % 2 ? PINFIELD.dx / 2 : 0),
      y: PINFIELD.y + row * PINFIELD.dy
    }
  })
)
/** Payout pockets along the base; the ball's pocket is the lit one. */
const POCKETS = [240, 296, 352, 408, 464]
const LIT_POCKET = 3

/**
 * The slot-car oval — the roulette wheel's exact construction, re-themed: concentric
 * ellipses squashed into the floor's perspective (outer rail, two dashed lanes, inner
 * apron) with short rumble ticks around the outer rail, same radial hand as the wheel's
 * frets. A car sits mid-corner on the near stretch with its tail hung out; motion streaks
 * trail it. Composed on the right, out past the copy fade, exactly like PAO's lattice.
 */
const OVAL = { cx: 902, cy: 110 }
const TIES = 26
const trackTies = computed(() =>
  Array.from({ length: TIES }, (_, i) => {
    const t = (i / TIES) * Math.PI * 2
    return {
      x1: OVAL.cx + 190 * Math.cos(t),
      y1: OVAL.cy + 73 * Math.sin(t),
      x2: OVAL.cx + 176 * Math.cos(t),
      y2: OVAL.cy + 67 * Math.sin(t)
    }
  })
)
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

      <!-- the wheel in perspective — and the scatter it was proven fair with -->
      <g v-else-if="art === 'roulette'" class="hero">
        <circle v-for="(d, i) in [[150, 192], [205, 206], [256, 194], [178, 220], [232, 176], [128, 208]]" :key="`o${i}`" class="star" :cx="d[0]" :cy="d[1]" r="2.4" />

        <ellipse class="rail" cx="448" cy="128" rx="108" ry="45" />
        <ellipse class="hair dash" cx="448" cy="128" rx="88" ry="36" />
        <line v-for="(p, i) in wheelPegs" :key="`w${i}`" class="peg" :x1="p.x1" :y1="p.y1" :x2="p.x2" :y2="p.y2" />
        <ellipse class="fill stroke" cx="448" cy="128" rx="36" ry="14" />
        <ellipse class="fill stroke" cx="448" cy="117" rx="9.5" ry="4.2" />

        <path class="hair" d="M 507 101 A 88 36 0 0 1 524 110" />
        <circle class="node" cx="528" cy="113" r="5" />
      </g>

      <!-- the pin field, one ball's path through it, and the pocket that pays -->
      <g v-else-if="art === 'pachinko'" class="hero">
        <circle v-for="(s, i) in [[150, 58], [185, 112], [128, 152], [210, 88]]" :key="`f${i}`" class="star" :cx="s[0]" :cy="s[1]" r="2.4" />

        <circle v-for="p in pins" :key="`p${p.i}`" class="peg" :cx="p.x" :cy="p.y" r="3.2" />
        <circle class="hair" cx="473" cy="86" r="6.5" />
        <circle class="hair" cx="435" cy="150" r="6.5" />
        <path class="curve" d="M 473 84 L 454 118 L 435 150 L 417 182 L 420 202" />
        <rect
          v-for="(x, i) in POCKETS"
          :key="`k${i}`"
          :class="i === LIT_POCKET ? 'fill stroke' : 'hair'"
          :x="x"
          y="206"
          width="34"
          height="24"
          rx="5"
        />
        <circle class="node" cx="420" cy="202" r="5.5" />
      </g>

      <!-- a two-lane oval in perspective, and a car with its tail hung out -->
      <g v-else-if="art === 'slotcar'" class="hero">
        <circle v-for="(s, i) in [[904, 104], [872, 118], [936, 120], [900, 92]]" :key="`g${i}`" class="star" :cx="s[0]" :cy="s[1]" r="2.4" />

        <ellipse class="rail" :cx="OVAL.cx" :cy="OVAL.cy" rx="190" ry="73" />
        <line v-for="(t, i) in trackTies" :key="`t${i}`" class="peg" :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2" />
        <ellipse class="hair dash" :cx="OVAL.cx" :cy="OVAL.cy" rx="172" ry="65" />
        <ellipse class="hair dash" :cx="OVAL.cx" :cy="OVAL.cy" rx="140" ry="53" />
        <ellipse class="hair" :cx="OVAL.cx" :cy="OVAL.cy" rx="120" ry="46" />

        <!-- the car, mid-corner on the near stretch: nose to the left, tail kicked out -->
        <g transform="translate(872 172) rotate(-15)">
          <path class="hair" d="M 26 -6 L 52 -9 M 29 0 L 60 0 M 26 6 L 52 9" />
          <rect class="fill stroke" x="-21" y="-11" width="42" height="22" rx="8" />
          <path class="hair" d="M 18 -12 L 18 12" />
          <rect class="fill stroke" x="-4" y="-6" width="13" height="12" rx="3" />
          <circle class="node" cx="-20" cy="0" r="4" />
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
.art-wide {
  /* same sideways fade — the wide's copy is capped at 21rem (GameCabinet.vue), which
     is exactly the transparent 60% of a 558px tile. Solid elements sit right of the
     ramp; only the band-mode ambience (the outcome dots, the left pins) lives under
     the copy, and the mask removes it here. */
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

/* One column: stop treating the scene as backdrop at all. Every band of the tile has
   copy in it, and the 07-14 answer — hold the art at 0.3 under the text — reduced the
   floor's best asset to a smudge on the viewport most visitors use. So the scene leaves
   the backdrop layer and becomes the cabinet's marquee screen: an in-flow, hairline-
   bordered panel under the bulb strip. No copy ever sits on it, so it runs at full
   strength and the whole contrast argument dissolves rather than being re-balanced.
   (The banner stays a backdrop: 52 lattice cells in a ~340px panel is mud.) */
@media (max-width: 620px) {
  .art-feature,
  .art-wide {
    /* in flow — but still positioned, or the bloom's `inset: 0` would escape the
       panel and fill the whole cabinet */
    position: relative;
    inset: auto;
    z-index: auto;
    width: auto;
    /* Under the feature scenes' `slice`, 8/5 shows viewBox y≈104–454 — precisely the
       composed hero band (y105–355) plus floor foreground — at every phone width. */
    aspect-ratio: 8 / 5;
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--ac) 30%, transparent);
    overflow: hidden;
    opacity: 1;
    /* the panel's edges are intentional — nothing to fade behind */
    --fade: none;
  }
  .art-wide {
    /* the wide scenes' own ratio, so `meet` fits them exactly — no letterbox */
    aspect-ratio: 558 / 240;
  }
  /* the backdrop lift has nothing to dodge now */
  .art-feature svg {
    transform: none;
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
.art-wide .bloom {
  background: radial-gradient(
    46% 78% at 76% 46%,
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
/* pegs: pachinko's pins and the frets between roulette pockets — same hardware */
.peg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  opacity: 0.45;
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
