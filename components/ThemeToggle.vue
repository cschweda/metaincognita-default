<template>
  <v-btn
    icon
    size="small"
    color="primary"
    class="theme-switch"
    @click="toggleTheme"
    variant="flat"
    style="position: fixed; top: 24px; right: 24px; z-index: 10;"
  >
    <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
  </v-btn>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDarkTheme = ref(true)

onMounted(() => {
  isDarkTheme.value = theme.global.name.value === 'dark'
})

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  theme.global.name.value = isDarkTheme.value ? 'dark' : 'light'
}

watch(isDarkTheme, (val) => {
  document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
})
</script>