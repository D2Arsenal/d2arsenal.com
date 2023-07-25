import svgLoader from 'vite-svg-loader'
import tailwindTypography from '@tailwindcss/typography'
import { copyManifestFromNodeModulesCacheIfAvailable, loadManifest } from './utils/server/manifest'

const SITE_URL = 'https://www.d2arsenal.com'
const SITE_NAME = 'D2 Arsenal'
const GTAG_ID = 'G-SF9MC2HVRE'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@kevinmarrec/nuxt-pwa', '@vueuse/nuxt', 'nuxt-icon'],
  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
      gtagId: GTAG_ID,
    },
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
  },
  nitro: {
    prerender: {
      routes: ['/', '/donate/', '/sitemap.xml'],
    },
  },
  experimental: {
    payloadExtraction: true,
  },
  hooks: {
    'nitro:build:before': async () => {
      await copyManifestFromNodeModulesCacheIfAvailable(Boolean(process.env.INCOMING_HOOK_BODY))
      // eslint-disable-next-line no-console
      console.log('preloading manifest')
      await loadManifest(true)
      // eslint-disable-next-line no-console
      console.log('Successfully preloaded manifest')
    },
  },
  typescript: {
    strict: true,
  },
  build: {
    transpile: ['@headlessui/vue'],
  },
  vite: {
    plugins: [svgLoader()],
    optimizeDeps: { exclude: ['fsevents'] },
    vue: {
      reactivityTransform: true,
    },
  },
  tailwindcss: {
    config: {
      plugins: [tailwindTypography],
      theme: {
        extend: {
          backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          },
        },
      },
    },
  },
  pwa: {
    meta: {
      name: `${SITE_NAME} - Craft your favorite weapon`,
      author: 'D2 Arsenal Team',
      description: 'D2 Arsenal allows you to create your favorite weapon rolls for Destiny 2 and share them along with the community.',
      ogHost: SITE_URL,
      ogSiteName: SITE_NAME,
      twitterCreator: '@D2Arsenal',
      twitterCard: 'summary',
    },
  },
  routeRules: {
    '/en/weapons/**': { static: true },
    '/discord/': { redirect: { to: 'https://discord.gg/vagYTbGHud', statusCode: 301 } },
    '/twitter/': { redirect: { to: 'https://twitter.com/D2Arsenal', statusCode: 301 } },
  },
})
