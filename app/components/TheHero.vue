<script setup lang="ts">
import { zones, allItems } from '~/data/catalog'

// The opening: the thesis set large, then the facts and a short account of what is here.
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
  </section>
</template>

<style scoped>
.hero { padding-top: clamp(64px, 9vw, 128px); }

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

</style>
