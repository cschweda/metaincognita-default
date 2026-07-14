import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SoundSwitch from '~/components/SoundSwitch.vue'

describe('SoundSwitch', () => {
  beforeEach(() => {
    localStorage.clear()
    document.querySelectorAll('audio').forEach(a => a.remove())
    vi.restoreAllMocks()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  it('is a real button whose accessible name matches its visible text (WCAG 2.5.3)', async () => {
    const w = await mountSuspended(SoundSwitch)
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-pressed')).toBe('true')
    // No aria-label may override the visible text — that is a Label-in-Name violation.
    expect(btn.attributes('aria-label')).toBeUndefined()
    expect(btn.text()).toContain('Floor audio')
  })

  it('flips aria-pressed and its label when clicked', async () => {
    const w = await mountSuspended(SoundSwitch)
    expect(w.text()).toContain('on')
    await w.find('button').trigger('click')
    expect(w.find('button').attributes('aria-pressed')).toBe('false')
    expect(w.text()).toContain('off')
  })

  it('flips back from off to on on a second click', async () => {
    // Start from a stored OFF preference, the mirror image of the test above —
    // only the on->off direction was ever exercised before.
    localStorage.setItem('mi-floor-audio', 'off')
    const w = await mountSuspended(SoundSwitch)
    expect(w.find('button').attributes('aria-pressed')).toBe('false')
    expect(w.text()).toContain('off')

    await w.find('button').trigger('click')

    expect(w.find('button').attributes('aria-pressed')).toBe('true')
    expect(w.text()).toContain('on')
    expect(localStorage.getItem('mi-floor-audio')).toBe('on')
  })
})
