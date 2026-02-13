import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/scss/main.scss',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function']
        }
      }
    }
  }
})
