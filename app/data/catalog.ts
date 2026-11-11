/**
 * Footprint on a zone's mosaic grid. DOM order matters — see main.css.
 * `shot` is The Workshop's tile: half the floor wide, led by the app's own
 * og:image instead of a drawn scene. `showcase` is the same picture across the
 * whole floor, set beside the copy — for an umbrella project with a suite to list.
 */
export type Span = 'std' | 'wide' | 'feature' | 'banner' | 'shot' | 'showcase'

/**
 * Selects a cabinet's bespoke line-art scene. See CabinetArt.vue.
 * `pao` currently has no cabinet: The Mind is off the floor while its zone is
 * rethought, and the scene waits in CabinetArt.vue for its return.
 */
export type ArtKey = 'blackjack' | 'holdem' | 'flameout' | 'roulette' | 'pachinko' | 'pao' | 'slotcar' | 'vogeltronics' | 'rovacon' | 'gridiron'

export interface CatalogItem {
  /** Display name shown on the cabinet. */
  title: string
  /** One-line description, lifted from each app's own metadata. */
  description: string
  /**
   * Bare hostname; the cabinet's live-link affordance. Usually a
   * `<name>.metaincognita.com` subdomain, but a project can live anywhere it
   * likes (The Arcade's slot car sim ships on `slotcar.netlify.app`).
   */
  domain: string
  /**
   * Full GitHub URL; the cabinet's view-source affordance. Every app is open
   * source — optional only so a cabinet whose repo has not gone public yet
   * shows no link rather than a dead one.
   */
  repo?: string
  /** lucide icon name (rendered as `i-lucide-<icon>`). Never an emoji. */
  icon: string
  /** Per-item neon accent driving the glow, bulb strip, ring and icon tint. */
  accent: string
  /**
   * The gold chip: the *method* by which this app exposes the edge.
   * Deliberately non-numeric — we do not print house-edge percentages we
   * cannot source from the app itself. See the design spec.
   */
  badge: string
  /** Caption beneath the chip. */
  badgeNote: string
  span: Span
  /**
   * The bespoke scene that fills the tile's dead band. Every roomy span gets
   * one — only a `std` cabinet has no room, and would just be crowded. Where it
   * is set it replaces the watermark glyph; the two must never both render.
   */
  art?: ArtKey
  /**
   * A `shot` cabinet's picture: the app's own og:image, copied into
   * `public/workshop/` (the CSP is `img-src 'self'`, so it must be same-origin).
   * Root-relative path, e.g. `/workshop/drafter.webp`.
   */
  shot?: string
  /**
   * An umbrella project's member tools, each a name, a one-line note and its
   * source repo (two tools may share one), listed under the description. Only a
   * `showcase` cabinet has room for it.
   */
  suite?: { name: string, note: string, repo?: string }[]
  /** One closing line after the suite: what is still to come. */
  suiteMore?: string
  /**
   * A short state worth flagging, e.g. `In development`: drawn as a ribbon across
   * the top-right corner of the picture, so only a `shot` or `showcase` cabinet
   * can carry one.
   */
  status?: string
  /** schema.org applicationCategory. Defaults to `GameApplication`. */
  category?: string
}

export interface Zone {
  /** Scroll anchor and grid modifier (`.floor-<id>`). */
  id: 'pit' | 'machines' | 'workshop' | 'fiction' | 'arcade' | 'vogeltronics'
  /** Text inside the neon tube sign. */
  sign: string
  /** Zone neon colour. */
  color: string
  title: string
  sub: string
  /** Singular noun; ZoneSign pluralises it by count. */
  unit: string
  items: CatalogItem[]
}

