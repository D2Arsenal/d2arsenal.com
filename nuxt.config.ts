import svgLoader from 'vite-svg-loader'
import tailwindTypography from '@tailwindcss/typography'
import { copyManifestFromNodeModulesCacheIfAvailable, loadManifest } from './utils/server/manifest'

const SITE_URL = 'https://www.d2arsenal.com'
const GTAG_ID = 'G-SF9MC2HVRE'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxt/icon'],

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
      // eslint-disable-next-line n/prefer-global/process
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
    plugins: [svgLoader()]
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

  routeRules: {
    '/en/weapons/**': { static: true },
    '/discord/': { redirect: { to: 'https://discord.gg/vagYTbGHud', statusCode: 301 } },
    '/twitter/': { redirect: { to: 'https://twitter.com/D2Arsenal', statusCode: 301 } },
  },

  compatibilityDate: '2024-11-05',
})