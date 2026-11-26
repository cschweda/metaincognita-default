<script setup lang="ts">
import { zones, allItems, LEGACY_ANCHORS } from '~/data/catalog'
import { buildJsonLd } from '~/utils/jsonLd'

// A zone's finished cards, then the ones flagged with a status ("In development").
// The catalog already keeps flagged cards last (a test holds it to that); here they
// become a group of their own under the grid, set apart by a labelled rule.
const floors = zones.map((zone, i) => ({
  zone,
  index: i + 1,
  open: zone.items.filter(item => !item.status),
  pending: zone.items.filter(item => item.status)
}))

// Three to a row on a wide screen, two on a tablet, one on a phone. The showcase
// (an umbrella project with a suite to list) takes the whole row.
const span = (s: string) => s === 'showcase' ? 'col-span-12' : 'col-span-12 md:col-span-6 lg:col-span-4'

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildJsonLd(allItems)) }]
})

// Pageviews are recorded here rather than automatically (autoPageviews is off in
// nuxt.config.ts), so unknown URLs that land on the 404 page are never counted.
const { $plausible } = useNuxtApp()
onMounted(() => {
  // An old anchor (#pit, #machines, #fiction, #arcade) from a link given out before the
  // sections were renamed: swap in the new one, without adding a history entry, and go there.
  const renamed = LEGACY_ANCHORS[window.location.hash.slice(1)]
  if (renamed) {
    history.replaceState(null, '', `#${renamed}`)
    document.getElementById(renamed)?.scrollIntoView()
  }
  $plausible?.trackPageview()
})
</script>

<template>
  <div>
    <main>
      <TheHero />

      <section
        v-for="{ zone, index, open, pending } in floors"
        :id="zone.id"
        :key="zone.id"
        class="zone wrap"
        :aria-labelledby="`${zone.id}-h`"
      >
        <ZoneSign
          :heading-id="`${zone.id}-h`"
          :index="index"
          :sign="zone.sign"
          :title="zone.title"
          :title-accent="zone.titleAccent"
          :sub="zone.sub"
          :count="zone.items.length"
          :unit="zone.unit"
        />

        <div v-if="open.length" class="g12 floor">
          <GameCabinet
            v-for="item in open"
            :key="item.domain"
            :class="span(item.span)"
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
        >
          <p :id="`${zone.id}-pending`" class="bench-label">{{ pending[0]!.status }}</p>
          <div class="g12 floor floor-pending">
            <GameCabinet
              v-for="item in pending"
              :key="item.domain"
              :class="span(item.span)"
              :item="item"
            />
          </div>
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.zone { margin-top: clamp(96px, 11vw, 160px); }

.floor {
  margin-top: 72px;
  row-gap: 64px;
}

.bench {
  margin-top: 96px;
  padding-top: 16px;
  border-top: 1px solid var(--color-rule);
}
.bench-label { font-size: 15px; font-weight: 700; color: var(--color-mute); }
.floor-pending { margin-top: 32px; }
</style>
