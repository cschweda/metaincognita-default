<script setup lang="ts">
// Presentational. The wordmark gets a polished-floor reflection beneath it —
// the cheapest possible way to say "casino lobby".
</script>

<template>
  <section class="relative flex min-h-[74vh] flex-col items-center justify-center px-6 pt-24 pb-10 text-center">
    <div class="reveal flex items-center gap-4" style="animation-delay: 0.05s">
      <span class="hidden h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/60 sm:block" />
      <span class="eyebrow">a collection · not gambling</span>
      <span class="hidden h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/60 sm:block" />
    </div>

    <h1 class="wordmark font-display reveal mt-7" style="animation-delay: 0.12s">
      <span class="text-neon-cyan">meta</span><span class="i text-neon-magenta">incognita</span>
    </h1>

    <div class="wordmark reflect-wrap reveal" aria-hidden="true" style="animation-delay: 0.12s">
      <div class="reflect">
        <span class="rm">meta</span><span class="ri">incognita</span>
      </div>
    </div>

    <p
      class="font-display reveal mt-7 text-[clamp(1.3rem,3vw,2.1rem)] font-normal leading-snug tracking-tight text-bone-100"
      style="animation-delay: 0.36s"
    >
      Nothing at stake. Everything simulated.
    </p>

    <p
      class="reveal mt-5 max-w-2xl text-base leading-relaxed text-bone-300 sm:text-lg"
      style="animation-delay: 0.46s"
    >
      A small, curated collection of open-source projects, built out of pure curiosity —
      casino simulations that show their math, games just for fun, and the reborn catalog
      of AmToy, an American toy company that never existed. No real money, no accounts.
    </p>

    <div class="reveal mt-10 flex flex-wrap items-center justify-center gap-4" style="animation-delay: 0.56s">
      <a href="#pit" class="btn-gold">
        Take the floor
        <UIcon name="i-lucide-arrow-down" class="text-[0.95em]" aria-hidden="true" />
      </a>
      <!-- named for their destinations: the signs say The Arcade / AmToy, the titles say the rest -->
      <a href="#arcade" class="btn-ghost">Tools for fun</a>
      <a href="#amtoy" class="btn-ghost">AmToy games</a>
    </div>

    <ul class="reveal mt-9 flex flex-wrap items-center justify-center gap-2.5" style="animation-delay: 0.66s">
      <li class="chip">No real money</li>
      <li class="chip">No accounts</li>
      <li class="chip">No generative AI</li>
      <li class="chip chip-gold">
        <UIcon name="i-lucide-git-fork" class="text-[0.9em]" aria-hidden="true" />
        Open source
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wordmark {
  font-size: clamp(2.6rem, 10vw, 7.4rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}

.wordmark .i { animation: flick 6s infinite; }

/* the polished floor: the wrapper is animated and clipped; the inner does the
   flip, so no keyframe can ever overwrite the mirror. */
.reflect-wrap {
  margin-top: -0.1em;
  height: 0.55em;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.reflect {
  opacity: 0.22;
  filter: blur(3px);
  transform: scaleY(-1);
  -webkit-mask-image: linear-gradient(to bottom, transparent 42%, #000 100%);
  mask-image: linear-gradient(to bottom, transparent 42%, #000 100%);
}
.reflect .rm { color: var(--color-cyan-300); }
.reflect .ri { color: var(--color-magenta-300); }

.btn-gold,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.85rem 1.7rem;
  font-size: 0.93rem;
  font-weight: 700;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.35s ease,
    color 0.35s ease;
}

.btn-gold {
  color: #180f00;
  background: linear-gradient(180deg, #ffe3a0, #ffb92e 55%, #e79608);
  box-shadow:
    0 0 24px rgba(255, 185, 46, 0.55),
    0 0 60px rgba(255, 140, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}
.btn-gold:hover { transform: translateY(-2px); }

.btn-ghost {
  color: #d8f7ff;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-cyan-400) 55%, transparent);
  box-shadow: 0 0 14px rgba(0, 214, 255, 0.28), inset 0 0 14px rgba(0, 214, 255, 0.1);
}
.btn-ghost:hover { transform: translateY(-2px); color: #fff; }

.btn-gold:focus-visible,
.btn-ghost:focus-visible {
  outline: 2px solid var(--color-cyan-400);
  outline-offset: 3px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.03);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-bone-300);
}

.chip-gold {
  border-color: color-mix(in srgb, var(--color-gold-400) 50%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 8%, transparent);
  color: var(--color-gold-200);
  box-shadow: 0 0 14px rgba(255, 185, 46, 0.2);
}
</style>
