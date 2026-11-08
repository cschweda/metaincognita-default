import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { zones, allItems, type Span } from '~/data/catalog'

const SPANS: Span[] = ['std', 'wide', 'feature', 'banner', 'shot', 'showcase']

describe('catalog', () => {
  it('has exactly six zones in floor order — the casino first', () => {
    expect(zones.map(z => z.id)).toEqual(['pit', 'machines', 'workshop', 'fiction', 'arcade', 'vogeltronics'])
  })

  it('carries all seventeen apps', () => {
    expect(allItems).toHaveLength(17)
    expect(zones.map(z => z.items.length)).toEqual([4, 4, 4, 1, 1, 3])
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
    // The Workshop runs a two-by-two of screenshots; Interactive Fiction one full-width
    // showcase; The Arcade a single full-width banner; VogelTronics its wides, two to a row.
    expect(zones[2]!.items.map(i => i.span)).toEqual(['shot', 'shot', 'shot', 'shot'])
    expect(zones[3]!.items.map(i => i.span)).toEqual(['showcase'])
    expect(zones[4]!.items.map(i => i.span)).toEqual(['banner'])
    expect(zones[5]!.items.map(i => i.span)).toEqual(['wide', 'wide', 'wide'])
  })

  // Anything with slack to fill carries a scene; a std tile has no room for one, and a
  // shot tile is filled by its screenshot instead.
  it('gives every roomy cabinet a scene, and no std or shot one', () => {
    for (const item of allItems) {
      const roomy = item.span !== 'std' && item.span !== 'shot' && item.span !== 'showcase'
      expect(Boolean(item.art), `${item.domain} (${item.span})`).toBe(roomy)
    }
  })

  // The CSP is img-src 'self': a shot must be a local file, never the app's own URL.
  it('gives every shot cabinet a same-origin screenshot that exists', () => {
    for (const item of allItems) {
      expect(Boolean(item.shot), item.domain).toBe(item.span === 'shot' || item.span === 'showcase')
      if (item.shot) {
        expect(item.shot, item.domain).toMatch(/^\/workshop\/[a-z0-9-]+\.webp$/)
        expect(existsSync(resolve(__dirname, '../public', item.shot.slice(1))), item.domain).toBe(true)
      }
    }
  })

  // Only a showcase has the room to list a suite.
  it('lists a suite only on a showcase cabinet', () => {
    for (const item of allItems) {
      if (item.suite || item.suiteMore) expect(item.span, item.domain).toBe('showcase')
      for (const tool of item.suite ?? []) {
        expect(tool.repo, tool.name).toMatch(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/)
      }
    }
  })

  it('uses unique domains', () => {
    const domains = allItems.map(i => i.domain)
    expect(new Set(domains).size).toBe(domains.length)
  })
})
