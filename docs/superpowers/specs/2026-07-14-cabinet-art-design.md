# metaincognita — cabinet art for the big cabinets

**Date:** 2026-07-14
**Status:** Approved
**Extends:** the "Neon Palace" redesign (2026-07-13)

## The problem

The `feature` and `banner` cabinets carry a dead band between the icon/badge row and the
sunken text block. `a8c8458` sank the copy to the floor and bled an oversized icon glyph
into the gap, which stopped the tiles reading as *empty* — but a 14%-opacity glyph is a
watermark, not art. The big tiles are the ones the eye lands on first, and they are the
least decorated things on the floor.

## Rejected: reuse each app's `og:image`

The obvious move — point the tiles at `https://<app>.metaincognita.com/og-image.png` —
was investigated and rejected on four independent grounds. Recording them so nobody
re-litigates this.

1. **The og:images already contain the cabinet's own text.** Flameout's reads *"Watch the
   multiplier climb. Cash out before the crash. Then see why the house always wins"* —
   word for word the `description` the cabinet renders as live text. Blackjack's carries
   its title, its description and a `METAINCOGNITA` wordmark. Every feature tile would
   state itself twice, once as unselectable, untranslatable pixels.
2. **The CSP forbids them.** `netlify.toml` sets `img-src 'self' data:`. A subdomain is a
   separate origin, so these are blocked. The Neon Palace spec locked that down on
   purpose: *"Zero new fonts, zero images — all decoration is CSS or inline SVG."*
3. **Wrong geometry, wrong palette.** They are 1200×630 landscape going into a ~558×600
   near-square tile, and they share no visual language with each other — Blackjack is green
   felt on a blueprint grid, Flameout is a purple starfield. Three tiles would read as
   three brands.
4. **They do not all exist.** Craps, Video Poker and PAO ship none; PAO is one of the three
   tiles that needs one. Hold'em declares an `og:image` that 404s to the SPA shell.

## The design

Bespoke inline SVG per game — vector, accent-tinted, textless. No `/public` assets, no HTTP
requests, no CSP change.

### The shared substrate

Every scene is composed of the same four layers, so the three can't drift apart:

| Layer | Role |
|---|---|
| 1. Floor grid | Faint perspective lines converging on a vanishing point |
| 2. Accent bloom | Radial glow behind the hero object |
| 3. Hero object | Neon line-art — uniform stroke weight, round caps, CSS `drop-shadow` glow |
| 4. Fade | Bottom mask, so the scene dies before the copy starts |

**The load-bearing rule: no scene declares a colour of its own.** Every stroke and fill
resolves through `currentColor` / `var(--ac)`. Blackjack renders green, Flameout orange,
PAO teal — automatically, from the accent already in `catalog.ts`. This is the property the
og:images structurally cannot have, and the reason they clashed. It also means a future
cabinet gets coherent art for free by setting one hex value.

### The scenes

| Item | `--ac` | Hero object |
|---|---|---|
| Blackjack Trainer | `#2fe58f` | Felt-arc horizon, two fanned cards (A♠ K♥), chip stack |
| Flameout | `#ff7a3d` | Exponential crash curve off the right edge, rocket at the tip, multiplier ticks |
| PAO Speed Trainer | `#2ff0d8` | 52-card lattice fanning right, three linked nodes (person → action → object) |

Composition differs by span. A `feature` tile is a near-square 2×2: the scene owns the top
~60%, bleeds off the right edge, fades before the title. A `banner` is short and wide: the
scene tucks into the right third, where `.cab-banner .mark` sits today.

### Data + components

- `CatalogItem` gains `art?: 'blackjack' | 'flameout' | 'pao'`. **Optional** — only the
  three big items set it, and every existing spec keeps passing untouched.
- New `app/components/CabinetArt.vue`: one component, the substrate plus a `v-if` per
  scene. Kept in one file because the three scenes must stay visually consistent, which is
  easier to hold when they're read side by side. Split if it passes ~250 lines.
- `GameCabinet` renders `<CabinetArt>` **in place of** the `.mark` watermark. Art and
  watermark must never both appear; the watermark remains the fallback for a big cabinet
  that has no `art` key.

### Constraints carried from the Neon Palace spec

- **Motion is opacity/transform only**, so it stays on the compositor: a slow `breathe` on
  the bloom, a few-pixel parallax on the hero object on `:hover`. No `stroke-dashoffset`.
- **Reduced motion needs no new code.** The global rule in `main.css` already kills every
  `animation:`. The static fallback must not look broken — the trap the `chase` bulb
  comment documents.
- The scene is `aria-hidden`, `pointer-events: none`, `z-index: -1`, inside the cabinet's
  existing `isolation: isolate`.
- **No `<defs>`.** SVG ids are document-global and two cabinets on one page would collide.
  Glow comes from CSS `drop-shadow()`, depth from opacity. Only if a gradient proves
  unavoidable, namespace ids with Vue's `useId()`.

### Legibility

The fade mask exists to protect the copy. Verify with the `contrastcap` MCP against the
rendered page — do not assume. Floors: the `feature` title runs 1.85rem bold (large text,
**3:1**); `.cab-desc` runs 0.95rem (**4.5:1**).

Measure against the **ink**, not the element box. `.cab-desc` on a banner is a block: its
box runs the full 1132px while its text stops at 693px, so an automated check samples the
art through the empty right-hand half of the box and reports a failure that no reader can
see. Cap the copy box instead (`.cab-banner .cab-title/.cab-desc { max-width: 44rem }`) —
which a 1100px measure deserved anyway.

### Responsive

The scene is composed against the cabinet's *measured* geometry, so it has to be re-aimed
wherever the grid changes that geometry. Three regimes:

| Width | Cabinet | Treatment |
|---|---|---|
| > 980px | 558×556, near-square | As composed. `slice` fits ~1:1; fade upward off the title. |
| 620–980px | ~852×352, landscape | The tile is now shaped like a banner. Pull the art box to the right 56% (keeping it near-square, so `slice` barely crops) and fade sideways off the copy. |
| < 620px | near-square, copy-dense | No clean band left — the only gap is the one the badge caption sits in. Lift the scene (translate, never scale) and hold it at `opacity: 0.3`. |

Two traps, both load-bearing:

- **The banner must not `slice`.** It is 5:1 at 1280 and ~4.5:1 at 1024, so a fixed viewBox
  under `slice` crops a different amount at every width — which lopped the right-hand
  columns off the lattice. Use `xMaxYMid meet`: fits the whole scene, pins it to the
  dead space.
- **The art scales with the tile; the copy does not.** As the banner narrows, the lattice
  slides left under the description while the text stays put. bone-300 on a full-strength
  chevron stroke is **1.03:1** — not low contrast, invisible. No fade fixes it, because the
  thing that moves is the art. Hold it to ambient strength (0.3) below 980px instead.

## Testing

- Existing `catalog.spec.ts` and `GameCabinet.spec.ts` pass unchanged — `art` is optional
  and the `GameCabinet` fixture omits it, so it still renders `.mark`.
- New `CabinetArt.spec.ts`: correct scene per key; `aria-hidden`; renders nothing for an
  unknown key.
- New `GameCabinet` cases: an item with `art` renders the scene and **not** the watermark.
- New `catalog.spec.ts` case: every `feature`/`banner` item carries an `art` key.

## Scope

The three big cabinets only. The four `std` and two `wide` cabinets are already dense and
are not touched. Not in scope: raster assets, CSP changes, any use of the og:images.
