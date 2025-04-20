import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            background: '#FFFFFF',
            surface: '#FFFFFF',
            primary: '#121212',
            'primary-darken-1': '#3700B3',
            secondary: '#6c757d',
            'secondary-darken-1': '#018786',
            error: '#dc3545',
            info: '#17a2b8',
            success: '#28a745',
            warning: '#ffc107',
          },
        },
        dark: {
          dark: true,
          colors: {
            background: '#121212',
            surface: '#1E1E1E',
            primary: '#FFFFFF',
            'primary-darken-1': '#3700B3',
            secondary: '#6c757d',
            'secondary-darken-1': '#03DAC5',
            error: '#CF6679',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})