# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-07-18

The AmToy wing opens, and every cabinet shows its source.

### Added
- **A new zone: AmToy.** *Games That Think!* — playable homages to a completely fictional
  American toy company (1961–1983), invented from scratch so the retro-toy recreations
  step on no one's trademarks. Two wide cabinets stand shoulder to shoulder under a sign
  in the logo's own LED red: **AmToy: The Whole Story** (`amtoy.netlify.app`), the
  magazine-style corporate history, and the **Rovacon Voice Bench**
  (`rovacon-voice.netlify.app`), the flagship's Votrax-class voice chip rebuilt in the
  browser. Its badge caption is lifted straight from the lore: *the voice that shouldn't
  exist*. The wing grows next — a full Rovacon toy simulation is in the works.
- **Two new wide scenes.** The history cabinet gets a gaudy box-art sunburst — thirteen
  rays, long-short-long — crowning the flagship rover, photo-eye lit and one keypad key
  glowing mid-command. The voice bench gets the DIP package itself, a quantized formant
  burst stepping out of its output pin and decaying into the copy fade, over seven
  phoneme ticks: R OH: V AH K AA: N. Both stand on the roulette/pachinko substrate and,
  like every scene, name no colour of their own.
- **The cream cabinet.** The voice bench's accent is VoxAm cream (`#f4efe6`) — red beside
  cream is the AmToy logo's own two-tone, and the first white-neon cabinet on the floor.
- **Every cabinet now links its source.** A quiet mono `source` link with the GitHub mark
  sits in each cabinet's footer row, straight to the app's repository — every app on the
  floor is open source, so the floor now says so, per cabinet. The one gap is the
  hold'em repo, private for now; its cabinet simply shows no source link rather than a
  dead one. The JSON-LD carries each repository as `sameAs`, and the README tables grew
  a Source column.

### Changed
- **The cabinet is an `article` now, not one big anchor.** Two links per cabinet means
  nested anchors — invalid HTML — so the live link stretches itself over the tile via a
  `::after` overlay (the card still plays like a single button, ring and lift intact via
  `:has()`), and the source link floats above the overlay on its own z-index. Both links
  name their app to screen readers, so eleven "source" links stay distinguishable.
