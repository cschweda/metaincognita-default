<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-10 border-t border-white/[0.08] px-6 py-14">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <a href="#top" class="font-display text-2xl font-bold tracking-tight">
          <span class="text-bone-100">meta</span><span class="text-gold">incognita</span>
        </a>
        <p class="eyebrow mt-3">the house edge, revealed</p>
      </div>

      <div class="font-mono text-xs leading-relaxed text-bone-500 sm:text-right">
        <p>Open-source simulations · no real money, no accounts, no AI.</p>
        <p class="mt-1.5">© {{ year }} metaincognita</p>
      </div>
    </div>
  </footer>
</template>
