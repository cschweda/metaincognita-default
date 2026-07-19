import { describe, it, expect } from 'vitest'
import { zones, allItems, type Span } from '~/data/catalog'

const SPANS: Span[] = ['std', 'wide', 'feature', 'banner']

describe('catalog', () => {
  it('has exactly four zones in floor order', () => {
    expect(zones.map(z => z.id)).toEqual(['pit', 'machines', 'arcade', 'vogeltronics'])
  })

  it('carries all eleven apps', () => {
    expect(allItems).toHaveLength(11)
    expect(zones.map(z => z.items.length)).toEqual([4, 4, 1, 2])
  })

  it('gives every item a complete, non-empty record', () => {
    for (const item of allItems) {
      expect(item.title, item.domain).toBeTruthy()
      expect(item.description, item.domain).toBeTruthy()
      expect(item.icon, item.domain).toBeTruthy()
      expect(item.badge, item.domain).toBeTruthy()
      expect(item.badgeNote, item.domain).toBeTruthy()
      expect(SPANS, item.domain).toContain(item.span)
      expect(item.accent, item.domain).toMatch(/^#[0-9a-f]{6}$/i)
      // A bare hostname — no scheme, no path (GameCabinet prepends https://). Usually a
      // metaincognita.com subdomain, but a project can live anywhere (slotcar.netlify.app).
      expect(item.domain, item.domain).toMatch(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/)
    }
  })

  it('points every app at its GitHub repository', () => {
    for (const item of allItems) {
      if (item.repo) {
        expect(item.repo, item.domain).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/)
      }
    }
    // Every cabinet links its source. A new app whose repo is not public yet may
    // ship without one (the link affordance just stays off) — but it must be
    // named here deliberately, never forgotten.
    expect(allItems.filter(i => !i.repo).map(i => i.domain)).toEqual([])

    const repos = allItems.map(i => i.repo).filter(Boolean)
    expect(new Set(repos).size).toBe(repos.length)
  })

  it('never prints a house-edge percentage on a badge', () => {
    // The whole point: we do not ship numbers we cannot source from the apps.
    for (const item of allItems) {
      expect(item.badge.length, item.domain).toBeGreaterThan(0)
      expect(item.badge, item.domain).not.toMatch(/\d/)
      expect(item.badge, item.domain).not.toContain('%')
    }
  })

  it('lays out the mosaic so each zone fills its grid', () => {
    const pit = zones[0]!.items.map(i => i.span)
    const machines = zones[1]!.items.map(i => i.span)
    // DOM order matters — the grid placement rules in main.css assume it.
    expect(pit).toEqual(['feature', 'std', 'std', 'wide'])
    expect(machines).toEqual(['std', 'std', 'wide', 'feature'])
    // The Arcade runs a single full-width banner; VogelTronics runs two wides shoulder to shoulder.
    expect(zones[2]!.items.map(i => i.span)).toEqual(['banner'])
    expect(zones[3]!.items.map(i => i.span)).toEqual(['wide', 'wide'])
  })

  // Anything with slack to fill carries a scene; a std tile has no room for one.
  it('gives every roomy cabinet a scene, and no std one', () => {
    for (const item of allItems) {
      expect(Boolean(item.art), `${item.domain} (${item.span})`).toBe(item.span !== 'std')
    }
  })

  it('uses unique domains', () => {
    const domains = allItems.map(i => i.domain)
    expect(new Set(domains).size).toBe(domains.length)
  })
})
