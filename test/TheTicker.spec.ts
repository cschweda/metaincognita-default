import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TheTicker from '~/components/TheTicker.vue'

describe('TheTicker', () => {
  it('hides the moving tape from assistive tech — it is decoration', async () => {
    const w = await mountSuspended(TheTicker)
    expect(w.find('.tape').attributes('aria-hidden')).toBe('true')
  })

  it('carries the thesis, not invented numbers', async () => {
    const w = await mountSuspended(TheTicker)
    const text = w.text()
    expect(text).toContain('The house always wins')
    expect(text).toContain('The math is the point')
    expect(text).not.toMatch(/\d+(\.\d+)?%/)
  })

  it('offers a real pause control — WCAG 2.2.2', async () => {
    const w = await mountSuspended(TheTicker)
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-label')).toBe('Pause the scrolling ticker')
  })

  it('pauses and relabels when the control is used', async () => {
    const w = await mountSuspended(TheTicker)
    await w.find('button').trigger('click')
    expect(w.find('.ticker').classes()).toContain('paused')
    expect(w.find('button').attributes('aria-label')).toBe('Resume the scrolling ticker')
  })

  it('keeps the pause control OUTSIDE the aria-hidden subtree — it must stay reachable', async () => {
    const w = await mountSuspended(TheTicker)
    const btn = w.find('button').element
    // The tape is decoration and is aria-hidden. The control that pauses it must not be.
    expect(btn.closest('[aria-hidden="true"]')).toBeNull()
  })
})
