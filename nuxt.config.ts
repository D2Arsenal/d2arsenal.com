import svgLoader from 'vite-svg-loader'
import { loadManifest } from './utils/server/manifest';
import { getMinimalWeapons } from './utils/weapon';

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
  runtimeConfig: {
    public: {
      manifestVersion: 'Version of the Destiny2 Manifest, will be overridden'
    }
  },
  hooks: {
    'nitro:config': async (config) => {
      const { data, version } = await loadManifest()

      console.log('Setting manifest to version', { version })
      // Save manifest version to runtime config
      config.runtimeConfig!.public.manifestVersion = version

      // Set up prerender routes
      const { weapons } = data

      const minimalWeapons = getMinimalWeapons(weapons)
      minimalWeapons.forEach((weapon) => {
        config.prerender!.routes!.push(`/en/weapons/${weapon.hash}`)
      })
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
