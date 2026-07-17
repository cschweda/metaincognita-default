# metaincognita — floor polish: the wides get scenes, mobile gets a marquee, the small type gets a notch

**Date:** 2026-07-17
**Status:** Approved
**Extends:** the "Neon Palace" redesign (2026-07-13) and the cabinet-art spec (2026-07-14)

## Where this came from

A full review of the shipped 2.2.0 page (code read, desktop + 390px screenshots, Lighthouse
100/100/100/100, contrastcap). Six findings were approved for fixing in one pass. Two of
them **supersede decisions recorded in the 2026-07-14 spec**, and this document exists
mostly so that spec's scope lines don't get re-cited against the changes.

## 1. The wide cabinets get scenes (supersedes "the two `wide` cabinets are not touched")

The 07-14 spec scoped the wides out as "already dense." Filling the feature and banner
tiles falsified that: Roulette and Pachinko are now the only tiles on the floor with a
dead half, and they sit directly beside the most decorated tiles on the page. The fix that
made the big tiles read as furnished made the wides read as vacant.

- `ArtKey` gains `'roulette' | 'pachinko'`; both wide items set `art`.
- The `GameCabinet` gate changes from *feature-or-banner* to ***anything but `std`***.
  The watermark glyph remains the fallback for any roomy cabinet without a scene — the
  invariant "art and watermark never both render" is untouched.
