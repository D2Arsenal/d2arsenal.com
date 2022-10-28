import { MinimalManifestData } from './../types';
import { MinimalWeapon } from './../utils/weapon';
import { defineStore } from 'pinia'
import { isSandboxMod } from '~~/utils/checks';


export const useManifestStore = defineStore('manifest', () => {
  const version = ref<string>()
  const data = ref<MinimalManifestData>()
  const weapons = ref<MinimalWeapon[]>([])

  // TODO: Remove obsolete data

  const damageTypes = computed(() => data.value?.damageTypes ?? {})
  const mods = computed(() => data.value?.mods ?? [])
  const sandboxModsFn = computed(() => data.value?.sandboxPerks && isSandboxMod(data.value.sandboxPerks))
  const sandboxMods = computed(() => {
    if (!sandboxModsFn.value) {
      return []
    }
    return mods.value?.filter(w => isSandboxMod(w))
  })

  const init = async () => {
    const [{ minimalManifest, version: _version }, minimalWeaponsData] = await Promise.all([$fetch('/api/manifest'), $fetch('/api/weapons')])
    version.value = _version
    data.value = minimalManifest
    weapons.value = minimalWeaponsData
  }


  return { init, version, data, weapons, damageTypes, mods, sandboxMods }
})
