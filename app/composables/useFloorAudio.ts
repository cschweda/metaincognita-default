const STORAGE_KEY = 'mi-floor-audio'
const TARGET_VOLUME = 0.45
const FADE_IN_MS = 1600
const FADE_OUT_MS = 500
const FADE_TICK_MS = 40

/**
 * Client-side singletons. One <audio> for the whole app no matter how many
 * components call this composable — otherwise TheDoors and SoundSwitch would
 * each build their own element and we'd hear the floor twice.
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
}

export function useFloorAudio() {
  /**
   * The *preference*. This says nothing about whether sound is currently
   * audible: browsers reject play() until a user gesture has occurred, which
   * is exactly what TheDoors exists to supply.
   */
  const enabled = useState('floor-audio-enabled', () => true)
  const playing = useState('floor-audio-playing', () => false)

  function persist(on: boolean) {
    if (!import.meta.client) return
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  }

  function ensureEl(): HTMLAudioElement {
    if (el) {
      // Re-attach if something detached it (and it keeps the tests honest —
      // the element is a module singleton that outlives any one component).
      if (!el.isConnected) document.body.appendChild(el)
      return el
    }
    el = document.createElement('audio')
    el.loop = true
    // Nothing is fetched until we actually play — first paint is untouched.
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
        // The autoplay policy said no. Stay silent and wait for the next gesture.
        playing.value = false
      })
  }

  /** TheDoors: the gesture that lets the floor come alive. */
  function enter(withSound: boolean) {
    enabled.value = withSound
    persist(withSound)
    if (withSound) play()
  }

  /** SoundSwitch: always inside a click handler, so a gesture is present. */
  function toggle() {
    enabled.value = !enabled.value
    persist(enabled.value)
    if (enabled.value) play()
    else if (el) fadeTo(0, FADE_OUT_MS) // nothing to fade if nothing was ever built
  }

  function onVisibility() {
    if (!el) return
    if (document.hidden) {
      el.pause()
      playing.value = false
    } else if (enabled.value) {
      el.play().then(() => { playing.value = true }).catch(() => {})
    }
  }

  // Set (per component instance) while a one-shot resume listener is armed,
  // so onBeforeUnmount can remove it if the component goes away before any
  // gesture fires. Cleared as soon as the listener fires or is torn down.
  let resumeGo: (() => void) | null = null

  /**
   * A reload inside the same session skips The Doors (see TheDoors' session
   * gate), so no gesture has ever happened — yet the preference still says
   * ON, and the floor is silent. Arm a one-shot listener so the very first
   * interaction anywhere on the page brings it back. This IS a genuine user
   * gesture, so the no-autoplay guarantee holds; it just doesn't require the
   * curtain specifically.
   */
  function armResume() {
    const go = () => {
      document.removeEventListener('pointerdown', go)
      document.removeEventListener('keydown', go)
      resumeGo = null
      if (enabled.value && !playing.value) play()
    }
    resumeGo = go
    document.addEventListener('pointerdown', go, { once: true })
    document.addEventListener('keydown', go, { once: true })
  }

  onMounted(() => {
    // Read the stored preference. Note: we do NOT start playing here — that
    // would be an autoplay attempt, and the browser would reject it anyway.
    enabled.value = window.localStorage.getItem(STORAGE_KEY) !== 'off'
    document.addEventListener('visibilitychange', onVisibility)

    // A reload inside the same session skips The Doors, so no gesture has happened and the
    // floor is silent — yet the preference still says ON. Arm a one-shot listener so the very
    // first interaction brings it back. Still a real user gesture: the no-autoplay guarantee
    // is untouched. (Same session key TheDoors uses.)
    const alreadyEntered = window.sessionStorage.getItem('mi-entered') === '1'
    if (alreadyEntered && enabled.value) armResume()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
    if (resumeGo) {
      document.removeEventListener('pointerdown', resumeGo)
      document.removeEventListener('keydown', resumeGo)
      resumeGo = null
    }
  })

  return { enabled, playing, enter, toggle }
}
