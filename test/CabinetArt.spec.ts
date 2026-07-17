import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CabinetArt from '~/components/CabinetArt.vue'
import type { ArtKey } from '~/data/catalog'

const KEYS: ArtKey[] = ['blackjack', 'flameout', 'roulette', 'pachinko', 'pao']

describe('CabinetArt', () => {
  it('draws the scene the key asks for, and only that one', async () => {
    for (const art of KEYS) {
      const w = await mountSuspended(CabinetArt, { props: { art } })
      expect(w.findAll('svg > g.hero'), art).toHaveLength(1)
    }
  })

  it('is decoration — it says nothing to a screen reader', async () => {
    const w = await mountSuspended(CabinetArt, { props: { art: 'blackjack' } })
    expect(w.find('.art').attributes('aria-hidden')).toBe('true')
    expect(w.text()).toBe('')
  })

  /**
   * The whole reason these scenes cohere: not one of them names a colour, so each
   * inherits its cabinet's `--ac`. A literal hex here would be the bug — it is exactly
   * how the apps' og:images ended up looking like three unrelated brands.
   */
  it('names no colour of its own — every scene inherits the cabinet accent', async () => {
    for (const art of KEYS) {
      const w = await mountSuspended(CabinetArt, { props: { art } })
      expect(w.html(), art).not.toMatch(/#[0-9a-f]{3,8}\b/i)
      expect(w.html(), art).not.toMatch(/\b(rgb|hsl)a?\(/i)
    }
  })

  it('carries the fade that keeps the copy off the art', async () => {
    const feature = await mountSuspended(CabinetArt, { props: { art: 'blackjack' } })
    expect(feature.find('.art').classes()).toContain('art-feature')

    // A banner's copy runs along its left, not above its foot, so it fades the other way.
    const banner = await mountSuspended(CabinetArt, { props: { art: 'pao' } })
    expect(banner.find('.art').classes()).toContain('art-banner')

    // A wide reads like a short banner: copy left, scene right, sideways fade.
    const wide = await mountSuspended(CabinetArt, { props: { art: 'roulette' } })
    expect(wide.find('.art').classes()).toContain('art-wide')
  })

  /**
   * A feature tile stays near-square at every width so it can safely cover. The banner
   * cannot — it is 5:1 on desktop and ~4.5:1 at 1024 — and under `slice` a fixed viewBox
   * crops a different amount at every width, which lopped the right-hand columns clean
   * off the lattice. `meet` fits the whole scene in; `xMax` pins it to the dead space.
   */
  it('never crops the banner, whatever the viewport does to its aspect ratio', async () => {
    const banner = await mountSuspended(CabinetArt, { props: { art: 'pao' } })
    expect(banner.find('svg').attributes('preserveAspectRatio')).toBe('xMaxYMid meet')

    const feature = await mountSuspended(CabinetArt, { props: { art: 'flameout' } })
    expect(feature.find('svg').attributes('preserveAspectRatio')).toBe('xMidYMid slice')
  })

  // A wide shares the banner's trap: 2.3:1 at 1180 and ~3.6:1 when it spans the row,
  // so `slice` would crop a different amount at every width. `meet`, pinned right.
  it('never crops a wide either', async () => {
    for (const art of ['roulette', 'pachinko'] as const) {
      const w = await mountSuspended(CabinetArt, { props: { art } })
      expect(w.find('svg').attributes('preserveAspectRatio'), art).toBe('xMaxYMid meet')
    }
  })

  it('drops one pachinko ball into exactly one lit pocket', async () => {
    const w = await mountSuspended(CabinetArt, { props: { art: 'pachinko' } })
    // five payout pockets at the base — the only rects in the scene
    expect(w.findAll('.hero rect')).toHaveLength(5)
    // one pocket lit, in the lattice's own lit-vs-unlit language
    expect(w.findAll('.hero rect.fill.stroke')).toHaveLength(1)
    // one ball, resting where the path ends
    expect(w.findAll('.hero circle.node')).toHaveLength(1)
  })

  it('gives the roulette wheel its rim, track and hub', async () => {
    const w = await mountSuspended(CabinetArt, { props: { art: 'roulette' } })
    // rim + track + hub + turret at minimum; all drawn as perspective ellipses
    expect(w.findAll('.hero ellipse').length).toBeGreaterThanOrEqual(4)
    expect(w.findAll('.hero circle.node')).toHaveLength(1)
  })

  it('deals all fifty-two cards, and fires exactly one triplet', async () => {
    const w = await mountSuspended(CabinetArt, { props: { art: 'pao' } })
    const cards = w.findAll('.hero rect')
    expect(cards).toHaveLength(52)
    expect(w.findAll('.hero circle.node')).toHaveLength(3)
  })

  /**
   * SVG ids are document-global. Two cabinets on one page would collide over any <defs>
   * id, so the scenes carry none — glow is a CSS drop-shadow, depth is opacity.
   */
  it('defines no document-global SVG ids to collide over', async () => {
    for (const art of KEYS) {
      const w = await mountSuspended(CabinetArt, { props: { art } })
      expect(w.html(), art).not.toContain('<defs')
      expect(w.find('svg').attributes('id'), art).toBeUndefined()
    }
  })
})