- Scenes are composed at **558×240** (the measured desktop wide tile), on the same
  substrate (perspective floor, bloom, `currentColor`-only hero, no `<defs>`):
  - **Roulette** (`#ff4d63`): perspective wheel right-of-centre — rim, dashed ball track,
    pocket ticks, hub — ball on the track, scatter of outcome dots on the floor to the
    left. The dots are the "proven fair by simulation" claim drawn literally.
  - **Pachinko** (`#ff5bb0`): staggered pin lattice, one ball's bounce path drawn down
    through it (the `curve` stroke, same weight as Flameout's crash curve), five payout
    pockets at the base with **exactly one lit** — the same lit-vs-unlit language as PAO's
    triplet. Pins get one new shared stroke class (`.pin`); it names no colour.
- Like the banner, a wide **must not `slice`** (it is 2.3:1 at 1180 and ~3.6:1 at 900):
  `xMaxYMid meet`, pinned to the dead space.
- The wide's copy box is capped (`.cab-wide .cab-title/.cab-desc { max-width: 21rem }`) —
  same reasoning, same mechanism as the banner's 44rem cap — and the scene fades sideways
  off the copy exactly as the banner does.

## 2. Mobile: the art becomes a marquee screen (supersedes the <620px `opacity: 0.3` treatment)

The 07-14 spec held the scene at 0.3 opacity below 620px because every band it could
occupy has copy in it, and full-strength strokes under bone-300 measured as low as 1.03:1.
That was the right call for art-as-backdrop — and it reduced the page's best asset to a
smudge precisely on the viewport most visitors use.

The way out is to stop putting copy on the art. Below 620px, a `feature` or `wide` scene
leaves the backdrop layer and becomes an **in-flow panel at the top of the cabinet** — a
rounded, hairline-bordered "screen" under the bulb strip, the way a real cabinet carries
its display. No text ever sits on it, so it runs at **full opacity** and the entire
contrast argument dissolves rather than being re-balanced.

- `position: relative; inset: auto` (in flow, and still the containing block for the
  bloom — `static` would let the bloom escape to fill the whole cabinet).
- Aspect: `8 / 5` for a feature scene — under its existing `xMidYMid slice` this shows
  viewBox y≈104–454, which is precisely the composed hero band (y105–355) plus floor
  foreground. The wide scenes use their own `558 / 240` ratio, so `meet` fits them
  exactly, no letterbox.
- The mask, the `translateY(-45px)` lift and the 0.3 opacity are all overridden in band
  mode; the panel's edges are intentional, so no fade is needed.
- The **banner keeps the 07-14 backdrop treatment on mobile**: the 52-cell lattice at
  ~340px wide would render 6px cells — mud in a panel, fine as ambience.

## 3. Scroll-triggered reveals (progressive)

Every `.reveal` fires at t=0, so all below-fold entrances finish unwatched; the cabinet
stagger only ever performs for the first row. New class `reveal-view` on cabinets and zone
signs; inside `@supports (animation-timeline: view())` it re-times the same `reveal`
keyframes to viewport entry (`animation-range: entry 0% entry 40%`), with
`animation-delay: 0s !important` to neutralise the inline stagger — entry order **is** the
stagger. Browsers without support get today's load-time behaviour verbatim; the hero keeps
plain `.reveal` (its load-time stagger is the point). Fill stays `backwards` — the
07-13 lesson about `forwards` outranking author rules holds for view timelines too.
`prefers-reduced-motion` needs no new code: the global `animation: none` kills this like
everything else.

## 4. The caption tier comes up one notch

Contrast was engineered (5.29:1 floor) but size wasn't: the caption tier bottoms out at
0.56rem ≈ 9px. Nothing on the page renders below **0.66rem** after this pass:

| Voice | Was | Becomes |
|---|---|---|
| Badge caption (`.badge span`) | 0.56rem | 0.66rem (tracking 0.1em → 0.08em) |
| Domain row (`.dom`) | 0.62rem | 0.7rem |
| Status bar | 0.64rem | 0.7rem |
| Hero chips | 0.66rem | 0.7rem |
| Badge chip (`.badge b`) | 0.68rem | 0.72rem |
| Zone count | 0.68rem | 0.72rem |
| Ticker tape | 0.72rem | 0.76rem, glow `0 0 10px @ 0.9` → `0 0 7px @ 0.55` |

The hierarchy (eyebrow < caption < label) survives; only the floor rises. The ticker's
glow drops because a 10px blur at 0.9 alpha on 11.5px text muddies letterform edges —
the pixel sampler read the halo as background at 3.76:1.

## 5. Copy pass

- Hero chips: **"No login" is cut** — it is "No accounts" said twice, and it costs a
  wrapped line on mobile.
- The ghost CTA **"Tooling" → "Tools for the mind"** — button, sign and zone title now
  share one name for one destination.
- Badge notes (landing-page copy, fair game — descriptions are lifted from the apps and
  stay untouched). Rule applied: a note may not repeat its own description or shadow a
  zone headline.

| Cabinet | Was | Becomes | Why |
|---|---|---|---|
| Craps | "where the edge hides" | **"the zero-edge bet"** | Shadowed the Machines H2; the odds bet's 0% edge is the app's actual hook |
| Roulette | "proven fair" | **"no rigging required"** | Verbatim in its own description; new line echoes the ticker thesis instead |
| Flameout | "why the house wins" | **"cash out or burn"** | Verbatim in its own description |
| Pachinko | "the odds behind the pins" | **"the house sets the pins"** | Verbatim in its own description; and "every pocket priced" would have made three "every …" captions sit side by side in one zone |
| Video Poker | "pay-table literacy" | **"ranked by expected value"** | Verbatim in its own description; and "every hold ranked" would have sat directly beside "every reel weight" |

Kept: "plus the hi-lo count", "odds as you play", "every reel weight", "no edge — it's a
tool" (partial echoes at worst, and the last one is the best line on the page).

## 6. apple-touch-icon

180×180 opaque PNG rendered from `favicon.svg` (gold spade on the dark tile), linked from
the head. iOS otherwise falls back to a page screenshot on share sheets and home screens.

## Testing

- `catalog.spec`: the big-cabinet rule becomes *every non-`std` item carries `art`, no
  `std` item does*.
- `CabinetArt.spec`: keys extended; wides assert `art-wide` + `xMaxYMid meet`; pachinko
  deals five pockets and lights exactly one.
- `GameCabinet.spec`: the two std/wide loops split — `std` never renders scene or mark;
  `wide` renders the scene with `art` and the watermark without.
- Everything else passes unchanged.

## Out of scope

The ~146 KiB unused-JS observation (framework tax; perf is 100 regardless), the ticker's
duplicate thesis lines (deliberate ambience), and any raster/CSP change.
