import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { zones, allItems, LEGACY_ANCHORS, type Span } from '~/data/catalog'

const SPANS: Span[] = ['std', 'wide', 'feature', 'banner', 'shot', 'showcase']

describe('catalog', () => {
  it('has exactly six zones in floor order — the workshop first, then VogelTronics', () => {
    expect(zones.map(z => z.id)).toEqual(['workshop', 'vogeltronics', 'casino-table-games', 'casino-machines', 'interactive-fiction', 'retro-games'])
  })

  // A section's anchor is a link people are given, so it reads as the section's name:
  // lower case, words joined by hyphens.
  it('names every anchor after its section, and keeps the old anchors pointing home', () => {
    for (const z of zones) {
      expect(z.id, z.sign).toMatch(/^[a-z]+(-[a-z]+)*$/)
      expect(z.sign.toLowerCase().replace(/^the /, '').replace(/ /g, '-'), z.id).toBe(z.id)
    }
    for (const target of Object.values(LEGACY_ANCHORS)) {
      expect(zones.map(z => z.id)).toContain(target)
    }
  })

  it('carries all twenty-nine apps', () => {
    expect(allItems).toHaveLength(29)
    expect(zones.map(z => z.items.length)).toEqual([16, 3, 4, 4, 1, 1])
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
      // A hostname with no scheme (GameCabinet prepends https://). Usually a
      // metaincognita.com subdomain, but a project can live anywhere (slotcar.netlify.app),
      // and one on GitHub Pages carries its project path (cschweda.github.io/v6blick).
      expect(item.domain, item.domain).toMatch(/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/[a-z0-9-]+)*$/)
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
    // Utenat is in development: it has no repository yet.
    expect(allItems.filter(i => !i.repo).map(i => i.domain)).toEqual(['utenat.com'])

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

  // Every card leads with its app's own og:image. The frotz, Inc. umbrella is the one
  // showcase (a whole row, with its suite); everything else is a shot in the grid.
  it('gives every app a picture card, with one showcase for the umbrella project', () => {
    expect(allItems.filter(i => i.span === 'showcase').map(i => i.domain)).toEqual(['frotzinc.com'])
    for (const item of allItems) {
      expect(['shot', 'showcase'], item.domain).toContain(item.span)
      // a scene is drawn only where there is no picture, and now there always is one
      expect(item.art, item.domain).toBeUndefined()
    }
  })

  // The CSP is img-src 'self': a shot must be a local file, never the app's own URL.
  it('gives every card a same-origin og:image that exists, each its own', () => {
    const shots = allItems.map(i => i.shot)
    expect(new Set(shots).size).toBe(shots.length)
    for (const item of allItems) {
      expect(Boolean(item.shot), item.domain).toBe(true)
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

  // The ribbon hangs on the picture, so only a cabinet with one can carry a status.
  it('flags a status only on a cabinet with a picture', () => {
    for (const item of allItems) {
      if (item.status) expect(Boolean(item.shot), item.domain).toBe(true)
    }
    expect(allItems.filter(i => i.status).map(i => [i.domain, i.status])).toEqual([['utenat.com', 'In development']])
  })

  // Standing rule: in-development cabinets sit at the bottom of their zone, however
  // many there are. Nothing finished may follow one.
  it('keeps in-development cabinets last in their zone', () => {
    for (const zone of zones) {
      const flags = zone.items.map(i => Boolean(i.status))
      const first = flags.indexOf(true)
      if (first !== -1) expect(flags.slice(first).every(Boolean), zone.id).toBe(true)
    }
  })

  it('uses unique domains', () => {
    const domains = allItems.map(i => i.domain)
    expect(new Set(domains).size).toBe(domains.length)
  })
})