- The hero's sub-paragraph and ghost links follow the floor: *Tools for fun* (#arcade)
  and *AmToy games* (#amtoy). Meta description, JSON-LD and README all now name the
  toy company that never existed.

### Removed
- **The Mind is off the floor — for now.** The PAO Speed Trainer's zone is parked while
  it is rethought, not retired: the 52-card lattice scene stays drawn and tested in
  `CabinetArt.vue`, so its return is a one-line catalog edit.

## [2.4.1] - 2026-07-18

The floor stops preaching, and admits it was curious the whole time.

### Changed
- **Retoned the landing copy off the honesty-crusade and onto the mathematics — and the
  curiosity behind it.** The 2.4.0 hero read like a slogan (*"Every machine on this floor
  tells the truth."*); it now reads **"Nothing at stake. Everything simulated."** The
  sub-paragraph reframes the site as what it actually is — *a small, curated collection of
  open-source projects, built out of pure curiosity* — casino simulations that show their
  math, memory trainers, and games just for fun. No "truth", no "honest", no "expose/reveal"
  left doing moral work anywhere on the page.
- **An origin line in the footer.** This stuff has been rolling around one head for a long
  time: *"In the works, one way or another, since a video poker game I wrote on a TRS-80
  Model III — sometime in the 1980s, in BASIC."* The Video Poker trainer on the floor is its direct
  descendant.
- Footer eyebrow *an honest floor* → *all simulation, all source*.
- **Ticker:** the two lines that had drifted toward sermon are retoned to the register of the
  one everyone liked (*"The math is the point"*): *"Every edge is published"* →
  **"The edge is just arithmetic"**, and *"Nothing here is rigged — it doesn't need to be"* →
  **"Fake chips, real math"**. The factual joke (*"The house always wins"*) stays.
- Meta description, JSON-LD and the README swept for the same vocabulary and reframed as a
  curated, curiosity-driven collection whose sims show their math. The Arcade sub drops a
  stray "reveal"; the Pit and Machines keep their edge-facts (they are, genuinely, about the
  math).

## [2.4.0] - 2026-07-18

The Arcade opens — and the floor stops being all about the edge.

### Added
- **A fourth zone: The Arcade.** The floor was three rooms about the house edge and one
  about memory; it is a collection now. The Arcade is where nothing is rigged because
  nothing is at stake — games built for the joy of it, under an AFX-orange sign. First
  cabinet in: **AFX Slot Car Racing** (`slotcar.netlify.app`), a photoreal 1970s Aurora
  HO sim — analog trigger throttle, real deslot physics, race a fallible AI or practice
  solo. Its badge names the hook, not a number: *Analog throttle · no house, just the track*.
- **A slot-car scene for the banner.** It is the roulette wheel's own construction,
  re-themed: concentric ellipses squashed into the floor's perspective — outer rail, two
  dashed lanes, an inner apron, rumble ticks around the rim — with a car mid-corner on the
  near stretch, tail hung out and motion streaking off it. Like every scene it names no
  colour; the whole oval inherits the cabinet's AFX orange from one hex in `catalog.ts`.
- A cabinet can now live anywhere. The slot car ships on `slotcar.netlify.app`, so the
  catalog no longer assumes every app is a `metaincognita.com` subdomain — any bare
  hostname works, and the tests check for one rather than for the old suffix.

### Changed
- **The hero is about the collection now, not the edge alone.** The tagline moves from
  *"The house edge, revealed."* to **"Every machine on this floor tells the truth."** The
  edge-revealing identity is not gone — it stays down in the Pit and Machines intros, where
  it is literally true, rather than stretched across memory trainers and slot cars. The
  sub-paragraph names all three families plainly, the eyebrow reads *a collection · not
  gambling* (the not-gambling disclaimer is load-bearing and stays), and a third hero link,
  *Tools for fun*, reaches The Arcade. The footer's old *the house edge, revealed* becomes
  *an honest floor*.
- **"No AI" is now "No generative AI" — everywhere it appears** (hero chip, ticker thesis,
  footer, JSON-LD). The site has always had scripted opponents — Hold'em's bots, and now
  the slot car's rival driver — which are game AI, not a language model. The bare "No AI"
  chip was a lie waiting for anyone who had just raced that car; the precise claim is the
  kind of honesty the rest of the site is built on. There is no generative model anywhere,
  and the copy now says exactly that.
- Title, meta description, JSON-LD and the README reposition to the collection — casino
  simulators, memory trainers, and games built for fun.

## [2.3.0] - 2026-07-17

Floor polish: the wides get scenes, mobile gets a marquee, the small type gets a notch.

### Added
- **Scenes on the two wide cabinets.** Roulette gets its wheel in perspective — rim, dashed
  ball track, the pegs between pockets, a ball riding the outer track — with a scatter of
  simulated outcomes on the floor beside it. Pachinko gets its staggered pin field, one
  ball's bounce path kinking pin to pin, and five payout pockets with exactly one lit.
  The 2.2.0 spec scoped the wides out as "already dense"; filling the big tiles falsified
  that — they had become the only tiles on the floor with a dead half.
- **The cabinet art survives phones now.** Below 620px a feature or wide scene stops being
  a 0.3-opacity backdrop smudge and becomes the cabinet's marquee screen: an in-flow,
  hairline-bordered panel under the bulb strip. No copy ever sits on it, so it runs at
  full strength — the contrast argument that forced 0.3 dissolves instead of being
  re-balanced. (The banner stays a backdrop: 52 lattice cells in a ~340px panel is mud.)
- **Reveals now happen where you can see them.** Cabinets and zone signs animate on
  viewport entry (`animation-timeline: view()`) instead of all firing at page load and
  finishing unwatched below the fold. Browsers without view timelines get the load-time
  behaviour unchanged; reduced motion kills it like everything else.
- `apple-touch-icon.png` — iOS share sheets and home screens got a page screenshot before.

### Changed
- **Nothing on the page renders below 0.66rem any more.** The caption tier came up one
  notch across the board: badge captions 0.56→0.66rem, domains 0.62→0.7rem, status bar
  0.64→0.7rem, hero chips 0.66→0.7rem, badge chips 0.68→0.72rem, zone counts
  0.68→0.72rem, ticker 0.72→0.76rem. Contrast was always engineered; size now is too.
- The ticker's glow dropped from a 10px/0.9 wash to a 7px/0.55 halo — at 12px the old
  bloom muddied the letterforms it was supposed to flatter.
- **Copy pass.** The "No login" chip is gone ("No accounts" said it already). The hero's
  ghost CTA says "Tools for the mind" — button, sign and zone title now share one name.
  Five badge captions rewritten so no caption repeats its own description, shadows a
  zone headline, or shares a formula with its neighbours: craps "the zero-edge bet",
  roulette "no rigging required", flameout "cash out or burn", pachinko "the house sets
  the pins", video poker "ranked by expected value". Descriptions stay verbatim — they
  are lifted from each app's own metadata.
- A wide's copy box is capped at 21rem, same mechanism and reasoning as the banner's
  44rem cap: the fade needs an edge it can clear.

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
