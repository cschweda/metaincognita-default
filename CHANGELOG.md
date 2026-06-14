# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
