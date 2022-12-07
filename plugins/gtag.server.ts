export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const id = config.gtagId

  nuxtApp._useHead({
    link: [
      {
        rel: 'preload',
        as: 'script',
        href: `https://www.googletagmanager.com/gtag/js?id=${id}`,
      },
      {
        rel: 'preconnect',
        href: 'https://www.google-analytics.com/',
      },
    ],
  })
})
