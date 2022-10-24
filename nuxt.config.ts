export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  app: {
    pageTransition: false,
    layoutTransition: false
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
  }
})
