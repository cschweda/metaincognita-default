<script setup lang="ts">
import { simulations, tools } from '~/data/catalog'

// Stagger the card reveals a touch past the hero's entrance.
const cardDelay = (i: number, base = 0) => `${(base + i * 0.06).toFixed(2)}s`
</script>

<template>
  <div>
    <TheHero />

    <main class="relative z-10 mx-auto max-w-6xl px-6">
      <!-- Simulations -->
      <section id="simulations" class="scroll-mt-16 py-20 sm:py-28">
        <SectionHeading
          kicker="01"
          label="Simulations"
          title="Play the house at its own game."
          sub="Eight casino games rebuilt as open-source simulations — true odds, basic strategy, and the exact house edge, all out in the open. No money, no sign-up."
          :count="`${String(simulations.length).padStart(2, '0')} simulations`"
        />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AppCard
            v-for="(item, i) in simulations"
            :key="item.domain"
            class="reveal"
            :style="{ animationDelay: cardDelay(i) }"
            :item="item"
            :index="i"
          />
        </div>
      </section>

      <div class="rule-gold h-px w-full opacity-40" />

      <!-- Tooling -->
      <section id="tooling" class="scroll-mt-16 py-20 sm:py-28">
        <SectionHeading
          kicker="02"
          label="Tooling"
          title="Tools for the mind."
          sub="Utilities that sharpen memory and recall — open source, like everything here. Starting with one; more on the way."
          :count="`${String(tools.length).padStart(2, '0')} tool${tools.length === 1 ? '' : 's'}`"
        />
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AppCard
            v-for="(item, i) in tools"
            :key="item.domain"
            class="reveal"
            :style="{ animationDelay: cardDelay(i) }"
            :item="item"
            :index="i"
          />
        </div>
      </section>
    </main>

    <TheFooter />
  </div>
</template>
