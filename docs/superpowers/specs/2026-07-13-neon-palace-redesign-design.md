# metaincognita — "Neon Palace" landing page redesign

**Date:** 2026-07-13
**Status:** Approved
**Supersedes:** the "casino noir" design shipped in v1.0.0

## The concept

**Loud eyes, quiet voice.**

The landing page should feel like walking into a modern casino at 11pm — neon, chrome,
saturated light, a floor full of choices. The *copy* stays bone-dry and mathematical.
That contrast is the point: we sell with the sizzle, then hand you the house edge.

This preserves the brand's actual pitch (open-source, no money, no accounts, no AI,
the math is public) while letting the design be as gaudy as it wants.

Rejected alternatives: retro bulb/marquee kitsch (reads ironic-retro, not "modern
casino", and slab type hurts at paragraph length) and a full maximal mash with a
garish casino-carpet backdrop (too cheesy for the brand).

## Art direction

Modern Vegas, not old Vegas. LED and chrome, not bulbs and velvet — with exactly
one dose of machine kitsch (the bulb strip on each cabinet) to stop it reading as a
generic dark SaaS page.

### Palette

Retune the existing scales; add two neon scales. Near-black gains a violet tint.

| Token | Value | Role |
|---|---|---|
| `ink-950` | `#06050c` | page base |
| `ink-900` | `#0a0813` | |
| `ink-850` | `#0d0b17` | cabinet base |
| `ink-800` | `#131020` | |
| `neon-cyan` | `#00d6ff` | **architecture** — zone signs, structural rules, ghost CTA |
| `neon-magenta` | `#ff1ba6` | **energy** — the hero wordmark, The Machines zone |
| `gold` | `#ffb92e` | **money** — ticker, badges, primary CTA |
| `bone-100` | `#eef1fa` | headings (cooled from the old warm bone) |
| `bone-300` | `#b9c0d4` | body |
| `bone-500` | `#737b96` | mono captions — **verify contrast, see A11y** |

Per-item accents are the existing ones, saturated for neon:

| Item | Old | New |
|---|---|---|
| Blackjack | `#33b07a` | `#2fe58f` |
| Hold'em | `#7c83ff` | `#8a8cff` |
| Craps | `#3e9bd6` | `#35baff` |
| Roulette | `#e0555a` | `#ff4d63` |
| Slots | `#e0a92e` | `#ffb62e` |
| Video Poker | `#b18cff` | `#c46bff` |
| Pachinko | `#ef5ba1` | `#ff5bb0` |
| Flameout | `#ff6a3d` | `#ff7a3d` |
| PAO | `#34d6c4` | `#2ff0d8` |

### Type

**No new fonts.** Sora (display + body) and Geist Mono (labels, ticker, domains) stay.
They are already self-hosted at build by `@nuxt/fonts` (bundled inside Nuxt UI 4), so
this redesign adds **zero** font bytes. The neon tube does the signage work that a
display face would otherwise do.

### Icons

**Keep lucide** (`i-lucide-*`), already bundled via `icon.clientBundle.scan`.
The mockups used emoji only because a standalone HTML file had no icon font — **do not
ship emoji**; they render inconsistently across platforms and are noisy for screen
readers. Neon glow is applied to the lucide glyph with `text-shadow` / `filter`.

The four drifting backdrop suits (`♠ ♥ ♦ ♣`) stay as text glyphs — decorative,
`aria-hidden`.

## Structure — the floor plan

```
THE DOORS      arrival curtain; the gesture that unlocks audio
HERO           neon wordmark + polished-floor reflection, tagline, CTAs, chips
THE TICKER     LED marquee carrying the thesis; the threshold you cross
─ THE PIT ─    4 table games,  zone colour #2fe58f
─ THE MACHINES 4 cabinets,     zone colour #ff1ba6
─ THE MIND ─   1 tool,         zone colour #2ff0d8
FOOTER
STATUS BAR     open-source + GitHub + the sound switch
```

### The Doors

A full-screen curtain over the (already glowing) page: *"Step onto the floor — click
anywhere, sound is on"*, plus an *"enter silently instead"* escape.

Its real job is to supply the **user gesture** browsers require before audio may play
(see Audio). Its second job is that arriving through a door is a better entrance than a
page that simply exists.

- Shows **once per session** (`sessionStorage`), not on every navigation within a visit.
- If the stored audio preference is `off`, the doors still show but drop the sound line.

### The Ticker

A scrolling LED marquee between the hero and the floor. It carries the **thesis**, not
numbers:

> ◆ THE HOUSE ALWAYS WINS ◆ EVERY EDGE IS PUBLISHED ◆ NO REAL MONEY ◆ NO ACCOUNTS ◆
> NO AI ◆ READ THE SOURCE ◆ THE MATH IS THE POINT ◆ NOTHING HERE IS RIGGED — IT
> DOESN'T NEED TO BE ◆

Has a real pause control (see A11y).

### Zones and the mosaic

Each zone gets a glowing neon-tube sign, a title, a sub, and a count. Within a zone the
cabinets are laid on a 4-column grid at **varied sizes**, and the feature tile **mirrors**
between zones so the eye never settles:

```
THE PIT                          THE MACHINES
┌───────────┬─────┬─────┐        ┌─────┬─────┬───────────┐
│           │ ♣   │ ⚄   │        │ 🍒  │ ◆   │           │
│  ♠ FEATURE├─────┴─────┤        ├─────┴─────┤  🔥FEATURE│
│           │  ◎ WIDE   │        │  ◉ WIDE   │           │
└───────────┴───────────┘        └───────────┴───────────┘
```

- `≤980px` → 2 columns, all spans collapse to `span 2`
- `≤620px` → 1 column

Span assignments (**DOM order matters** — the grid placement rules assume it):

| Zone | order | item | span |
|---|---|---|---|
| The Pit | 1 | Blackjack | `feature` (2×2) |
| | 2 | Hold'em | `std` |
| | 3 | Craps | `std` |
| | 4 | Roulette | `wide` (2×1) |
| The Machines | 1 | Slots | `std` |
| | 2 | Video Poker | `std` |
| | 3 | Pachinko | `wide` (2×1) |
| | 4 | Flameout | `feature` (2×2, placed right: `grid-column: 3 / span 2`) |
| The Mind | 1 | PAO Speed Trainer | `banner` (full width) |

This is what makes nine apps read as a room full of choices rather than a list.

### The Cabinet

Replaces `AppCard`. Per tile:

- a **chasing bulb strip** across the top (accent-coloured) — the single dose of kitsch
- a chrome hairline beneath it
- a glowing neon icon tile
- the title
- a **gold badge** (see below)
- the description
- the domain + `↗`
- hover: lift, glow intensifies, cursor-tracking spotlight (retained from v1)

Size variants: `feature` (2×2, larger type, decorative watermark glyph), `wide` (2×1),
`std` (1×1), `banner` (full-width, used by The Mind's single tool).

### The badges — non-numeric

Each cabinet advertises the **method** by which it exposes the edge. Every string is
lifted from the existing catalog copy; **nothing is invented**.

| Item | Badge | Caption |
|---|---|---|
| Blackjack | Basic strategy | + hi-lo count |
| Hold'em | Live equity | odds as you play |
| Craps | True odds | where the edge hides |
| Roulette | Real physics | proven fair |
| Slots | Exact odds | every reel weight |
| Video Poker | Optimal play | pay-table literacy |
| Pachinko | Ball physics | the odds behind the pins |
| Flameout | The crash curve | why the house wins |
| PAO | All 52 cards | no edge — it's a tool |

> **Why not real percentages?** The obvious design is a gold chip reading `5.26%`. We are
> not shipping that, because we cannot source the numbers: we do not know whether the
> roulette sim models a single- or double-zero wheel, what Flameout's actual edge is, or
> which pay table the video-poker trainer uses. Printing textbook figures that don't match
> what the apps model would be a lie on a site whose entire pitch is mathematical honesty.
>
> The badge is a plain string in `catalog.ts`. If the real figures are verified per app
> later, swap the text — no other code changes.

## Audio

### The autoplay reality

**"Sound on by default" is not buildable, and this is not a preference.** Chrome, Safari
and Firefox all block audible autoplay until the user has interacted with the page;
`play()` is rejected with `NotAllowedError` on a first visit. It is also a WCAG 1.4.2
(Audio Control, Level A) problem, and unexpected sound on load is a dark pattern on a site
that advertises having none.

**What we build instead:** the preference genuinely *is* ON by default. The Doors supply
the one gesture the browser requires, and the floor fades up the instant the visitor
steps through. Anyone who would rather not gets "enter silently instead", and the switch
in the status bar persists their choice.

### The asset

Source: `audio/freesound_community-bruit-2-casino-56939.mp3` ("bed A"), chosen by ear.

Measured problem: **mean volume −32.5 dB, peaks 0.0 dB** — a quiet crowd murmur with
full-scale transients (coin drops, chimes) buried in it. Untreated, it is either inaudible
or it spikes.

Pipeline (normalise **before** looping, so the crossfade blends already-levelled audio):

```bash
# 1. high-pass sub-60Hz rumble, compress, normalise → mean −21.8 dB, peak −1.2 dB
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
  public/audio/casino-floor.webm                                   # 451 KB
ffmpeg -i loop.wav -c:a aac -b:a 48k -ac 1 -ar 24000 -movflags +faststart \
  public/audio/casino-floor.m4a                                    # 563 KB
```

**1,912 KB → 451 KB.** Opus for modern browsers, AAC for Safari. Both already written.

CSP needs no change: `media-src` falls back to `default-src 'self'`, and the audio is
same-origin.

### `useFloorAudio()` composable

- preference in `localStorage` (`mi-floor-audio`: `'on' | 'off'`), **default `on`**
- `preload="none"` — nothing is fetched until sound is actually enabled, so first paint
  is untouched for every visitor regardless of preference
- `<source>` order: `audio/webm; codecs=opus` → `audio/mp4; codecs=mp4a.40.2`
- fade in 1.6s / fade out 0.5s; target volume `0.45`
- `loop = true`
- pause on `visibilitychange` when the tab is hidden; resume if still enabled
- never call `play()` outside a user gesture

## Components

| File | Action |
|---|---|
| `app/assets/css/main.css` | rewrite — new tokens, neon utilities, keyframes |
| `app/data/catalog.ts` | rewrite — zone-shaped data (below) |
| `app/pages/index.vue` | rewrite — zones + mosaic; JSON-LD derives from zones |
| `app/components/TheDoors.vue` | **new** — arrival curtain, audio gesture |
| `app/components/TheTicker.vue` | **new** — LED marquee + pause control |
| `app/components/ZoneSign.vue` | **new** — neon-tube zone heading |
| `app/components/GameCabinet.vue` | **new** — replaces `AppCard.vue` |
| `app/components/SoundSwitch.vue` | **new** — status-bar toggle |
| `app/composables/useFloorAudio.ts` | **new** |
| `app/components/TheHero.vue` | rewrite — neon wordmark + reflection |
| `app/components/TheBackdrop.vue` | rewrite — neon glows, light sweep, glowing suits |
| `app/components/TheStatusBar.vue` | restyle + host `SoundSwitch` |
| `app/components/TheFooter.vue` | restyle |
| `app/components/AppCard.vue` | **delete** — superseded by `GameCabinet` |
| `app/components/SectionHeading.vue` | **delete** — superseded by `ZoneSign` |

### Data model

```ts
export interface CatalogItem {
  title: string
  description: string
  domain: string
  icon: string                          // lucide name, rendered as i-lucide-<icon>
  accent: string                        // neon accent
  badge: string                         // gold chip, e.g. 'Basic strategy'
  badgeNote: string                     // caption, e.g. '+ hi-lo count'
  span?: 'feature' | 'wide' | 'std' | 'banner'   // mosaic footprint; default 'std'
}

export interface Zone {
  id: string        // 'pit' | 'machines' | 'mind' — also the scroll anchor
  sign: string      // 'The Pit'
  color: string     // zone neon colour
  title: string
  sub: string
  unit: string      // 'tables' | 'cabinets' | 'tool'
  items: CatalogItem[]
}

export const zones: Zone[]
```

The old `simulations` / `tools` exports go away; `index.vue` derives its JSON-LD
`ItemList` from `zones.flatMap(z => z.items)`, preserving every existing
`WebApplication` entry.

## Accessibility

Non-negotiable — this is a site that already ships a11y fixes, and the owner keeps
axe/contrast/Lighthouse tooling on hand.

- **The Doors** are a real dialog: `role="dialog"`, `aria-modal="true"`, labelled by its
  heading, containing two genuine `<button>`s ("Step onto the floor" / "enter silently
  instead"). Primary button takes focus on mount. `Escape` = enter silently. It must never
  become a keyboard trap.
- **The Ticker** tape is `aria-hidden="true"` (decorative sloganeering; the substantive
  content lives in the badges). Its pause control is a real `<button>` with an
  `aria-label` that flips with state. This plus `prefers-reduced-motion` satisfies
  **WCAG 2.2.2 (Pause, Stop, Hide)**.
- **The bulb chase** alternates at ~1 Hz — far below the 3-flashes-per-second threshold of
  **WCAG 2.3.1**. Still disabled under reduced motion.
- **The sound switch** is a `<button>` with `aria-pressed`.
- **Contrast:** verify *every* text/background pair with the `contrastcap` MCP. `bone-500`
  (`#737b96`) on `ink-850` computes to ≈**4.64:1** — it passes AA for normal text, but only
  just, and it is used at 0.62rem. **Lighten `bone-500` if contrastcap reports < 4.5:1.**
- All decorative glyphs (backdrop suits, watermarks, chrome rules) are `aria-hidden`.
- Heading order preserved: `h1` hero → `h2` zone → `h3` cabinet.
- External links keep the existing `sr-only` "opens in a new tab".
- **`prefers-reduced-motion: reduce` kills:** wordmark flicker, bulb chase (bulbs stay
  lit), ticker scroll, zone-sign breathe, backdrop sweep + suit drift, status pulse,
  equaliser bars, door bob, smooth scroll.

## Performance

- **Animate only `opacity` and `transform`.** Every animation in the design already
  complies: ticker (`transform`), bulbs (`opacity`), flicker (`opacity`), sweep
  (`transform`), suits (`transform`), sign breathe (`opacity`). No animated `box-shadow`
  or `filter` on repeated elements.
- Zero new fonts, zero images — all decoration is CSS or inline SVG (`img-src 'self' data:`).
- Audio is `preload="none"` and fetched only on opt-in; it never touches first paint.
- Site stays a static prerender (`nitro.preset = 'netlify_static'`).
- **Targets: Lighthouse performance ≥ 95, accessibility 100.** Verify with `lightcap`.

## Out of scope / open items

- **Real house-edge percentages.** Deferred by decision, not oversight. The badge is a
  string; swap it once each app's actual model is confirmed.
- **The second audio bed** (`casino-ambiance`, 7.5 MB) is unused.
- **Raw audio in git.** The two source MP3s total 9.4 MB. Recommendation: add `audio/` to
  `.gitignore`, commit only the compressed `public/audio/*`, and keep the ffmpeg pipeline
  above in the README so the assets are reproducible from a fresh download. *Owner's call.*
- **Audio attribution.** The beds are freesound_community uploads (Pixabay Content
  License — commercial use, no attribution required). Credit them in the README anyway;
  it's an open-source project.
