// https://nuxt.com/docs/api/configuration/nuxt-config
// import { splitVendorChunkPlugin } from 'vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css',
  ],
  
  modules: ['@nuxtjs/google-fonts', '@nuxtjs/plausible'],
  
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
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         return 'vendor';
    //       }
    //       if (id.includes('src/components/')) {
    //         return 'components';
    //       }
    //     },
    //   },
    // },
    
  },
  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ['localhost'],
  },
   vite: {
    // plugins: [
    //   splitVendorChunkPlugin(),
    // ]
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
