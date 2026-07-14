# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
