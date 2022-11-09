import { defineStore } from 'pinia'
import type { MinimalManifestData } from '../types'
import type { MinimalWeapon } from '../utils/weapon'
import { isSandboxMod } from '../utils/checks'

export const useManifestStore = defineStore('manifest', () => {
  const version = ref<string>()
  const data = ref<MinimalManifestData>()
  const weapons = ref<MinimalWeapon[]>([])
  const suggestedWeapons = ref<MinimalWeapon[]>([])

  const damageTypes = computed(() => data.value?.damageTypes ?? {})
  const mods = computed(() => data.value?.mods ?? [])
  const sandboxModsFn = computed(() => data.value?.sandboxPerks && isSandboxMod(data.value.sandboxPerks))
  const sandboxMods = computed(() => {
    if (!sandboxModsFn.value) { return [] }

    return mods.value?.filter(w => isSandboxMod(w))
  })

  const init = async () => {
    const [{ minimalManifest, version: _version }, suggestedWeaponsData] = await Promise.all([$fetch('/api/manifest'), $fetch('/api/suggested-weapons')])
    version.value = _version
    data.value = minimalManifest
    suggestedWeapons.value = suggestedWeaponsData
  }

  const loadMinimalWeapons = async () => {
    const minimalWeapons = await $fetch('/api/weapons')
    weapons.value = minimalWeapons
  }

  return { init, loadMinimalWeapons, version, data, weapons, suggestedWeapons, damageTypes, mods, sandboxMods }
})
