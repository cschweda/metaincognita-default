# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-07-14

The big cabinets get artwork, not a watermark.

### Added
- **Bespoke line-art scenes on the three big cabinets.** Blackjack gets a felt-arc table
  with two fanned cards and a chip stack; Flameout gets its crash curve with a rocket
  riding it and multiplier ticks up the axis; PAO gets a 52-card lattice with one
  Person–Action–Object triplet firing across it. All three stand on the same perspective
  floor, receding to a vanishing point.
- `CabinetArt.vue`, and an optional `art` key on `CatalogItem`. Where a cabinet has a
  scene it supersedes the watermark glyph; the glyph stays as the fallback for a big
  cabinet nobody has drawn yet.

### Changed
- **No scene names a colour.** Every stroke resolves through `currentColor`, which each
  cabinet sets to its own accent — so Blackjack renders green, Flameout orange and PAO
  teal with no per-scene decision, and the three cannot drift apart. A future cabinet gets
  coherent art by setting one hex value in `catalog.ts`.
- The banner's title and description are capped at 44rem. Uncapped they ran ~1100px — a
  measure no one should have to read, and one that reached across the artwork.

### Not done: reusing each app's `og:image`
The obvious idea, investigated and rejected on four counts, recorded so nobody has to
re-litigate it:
- **They already contain the cabinet's own text.** Flameout's reads *"Watch the multiplier
  climb. Cash out before the crash. Then see why the house always wins"* — word for word
  the description the cabinet renders as live text. Every feature tile would state itself
  twice, once as unselectable, untranslatable pixels.
- **The CSP forbids them.** `img-src 'self' data:`, and a subdomain is a separate origin.
  The 2.0.0 spec locked that down on purpose: all decoration is CSS or inline SVG.
- **They don't cohere.** Blackjack is green felt on a blueprint grid, Flameout a purple
  starfield. Three tiles would read as three brands.
- **They don't all exist.** Craps, Video Poker and PAO ship none — and PAO is one of the
  three tiles that needed one. Hold'em declares one that 404s to the SPA shell.

### Accessibility
- Scenes are `aria-hidden` and contribute nothing to the accessible name. Each fades out
  before the copy begins rather than sitting behind it at low alpha.
- Below 980px the artwork scales with the tile but the copy does not, so a scene slides
  under the description as the viewport narrows — bone-300 on a full-strength stroke
  measures 1.03:1, which is not low contrast but invisible. The art is held to ambient
  strength there. No new contrast failures against the pre-change baseline.
- Reduced motion needs no new code: the global rule already stops every animation, and the
  scenes are composed to read correctly standing still.

## [2.1.0] - 2026-07-14

Sound is now off. Always.

### Changed
- **Floor audio is off on every page load, without exception.** It was on by default,
  behind an arrival curtain. That turned out to be far more annoying in practice than it
  looked on paper.
- **Nothing is persisted.** There is deliberately no stored audio preference now. If we
  remembered an "on" choice, a reload would leave the switch reading *on* over a silent
  page — browsers won't start audio without a gesture — and one stray click would bring
  the noise back unannounced. Nothing stored means nothing to be surprised by. Reload,
  revisit, come back tomorrow: silence.
- The equaliser bars on the switch read from whether the floor is *actually audible*
  rather than from the setting, so the control can never claim to be playing over a
  silent page.

### Removed
- **The Doors** — the arrival curtain. Its only job was supplying the user gesture that
  browsers require before audio may play. With sound off by default it had no job left,
  and a curtain that says "click anywhere" and then does nothing is just a click tax on
  every visit. The status-bar switch is the gesture now.

### Unchanged
- `play()` is still never called outside a user-gesture handler, and `preload="none"`
  still means zero audio bytes are fetched until the switch is actually flipped.

## [2.0.0] - 2026-07-13

A ground-up visual rebuild: from restrained "casino noir" to a modern casino floor.

> **Superseded in 2.1.0:** the audio behaviour described below (on by default, behind
> The Doors) is gone. Sound is off on every load and The Doors were removed.

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
- Vitest + `@nuxt/test-utils` test suite (**62 tests**, covering catalog data integrity,
  the audio composable's no-autoplay guarantee, the doors' focus trap, and the
  JSON-LD structured data).
- Extraction of the JSON-LD builder to `app/utils/jsonLd.ts`.

### Changed
- `catalog.ts` is now zone-shaped (`zones`, `allItems`); `simulations` / `tools` removed.
- Per-item accents saturated for neon.
- Status bar restyled and now hosts the audio switch.

### Fixed
- Reduced-motion now uses `animation: none` rather than the common `0.01ms` idiom —
  `0.01ms` runs each animation once and lands it on its *end* keyframe, which for the
  bulb chase is `opacity: 0.3`, i.e. **dark bulbs**. `none` reverts to the static
  value, leaving them lit.
- No animation touches `box-shadow`, `filter`, or any layout property — in
  `transition:` lists as much as in `@keyframes`.
- The status-bar GitHub link keeps an accessible name at phone widths, where its
  visible label is hidden.
- The sound switch's accessible name matches its visible text (WCAG 2.5.3 Label in Name).
- `bone-500` lightened to `#949db5` for contrast headroom on the smallest mono captions.

### Removed
- `AppCard.vue` (superseded by `GameCabinet.vue`).
- `SectionHeading.vue` (superseded by `ZoneSign.vue`).

### Notes
- **Badges are deliberately non-numeric.** We do not print house-edge percentages we
  cannot source from the apps themselves — the roulette wheel's zero count, Flameout's
  real edge, and the video-poker pay table are all unconfirmed. The badge is a plain
  string in `catalog.ts`; swap it once each figure is verified.

## [1.0.0] - 2026-06-14

Initial release — a from-scratch rebuild of the metaincognita landing page.

### Added
- **Nuxt 4** app (the `app/` directory structure) + **Nuxt UI 4** + **Tailwind CSS v4**, prerendered to static HTML for Netlify.
- **Casino-noir design** — gold-on-black palette, film grain, drifting suit glyphs, per-item accent glow with a cursor-tracking spotlight on each card.
- **Infographic typography** — Sora (geometric display + body) and Geist Mono (technical labels), self-hosted at build via `@nuxt/fonts`.
- **Simulations** section — eight casino simulations (Blackjack, No-Limit Hold'em, Roulette, Slots, Craps, Video Poker, Flameout, Pachinko), each linking to its `<name>.metaincognita.com` deployment.
- **Tooling** section — PAO Speed Trainer.
- Data-driven catalog (`app/data/catalog.ts`): each simulation/tool is a single array entry.
- Prominent **"not gambling"** messaging — no real money, no accounts, no login, no AI — surfaced as hero chips and reinforced in the footer.
- Fixed **open-source status bar** linking `github.com/cschweda` (MIT · free to use · fork · self-host).
- Branded **og-image** (1200×630), `favicon.svg`, and full SEO/OpenGraph/Twitter meta.
- **Plausible** analytics.
- **Netlify** deploy config (`netlify_static` nitro preset → `dist`) with security headers and a Content-Security-Policy.
- **MIT** license.

### Changed
- Replaced the previous Nuxt 3 + Vuetify starter entirely.
- Switched the package manager from Yarn to **pnpm**; pinned **Node 22** via `.nvmrc`.
