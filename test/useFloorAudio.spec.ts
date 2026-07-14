import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import { useFloorAudio, __resetFloorAudioForTests } from '~/composables/useFloorAudio'

let api: ReturnType<typeof useFloorAudio>

const Harness = defineComponent({
  setup() {
    api = useFloorAudio()
    return () => h('div')
  }
})

function spyPlay() {
  return vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
}

/** Flips document.hidden and fires the real event the composable listens for. */
function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'hidden', { value: hidden, configurable: true })
  document.dispatchEvent(new Event('visibilitychange'))
}

// mountSuspended never gets unmounted on its own. Each mount's onMounted()
// registers its own `visibilitychange` listener on the shared `document`, and
// since `el` is a real module singleton, EVERY still-attached listener from
// EVERY earlier test would fire (and call el.pause()/play()) the moment any
// later test dispatches the event. Track every wrapper and unmount it after
// its test so exactly one listener is ever live at a time.
let wrappers: Awaited<ReturnType<typeof mountSuspended>>[] = []

async function mount(component: Parameters<typeof mountSuspended>[0]) {
  const wrapper = await mountSuspended(component)
  wrappers.push(wrapper)
  return wrapper
}

describe('useFloorAudio', () => {
  beforeEach(() => {
    // The fade-in/out interval must not survive past the test that starts it —
    // otherwise it keeps ticking (and mutating .volume) into later tests.
    vi.useFakeTimers()
    // The <audio> element and its fade timer are module-level singletons by
    // design (see Finding 1 below); reset them so no test inherits DOM nodes
    // or timers left behind by a previous one.
    __resetFloorAudioForTests()
    localStorage.clear()
    document.querySelectorAll('audio').forEach(a => a.remove())
    vi.restoreAllMocks()
  })

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers = []
    vi.useRealTimers()
  })

  it('NEVER calls play() on mount — audio must wait for a user gesture', async () => {
    const play = spyPlay()
    await mount(Harness)
    expect(play).not.toHaveBeenCalled()
  })

  it('defaults the preference to ON', async () => {
    await mount(Harness)
    expect(api.enabled.value).toBe(true)
  })

  it('honours a stored OFF preference', async () => {
    localStorage.setItem('mi-floor-audio', 'off')
    await mount(Harness)
    expect(api.enabled.value).toBe(false)
  })

  it('enter(true) starts playback and persists ON', async () => {
    const play = spyPlay()
    await mount(Harness)
    api.enter(true)
    expect(play).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('mi-floor-audio')).toBe('on')
  })

  it('enter(false) persists OFF and never plays', async () => {
    const play = spyPlay()
    await mount(Harness)
    api.enter(false)
    expect(play).not.toHaveBeenCalled()
    expect(api.enabled.value).toBe(false)
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
  })

  it('toggle() flips the preference and persists it', async () => {
    spyPlay()
    await mount(Harness)
    expect(api.enabled.value).toBe(true)
    api.toggle()
    expect(api.enabled.value).toBe(false)
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
    // Nothing had ever played, so toggling off must not build an <audio>
    // element just to immediately fade nothing out.
    expect(document.querySelectorAll('audio')).toHaveLength(0)
    api.toggle()
    expect(api.enabled.value).toBe(true)
    expect(localStorage.getItem('mi-floor-audio')).toBe('on')
  })

  it('builds one <audio> element with opus first and an aac fallback', async () => {
    spyPlay()
    await mount(Harness)
    api.enter(true)
    const els = document.querySelectorAll('audio')
    expect(els).toHaveLength(1)
    const el = els[0]!
    expect(el.loop).toBe(true)
    expect(el.preload).toBe('none')
    const sources = [...el.querySelectorAll('source')].map(s => s.getAttribute('src'))
    expect(sources).toEqual(['/audio/casino-floor.webm', '/audio/casino-floor.m4a'])
  })

  it('survives a rejected play() — the autoplay policy must not throw', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValue(new DOMException('blocked', 'NotAllowedError'))
    await mount(Harness)
    expect(() => api.enter(true)).not.toThrow()
    // Fake timers: setTimeout(r, 0) will never resolve on its own. Advancing
    // the fake clock also flushes the microtask queue between ticks, which is
    // what lets the rejected play() promise's .catch() actually run.
    await vi.advanceTimersByTimeAsync(0)
    expect(api.playing.value).toBe(false)
  })

  it('shares ONE <audio> element across every consumer', async () => {
    spyPlay()
    // Two independent components, each calling the composable — exactly as
    // TheDoors and SoundSwitch will in the real app.
    let a: ReturnType<typeof useFloorAudio> | undefined
    let b: ReturnType<typeof useFloorAudio> | undefined
    const A = defineComponent({ setup() { a = useFloorAudio(); return () => h('div') } })
    const B = defineComponent({ setup() { b = useFloorAudio(); return () => h('div') } })
    await mount(A)
    await mount(B)

    // A is TheDoors: the gesture that first brings the floor to life.
    a!.enter(true)
    // B is SoundSwitch: toggled off then back on. The second toggle is the
    // one that matters — it forces B through the same play()/ensureEl() path
    // A already took. If `el` were per-call state instead of a module
    // singleton, this is the exact moment a second <audio> element would be
    // built and we'd hear the floor twice.
    b!.toggle()
    b!.toggle()

    expect(document.querySelectorAll('audio')).toHaveLength(1)
    // The preference is shared too, not per-instance.
    expect(a!.enabled.value).toBe(b!.enabled.value)
  })

  describe('visibilitychange', () => {
    it('does NOT call play() going hidden→visible when nothing has ever played', async () => {
      // No enter()/toggle() call has ever happened, so `el` is still null.
      // This pins the `if (!el) return` guard at the top of onVisibility —
      // delete that guard and this is silent autoplay.
      const play = spyPlay()
      await mount(Harness)
      setHidden(true)
      setHidden(false)
      expect(play).not.toHaveBeenCalled()
    })

    it('pauses playback when the tab goes hidden after enter(true)', async () => {
      const play = spyPlay()
      const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause')
      await mount(Harness)
      api.enter(true)
      await vi.advanceTimersByTimeAsync(0)
      expect(api.playing.value).toBe(true)

      setHidden(true)

      expect(pause).toHaveBeenCalledTimes(1)
      expect(api.playing.value).toBe(false)
      expect(play).toHaveBeenCalledTimes(1) // still just the original enter(true)
    })

    it('resumes playback when the tab becomes visible again while enabled', async () => {
      const play = spyPlay()
      await mount(Harness)
      api.enter(true)
      await vi.advanceTimersByTimeAsync(0)

      setHidden(true)
      expect(api.playing.value).toBe(false)

      setHidden(false)
      await vi.advanceTimersByTimeAsync(0)

      expect(play).toHaveBeenCalledTimes(2) // the original enter(true) + the resume
      expect(api.playing.value).toBe(true)
    })

    it('does NOT resume playback on visibilitychange once sound has been toggled off', async () => {
      const play = spyPlay()
      await mount(Harness)
      api.enter(true)
      await vi.advanceTimersByTimeAsync(0)
      api.toggle() // sound off; the <audio> element still exists
      play.mockClear()

      setHidden(true)
      setHidden(false)
      await vi.advanceTimersByTimeAsync(0)

      expect(play).not.toHaveBeenCalled()
    })
  })
})
