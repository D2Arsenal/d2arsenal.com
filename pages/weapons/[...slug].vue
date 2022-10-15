<script setup lang="ts">
import { useManifestStore } from '~/store/manifest';

const manifestStore = useManifestStore()

const [weaponHash, possibleAttributes] = useRoute().params.slug as [string, string?]

const decodeHashes = (str?: string) => {
  const splitStrings = str?.split('-').map(s => Number(s))
  if (!splitStrings || splitStrings.length < 6) {
    return {
      perks: [null, null, null, null],
      masterwork: null,
      mod: null
    }
  }
  const perks = splitStrings.slice(0, 4)
  const [masterwork, mod] = splitStrings.slice(4)
  return {
    perks,
    masterwork,
    mod
  }
}
const decodedHashes = decodeHashes(possibleAttributes)

const weapon = computed(() => manifestStore.weapons.find(w => w.hash === Number(weaponHash)))
// const frame = computed(() => weapon.value && manifestStore.frames.find(f => f.hash === weapon.value?.summaryItemHash))
const damageTypes = computed(() => {
  return weapon.value?.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? []
})

const canApplyAdeptMods = computed(() => Boolean(weapon.value?.displayProperties.name.includes('(Adept)')))
const selectedModHash = ref<number | null>(decodedHashes.mod)
const selectedMod = computed(() => manifestStore.mods.find(m => m.hash === selectedModHash.value))

const selectedPerkHashes = ref(decodedHashes.perks)

const selectedMasterworkHash = ref(decodedHashes.masterwork)

const router = useRouter()
const updateRouteOnChange = () => {
  const newRoutePrefix = `/weapons/${weaponHash}/`
  const slugValues = [
    ...selectedPerkHashes.value.map(h => h ?? 0),
    selectedMasterworkHash.value ?? 0,
    selectedModHash.value ?? 0,
  ].join('-')

  const route = newRoutePrefix + slugValues

  router.push(route)
}
watch([selectedModHash, selectedPerkHashes, selectedMasterworkHash], updateRouteOnChange)

</script>

<template>
  <div>
    {{ selectedMod }}
    <WeaponSummary v-if="weapon" :weapon="weapon" :damage-types="damageTypes" :mod="selectedMod" />
    <WeaponMods v-model="selectedModHash" v-if="manifestStore.mods" :mods="manifestStore.mods"
      :can-apply-adept-mods="canApplyAdeptMods" />
  </div>
</template>