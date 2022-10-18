<script setup lang="ts">
import { useManifestStore } from '~/store/manifest';
import { buildMasterwork } from '~/utils/masterwork';
import { buildPerks, PERK_NONE, PERK_LENGTH, PERK_INTRINSIC_COLUMN } from '~/utils/perks';

const manifestStore = useManifestStore()

const [weaponHash, possibleAttributes] = useRoute().params.slug as [string, string?]

const decodeHashes = (str?: string) => {
  const [rawPerks, rawMasterwork, rawMod] = str?.split('-') ?? []
  const transformedPerks = rawPerks?.split(',').map(Number) ?? []
  const perks = transformedPerks.slice().fill(PERK_NONE, transformedPerks.length, PERK_LENGTH - 1)

  return {
    perks,
    masterwork: rawMasterwork ? Number(rawMasterwork) : null,
    mod: rawMod ? Number(rawMod) : null
  }
}
const decodedHashes = decodeHashes(possibleAttributes)

const weapon = computed(() => manifestStore.weapons.find(w => w.hash === Number(weaponHash)))
const damageTypes = computed(() => weapon.value?.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? [])

const statGroups = computed(() => manifestStore.data?.statGroups)
const stats = computed(() => manifestStore.data?.statDefs)

const canApplyAdeptMods = computed(() => Boolean(weapon.value?.displayProperties.name.includes('(Adept)')))
const selectedModHash = ref(decodedHashes.mod)
const selectedMod = computed(() => manifestStore.mods.find(m => m.hash === selectedModHash.value))
const resetMod = () => {
  selectedModHash.value = null
}

const frameForWeapon = computed(() => manifestStore.frames.find((f) => f.hash === weapon.value?.sockets?.socketEntries[0]?.singleInitialItemHash))

const perks = computed(() => {
  if (!(weapon.value && manifestStore.data)) {
    return
  }

  return buildPerks(weapon.value, manifestStore.data.plugSets, manifestStore.data.weaponTraits, manifestStore.data.statDefs, manifestStore.data.statGroups, frameForWeapon.value, false)
})
// Hides intrinsic perks
const perksToDisplay = computed(() => perks.value?.slice(1))

const selectedPerkHashes = ref(decodedHashes.perks)
const selectedPerks = computed(() => {
  const intrinsicPerks = (perks.value?.[0] ?? []).map(p => p.hash)
  
  const perksToUse = intrinsicPerks.concat(selectedPerkHashes.value)
  return perksToUse.map((hash, i) => {
    if (hash === PERK_NONE) {
      return null
    }
    if(i === PERK_INTRINSIC_COLUMN) {
      return manifestStore.frames.find(p => p.hash === hash)
    }
    
    return manifestStore.data?.weaponTraits.find(t => t.hash === hash) ?? null
  })
})

const resetPerk = (colIndex: number) => {
  selectedPerkHashes.value[colIndex] = PERK_NONE
}

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
const resetMasterwork = () => selectedMasterworkHash.value = null

const router = useRouter()
const updateRouteOnChange = () => {
  const newRoutePrefix = `/weapons/${weaponHash}/`
  const slugValues = [
    selectedPerkHashes.value.join(','),
    selectedMasterworkHash.value ?? 0,
    selectedModHash.value ?? 0,
  ].join('-')

  const route = newRoutePrefix + slugValues

  router.push(route)
}
watch([selectedModHash, selectedPerkHashes, selectedMasterworkHash], updateRouteOnChange)

// TODO: description based on changed values
useHead({
  title: weapon.value?.displayProperties.name
})

</script>

<template>
  <div class="grid p-5 gap-4 grid-cols-3">
    <div class="grid gap-4 grid-cols-5 col-span-2">
      <WeaponSummary class="col-span-5" v-if="weapon" :weapon="weapon" :damage-types="damageTypes"
        :masterwork="selectedMasterworkItem" :mod="selectedMod" :stat-groups="statGroups" :stats="stats"
        :perks="selectedPerks"
        @reset:masterwork="resetMasterwork" @reset:mod="resetMod"
        @reset:perk="resetPerk($event)" />
      <div class="col-span-2">
        <WeaponExtras />
      </div>
      <div class="col-span-3 flex flex-col">
        <WeaponMasterwork v-if="masterworkData" :options="masterworkData" v-model="selectedMasterworkHash" />
        <WeaponMods class="mt-4" v-model="selectedModHash" v-if="manifestStore.mods" :mods="manifestStore.mods"
          :can-apply-adept-mods="canApplyAdeptMods" />
      </div>
    </div>
    <WeaponPerks v-if="perks" :perks="perksToDisplay!" v-model="selectedPerkHashes" />
  </div>
</template>