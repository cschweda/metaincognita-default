import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GameCabinet from '~/components/GameCabinet.vue'
import type { CatalogItem } from '~/data/catalog'

const item: CatalogItem = {
  title: 'Blackjack Trainer',
  description: 'Basic-strategy coaching and Hi-Lo card counting.',
  domain: 'blackjack.metaincognita.com',
  icon: 'spade',
  accent: '#2fe58f',
  badge: 'Basic strategy',
  badgeNote: 'plus the hi-lo count',
  span: 'feature'
}

describe('GameCabinet', () => {
  it('links out safely, in a new tab, and says so to screen readers', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    const a = w.find('a')
    expect(a.attributes('href')).toBe('https://blackjack.metaincognita.com')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    expect(w.find('.sr-only').text()).toContain('opens in a new tab')
  })

  it('carries its span class so the mosaic can place it', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('a').classes()).toContain('cab-feature')

    const std = await mountSuspended(GameCabinet, { props: { item: { ...item, span: 'std' } } })
    expect(std.find('a').classes()).toContain('cab-std')
  })

  it('publishes its accent as the --ac custom property', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('a').attributes('style')).toContain('--ac: #2fe58f')
  })

  it('shows the badge and its caption', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.text()).toContain('Basic strategy')
    expect(w.text()).toContain('plus the hi-lo count')
  })

  it('titles the cabinet with an h3, under the zone h2', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('h3').text()).toBe('Blackjack Trainer')
  })

  // The watermark only belongs on tiles big enough to carry it.
  it('renders the watermark glyph on a feature cabinet', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('.mark').exists()).toBe(true)
  })

  // A bespoke scene supersedes the watermark. Both at once would stack an oversized
  // glyph on top of the artwork drawn to replace it.
  it('swaps the watermark for the bespoke scene when the item has one', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item: { ...item, art: 'blackjack' } } })
    expect(w.find('.art').exists()).toBe(true)
    expect(w.find('.mark').exists()).toBe(false)
  })

  it('keeps the watermark on a big cabinet that has no scene yet', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('.art').exists()).toBe(false)
    expect(w.find('.mark').exists()).toBe(true)
  })

  // `art` is only ever set on the big spans, but nothing in the type stops a std item
  // carrying one — and a scene on a std tile would bury the copy.
  it('never draws a scene on the small cabinets', async () => {
    for (const span of ['std', 'wide'] as const) {
      const w = await mountSuspended(GameCabinet, { props: { item: { ...item, span, art: 'blackjack' } } })
      expect(w.find('.art').exists(), span).toBe(false)
    }
  })

  it('renders the watermark glyph on a banner cabinet', async () => {
    const b = await mountSuspended(GameCabinet, { props: { item: { ...item, span: 'banner' } } })
    expect(b.find('.mark').exists()).toBe(true)
  })

  it('does NOT render the watermark on the small cabinets — it would crowd the copy', async () => {
    for (const span of ['std', 'wide'] as const) {
      const w = await mountSuspended(GameCabinet, { props: { item: { ...item, span } } })
      expect(w.find('.mark').exists(), span).toBe(false)
    }
  })
})
