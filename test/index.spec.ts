import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'
import { zones, allItems } from '~/data/catalog'

describe('index page', () => {
  // A makeover, not a cut: every project in the catalog is on the page as a card,
  // the in-development ones included.
  it('draws a card for every project in the catalog', async () => {
    const w = await mountSuspended(IndexPage)
    expect(w.findAll('article.cab')).toHaveLength(allItems.length)
    expect(w.findAll('.cab-title').map(t => t.text())).toEqual(allItems.map(i => i.title))
  })

  it('draws the zones in floor order, each labelled by its own heading', async () => {
    const w = await mountSuspended(IndexPage)
    const sections = w.findAll('main > section.zone')
    expect(sections.map(s => s.attributes('id'))).toEqual(zones.map(z => z.id))
    for (const s of sections) {
      const id = s.attributes('aria-labelledby')!
      expect(s.find(`h2#${id}`).exists()).toBe(true)
    }
  })

  // Finished tools and in-development ones are separate groups: the flagged cards
  // sit in their own grid, under a rule that names the group.
  it('sets the in-development cards apart from the live ones', async () => {
    const w = await mountSuspended(IndexPage)
    const workshop = w.find('#workshop')

    const bench = workshop.find('.bench')
    expect(bench.attributes('role')).toBe('group')
    expect(bench.attributes('aria-labelledby')).toBe('workshop-pending')
    expect(bench.find('#workshop-pending').text()).toBe('In development')
    expect(bench.findAll('.cab-title').map(t => t.text())).toEqual(['Utenat'])
    expect(bench.findAll('.cab').every(c => c.classes('cab-pending'))).toBe(true)

    const live = workshop.find('.floor:not(.floor-pending)')
    expect(live.findAll('.cab')).toHaveLength(13)
    expect(live.findAll('.cab-pending')).toHaveLength(0)
    expect(live.findAll('.cab-title').map(t => t.text()).slice(-2)).toEqual(['Fotobogen', 'Omsett'])
  })

  it('draws no rule in a zone with nothing in development', async () => {
    const w = await mountSuspended(IndexPage)
    expect(w.findAll('.bench')).toHaveLength(1)
    expect(w.find('#pit .bench').exists()).toBe(false)
  })

  it('opens with the thesis, "Given away." in the signal colour', async () => {
    const w = await mountSuspended(IndexPage)
    expect(w.find('h1').text()).toBe('Built out of curiosity.Given away.')
    expect(w.find('h1 .signal').text()).toBe('Given away.')
  })
})
