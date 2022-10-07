import { defineStore } from 'pinia'


export const useManifestStore = defineStore('manifest', async () => {
  const version = ref<number | null>()
  const data = ref()

  const init = async () => {
    const res = await $fetch('/api/manifest')
    version.value = res.version
    data.value = res.data
  }


  return { init, version, data }
})
