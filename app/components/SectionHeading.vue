<script setup lang="ts">
defineProps<{
  kicker: string
  label: string
  title: string
  sub: string
  count?: string
}>()
</script>

<template>
  <header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div class="max-w-2xl">
      <div class="eyebrow flex items-center gap-3">
        <span>{{ kicker }}</span>
        <span class="text-gold-600/60">/</span>
        <span>{{ label }}</span>
      </div>
      <h2 class="font-display mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-bone-100 sm:text-5xl">
        {{ title }}
      </h2>
      <p class="mt-4 max-w-xl text-base leading-relaxed text-bone-300">
        {{ sub }}
      </p>
    </div>
    <div
      v-if="count"
      class="eyebrow shrink-0 text-bone-500"
    >
      {{ count }}
    </div>
  </header>
</template>
