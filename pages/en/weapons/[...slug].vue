<script setup lang="ts">
import { useManifestStore } from '~/store/manifest';
import { PERK_NONE, PERK_LENGTH } from '~/utils/perks';
import { buildMods } from '~/utils/mods';
import { isExotic } from '~/utils/weapon';

// Avoid re-rendering of the page component on hash switch
definePageMeta({
  key: (route) => (route.params.slug as string[])[0]
})

const manifestStore = useManifestStore()

const [weaponHash, possibleAttributes] = useRoute().params.slug as [string, string?]

const { data, error } = await useFetch(`/api/weapons/${weaponHash}`, { key: weaponHash })

if(error.value) {
  throw createError({
    statusCode: 404,
    // TODO: Revisit after https://github.com/nuxt/framework/pull/8521
    // message: error.value.message,
    message: 'Sorry, the provided weapon hash is invalid and could not be found',
    fatal: true
  })
}

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

const weapon = computed(() => data.value?.weapon)
const isExoticWeapon = computed(() => weapon.value && isExotic(weapon.value))
const damageTypes = computed(() => weapon.value?.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? [])

const statGroups = computed(() => manifestStore.data?.statGroups)
const stats = computed(() => manifestStore.data?.statDefs)

const mods = computed(() => manifestStore.data ? buildMods(manifestStore.mods, stats.value!, statGroups.value!, manifestStore.data!.sandboxPerks) : [])
const canApplyAdeptMods = computed(() => Boolean(weapon.value?.displayProperties.name.includes('(Adept)')))
const selectedModHash = ref(decodedHashes.mod)
const selectedMod = computed(() => mods.value.find((m) => m.mod?.hash === selectedModHash.value))
const resetMod = () => {
  selectedModHash.value = null
}

const perks = computed(() => data.value?.perks ?? { perks: [], curatedPerks: [] })
// Hides intrinsic perks
const perksToDisplay = computed(() => ({ perks: perks.value?.perks.slice(1), curatedPerks: perks.value?.curatedPerks }))

const selectedPerkHashes = ref(decodedHashes.perks)
const selectedPerks = computed(() => {
  const intrinsicPerks = (perks.value?.perks[0] ?? []).map(p => p.hash)

  const perksToUse = intrinsicPerks.concat(selectedPerkHashes.value)
  return perksToUse.map((hash, i) => {
    if (hash === PERK_NONE) {
      return null
    }

    return perks.value.perks.flat().find(t => t.hash === hash) ?? null
  })
})

const resetPerk = (colIndex: number) => {
  selectedPerkHashes.value[colIndex] = PERK_NONE
}

const masterwork = computed(() => data.value?.masterwork)

const selectedMasterworkHash = ref(decodedHashes.masterwork)
const selectedMasterworkItem = computed(() => masterwork.value?.flatMap(mw => mw.data.benefits).find(i => i.hash === selectedMasterworkHash.value))
const resetMasterwork = () => selectedMasterworkHash.value = null

const router = useRouter()
const updateRouteOnChange = () => {
  const newRoutePrefix = `/en/weapons/${weaponHash}/`
  const slugValues = [
    selectedPerkHashes.value.join(','),
    selectedMasterworkHash.value ?? 0,
    selectedModHash.value ?? 0,
  ].join('-')

  const route = newRoutePrefix + slugValues

  router.push(route)
}
watch([selectedModHash, selectedPerkHashes, selectedMasterworkHash], updateRouteOnChange)

const favicon = computed(() => useBungieUrl(weapon.value?.displayProperties.icon ?? ''))

// TODO: description based on changed values
useHead({
  title: weapon.value?.displayProperties.name,
  // TODO: Wrong type here
  // @ts-ignore
  link: [{ rel: 'icon', href: favicon, key: 'favicon' }]
})
</script>

<template>
  <div class="grid sm:gap-4 grid-cols-1 sm:grid-cols-3 md:p-5">
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-5 sm:col-span-2">
      <WeaponSummary class="sm:col-span-5" v-if="weapon" :weapon="weapon" :damage-types="damageTypes"
        :masterwork="selectedMasterworkItem" :mod="selectedMod" :stat-groups="statGroups" :stats="stats"
        :perks="selectedPerks" @reset:masterwork="resetMasterwork" @reset:mod="resetMod"
        @reset:perk="resetPerk($event)" />
      <div class="hidden sm:block sm:col-span-2">
        <WeaponExtras />
      </div>
      <div class="sm:col-span-3 flex flex-col">
        <WeaponMasterwork v-if="masterwork" :options="masterwork" v-model="selectedMasterworkHash"
          :is-exotic-weapon="isExoticWeapon" />
        <WeaponMods class="sm:mt-4" v-model="selectedModHash" v-if="mods" :mods="mods"
          :can-apply-adept-mods="canApplyAdeptMods" />
      </div>
    </div>
    <WeaponPerks v-if="perks" :perks="perksToDisplay!" v-model="selectedPerkHashes" />
    <WeaponExtras class="sm:hidden" />
  </div>
</template>