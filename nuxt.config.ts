import { loadMinimalManifest } from './utils/server/manifest';
import svgLoader from 'vite-svg-loader'

const PROJECT_URL = 'https://d2arsenal.com'
const SITE_NAME = 'D2 Arsenal'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@kevinmarrec/nuxt-pwa'],
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  hooks: {
    async 'build:done' () {
      await loadMinimalManifest()
    }
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    // Ideal for offline-work. Needs a manifest.json in /tmp
    useCachedManifest: false
  },
  build: {
    transpile: ["@heroicons/vue", "@headlessui/vue"]
  },
  vite: {
    plugins: [svgLoader()]
  },
  pwa: {
    meta: {
      name: `${SITE_NAME} - Craft your favorite weapon`,
      author: 'D2 Arsenal Team',
      description: `D2 Arsenal allows you to create your favorite weapon rolls for Destiny 2 with all mods available`,
      ogHost: PROJECT_URL,
      ogSiteName: SITE_NAME
    },
    icon: {

    }
  },
  routeRules: {
    '/en/weapons/**': { static: true }
  }
})
