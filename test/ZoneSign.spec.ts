import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ZoneSign from '~/components/ZoneSign.vue'

const base = {
  index: 3,
  headingId: 'pit-h',
  sign: 'Casino Table Games',
  title: 'Table Games rebuilt as open-source simulations.',
  sub: 'True odds, basic strategy, and the exact house edge.',
  count: 4,
  unit: 'table'
}

describe('ZoneSign', () => {
  it('renders the zone title as an h2 carrying the id the section is labelled by', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('h2').text()).toBe('Table Games rebuilt as open-source simulations.')
    expect(w.find('h2').attributes('id')).toBe('pit-h')
  })

  it('numbers the zone by its place on the floor, two digits', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('.num').text()).toBe('03')
    expect(w.find('.sign').text()).toBe('Casino Table Games')
  })

  it('pluralises the count', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('.count').text()).toBe('4 tables')
  })

  it('keeps a count of one singular', async () => {
    const w = await mountSuspended(ZoneSign, { props: { ...base, count: 1, unit: 'suite' } })
    expect(w.find('.count').text()).toBe('1 suite')
  })
})
