# metaincognita

The landing page for **metaincognita** — a collection of casino games rebuilt as
honest, open-source **simulations** that expose the math the floor never shows, plus a
growing set of **tools** for a sharper mind.

> **Not a gambling site.** No real money, no accounts, no logins, no AI — just
> simulations you run in your browser. Everything is open source and free to fork.

**Live:** https://metaincognita.com

This repository is *only* the landing page. Each project below is its own deployment and
its own repository under [`github.com/cschweda`](https://github.com/cschweda); the page
simply links out to them.

## The collection

### Simulations — casino games

| Simulation | Live | What it is |
| --- | --- | --- |
| Blackjack Trainer | `blackjack.metaincognita.com` | Basic-strategy coaching and Hi-Lo card counting on official-rulebook rules. |
| No-Limit Hold’em | `holdem.metaincognita.com` | Texas Hold’em vs. intelligent bots, with live equity, outs, pot odds and ranges. |
| Roulette Trainer | `roulette.metaincognita.com` | A real forward-physics wheel, proven fair by simulation. |
| Slots Simulator | `slots.metaincognita.com` | Reel strips, virtual-reel weights and exact house edge across eight archetypes. |
| Craps Simulator | `craps.metaincognita.com` | Learn the line, the odds bets and where the edge hides. |
| Video Poker Trainer | `video-poker.metaincognita.com` | Optimal play, pay-table literacy and bankroll management. |
| Flameout | `flameout.metaincognita.com` | A crash-game simulator: climb, cash out, then see why the house always wins. |
| Pachinko Parlor | `pachinko.metaincognita.com` | Ball-drop physics and payout pockets, with the odds laid bare. |

### Tooling

| Tool | Live | What it is |
| --- | --- | --- |
| PAO Speed Trainer | `pao.metaincognita.com` | Drill the Person–Action–Object system across all 52 cards until each triplet fires as one reflex. |

## Tech stack

- **[Nuxt 4](https://nuxt.com)** with the `app/` directory structure, prerendered to static HTML (SSG)
- **[Nuxt UI 4](https://ui.nuxt.com)** + **Tailwind CSS v4**
- Self-hosted fonts via `@nuxt/fonts` — **Sora** (geometric, infographic-style display + body) and **Geist Mono** (technical labels)
- Lucide icons (`@iconify-json/lucide`, bundled at build — no runtime Iconify calls)
- [Plausible](https://plausible.io) analytics (`@nuxtjs/plausible`)
- **pnpm** · **Node 22**

## Project structure

```
app/
  app.vue              # UApp wrapper + global backdrop + grain + status bar
  app.config.ts        # Nuxt UI theme (gold primary, warm neutrals)
  assets/css/main.css  # design tokens, palette, grain, reveal animations
  components/
    AppCard.vue        # the simulation/tool card (accent glow + cursor spotlight)
    SectionHeading.vue # mono eyebrow + bold headline
    TheBackdrop.vue    # gold glow, felt undertone, drifting suit glyphs
    TheHero.vue        # wordmark, tagline, CTAs, "not gambling" chips
    TheStatusBar.vue   # fixed open-source / GitHub status bar
    TheFooter.vue
  data/catalog.ts      # the single source of truth for simulations + tools
  pages/index.vue      # composes hero + Simulations + Tooling + footer
public/                # favicon.svg, favicon.ico, og-image.png, robots.txt
nuxt.config.ts         # SEO/OG head, netlify_static preset, modules
netlify.toml           # security headers + CSP
```

## Adding a simulation or tool

Everything on the page is data-driven. Edit [`app/data/catalog.ts`](app/data/catalog.ts)
and append to the `simulations` or `tools` array:

```ts
{
  title: 'New Game',
  description: 'One honest line about what it teaches.',
  domain: 'new-game.metaincognita.com', // shown as the live-link label
  icon: 'dice-6',                        // any lucide name -> i-lucide-dice-6
  accent: '#e0a92e'                      // hex driving the card's glow + icon tint
}
```

No template changes are needed — the cards, counts and grid update automatically.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000 (Nuxt picks the next free port if taken)
```

## Build

```bash
pnpm generate     # static site emitted to ./dist
pnpm preview      # preview the production build locally
```

## Deploy (Netlify)

Configured in [`netlify.toml`](netlify.toml):

- **Build command:** `pnpm generate`
- **Publish directory:** `dist`
- **Node version:** 22 (also pinned in `.nvmrc`)

The `netlify_static` nitro preset generates `dist/_redirects` (unknown paths → the
prerendered 404) and `dist/_headers` (immutable caching for `/_nuxt/*` and `/_fonts/*`).
`netlify.toml` layers on the security headers nitro does not emit, including a
Content-Security-Policy scoped to self-hosted assets, inline styles/scripts Nuxt emits,
and Plausible.

The social share card is `public/og-image.png` (1200×630), referenced by the OG/Twitter
meta tags in `nuxt.config.ts`.

## License

[MIT](LICENSE) © 2026 metaincognita — free to use, fork, and self-host.
