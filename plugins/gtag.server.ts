export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const id = config.gtagId

  const preloadLinks = [
    {
      re1l: 'preload',
      as: 'script',
      href: `https://www.googletagmanager.com/gtag/js?id=${id}`,
    },
    {
      rel: 'preconnect',
      href: 'https://www.google-analytics.com/',
    },
  ]
  if (process.env.NODE_ENV === 'production') {
    if (nuxtApp.app.head) {
      nuxtApp.app.head.link = [...(nuxtApp.app.head.link || []), ...preloadLinks]
    } else {
      nuxtApp.app.head = {
        link: preloadLinks,
      }
    }
  }
})