// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  typescript: {
    strict: true,
  },
  build: {
    transpile: ["@heroicons/vue", "@headlessui/vue"]
  }
})
