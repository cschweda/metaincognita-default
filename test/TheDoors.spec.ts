import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import TheDoors from '~/components/TheDoors.vue'
import { __resetFloorAudioForTests } from '~/composables/useFloorAudio'

// The fix for Finding 1 attaches a real `document`-level keydown listener and
// mutates `document.body` children's `inert` attribute for as long as a
// dialog instance is open (or simply mounted). mountSuspended never unmounts
// on its own, so track every wrapper and unmount it after its test — same
// pattern as test/useFloorAudio.spec.ts — or a leaked listener/inert
// attribute from one test skews the next.
let wrappers: Awaited<ReturnType<typeof mountSuspended>>[] = []

async function mount(component: Parameters<typeof mountSuspended>[0]) {
  const wrapper = await mountSuspended(component)
  wrappers.push(wrapper)
  return wrapper
}

describe('TheDoors', () => {
  beforeEach(() => {
    // The <audio> element and its fade timer are module-level singletons
    // (see useFloorAudio.ts); reset them so no test inherits DOM nodes or
    // timers left behind by a previous one.
    __resetFloorAudioForTests()
    localStorage.clear()
    sessionStorage.clear()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
  })

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers = []
  })

  it('opens as a labelled modal dialog on a fresh session', async () => {
    await mount(TheDoors)
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog!.getAttribute('aria-modal')).toBe('true')
    const labelledBy = dialog!.getAttribute('aria-labelledby')!
    expect(document.getElementById(labelledBy)?.textContent).toContain('Step onto the floor')
  })

  it('does not re-gate a session that has already entered', async () => {
    sessionStorage.setItem('mi-entered', '1')
    await mount(TheDoors)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('offers a real button to enter with sound, and one to enter silently', async () => {
    await mount(TheDoors)
    const buttons = [...document.querySelectorAll('[role="dialog"] button')]
    expect(buttons).toHaveLength(2)
    expect(buttons[0]!.textContent).toContain('Step onto the floor')
    expect(buttons[1]!.textContent).toContain('Enter silently')
  })

  it('entering with sound starts playback and closes the dialog', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    await mount(TheDoors)
    const enter = document.querySelectorAll('[role="dialog"] button')[0] as HTMLButtonElement
    enter.click()
    await new Promise(r => setTimeout(r, 0))
    expect(play).toHaveBeenCalledTimes(1)
    expect(sessionStorage.getItem('mi-entered')).toBe('1')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('entering silently closes the dialog and never plays', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    await mount(TheDoors)
    const quiet = document.querySelectorAll('[role="dialog"] button')[1] as HTMLButtonElement
    quiet.click()
    await new Promise(r => setTimeout(r, 0))
    expect(play).not.toHaveBeenCalled()
    expect(localStorage.getItem('mi-floor-audio')).toBe('off')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('sends focus to the primary button after mount', async () => {
    await mount(TheDoors)
    await nextTick()
    const primaryBtn = document.querySelectorAll('[role="dialog"] button')[0] as HTMLButtonElement
    expect(document.activeElement).toBe(primaryBtn)
  })

  it('Escape closes the dialog and marks the session entered', async () => {
    await mount(TheDoors)
    await nextTick()
    // Focus is inside the dialog here (the primary button, per the test
    // above) — this is the baseline case, distinct from the outside-focus
    // regression test below.
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
    expect(sessionStorage.getItem('mi-entered')).toBe('1')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  // Regression test for Finding 1a. A mouse user clicking the (non-focusable)
  // backdrop drops focus to <body>. The dialog <div> (teleported to <body>)
  // is a DESCENDANT of <body>, not an ancestor of it, so an event dispatched
  // on <body> bubbles up towards `document` and never passes through the
  // dialog subtree at all. If the keydown listener lived on the dialog div
  // (as it did before this fix), this test fails — proving Escape would be
  // unreachable the instant focus leaves the dialog.
  it('Escape still closes the dialog when focus is outside it entirely', async () => {
    await mount(TheDoors)
    await nextTick()
    const active = document.activeElement as HTMLElement | null
    active?.blur()
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
    expect(sessionStorage.getItem('mi-entered')).toBe('1')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('Tab on the last button wraps focus to the first', async () => {
    await mount(TheDoors)
    await nextTick()
    const buttons = document.querySelectorAll('[role="dialog"] button')
    const primaryBtn = buttons[0] as HTMLButtonElement
    const quietBtn = buttons[1] as HTMLButtonElement
    quietBtn.focus()
    quietBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(primaryBtn)
  })

  it('Shift+Tab on the first button wraps focus to the last', async () => {
    await mount(TheDoors)
    await nextTick()
    const buttons = document.querySelectorAll('[role="dialog"] button')
    const primaryBtn = buttons[0] as HTMLButtonElement
    const quietBtn = buttons[1] as HTMLButtonElement
    primaryBtn.focus()
    primaryBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(quietBtn)
  })

  it('marks background siblings inert while open, and clears them on close', async () => {
    const sibling = document.createElement('div')
    document.body.appendChild(sibling)
    await mount(TheDoors)
    await nextTick()
    expect(sibling.hasAttribute('inert')).toBe(true)

    const primaryBtn = document.querySelectorAll('[role="dialog"] button')[0] as HTMLButtonElement
    primaryBtn.click()
    await new Promise(r => setTimeout(r, 0))
    expect(sibling.hasAttribute('inert')).toBe(false)
  })
})