export const zones: Zone[] = [
  {
    id: 'pit',
    sign: 'The Pit',
    color: '#2fe58f',
    title: 'Play the house at its own game.',
    sub: 'Table games rebuilt as open-source simulations — true odds, basic strategy, and the exact house edge, all out in the open. No money, no sign-up.',
    unit: 'table',
    items: [
      {
        title: 'No-Limit Hold’em',
        description: 'No-Limit Texas Hold’em against 27 bots, with live equity, outs, pot odds and hand ranges as you play, and every hand there to replay and study.',
        domain: 'holdem.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-holdem',
        icon: 'club',
        accent: '#8a8cff',
        badge: 'Live equity',
        badgeNote: 'odds as you play',
        span: 'feature',
        art: 'holdem'
      },
      {
        title: 'Blackjack Trainer',
        description: 'Basic-strategy coaching and Hi-Lo card counting on rules taken straight from official casino documents.',
        domain: 'blackjack.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-blackjack',
        icon: 'spade',
        accent: '#2fe58f',
        badge: 'Basic strategy',
        badgeNote: 'plus the hi-lo count',
        span: 'std'
      },
      {
        title: 'Craps Simulator',
        description: 'A browser craps table for learning the line, the odds bets and where the edge really hides.',
        domain: 'craps.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-craps',
        icon: 'dice-5',
        accent: '#35baff',
        badge: 'True odds',
        badgeNote: 'the zero-edge bet',
        span: 'std'
      },
      {
        title: 'Roulette Trainer',
        description: 'A real forward-physics wheel, proven fair by simulation — see exactly why you can’t beat it.',
        domain: 'roulette.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-roulette',
        icon: 'disc-3',
        accent: '#ff4d63',
        badge: 'Real physics',
        badgeNote: 'no rigging required',
        span: 'wide',
        art: 'roulette'
      }
    ]
  },
  {
    id: 'machines',
    sign: 'The Machines',
    color: '#ff1ba6',
    title: 'Where the edge hides in plain sight.',
    sub: 'Reels, pins and multipliers. The loudest machines on any floor — and the ones that take the most. Here is exactly how.',
    unit: 'cabinet',
    items: [
      {
        title: 'Slots Simulator',
        description: 'Reel strips, virtual-reel weights and the exact-enumeration house edge across eight machine archetypes.',
        domain: 'slots.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-slots',
        icon: 'cherry',
        accent: '#ffb62e',
        badge: 'Exact odds',
        badgeNote: 'every reel weight',
        span: 'std'
      },
      {
        title: 'Video Poker Trainer',
        description: 'Optimal play, pay-table literacy and bankroll management — taught one hand at a time.',
        domain: 'videopoker.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-video-poker',
        icon: 'diamond',
        accent: '#c46bff',
        badge: 'Optimal play',
        badgeNote: 'ranked by expected value',
        span: 'std'
      },
      {
        title: 'Pachinko Parlor',
        description: 'Ball-drop physics and payout pockets, with the odds behind the pins laid bare.',
        domain: 'pachinko.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-pachinko',
        icon: 'circle-dot',
        accent: '#ff5bb0',
        badge: 'Ball physics',
        badgeNote: 'the house sets the pins',
        span: 'wide',
        art: 'pachinko'
      },
      {
        title: 'Flameout',
        description: 'Watch the multiplier climb, cash out before the crash — then see why the house always wins.',
        domain: 'flameout.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-flameout',
        icon: 'flame',
        accent: '#ff7a3d',
        badge: 'The crash curve',
        badgeNote: 'cash out or burn',
        span: 'feature',
        art: 'flameout'
      }
    ]
  },
  {
    id: 'workshop',
    sign: 'The Workshop',
    color: '#00d6ff',
    title: 'Tools I build and use.',
    sub: 'Software for writing scripts and stories, taking old machines apart, putting photos on the wall, and keeping an eye on the coffee — plus the everyday tools I wrote for work: a Markdown editor, placeholder text, image compression and an accessibility checker for documents. Next on the bench: Fotobogen, for publishing photographs. Free, open source, no sign-ups, and your files stay yours.',
    unit: 'tool',
    items: [
      {
        title: 'Drafter',
        description: 'Write screenplays and stage plays in plain-text Fountain and watch the formatted pages build as you type, or draft a novel in Markdown.',
        domain: 'drafter.dev',
        repo: 'https://github.com/cschweda/drafter',
        icon: 'clapperboard',
        accent: '#8fb8ff',
        badge: 'Plain-text Fountain',
        badgeNote: 'or classic enter and tab',
        span: 'shot',
        shot: '/workshop/drafter.webp',
        category: 'DesignApplication'
      },
      {
        title: 'Fugløy',
        description: 'Take TRS-80 Model I and III programs apart: a disassembler whose output rebuilds the original byte for byte, a workbench that explains every line, and an emulator.',
        domain: 'fugloy.dev',
        repo: 'https://github.com/cschweda/fugloy',
        icon: 'cpu',
        accent: '#5fe3c9',
        badge: 'Byte-exact round trip',
        badgeNote: 'read faithfully',
        span: 'shot',
        shot: '/workshop/fugloy.webp',
        category: 'DeveloperApplication'
      },
      {
        title: 'OpenMantel',
        description: 'A digital picture frame you host yourself: a small computer behind a monitor, and your photos on every screen in the house. No subscription, no one else’s cloud.',
        domain: 'openmantel.com',
        repo: 'https://github.com/cschweda/openmantel',
        icon: 'image',
        accent: '#ff8a5c',
        badge: 'Self-hosted',
        badgeNote: 'your photos, your server',
        span: 'shot',
        shot: '/workshop/openmantel.webp',
        category: 'MultimediaApplication'
      },
      {
        title: 'aiden-portal',
        description: 'A dashboard for my Fellow Aiden coffee brewer: a live trace of every brew, profiles and schedules, a brew log and a descale tally. It runs on my own machine and is reachable only over Tailscale; the demo runs on invented data.',
        domain: 'aiden-portal.netlify.app',
        repo: 'https://github.com/cschweda/aiden-portal',
        icon: 'coffee',
        accent: '#fbbf24',
        badge: 'Tailscale only',
        badgeNote: 'no public address',
        span: 'shot',
        shot: '/workshop/aiden-portal.webp',
        category: 'UtilitiesApplication'
      },
      {
        title: 'ICJIA Markdown Editor 2.0',
        description: 'Accessible markdown editor for ICJIA researchers. Write, preview, and export markdown documents.',
        domain: 'markdown.icjia.cloud',
        repo: 'https://github.com/ICJIA/icjia-markdown-editor-2026',
        icon: 'file-pen-line',
        accent: '#a98bff',
        badge: 'Accessible editor',
        badgeNote: 'write, preview, export',
        span: 'shot',
        shot: '/workshop/markdown-editor.webp',
        category: 'DesignApplication'
      },
      {
        title: 'Ipsumify',
        description: 'Generate beautiful lorem ipsum placeholder text with markdown support, themed variants, and a free public API — no signup required.',
        domain: 'ipsumify.com',
        repo: 'https://github.com/ICJIA/ipsumify-next-2026',
        icon: 'pilcrow',
        accent: '#2ee6a8',
        badge: 'Free public API',
        badgeNote: 'no signup required',
        span: 'shot',
        shot: '/workshop/ipsumify.webp',
        category: 'UtilitiesApplication'
      },
      {
        title: 'Squish',
        description: 'Privacy-focused image compression for writers and developers. Compress images instantly in your browser with real-time preview. No uploads required.',
        domain: 'squish.icjia.app',
        repo: 'https://github.com/ICJIA/icjia-squish-2026',
        icon: 'shrink',
        accent: '#8be36a',
        badge: 'In your browser',
        badgeNote: 'no uploads required',
        span: 'shot',
        shot: '/workshop/squish.webp',
        category: 'MultimediaApplication'
      },
      {
        title: 'ICJIA Accessibility Audit',
        description: 'Free accessibility checker for PDF, Word, PowerPoint, and Excel: an instant WCAG 2.1 AA score with fix-it guidance for ADA Title II and Illinois IITAA.',
        domain: 'audit.icjia.app',
        repo: 'https://github.com/ICJIA/file-accessibility-audit',
        icon: 'scan-search',
        accent: '#19c9b4',
        badge: 'Instant score',
        badgeNote: 'with fix-it guidance',
        span: 'shot',
        shot: '/workshop/accessibility-audit.webp',
        category: 'UtilitiesApplication'
      },
      {
        // No repo yet: the app is planned but not started, and fotobogen.com is a
        // one-page teaser. Add `repo` when there is one.
        title: 'Fotobogen',
        description: 'Fotobogen is free, open-source software for running your own photo website. Install it, upload your pictures, and publish them at your own address. In development.',
        domain: 'fotobogen.com',
        icon: 'images',
        accent: '#ff3b30',
        badge: 'Your own address',
        badgeNote: 'a photo site of your own',
        span: 'shot',
        shot: '/workshop/fotobogen.webp',
        status: 'In development',
        category: 'MultimediaApplication'
      }
    ]
  },
  {
    id: 'fiction',
    sign: 'Interactive Fiction',
    color: '#ffb627',
    title: 'Games you play by typing.',
    sub: 'In 1979 Infocom wrote its adventures for an imaginary computer, the Z-machine, so one story file could run on every home computer of the day: you type GO NORTH or OPEN MAILBOX, and the game answers in prose. The format outlived the company, and people still write for it. frotz, Inc. is the umbrella for my Z-machine tools, which run in the browser and are open source.',
    unit: 'suite',
    items: [
      {
        title: 'frotz, Inc.',
        description: 'Instruments for the Z-machine: everything that used to come in the box, and a few things that didn’t. Write, build, play, inspect and ship Infocom-style text adventures, all in the browser.',
        domain: 'frotzinc.com',
        repo: 'https://github.com/cschweda/frotzinc',
        icon: 'scroll-text',
        accent: '#ffb627',
        badge: 'One suite',
        badgeNote: 'write, play, inspect, ship',
        span: 'showcase',
        shot: '/workshop/frotzinc.webp',
        suite: [
          {
            name: 'frotzsmith',
            note: 'A browser IDE for Inform 6 and ZIL. The real compilers run as WebAssembly and build Z-machine or Glulx story files on your own machine; play them inline and test them with a skein.',
            repo: 'https://github.com/cschweda/frotzsmith'
          },
          {
            name: 'frotzplay',
            note: 'A Z-machine player built for screen readers and strict security policies. Your story files are never uploaded. Ships as part of frotzlens.',
            repo: 'https://github.com/cschweda/frotzlens'
          },
          {
            name: 'frotzlens',
            note: 'Opens a story file and shows what is inside: header, object tree, dictionary, grammar, strings and cross-referenced disassembly. Fully symbolic with Inform’s debug output.',
            repo: 'https://github.com/cschweda/frotzlens'
          }
        ],
        suiteMore: 'Still to come: a debugger, a release packager, a linter and a regression tester.',
        category: 'DeveloperApplication'
      }
    ]
  },
  {
    id: 'arcade',
    sign: 'The Arcade',
    color: '#ff6a2b',
    title: 'Games for fun.',
    sub: 'No edge here, nothing to beat — just games built for the joy of it. Starting with a slot car track from 1971; more on the way.',
    unit: 'game',
    items: [
      {
        title: 'AFX Slot Car Simulator',
        description: 'Photoreal 1970s HO slot cars — squeeze the trigger, brake into the corner, or fly off into the shag carpet.',
        domain: 'slotcar.netlify.app',
        repo: 'https://github.com/cschweda/slotcarsim',
        icon: 'car-front',
        accent: '#ff6a2b',
        badge: 'Analog throttle',
        badgeNote: 'no house, just the track',
        span: 'banner',
        art: 'slotcar'
      }
    ]
  },
  {
    id: 'vogeltronics',
    sign: 'VogelTronics',
    color: '#ff4436',
    title: 'VogelTronics: A Fictional History',
    sub: 'Elk Grove Village, Illinois, 1961 to 1983 — twenty-three years of chasing American childhood and never quite catching it, then one loud swerve into electronics at the end. Every toy here is rebuilt from the ground up: no trademarks borrowed, nothing lifted. Gridiron plays now; the rest of the shelf is on its way.',
    unit: 'exhibit',
    items: [
      {
        title: 'VogelTronics: The Whole Story',
        description: 'The magazine-style corporate history — Elk Grove Village, 1961, to the crash of 1983, forever in the wrong place at the wrong time.',
        domain: 'vogeltronics.com',
        repo: 'https://github.com/cschweda/vogeltronics-history',
        icon: 'factory',
        accent: '#ff4436',
        badge: 'Games that think!',
        badgeNote: 'the whole sad story',
        span: 'wide',
        art: 'vogeltronics'
      },
      {
        title: 'Rovacon Voice Bench',
        description: 'The flagship’s voice chip, rebuilt — Votrax-class formant speech synthesis in the browser: type a phrase, hear 1980 arcade speech.',
        domain: 'vogelvox.vogeltronics.com',
        repo: 'https://github.com/cschweda/vogeltronics-vogel-vox',
        icon: 'audio-waveform',
        accent: '#f4efe6',
        badge: 'Formant synthesis',
        badgeNote: 'the voice that shouldn’t exist',
        span: 'wide',
        art: 'rovacon'
      },
      {
        title: 'Gridiron',
        description: 'The 1977 LED football handheld, rebuilt for solo play — one bright blip against five tacklers, four downs to move the chains, and a kick on fourth. Keyboard-first.',
        domain: 'gridiron.vogeltronics.com',
        repo: 'https://github.com/cschweda/vogeltronics-gridiron-i',
        icon: 'gamepad-2',
        accent: '#ff2a1a',
        badge: 'Nine yards of LED',
        badgeNote: 'it thinks two plays ahead',
        span: 'wide',
        art: 'gridiron'
      }
    ]
  }
]

/** Every item on the floor, in floor order. Drives the JSON-LD ItemList. */
export const allItems: CatalogItem[] = zones.flatMap(z => z.items)
