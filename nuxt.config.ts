// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = 'https://metaincognita.com'
const TITLE = 'metaincognita — casino simulators, trainers & games'
const DESCRIPTION
  = 'A small, curated collection of open-source projects, built out of curiosity — casino simulators that show the math behind blackjack, craps, hold’em, roulette and slots, memory trainers for a sharper mind, and games built for fun.'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/plausible'],

  ssr: true,

  // inline critical CSS into the prerendered HTML, dropping the render-blocking stylesheet
  features: { inlineStyles: true },

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // inline so the first paint is dark even before any stylesheet arrives
      bodyAttrs: { style: 'background-color:#06050c' },
      title: TITLE,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: DESCRIPTION },
        { name: 'theme-color', content: '#06050c' },
        { name: 'author', content: 'metaincognita' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'metaincognita' },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESCRIPTION },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og-image.png` },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'metaincognita — open-source casino simulation suite' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
        { name: 'twitter:image:alt', content: 'metaincognita — open-source casino simulation suite' }
      ],
      // Fonts (Sora / Geist Mono) are self-hosted at build time by @nuxt/fonts —
      // see app/assets/css/main.css @theme — so there is no external
      // stylesheet to link here.
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        // full-bleed square — iOS masks its own corners; without this, share
        // sheets and home screens fall back to a page screenshot
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: SITE_URL }
      ]
    }
  },

  icon: {
    clientBundle: {
      // bundle the icons we use so the static build needs no Iconify API calls
      scan: true
    }
  },

  plausible: {
    // don't record hits while developing
    ignoredHostnames: ['localhost']
  },

  nitro: {
    // emits a fully static site into ./dist for Netlify
    preset: 'netlify_static'
  },

  compatibilityDate: '2025-01-15'
})
