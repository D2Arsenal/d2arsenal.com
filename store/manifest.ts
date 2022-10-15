import { defineStore } from 'pinia'
import type { ManifestData } from '~/types'


export const useManifestStore = defineStore('manifest', () => {
  const version = ref<string | null>()
  const data = ref<ManifestData | null>(null)

  const weapons = computed(() => data.value?.weapons ?? [])
  const frames = computed(() => data.value?.weaponFrames ?? [])
  const damageTypes = computed(() => data.value?.damageTypes ?? {})
  const mods = computed(() => data.value?.weaponMods ?? [])

  const init = async () => {
    const res = await $fetch('/api/manifest')
    const _data: ManifestData = res.data
    version.value = res.version
    data.value = _data
  }


  return { init, version, data, weapons, frames, damageTypes, mods }
})
