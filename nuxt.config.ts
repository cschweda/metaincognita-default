// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css',
  ],
  
  modules: [
    '@nuxtjs/google-fonts',
  ],
  
  googleFonts: {
    families: {
      'Special Elite': true
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },
  
  build: {
    transpile: ['vuetify'],
  },
  
  app: {
    head: {
      title: 'metaincognita',
      meta: [
        { name: 'description', content: 'metaincognita web application' }
      ],
    }
  }
})