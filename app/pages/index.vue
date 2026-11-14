<script setup lang="ts">
import { zones, allItems } from '~/data/catalog'
import { buildJsonLd } from '~/utils/jsonLd'

// Fallback stagger for browsers without view timelines, where the cabinets still
// reveal at load. With `animation-timeline: view()` the delay is neutralised and
// viewport-entry order does the staggering instead — see .reveal-view in main.css.
const cabDelay = (i: number) => `${(i * 0.06).toFixed(2)}s`

// A zone's finished cabinets, then the ones flagged with a status ("In development").
// The catalog already keeps flagged cabinets last (a test holds it to that); here they
// become a group of their own, set a little apart under a labelled rule.
const floors = zones.map(zone => ({
  zone,
  open: zone.items.filter(i => !i.status),
  pending: zone.items.filter(i => i.status)
}))

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildJsonLd(allItems)) }]
})

// Pageviews are recorded here rather than automatically (autoPageviews is off in
// nuxt.config.ts), so unknown URLs that land on the 404 page are never counted.
const { $plausible } = useNuxtApp()
onMounted(() => $plausible?.trackPageview())
</script>

<template>
  <div>
    <TheHero />
    <TheTicker />

    <main class="relative z-10 mx-auto max-w-[1180px] px-6">
      <section
        v-for="{ zone, open, pending } in floors"
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

        <div v-if="open.length" class="floor" :class="`floor-${zone.id}`">
          <GameCabinet
            v-for="(item, i) in open"
            :key="item.domain"
            class="reveal-view"
            :style="{ animationDelay: cabDelay(i) }"
            :item="item"
          />
        </div>

        <!-- Not open yet: the same cards, apart from the live ones under a rule of
             their own. The label is the group's name, so it is announced once. -->
        <div
          v-if="pending.length"
          class="bench"
          role="group"
          :aria-labelledby="`${zone.id}-pending`"
          :style="{ '--zc': zone.color }"
        >
          <p :id="`${zone.id}-pending`" class="bench-rule reveal-view">
            <span>{{ pending[0]!.status }}</span>
          </p>
          <div class="floor floor-pending" :class="`floor-${zone.id}`">
            <GameCabinet
              v-for="(item, i) in pending"
              :key="item.domain"
              class="reveal-view"
              :style="{ animationDelay: cabDelay(i) }"
              :item="item"
            />
          </div>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
