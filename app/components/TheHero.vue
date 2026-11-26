<script setup lang="ts">
import { zones, allItems } from '~/data/catalog'

// The opening: the thesis set large, a short account of what is here, then an index
// of the six rooms in floor order, each with its count.
const THESES = [
  'The house always wins',
  'The math is the point',
  'Plain text outlives every app',
  'Your files stay yours',
  'Byte for byte',
  'Games you play by typing',
  'No real money',
  'No sign-ups',
  'Read the source',
  'Fly off into the shag carpet',
  'A fictional history'
]

const rooms = zones.map((z, i) => ({
  id: z.id,
  n: String(i + 1).padStart(2, '0'),
  name: z.sign,
  count: countLabel(z.items.length, z.unit)
}))
</script>

<template>
  <section class="wrap" aria-labelledby="hero-h">
    <div class="g12 hero">
      <h1 id="hero-h" class="col-span-12 h1">
        Built out of curiosity.<br><span class="signal">Given away.</span>
      </h1>

      <ul class="col-span-12 md:col-span-4 lg:col-span-3 facts">
        <li>A collection · all open source</li>
        <li>{{ allItems.length }} projects in {{ zones.length }} rooms</li>
        <li>Free</li>
        <li>No sign-ups</li>
        <li>No real money</li>
      </ul>

      <p class="col-span-12 md:col-start-6 md:col-span-7 lg:col-start-7 lg:col-span-6 lede">
        Tools for writing scripts, for taking apart TRS-80 programs, for putting your
        photos on the wall, and for watching the coffee brew, plus the everyday ones I
        wrote for work. The reborn catalog of VogelTronics, out of Elk Grove Village,
        Illinois. Casino simulations that show their math. frotz, Inc., for writing and
        playing 1980s-style text adventures on the Z-machine. And a 1971 slot car track.
      </p>
    </div>

    <nav class="index" aria-label="Index">
      <a v-for="r in rooms" :key="r.id" :href="`#${r.id}`">
        <span class="n">{{ r.n }}</span>
        <span class="name">{{ r.name }}</span>
        <span class="count">{{ r.count }}</span>
      </a>
    </nav>

    <!-- The thesis of every room, one line each. (These ran as a scrolling marquee
         in the neon design; here they hold still and can be read.) -->
    <ul class="theses" aria-label="The thesis of every room">
      <li v-for="line in THESES" :key="line">{{ line }}</li>
    </ul>
  </section>
</template>

<style scoped>
.hero { padding-block: clamp(64px, 9vw, 128px) clamp(56px, 7vw, 96px); }

.h1 {
  margin: 0;
  font-size: clamp(52px, 9.4vw, 140px);
  font-weight: 700;
  line-height: 0.94;
  letter-spacing: -0.045em;
}
.signal { color: var(--color-signal); }

.facts {
  margin-top: clamp(40px, 5vw, 72px);
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-mute);
}

.lede {
  margin-top: clamp(24px, 5vw, 72px);
  font-size: clamp(18px, 1.5vw, 21px);
  line-height: 1.45;
  color: var(--color-body);
}

.index {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  border-top: 1px solid var(--color-paper);
}
@media (min-width: 768px) { .index { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .index { grid-template-columns: repeat(6, minmax(0, 1fr)); } }

.index a {
  display: block;
  padding: 16px 16px 24px 0;
  border-bottom: 1px solid var(--color-rule);
  color: var(--color-paper);
}
.index a:hover .name { text-decoration: underline; text-underline-offset: 4px; }
.index span { display: block; }
.index .n { font-size: 13px; color: var(--color-mute); font-variant-numeric: tabular-nums; }
.index .name { margin-top: 6px; font-size: 17px; font-weight: 700; }
.index .count { font-size: 14px; color: var(--color-mute); }

.theses {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  margin-top: 40px;
  font-size: 14px;
  color: var(--color-mute);
}
@media (min-width: 768px) { .theses { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1100px) { .theses { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
.theses li { padding: 8px 16px 8px 0; border-top: 1px solid var(--color-rule); }
</style>
