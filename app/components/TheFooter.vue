<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative z-10 mt-24 border-t border-white/[0.08] px-6 py-14">
    <div class="mx-auto flex max-w-[1180px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <a href="#top" class="font-display foot-wm">
          <span class="m">meta</span><span class="i">incognita</span>
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

<style scoped>
.foot-wm {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.foot-wm .m { color: #f2fbff; text-shadow: 0 0 10px rgba(0, 214, 255, 0.7); }
.foot-wm .i { color: #ffe4f6; text-shadow: 0 0 10px rgba(255, 27, 166, 0.75); }
.foot-wm:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
  border-radius: 4px;
}
</style>
