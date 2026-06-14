export interface CatalogItem {
  /** Display name shown on the card. */
  title: string
  /** One-line description, lifted from each app's own metadata. */
  description: string
  /** Bare hostname, shown as the card's live-link affordance. */
  domain: string
  /** lucide icon name (rendered as `i-lucide-<icon>`). */
  icon: string
  /** Per-item accent colour driving the glow, ring and icon tint. */
  accent: string
}

/** Casino simulations — each its own open-source deployment at <name>.metaincognita.com */
export const simulations: CatalogItem[] = [
  {
    title: 'Blackjack Trainer',
    description: 'Basic-strategy coaching and Hi-Lo card counting on rules taken straight from official casino documents.',
    domain: 'blackjack.metaincognita.com',
    icon: 'spade',
    accent: '#33b07a'
  },
  {
    title: 'No-Limit Hold’em',
    description: 'Texas Hold’em against intelligent bots, with live equity, outs, pot odds and hand ranges as you play.',
    domain: 'holdem.metaincognita.com',
    icon: 'club',
    accent: '#7c83ff'
  },
  {
    title: 'Roulette Trainer',
    description: 'A real forward-physics wheel, proven fair by simulation — see exactly why you can’t beat it.',
    domain: 'roulette.metaincognita.com',
    icon: 'disc-3',
    accent: '#e0555a'
  },
  {
    title: 'Slots Simulator',
    description: 'Reel strips, virtual-reel weights and the exact-enumeration house edge across eight machine archetypes.',
    domain: 'slots.metaincognita.com',
    icon: 'cherry',
    accent: '#e0a92e'
  },
  {
    title: 'Craps Simulator',
    description: 'A browser craps table for learning the line, the odds bets and where the edge really hides.',
    domain: 'craps.metaincognita.com',
    icon: 'dice-5',
    accent: '#3e9bd6'
  },
  {
    title: 'Video Poker Trainer',
    description: 'Optimal play, pay-table literacy and bankroll management — taught one hand at a time.',
    domain: 'video-poker.metaincognita.com',
    icon: 'diamond',
    accent: '#b18cff'
  },
  {
    title: 'Flameout',
    description: 'Watch the multiplier climb, cash out before the crash — then see why the house always wins.',
    domain: 'flameout.metaincognita.com',
    icon: 'flame',
    accent: '#ff6a3d'
  },
  {
    title: 'Pachinko Parlor',
    description: 'Ball-drop physics and payout pockets, with the odds behind the pins laid bare.',
    domain: 'pachinko.metaincognita.com',
    icon: 'circle-dot',
    accent: '#ef5ba1'
  }
]

/** Standalone utilities. Starts with one; built to grow. */
export const tools: CatalogItem[] = [
  {
    title: 'PAO Speed Trainer',
    description: 'Drill the Person–Action–Object system across all 52 cards until each triplet fires as a single reflex.',
    domain: 'pao.metaincognita.com',
    icon: 'brain',
    accent: '#34d6c4'
  }
]
