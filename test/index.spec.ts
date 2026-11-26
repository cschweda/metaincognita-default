import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('index page', () => {
  // Finished tools and in-development ones are separate groups: the flagged cards
  // sit in their own grid, under a rule that names the group.
  it('sets the in-development cabinets apart from the live ones', async () => {
    const w = await mountSuspended(IndexPage)
    const workshop = w.find('#workshop')

    const bench = workshop.find('.bench')
    expect(bench.attributes('role')).toBe('group')
    expect(bench.attributes('aria-labelledby')).toBe('workshop-pending')
    expect(bench.find('#workshop-pending').text()).toBe('In development')
    expect(bench.findAll('.cab-title').map(t => t.text())).toEqual(['Utenat'])
    expect(bench.findAll('.cab').every(c => c.classes('cab-unlit'))).toBe(true)

    const live = workshop.find('.floor:not(.floor-pending)')
    expect(live.findAll('.cab')).toHaveLength(13)
    expect(live.findAll('.cab-unlit')).toHaveLength(0)
    expect(live.findAll('.cab-title').map(t => t.text()).slice(-2)).toEqual(['Fotobogen', 'Omsett'])
  })

  it('draws no rule in a zone with nothing in development', async () => {
    const w = await mountSuspended(IndexPage)
    expect(w.findAll('.bench')).toHaveLength(1)
    expect(w.find('#pit .bench').exists()).toBe(false)
  })
})
