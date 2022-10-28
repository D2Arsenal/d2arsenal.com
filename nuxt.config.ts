import svgLoader from 'vite-svg-loader'
import { loadManifest } from './utils/server/manifest';

const PROJECT_URL = 'https://d2arsenal.com'
const SITE_NAME = 'D2 Arsenal'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@kevinmarrec/nuxt-pwa'],
  app: {
    pageTransition: false,
    layoutTransition: false
  },
  nitro: {
    prerender: {
      routes: []
    },
    timing: true
  },
  hooks: {
    'nitro:build:before': async () => {
      console.log('preloading manifest')
      await loadManifest(true)
      console.log('Successfully preloaded manifest')
    }
  },
  typescript: {
    strict: true,
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
  },
  routeRules: {
    '/en/weapons/*': { static: true }
  }
})
