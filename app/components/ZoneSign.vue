<script setup lang="ts">
const props = defineProps<{
  /** The zone's place on the floor, from 1. */
  index: number
  /** id for the h2, so the section can name itself by its title. */
  headingId?: string
  sign: string
  title: string
  /** The part of the title set in the accent colour, if any. */
  titleAccent?: string
  sub: string
  count: number
  unit: string
}>()

const number = computed(() => String(props.index).padStart(2, '0'))
// "14" and "tools", set apart: the figure large, its unit small beside it
const unitLabel = computed(() => countLabel(props.count, props.unit).slice(String(props.count).length + 1))

// The title in three runs: before the accented part, the part itself, after it.
// No accent (or one the title does not contain) leaves the title as one plain run.
const runs = computed(() => {
  const i = props.titleAccent ? props.title.indexOf(props.titleAccent) : -1
  if (i < 0) return { before: props.title, accent: '', after: '' }
  const end = i + props.titleAccent!.length
  return { before: props.title.slice(0, i), accent: props.titleAccent!, after: props.title.slice(end) }
})
</script>

<template>
  <header class="g12 head">
    <div class="col-span-12 md:col-span-3 meta">
      <p class="num">{{ number }}</p>
      <p class="sign">{{ sign }}</p>
      <p class="count"><span class="count-n">{{ count }}</span> <span class="count-unit">{{ unitLabel }}</span></p>
    </div>
    <div class="col-span-12 md:col-start-4 md:col-span-9">
      <h2 :id="headingId" class="zone-title">{{ runs.before }}<span v-if="runs.accent" class="signal">{{ runs.accent }}</span>{{ runs.after }}</h2>
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

/* The meta column reads like an infographic: the zone's number set as a large
   numeral, a hairline, its name, then its count as a figure with a small unit. */
.num {
  font-size: clamp(72px, 9vw, 132px);
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.06em;
  color: var(--color-paper);
  font-variant-numeric: tabular-nums;
}
.sign {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--color-rule);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
}
.count {
  margin-top: 10px;
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.count-n {
  font-size: clamp(36px, 3.4vw, 48px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-paper);
  font-variant-numeric: tabular-nums;
}
.count-unit { font-size: 15px; color: var(--color-mute); }

/* on a narrow screen the meta column sits above the title: keep it to the left */
@media (max-width: 767px) {
  .meta { max-width: 320px; }
}

.zone-title {
  font-size: clamp(40px, 5vw, 72px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.035em;
  color: var(--color-paper);
}

.signal { color: var(--color-signal); }

.zone-sub {
  margin-top: 28px;
  max-width: 46em;
  font-size: 18px;
  line-height: 1.5;
  color: var(--color-mute);
}
</style>
