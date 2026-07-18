/** Footprint on a zone's mosaic grid. DOM order matters — see main.css. */
export type Span = 'std' | 'wide' | 'feature' | 'banner'

/**
 * Selects a cabinet's bespoke line-art scene. See CabinetArt.vue.
 * `pao` currently has no cabinet: The Mind is off the floor while its zone is
 * rethought, and the scene waits in CabinetArt.vue for its return.
 */
export type ArtKey = 'blackjack' | 'flameout' | 'roulette' | 'pachinko' | 'pao' | 'slotcar' | 'amtoy' | 'rovacon'

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
   * source — this is only optional because one repo (hold'em) is still private.
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
}

export interface Zone {
  /** Scroll anchor and grid modifier (`.floor-<id>`). */
  id: 'pit' | 'machines' | 'arcade' | 'amtoy'
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
        title: 'Blackjack Trainer',
        description: 'Basic-strategy coaching and Hi-Lo card counting on rules taken straight from official casino documents.',
        domain: 'blackjack.metaincognita.com',
        repo: 'https://github.com/cschweda/metaincognita-blackjack',
        icon: 'spade',
        accent: '#2fe58f',
        badge: 'Basic strategy',
        badgeNote: 'plus the hi-lo count',
        span: 'feature',
        art: 'blackjack'
      },
      {
        title: 'No-Limit Hold’em',
        description: 'Texas Hold’em against intelligent bots, with live equity, outs, pot odds and hand ranges as you play.',
        domain: 'holdem.metaincognita.com',
        // no repo yet — the hold'em source is still in a private repository
        icon: 'club',
        accent: '#8a8cff',
        badge: 'Live equity',
        badgeNote: 'odds as you play',
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
    id: 'arcade',
    sign: 'The Arcade',
    color: '#ff6a2b',
    title: 'Tools for fun.',
    sub: 'No edge here, nothing to beat — just games built for the joy of it. Starting with a slot car track from 1971; more on the way.',
    unit: 'game',
    items: [
      {
        title: 'AFX Slot Car Racing',
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
    id: 'amtoy',
    sign: 'AmToy',
    color: '#ff4436',
    title: 'Games That Think!',
    sub: 'Homages to AmToy — a completely fictional American toy company (1961–1983), invented from scratch so these recreations step on no one’s trademarks. The history and the flagship’s voice first; the toys themselves are on the way.',
    unit: 'exhibit',
    items: [
      {
        title: 'AmToy: The Whole Story',
        description: 'The magazine-style corporate history — Elk Grove Village, 1961, to the crash of 1983, forever in the wrong place at the wrong time.',
        domain: 'amtoy.netlify.app',
        repo: 'https://github.com/cschweda/amtoy-history',
        icon: 'factory',
        accent: '#ff4436',
        badge: 'Games that think!',
        badgeNote: 'the whole sad story',
        span: 'wide',
        art: 'amtoy'
      },
      {
        title: 'Rovacon Voice Bench',
        description: 'The flagship’s voice chip, rebuilt — Votrax-class formant speech synthesis in the browser: type a phrase, hear 1980 arcade speech.',
        domain: 'rovacon-voice.netlify.app',
        repo: 'https://github.com/cschweda/rovacon-voice',
        icon: 'audio-waveform',
        accent: '#f4efe6',
        badge: 'Formant synthesis',
        badgeNote: 'the voice that shouldn’t exist',
        span: 'wide',
        art: 'rovacon'
      }
    ]
  }
]

/** Every item on the floor, in floor order. Drives the JSON-LD ItemList. */
export const allItems: CatalogItem[] = zones.flatMap(z => z.items)
