import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import GameCabinet from '~/components/GameCabinet.vue'
import type { CatalogItem } from '~/data/catalog'

const item: CatalogItem = {
  title: 'Blackjack Trainer',
  description: 'Basic-strategy coaching and Hi-Lo card counting.',
  domain: 'blackjack.metaincognita.com',
  repo: 'https://github.com/cschweda/metaincognita-blackjack',
  icon: 'spade',
  accent: '#2fe58f',
  badge: 'Basic strategy',
  badgeNote: 'plus the hi-lo count',
  span: 'feature'
}

const shot = { ...item, span: 'shot' as const, shot: '/workshop/drafter.webp' }

describe('GameCabinet', () => {
  // Two links per card means the card itself cannot be an anchor —
  // nested anchors are invalid HTML and split by the parser.
  it('is an article carrying two real links: play and source', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('article.cab').exists()).toBe(true)
    expect(w.findAll('a')).toHaveLength(2)
  })

  it('links out safely, in a new tab, and says so to screen readers', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    const a = w.find('a.live')
    expect(a.attributes('href')).toBe('https://blackjack.metaincognita.com')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    // the stretched link is the whole card, so its hidden text names the app too
    expect(a.find('.sr-only').text()).toContain('Blackjack Trainer')
    expect(a.find('.sr-only').text()).toContain('opens in a new tab')
  })

  it('links the source code straight to the repository', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    const src = w.find('a.src')
    expect(src.attributes('href')).toBe('https://github.com/cschweda/metaincognita-blackjack')
    expect(src.attributes('target')).toBe('_blank')
    expect(src.attributes('rel')).toBe('noopener noreferrer')
    // the visible word starts the accessible name (WCAG 2.5.3), and the hidden
    // text keeps each of the many "Source" links unique
    expect(src.text()).toMatch(/^Source/)
    expect(src.find('.sr-only').text()).toContain('Blackjack Trainer')
  })

  it('shows no source link when the item has no public repo', async () => {
    const { repo: _repo, ...rest } = item
    const w = await mountSuspended(GameCabinet, { props: { item: rest } })
    expect(w.find('a.src').exists()).toBe(false)
    expect(w.findAll('a')).toHaveLength(1)
  })

  it('carries its span class, so a showcase can lay itself out across the row', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item: { ...item, span: 'showcase' } } })
    expect(w.find('.cab').classes()).toContain('cab-showcase')
  })

  it('shows the badge and its caption', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('.label').text()).toContain('Basic strategy')
    expect(w.find('.label').text()).toContain('plus the hi-lo count')
  })

  it('titles the card with an h3, under the zone h2', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('h3').text()).toBe('Blackjack Trainer')
  })

  // The plate leads with the app's own og:image — decorative, because the card
  // already says everything it says as live text.
  it('fills the plate with the og:image when the item has one', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item: shot } })
    const img = w.find('.plate img')
    expect(img.attributes('src')).toBe('/workshop/drafter.webp')
    expect(img.attributes('alt')).toBe('')
    expect(img.attributes('width')).toBeTruthy()
    expect(img.attributes('height')).toBeTruthy()
    expect(w.find('.glyph').exists()).toBe(false)
  })

  it('sets its pictogram in the plate when there is no og:image', async () => {
    const w = await mountSuspended(GameCabinet, { props: { item } })
    expect(w.find('.plate img').exists()).toBe(false)
    expect(w.find('.plate .glyph').exists()).toBe(true)
  })

  // A card that is not open yet says so once, in its group's label (index.vue), not again
  // on its picture; the card only carries the class that marks it.
  it('marks a card with a status, without labelling its picture', async () => {
    const plain = await mountSuspended(GameCabinet, { props: { item: shot } })
    expect(plain.find('.cab').classes()).not.toContain('cab-pending')

    const flagged = await mountSuspended(GameCabinet, { props: { item: { ...shot, status: 'In development' } } })
    expect(flagged.find('.cab').classes()).toContain('cab-pending')
    expect(flagged.text()).not.toContain('In development')
  })

  it('lists an umbrella project\'s suite, each tool with its own source link', async () => {
    const suite = [{ name: 'frotzsmith', note: 'A browser IDE.', repo: 'https://github.com/cschweda/frotzsmith' }]
    const w = await mountSuspended(GameCabinet, { props: { item: { ...shot, span: 'showcase', suite } } })
    expect(w.find('.suite b').text()).toBe('frotzsmith')
    expect(w.find('.suite a.src').attributes('href')).toBe('https://github.com/cschweda/frotzsmith')
  })
})
