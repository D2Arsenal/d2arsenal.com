<script setup lang="ts">
import { useManifestStore } from '~/store/manifest';
import { buildMasterwork } from '~/utils/masterwork';

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
const damageTypes = computed(() => weapon.value?.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? [])

const statGroups = computed(() => manifestStore.data?.statGroups)
const stats = computed(() => manifestStore.data?.statDefs)

const canApplyAdeptMods = computed(() => Boolean(weapon.value?.displayProperties.name.includes('(Adept)')))
const selectedModHash = ref<number | null>(decodedHashes.mod)
const selectedMod = computed(() => manifestStore.mods.find(m => m.hash === selectedModHash.value))

const selectedPerkHashes = ref(decodedHashes.perks)

const masterwork = computed(() => {
  if (!(weapon.value && manifestStore.data)) {
    return
  }
  const { masterwork } = buildMasterwork(weapon.value, manifestStore.data.statGroups, manifestStore.data.plugSets, manifestStore.data.catalysts) ?? {}
  return masterwork
})

const masterworkData = computed(() => Object.entries(masterwork.value ?? {})
  .filter(e => e[1].active)
  .map(([statistic, data]) => ({
    statistic,
    data
  }))
)

const selectedMasterworkHash = ref(decodedHashes.masterwork)
const selectedMasterworkItem = computed(() => manifestStore.data?.catalysts.find(i => i.hash === selectedMasterworkHash.value))

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
    <WeaponSummary v-if="weapon" :weapon="weapon" :damage-types="damageTypes" :masterwork="selectedMasterworkItem"
      :mod="selectedMod" :stat-groups="statGroups" :stats="stats" />
    <WeaponMasterwork v-if="masterworkData" :options="masterworkData" v-model="selectedMasterworkHash" />
    <WeaponMods v-model="selectedModHash" v-if="manifestStore.mods" :mods="manifestStore.mods"
      :can-apply-adept-mods="canApplyAdeptMods" />
  </div>
</template>