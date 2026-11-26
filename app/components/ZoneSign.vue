<script setup lang="ts">
const props = defineProps<{
  /** The zone's place on the floor, from 1. */
  index: number
  /** id for the h2, so the section can name itself by its title. */
  headingId?: string
  sign: string
  title: string
  sub: string
  count: number
  unit: string
}>()

const number = computed(() => String(props.index).padStart(2, '0'))
const count = computed(() => countLabel(props.count, props.unit))
</script>

<template>
  <header class="g12 head">
    <div class="col-span-12 md:col-span-3 meta">
      <p class="num">{{ number }}</p>
      <p class="sign">{{ sign }}</p>
      <p class="count">{{ count }}</p>
    </div>
    <div class="col-span-12 md:col-start-4 md:col-span-9">
      <h2 :id="headingId" class="zone-title">{{ title }}</h2>
      <p class="zone-sub">{{ sub }}</p>
    </div>
  </header>
</template>

<style scoped>
.head {
  border-top: 1px solid var(--color-paper);
  padding-top: 20px;
  row-gap: 24px;
}

.meta p { font-size: 15px; line-height: 1.45; }
.num { font-weight: 700; color: var(--color-signal); font-variant-numeric: tabular-nums; }
.sign { margin-top: 4px; font-weight: 700; }
.count { margin-top: 4px; color: var(--color-mute); }

.zone-title {
  font-size: clamp(40px, 5vw, 72px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
  color: var(--color-paper);
}

.zone-sub {
  margin-top: 28px;
  max-width: 46em;
  font-size: 18px;
  line-height: 1.5;
  color: var(--color-mute);
}
</style>
