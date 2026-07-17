<script setup lang="ts">
const props = defineProps<{
  sign: string
  color: string
  title: string
  sub: string
  count: number
  unit: string
}>()

const countLabel = computed(() => {
  const n = String(props.count).padStart(2, '0')
  return `${n} ${props.unit}${props.count === 1 ? '' : 's'}`
})
</script>

<template>
  <header :style="{ '--zc': color }">
    <div class="zone-head">
      <span class="sign">{{ sign }}</span>
      <span class="bar" aria-hidden="true" />
      <span class="count">{{ countLabel }}</span>
    </div>
    <h2 class="zone-title">{{ title }}</h2>
    <p class="zone-sub">{{ sub }}</p>
  </header>
</template>

<style scoped>
.zone-head {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
}

/* the neon tube */
.sign {
  padding: 0.42rem 1.2rem;
  border-radius: 999px;
  border: 2px solid var(--zc);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 10px var(--zc);
  box-shadow:
    0 0 10px var(--zc),
    0 0 34px color-mix(in srgb, var(--zc) 45%, transparent),
    inset 0 0 16px color-mix(in srgb, var(--zc) 30%, transparent);
  animation: breathe 4s ease-in-out infinite;
}

.bar {
  flex: 1;
  height: 1px;
  min-width: 2rem;
  background: linear-gradient(90deg, color-mix(in srgb, var(--zc) 55%, transparent), transparent);
}

.count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-bone-500);
}

.zone-title {
  margin-top: 1.5rem;
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--color-bone-100);
}

.zone-sub {
  margin-top: 0.85rem;
  max-width: 34rem;
  font-size: 0.97rem;
  line-height: 1.6;
  color: var(--color-bone-300);
}
</style>
