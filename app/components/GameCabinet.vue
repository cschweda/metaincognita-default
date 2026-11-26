<script setup lang="ts">
import type { CatalogItem } from '~/data/catalog'

const props = defineProps<{ item: CatalogItem }>()

const href = computed(() => `https://${props.item.domain}`)
</script>

<template>
  <!-- An article, not one big anchor: the card carries TWO links (play + source),
       and nested anchors are invalid HTML. The live link stretches itself over the
       whole card via ::after, so the card still clicks like one target; the source
       link sits above that overlay on its own z-index. -->
  <article class="cab" :class="[`cab-${item.span}`, { 'cab-pending': item.status }]">
    <!-- The plate: the app's own og:image where it has one, else its pictogram.
         Decorative either way: the card says everything as live text. -->
    <div class="plate">
      <img
        v-if="item.shot"
        :src="item.shot"
        alt=""
        width="1120"
        height="588"
        loading="lazy"
        decoding="async"
      >
      <UIcon v-else :name="`i-lucide-${item.icon}`" class="glyph" aria-hidden="true" />
    </div>

    <div class="body">
      <p class="label"><span class="badge">{{ item.badge }}</span> · {{ item.badgeNote }}</p>
      <h3 class="cab-title">{{ item.title }}</h3>
      <p class="cab-desc">{{ item.description }}</p>

      <!-- An umbrella project's tools. The card itself opens the umbrella site; each
           tool carries only its own source link, raised above the card's overlay. -->
      <ul v-if="item.suite?.length" class="suite">
        <li v-for="tool in item.suite" :key="tool.name">
          <span class="suite-head">
            <b>{{ tool.name }}</b>
            <a
              v-if="tool.repo"
              class="src"
              :href="tool.repo"
              target="_blank"
              rel="noopener noreferrer"
            >Source<span class="sr-only"> code for {{ tool.name }} on GitHub — opens in a new tab</span></a>
          </span>
          <span>{{ tool.note }}</span>
        </li>
      </ul>
      <p v-if="item.suiteMore" class="suite-more">{{ item.suiteMore }}</p>

      <p class="dom">
        <a
          class="live"
          :href="href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="truncate">{{ item.domain }}</span>
          <span aria-hidden="true">↗</span>
          <span class="sr-only">{{ item.title }} — opens in a new tab</span>
        </a>
        <a
          v-if="item.repo"
          class="src"
          :href="item.repo"
          target="_blank"
          rel="noopener noreferrer"
        >Source<span class="sr-only"> code for {{ item.title }} on GitHub — opens in a new tab</span></a>
      </p>
    </div>
  </article>
</template>

<style scoped>
.cab {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* The live link is the card, so its focus ring outlines the card. */
.live:focus-visible { outline: none; }
.cab:has(.live:focus-visible) {
  outline: 2px solid var(--color-signal);
  outline-offset: 6px;
}

.plate {
  position: relative;
  display: grid;
  aspect-ratio: 1120 / 588;
  overflow: hidden;
  background: var(--color-plate);
}
.plate img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* a pictogram, set in the plate's lower-left corner like a sign */
.glyph {
  align-self: end;
  margin: 0 0 24px 24px;
  font-size: clamp(64px, 6vw, 96px);
  color: var(--color-mute);
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.label {
  margin-top: 20px;
  font-size: 13px;
  color: var(--color-mute);
}
.badge { color: var(--color-paper); font-weight: 700; }

.cab-title {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-paper);
}
.cab:hover .cab-title { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px; }

.cab-desc {
  margin-top: 10px;
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-body);
}

.dom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--color-rule);
  font-size: 14px;
}

.live {
  display: inline-flex;
  gap: 6px;
  min-width: 0;
  color: var(--color-paper);
}
/* the stretch: one pseudo-element makes the whole card this link's hit area */
.live::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
}

.src {
  position: relative;
  z-index: 2; /* above the live link's overlay, or it could never be clicked */
  flex: none;
  /* a quiet caption, with padding that buys a real tap target */
  padding: 12px 8px;
  margin: -12px -8px;
  color: var(--color-mute);
}
.src:hover { color: var(--color-paper); text-decoration: underline; text-underline-offset: 4px; }

/* The showcase: one umbrella project across the whole row. The picture holds seven
   columns, the copy and its suite the other five; below a laptop it stacks. */
@media (min-width: 1024px) {
  .cab-showcase {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: 24px;
    align-items: start;
  }
  .cab-showcase .plate { grid-column: 1 / span 7; }
  .cab-showcase .body { grid-column: 8 / span 5; }
  .cab-showcase .label { margin-top: 0; }
}
.cab-showcase .cab-title { font-size: clamp(32px, 3vw, 44px); letter-spacing: -0.03em; }

.suite {
  margin-top: 20px;
  border-top: 1px solid var(--color-rule);
}
.suite li {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-rule);
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-body);
}
.suite-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.suite b { color: var(--color-paper); }
.suite-head .src { font-size: 14px; }
.suite-more {
  margin-top: 12px;
  font-size: 15px;
  color: var(--color-mute);
}
</style>
