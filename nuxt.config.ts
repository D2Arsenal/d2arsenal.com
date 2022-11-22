import svgLoader from 'vite-svg-loader'
import tailwindTypography from '@tailwindcss/typography'
import { copyManifestFromNodeModulesCacheIfAvailable, loadManifest } from './utils/server/manifest'

const SITE_URL = 'https://d2arsenal.com'
const SITE_NAME = 'D2 Arsenal'
const GTAG_ID = 'G-SF9MC2HVRE'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@kevinmarrec/nuxt-pwa', '@vueuse/nuxt'],
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
      await copyManifestFromNodeModulesCacheIfAvailable()
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
    transpile: ['@heroicons/vue', '@headlessui/vue'],
  },
  vite: {
    plugins: [svgLoader()],
    vue: {
      reactivityTransform: true,
    },
  },
  tailwindcss: {
    // @ts-expect-error no content necessary I think
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
      twitterCard: 'summary_large_image',
    },
  },
  routeRules: {
    '/en/weapons/**': { static: true },
    '/discord/': { redirect: { to: 'https://discord.gg/vagYTbGHud', statusCode: 301 } },
    '/twitter/': { redirect: { to: 'https://twitter.com/D2Arsenal', statusCode: 301 } },
  },
})
