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
    __resetFloorAudioForTests()
    localStorage.clear()
    sessionStorage.clear()
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

  it('starts OFF — the floor is silent on every page load', async () => {
    await mount(Harness)
    expect(api.enabled.value).toBe(false)
    expect(api.playing.value).toBe(false)
  })

  it('remembers NOTHING — a fresh load is silent even after sound was turned on', async () => {
    // This is the guarantee. If we persisted an "on" choice, a reload would leave
    // the switch reading "on" over a silent page, and one stray click would bring
    // the noise back unannounced. Nothing stored means nothing to be surprised by.
    spyPlay()
    await mount(Harness)
    api.toggle() // the visitor turns sound on
    expect(api.enabled.value).toBe(true)

    // ...and now they reload. Simulate it: fresh state, fresh mount.
    wrappers.forEach(w => w.unmount())
    wrappers = []
    __resetFloorAudioForTests()
    await mount(Harness)

    expect(api.enabled.value).toBe(false)
    expect(localStorage.getItem('mi-floor-audio')).toBeNull()
    expect(localStorage.length).toBe(0)
  })

  it('never fetches a byte of audio until sound is actually switched on', async () => {
    // preload="none" plus "no element until play()" means first paint is identical
    // whether the visitor turns audio on or not.
    spyPlay()
    await mount(Harness)
    expect(document.querySelectorAll('audio')).toHaveLength(0)

    api.toggle() // on

    const el = document.querySelector('audio')!
    expect(el).not.toBeNull()
    expect(el.preload).toBe('none')
  })

  it('toggle() turns sound on, and off again', async () => {
    const play = spyPlay()
    await mount(Harness)

    api.toggle()
    expect(api.enabled.value).toBe(true)
    expect(play).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(0)
    api.toggle()
    expect(api.enabled.value).toBe(false)
  })

  it('builds one <audio> element with opus first and an aac fallback', async () => {
    spyPlay()
    await mount(Harness)
    api.toggle() // on
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
    expect(() => api.toggle()).not.toThrow()
    // Fake timers: setTimeout(r, 0) will never resolve on its own. Advancing
    // the fake clock also flushes the microtask queue between ticks, which is
    // what lets the rejected play() promise's .catch() actually run.
    await vi.advanceTimersByTimeAsync(0)
    expect(api.playing.value).toBe(false)
  })

  it('shares ONE <audio> element across every consumer', async () => {
    spyPlay()
    // Two independent components, each calling the composable. If `el` were
    // per-call state instead of a module singleton, the second consumer would
    // build its own <audio> element and we'd hear the floor twice.
    let a: ReturnType<typeof useFloorAudio> | undefined
    let b: ReturnType<typeof useFloorAudio> | undefined
    const A = defineComponent({ setup() { a = useFloorAudio(); return () => h('div') } })
    const B = defineComponent({ setup() { b = useFloorAudio(); return () => h('div') } })
    await mount(A)
    await mount(B)

    a!.toggle() // on — A builds the element
    await vi.advanceTimersByTimeAsync(0)
    b!.toggle() // off
    b!.toggle() // on again — forces B through the same play()/ensureEl() path

    expect(document.querySelectorAll('audio')).toHaveLength(1)
    // The state is shared too, not per-instance.
    expect(a!.enabled.value).toBe(b!.enabled.value)
  })

  describe('visibilitychange', () => {
    it('does NOT call play() going hidden→visible when nothing has ever played', async () => {
      // No toggle() has ever happened, so `el` is still null. This pins the
      // `if (!el) return` guard at the top of onVisibility — delete that guard
      // and this becomes silent autoplay.
      const play = spyPlay()
      await mount(Harness)
      setHidden(true)
      setHidden(false)
      expect(play).not.toHaveBeenCalled()
    })

    it('pauses playback when the tab goes hidden', async () => {
      const play = spyPlay()
      const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause')
      await mount(Harness)
      api.toggle() // on
      await vi.advanceTimersByTimeAsync(0)
      expect(api.playing.value).toBe(true)

      setHidden(true)

      expect(pause).toHaveBeenCalledTimes(1)
      expect(api.playing.value).toBe(false)
      expect(play).toHaveBeenCalledTimes(1) // still just the original toggle
    })

    it('resumes playback when the tab becomes visible again while enabled', async () => {
      const play = spyPlay()
      await mount(Harness)
      api.toggle() // on
      await vi.advanceTimersByTimeAsync(0)

      setHidden(true)
      expect(api.playing.value).toBe(false)

      setHidden(false)
      await vi.advanceTimersByTimeAsync(0)

      expect(play).toHaveBeenCalledTimes(2) // the original toggle + the resume
      expect(api.playing.value).toBe(true)
    })

    it('does NOT resume playback on visibilitychange once sound has been toggled off', async () => {
      const play = spyPlay()
      await mount(Harness)
      api.toggle() // on
      await vi.advanceTimersByTimeAsync(0)
      api.toggle() // off; the <audio> element still exists
      play.mockClear()

      setHidden(true)
      setHidden(false)
      await vi.advanceTimersByTimeAsync(0)

      expect(play).not.toHaveBeenCalled()
    })
  })
})
