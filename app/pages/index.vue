<script setup lang="ts">
import { zones, allItems } from '~/data/catalog'
import { buildJsonLd } from '~/utils/jsonLd'

// Fallback stagger for browsers without view timelines, where the cabinets still
// reveal at load. With `animation-timeline: view()` the delay is neutralised and
// viewport-entry order does the staggering instead — see .reveal-view in main.css.
const cabDelay = (i: number) => `${(i * 0.06).toFixed(2)}s`

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildJsonLd(allItems)) }]
})
</script>

<template>
  <div>
    <TheHero />
    <TheTicker />

    <main class="relative z-10 mx-auto max-w-[1180px] px-6">
      <section
        v-for="zone in zones"
        :id="zone.id"
        :key="zone.id"
        class="scroll-mt-16 pt-16 pb-6 sm:pt-20"
      >
        <ZoneSign
          class="reveal-view"
          :sign="zone.sign"
          :color="zone.color"
          :title="zone.title"
          :sub="zone.sub"
          :count="zone.items.length"
          :unit="zone.unit"
        />

        <div class="floor" :class="`floor-${zone.id}`">
          <GameCabinet
            v-for="(item, i) in zone.items"
            :key="item.domain"
            class="reveal-view"
            :style="{ animationDelay: cabDelay(i) }"
            :item="item"
          />
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
