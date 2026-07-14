import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ZoneSign from '~/components/ZoneSign.vue'

const base = {
  sign: 'The Pit',
  color: '#2fe58f',
  title: 'Play the house at its own game.',
  sub: 'Table games rebuilt as open-source simulations.',
  count: 4,
  unit: 'table'
}

describe('ZoneSign', () => {
  it('renders the zone title as an h2', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('h2').text()).toBe('Play the house at its own game.')
  })

  it('zero-pads and pluralises the count', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.text()).toContain('04 tables')
  })

  it('keeps a count of one singular', async () => {
    const w = await mountSuspended(ZoneSign, { props: { ...base, count: 1, unit: 'tool' } })
    expect(w.text()).toContain('01 tool')
    expect(w.text()).not.toContain('01 tools')
  })

  it('publishes the zone colour as --zc', async () => {
    const w = await mountSuspended(ZoneSign, { props: base })
    expect(w.find('header').attributes('style')).toContain('--zc: #2fe58f')
  })
})
