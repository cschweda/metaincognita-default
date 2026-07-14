const TARGET_VOLUME = 0.45
const FADE_IN_MS = 1600
const FADE_OUT_MS = 500
const FADE_TICK_MS = 40

/**
 * Client-side singletons. One <audio> for the whole app no matter how many
 * components call this composable — otherwise every caller would build its own
 * element and we'd hear the floor twice.
 */
let el: HTMLAudioElement | null = null
let fadeTimer: ReturnType<typeof setInterval> | null = null

/**
 * Test-only escape hatch. The singletons above intentionally outlive any one
 * component, which means they'd otherwise leak an <audio> element (and a live
 * fade interval) from one test into the next. This exists solely so the test
 * suite can reset to a clean slate between tests — never call it from app code.
 */
export function __resetFloorAudioForTests() {
  if (fadeTimer) clearInterval(fadeTimer)
  fadeTimer = null
  if (el) el.remove()
  el = null
  // `enabled`/`playing` are Nuxt useState, which is shared across mounts in the
  // test environment — reset them too, or one test's playback leaks into the next.
  useState('floor-audio-enabled', () => false).value = false
  useState('floor-audio-playing', () => false).value = false
}

/**
 * The floor ambience.
 *
 * **Sound is OFF on every single page load, with no exceptions and nothing
 * remembered.** There is deliberately no persisted preference: if we stored an
 * "on" choice, a reload would leave the switch reading *on* while the page sat
 * silent (browsers won't start audio without a gesture), and one stray click
 * would bring the noise back unannounced. Nothing to store means nothing to be
 * surprised by. If you want the floor, you turn it on — every time.
 *
 * `play()` is therefore only ever reachable from the switch's click handler.
 * That is not merely a convention: browsers reject audible autoplay outright,
 * it is a WCAG 1.4.2 (Audio Control) failure, and it is a dark pattern besides.
 */
export function useFloorAudio() {
  /** Has the visitor asked for sound on THIS page load? Starts false, always. */
  const enabled = useState('floor-audio-enabled', () => false)
  /** Is the floor actually audible right now? The switch's bars read from this. */
  const playing = useState('floor-audio-playing', () => false)

  function ensureEl(): HTMLAudioElement {
    if (el) {
      // Re-attach if something detached it (and it keeps the tests honest —
      // the element is a module singleton that outlives any one component).
      if (!el.isConnected) document.body.appendChild(el)
      return el
    }
    el = document.createElement('audio')
    el.loop = true
    // Nothing is fetched until we actually play — first paint is byte-for-byte
    // identical whether or not the visitor ever turns sound on.
    el.preload = 'none'
    el.volume = 0

    const opus = document.createElement('source')
    opus.src = '/audio/casino-floor.webm'
    opus.type = 'audio/webm; codecs=opus'

    const aac = document.createElement('source')
    aac.src = '/audio/casino-floor.m4a'
    aac.type = 'audio/mp4; codecs=mp4a.40.2'

    el.append(opus, aac)
    document.body.appendChild(el)
    return el
  }

  function fadeTo(target: number, ms: number) {
    const a = ensureEl()
    if (fadeTimer) clearInterval(fadeTimer)
    const steps = Math.max(1, Math.round(ms / FADE_TICK_MS))
    const from = a.volume
    let i = 0
    fadeTimer = setInterval(() => {
      i += 1
      a.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)))
      if (i < steps) return
      if (fadeTimer) clearInterval(fadeTimer)
      fadeTimer = null
      if (target === 0) {
        a.pause()
        playing.value = false
      }
    }, FADE_TICK_MS)
  }

  /** MUST be called from inside a user-gesture handler. */
  function play() {
    const a = ensureEl()
    a.play()
      .then(() => {
        playing.value = true
        fadeTo(TARGET_VOLUME, FADE_IN_MS)
      })
      .catch(() => {
        // The autoplay policy said no. Stay silent.
        playing.value = false
      })
  }

  /** The switch. Always runs inside a click handler, so a gesture is present. */
  function toggle() {
    enabled.value = !enabled.value
    if (enabled.value) play()
    else if (el) fadeTo(0, FADE_OUT_MS) // nothing to fade if nothing was ever built
  }

  /** Don't keep playing to an empty room. */
  function onVisibility() {
    if (!el) return
    if (document.hidden) {
      el.pause()
      playing.value = false
    } else if (enabled.value) {
      el.play().then(() => { playing.value = true }).catch(() => {})
    }
  }

  onMounted(() => {
    // Note what is NOT here: no stored preference is read, and play() is never
    // called. The page always starts silent.
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { enabled, playing, toggle }
}
