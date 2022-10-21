import { defineStore } from 'pinia'
import { isWeapon, isWeaponFrame, isWeaponMod, isWeaponTrait, isMasterwork, isSandboxMod, isCatalyst } from '~/utils/transforms';
import type { ManifestData } from '~/types'


export const useManifestStore = defineStore('manifest', () => {
  const version = ref<string | null>()
  const data = ref<ManifestData | null>(null)

  const weapons = computed(() => data.value?.itemDefs.filter(i => isWeapon(i)) ?? [])
  const frames = computed(() => data.value?.itemDefs.filter(i => isWeaponFrame(i)) ?? [])
  const damageTypes = computed(() => data.value?.damageTypes ?? {})
  const mods = computed(() => data.value?.itemDefs.filter(i => isWeaponMod(i)) ?? [])
  const weaponTraits = computed(() => data.value?.itemDefs.filter(i => isWeaponTrait(i)) ?? [])
  const sandboxModsFn = computed(() => data.value?.sandboxPerks && isSandboxMod(data.value.sandboxPerks))
  const sandboxMods = computed(() => {
    if (!sandboxModsFn.value) {
      return []
    }
    return mods.value?.filter(w => isSandboxMod(w))
  })
  const catalysts = computed(() => data.value?.itemDefs.filter(i => isCatalyst(i)) ?? [])
  const masterworks = computed(() => data.value?.itemDefs.filter(i => isMasterwork(i)) ?? [])

  const init = async () => {
    const res = await $fetch('/api/manifest')
    const _data: ManifestData = res.data
    version.value = res.version
    data.value = _data
  }


  return { init, version, data, weapons, frames, damageTypes, mods, sandboxMods, weaponTraits, catalysts, masterworks }
})
