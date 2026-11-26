<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="wrap foot">
    <div class="g12 top">
      <p class="col-span-12 md:col-span-6 claim">All open source. No sign-ups. Always free. No real money, ever.</p>
      <div class="col-span-12 md:col-span-6 actions">
        <a
          class="gh"
          href="https://github.com/cschweda?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
        >All the code on GitHub <span aria-hidden="true">↗</span><span class="sr-only"> — opens in a new tab</span></a>
        <SoundSwitch />
      </div>
    </div>

    <div class="g12 small">
      <p class="col-span-12 md:col-span-6">
        © {{ year }} metaincognita. In the works, one way or another, since a video poker
        game I wrote on a TRS-80 Model III — sometime in the 1980s, in BASIC.
      </p>
      <!--
        The frame-break. The VogelTronics homages point at real products, so exactly
        one plain statement has to live somewhere a visitor can reach. Smallest type,
        last line — the same place the Owner's Manual puts it.
      -->
      <p class="col-span-12 md:col-span-6">
        VogelTronics, its catalog and its history are an original invention, created for a
        set of retro-toy homage projects. No Hasbro, Mattel, Milton Bradley, Parker Brothers
        or Fidelity trademarks, logos or trade dress are used.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  margin-top: clamp(96px, 11vw, 160px);
  padding-bottom: 48px;
}
.top {
  border-top: 1px solid var(--color-paper);
  padding-top: 20px;
  row-gap: 16px;
  align-items: center;
}
.claim { font-size: 15px; font-weight: 700; }
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
}
@media (min-width: 768px) { .actions { justify-content: flex-end; } }
.gh {
  display: inline-block;
  padding: 12px 0;
  font-size: 15px;
  color: var(--color-paper);
}
.gh:hover { text-decoration: underline; text-underline-offset: 4px; }

.small {
  margin-top: 32px;
  row-gap: 16px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--color-mute);
}
</style>
