// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = 'https://metaincognita.com'
const TITLE = 'Metaincognita Workshop'
const DESCRIPTION
  = 'The Metaincognita Workshop: open-source projects built out of curiosity. Tools for writing screenplays, taking apart TRS-80 programs, self-hosting a picture frame, publishing photographs, converting files in the browser, watching DNS, testing IPv6 readiness and watching a coffee brewer over Tailscale, plus a Markdown editor, a lorem ipsum generator, an image compressor, a document accessibility checker and an accessibility-deadline portal; the VogelTronics catalog, rebuilt; casino simulations that show the math behind hold’em, blackjack, craps, roulette, slots and video poker; frotz, Inc., a suite of browser tools for 1980s Infocom-style interactive fiction on the Z-machine; and a 1971 slot car track.'

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
      bodyAttrs: { style: 'background-color:#111111' },
      title: TITLE,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: DESCRIPTION },
        { name: 'theme-color', content: '#111111' },
        { name: 'author', content: 'metaincognita' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Metaincognita Workshop' },
        { property: 'og:title', content: TITLE },
        { property: 'og:description', content: DESCRIPTION },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: `${SITE_URL}/og-image.png` },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Metaincognita Workshop — open-source simulations, tools and games' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: TITLE },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
        { name: 'twitter:image:alt', content: 'Metaincognita Workshop — open-source simulations, tools and games' }
      ],
      // Inter Tight is self-hosted at build time by @nuxt/fonts (see `fonts` below
      // and app/assets/css/main.css @theme), so there is no external stylesheet to
      // link here and the CSP's font-src 'self' holds.
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

  // Helvetica Neue leads the font stack; Inter Tight is the fallback for systems
  // without it, downloaded at build time and served from /_fonts.
  fonts: {
    families: [{ name: 'Inter Tight', provider: 'google', weights: [400, 700], styles: ['normal'], global: true }]
  },

  icon: {
    clientBundle: {
      // bundle the icons we use so the static build needs no Iconify API calls
      scan: true
    }
  },

  plausible: {
    // don't record hits while developing
    ignoredHostnames: ['localhost'],
    // The module's automatic pageview fires on every URL that boots the app,
    // including the 404 fallback — so vulnerability scanners probing paths like
    // /mt/mt.cgi showed up as page views. The one real page records its own
    // view instead (see app/pages/index.vue).
    autoPageviews: false
  },

  nitro: {
    // emits a fully static site into ./dist for Netlify
    preset: 'netlify_static'
  },

  compatibilityDate: '2025-01-15'
})
