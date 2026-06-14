<script setup lang="ts">
// Presentational hero. Section counts live in the section headings below.
</script>

<template>
  <section class="relative flex min-h-[78vh] flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
    <!-- kicker -->
    <div class="reveal flex items-center gap-4" style="animation-delay: 0.05s">
      <span class="hidden h-px w-10 bg-gradient-to-r from-transparent to-gold-600/60 sm:block" />
      <span class="eyebrow">simulations · not gambling</span>
      <span class="hidden h-px w-10 bg-gradient-to-l from-transparent to-gold-600/60 sm:block" />
    </div>

    <!-- wordmark -->
    <h1 class="wordmark font-display reveal mt-7" style="animation-delay: 0.12s">
      <span class="text-bone-100">meta</span><span class="text-gold">incognita</span>
    </h1>

    <!-- gold rule -->
    <div class="rule-gold reveal mt-8 h-px w-44 sm:w-60" style="animation-delay: 0.26s" />

    <!-- tagline -->
    <p
      class="font-display reveal mt-8 text-[clamp(1.4rem,3.2vw,2.2rem)] font-normal leading-snug tracking-tight text-bone-100/90"
      style="animation-delay: 0.36s"
    >
      The house edge, revealed.
    </p>

    <!-- subline -->
    <p
      class="reveal mt-5 max-w-2xl text-base leading-relaxed text-bone-300 sm:text-lg"
      style="animation-delay: 0.46s"
    >
      Open-source casino simulations that reveal the math the floor never shows —
      no money, no accounts, no AI. Plus a tool or two for the mind that plays them.
    </p>

    <!-- calls to action -->
    <div class="reveal mt-10 flex flex-wrap items-center justify-center gap-4" style="animation-delay: 0.56s">
      <a href="#simulations" class="btn-primary">
        Browse simulations
        <UIcon name="i-lucide-arrow-down" class="text-[0.95em]" />
      </a>
      <a href="#tooling" class="btn-ghost">Tooling</a>
    </div>

    <!-- it's-not-gambling chips -->
    <ul
      class="reveal mt-9 flex flex-wrap items-center justify-center gap-2.5"
      style="animation-delay: 0.66s"
    >
      <li class="chip">No real money</li>
      <li class="chip">No accounts</li>
      <li class="chip">No login</li>
      <li class="chip">No AI</li>
      <li class="chip chip-gold">
        <UIcon name="i-lucide-git-fork" class="text-[0.9em]" />
        Open source
      </li>
    </ul>
  </section>
</template>

<style scoped>
.wordmark {
  font-size: clamp(2.7rem, 11vw, 8.4rem);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
}

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition:
    transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease,
    color 0.35s ease;
}

.btn-primary {
  color: #1a1407;
  background: linear-gradient(180deg, #f1dca0, #d4af37);
  box-shadow: 0 14px 34px -16px rgba(212, 175, 55, 0.7);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px -16px rgba(212, 175, 55, 0.85);
}

.btn-ghost {
  color: var(--color-bone-100);
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--color-gold-400) 60%, transparent);
  color: var(--color-gold-200);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.025);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-bone-300);
}

.chip-gold {
  border-color: color-mix(in srgb, var(--color-gold-400) 45%, transparent);
  background: color-mix(in srgb, var(--color-gold-400) 10%, transparent);
  color: var(--color-gold-200);
}
</style>
