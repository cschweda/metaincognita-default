import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'

describe('test harness', () => {
  it('exposes Nuxt auto-imports (useState, onMounted) without explicit import', async () => {
    const Probe = defineComponent({
      setup() {
        const state = useState('probe', () => 41)   // no import — must resolve as a Nuxt global
        onMounted(() => { state.value += 1 })        // no import — must resolve as a Nuxt global
        return () => h('span', state.value)
      }
    })
    const wrapper = await mountSuspended(Probe)
    expect(wrapper.text()).toBe('42')
  })

  it('provides a DOM', () => {
    expect(typeof document.createElement).toBe('function')
  })
})
