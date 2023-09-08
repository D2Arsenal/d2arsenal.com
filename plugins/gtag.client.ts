import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const id = config.gtagId as string

  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id,
      params: {
        anonymize_ip: true,
      },
    },
  })

  const router = useRouter()
  trackRouter(router)
})
