import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SoundSwitch from '~/components/SoundSwitch.vue'
import { __resetFloorAudioForTests } from '~/composables/useFloorAudio'

describe('SoundSwitch', () => {
  beforeEach(() => {
    __resetFloorAudioForTests()
    localStorage.clear()
    document.querySelectorAll('audio').forEach(a => a.remove())
    vi.restoreAllMocks()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  it('is a real button whose accessible name matches its visible text (WCAG 2.5.3)', async () => {
    const w = await mountSuspended(SoundSwitch)
    const btn = w.find('button')
    expect(btn.exists()).toBe(true)
    // No aria-label may override the visible text — that is a Label-in-Name violation.
    expect(btn.attributes('aria-label')).toBeUndefined()
    expect(btn.text()).toContain('Floor audio')
  })

  it('starts OFF — the floor is silent until the visitor asks for it', async () => {
    const w = await mountSuspended(SoundSwitch)
    expect(w.find('button').attributes('aria-pressed')).toBe('false')
    expect(w.text()).toContain('off')
  })

  it('the equaliser bars are still while the floor is silent', async () => {
    // The bars read from `playing` (reality), never from `enabled` (intent).
    const w = await mountSuspended(SoundSwitch)
    expect(w.find('button').classes()).not.toContain('live')
  })

  it('turns sound on when clicked', async () => {
    const w = await mountSuspended(SoundSwitch)
    await w.find('button').trigger('click')

    expect(w.find('button').attributes('aria-pressed')).toBe('true')
    expect(w.text()).toContain('on')
  })

  it('turns sound back off on a second click', async () => {
    const w = await mountSuspended(SoundSwitch)
    await w.find('button').trigger('click') // on
    await w.find('button').trigger('click') // off again

    expect(w.find('button').attributes('aria-pressed')).toBe('false')
    expect(w.text()).toContain('off')
  })

  it('stores nothing — the switch cannot remember its way back on', async () => {
    const w = await mountSuspended(SoundSwitch)
    await w.find('button').trigger('click') // on
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.getItem('mi-floor-audio')).toBeNull()
  })
})
