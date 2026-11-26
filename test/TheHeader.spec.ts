import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TheHeader from '~/components/TheHeader.vue'
import { zones } from '~/data/catalog'

describe('TheHeader', () => {
  it('links every zone, numbered in floor order, by its nav label', async () => {
    const w = await mountSuspended(TheHeader)
    const links = w.findAll('nav.row a')
    expect(links.map(a => a.attributes('href'))).toEqual(zones.map(z => `#${z.id}`))
    expect(links.map(a => a.text())).toEqual([
      '01 Workshop',
      '02 VogelTronics',
      '03 Casino Table Games',
      '04 Casino Machines',
      '05 Interactive Fiction',
      '06 Retro Games'
    ])
  })

  it('folds the links behind a real button that says whether it is open', async () => {
    const w = await mountSuspended(TheHeader)
    const btn = w.find('button.menu-btn')
    expect(btn.text()).toContain('Menu')
    expect(btn.attributes('aria-controls')).toBe('site-menu')
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(w.find('#site-menu').attributes('style')).toContain('display: none')

    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
    expect(w.find('#site-menu').attributes('style') ?? '').not.toContain('display: none')
    expect(w.findAll('#site-menu a')).toHaveLength(zones.length)
  })

  it('closes when a link in the menu is followed', async () => {
    const w = await mountSuspended(TheHeader)
    await w.find('button.menu-btn').trigger('click')
    await w.find('#site-menu a').trigger('click')
    expect(w.find('button.menu-btn').attributes('aria-expanded')).toBe('false')
  })

  it('closes on Escape', async () => {
    const w = await mountSuspended(TheHeader, { attachTo: document.body })
    await w.find('button.menu-btn').trigger('click')
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await w.vm.$nextTick()
    expect(w.find('button.menu-btn').attributes('aria-expanded')).toBe('false')
    w.unmount()
  })
})
