/** Footprint on a zone's mosaic grid. DOM order matters — see main.css. */
export type Span = 'std' | 'wide' | 'feature' | 'banner'

/** Selects a cabinet's bespoke line-art scene. See CabinetArt.vue. */
export type ArtKey = 'blackjack' | 'flameout' | 'roulette' | 'pachinko' | 'pao' | 'slotcar'

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
  id: 'pit' | 'machines' | 'mind' | 'arcade'
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
    id: 'mind',
    sign: 'The Mind',
    color: '#2ff0d8',
    title: 'Tools for the mind.',
    sub: 'Utilities that sharpen memory and recall — open source, like everything here. Starting with one; more on the way.',
    unit: 'tool',
    items: [
      {
        title: 'PAO Speed Trainer',
        description: 'Drill the Person–Action–Object system across all 52 cards until each triplet fires as a single reflex.',
        domain: 'pao.metaincognita.com',
        icon: 'brain',
        accent: '#2ff0d8',
        badge: 'All fifty-two cards',
        badgeNote: 'no edge — it’s a tool',
        span: 'banner',
        art: 'pao'
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
        icon: 'car-front',
        accent: '#ff6a2b',
        badge: 'Analog throttle',
        badgeNote: 'no house, just the track',
        span: 'banner',
        art: 'slotcar'
      }
    ]
  }
]

/** Every item on the floor, in floor order. Drives the JSON-LD ItemList. */
export const allItems: CatalogItem[] = zones.flatMap(z => z.items)
