import { defineStore } from 'pinia'
import { isSandboxMod } from '~~/utils/checks';
import type { ManifestData } from '~/types'


export const useManifestStore = defineStore('manifest', () => {
  const version = ref<string>()
  const data = ref<ManifestData>()

  const weapons = computed(() => data.value?.weapons ?? [])
  const frames = computed(() => data.value?.frames ?? [])
  const damageTypes = computed(() => data.value?.damageTypes ?? {})
  const mods = computed(() => data.value?.mods ?? [])
  const weaponTraits = computed(() => data.value?.weaponTraits ?? [])
  const sandboxModsFn = computed(() => data.value?.sandboxPerks && isSandboxMod(data.value.sandboxPerks))
  const sandboxMods = computed(() => {
    if (!sandboxModsFn.value) {
      return []
    }
    return mods.value?.filter(w => isSandboxMod(w))
  })
  const catalysts = computed(() => data.value?.catalysts ?? [])
  const masterworks = computed(() => data.value?.masterworks ?? [])

  const init = async () => {
    const res = await $fetch('/api/manifest')
    const _data: ManifestData = res.data
    version.value = res.version
    data.value = _data
  }


  return { init, version, data, weapons, frames, damageTypes, mods, sandboxMods, weaponTraits, catalysts, masterworks }
})
