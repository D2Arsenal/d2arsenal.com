<script setup lang="ts">
import { useManifestStore } from '~/store/manifest';
import { PERK_NONE, PERK_LENGTH, changePerkStatus } from '~/utils/perks';
import { buildMods } from '~/utils/mods';
import { isExotic } from '~/utils/weapon';
import { masterworkStatisticToTerm } from '~~/utils/masterwork.js';

import type { Perk } from '~/utils/perks';

// Avoid re-rendering of the page component on hash switch
definePageMeta({
  key: (route) => (route.params.slug as string[])[0]
})

const manifestStore = useManifestStore()

const [weaponHash, possibleAttributes] = useRoute().params.slug as [string, string?]

const { data, error } = await useFetch(`/api/weapons/${weaponHash}`, { key: weaponHash })

if (error.value) {
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

const weapon = $computed(() => data.value!.weapon)
const weaponName = $computed(() => weapon.displayProperties.name)
const isExoticWeapon = computed(() => isExotic(weapon))
const damageTypes = computed(() => weapon.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? [])

const statGroups = $computed(() => manifestStore.data?.statGroups)
const stats = $computed(() => manifestStore.data?.statDefs)

const mods = $computed(() => manifestStore.data ? buildMods(manifestStore.mods, stats!, statGroups!, manifestStore.data!.sandboxPerks) : [])
const canApplyAdeptMods = computed(() => weaponName.includes('(Adept)'))
let selectedModHash = $ref(decodedHashes.mod)
let selectedMod = $computed(() => mods.find((m) => m.mod?.hash === selectedModHash))
const resetMod = () => {
  selectedModHash = null
}

const perks = $computed(() => data.value?.perks ?? { perks: [], curatedPerks: [] })
// Hides intrinsic perks
const perksToDisplay = $computed(() => ({ perks: perks?.perks.slice(1), curatedPerks: perks?.curatedPerks }))

let selectedPerkHashes = $ref(decodedHashes.perks)
const selectedPerks = $computed(() => {
  const intrinsicPerks = (perks?.perks[0] ?? []).map(p => p.hash)
  const allPerks = perks.perks.flat()

  const perksToUse = intrinsicPerks.concat(selectedPerkHashes)
  return perksToUse.map((hash) => {
    if (hash === PERK_NONE) {
      return null
    }

    const isEnhancedPerk = (perk: Perk, hash: number) => perk.enhancedTrait?.hash === hash

    const perk = allPerks.find(t => isEnhancedPerk(t, hash) || (t.hash === hash))
    if (!perk) {
      return null
    }
    
    return {
      perk,
      isEnhanced: isEnhancedPerk(perk, hash)
    }
  })
})

// TODO: Rename, no actual reset but "cycle"
const resetPerk = (colIndex: number) => {
  selectedPerkHashes[colIndex] = changePerkStatus(selectedPerks[colIndex + 1]!.perk, selectedPerkHashes[colIndex])
}

const masterwork = $computed(() => data.value?.masterwork)

let selectedMasterworkHash = $ref(decodedHashes.masterwork)
const selectedMasterworkArrayEntry = $computed(() => masterwork?.find(mw => mw.data.benefits.find(i => i.hash === selectedMasterworkHash)))
const selectedMasterworkItem = computed(() => selectedMasterworkArrayEntry?.data.benefits.find(i => i.hash === selectedMasterworkHash))
const resetMasterwork = () => { selectedMasterworkHash = null }

const router = useRouter()
const updateRouteOnChange = () => {
  const newRoutePrefix = `/en/weapons/${weaponHash}/`
  const slugValues = [
    selectedPerkHashes.join(','),
    selectedMasterworkHash ?? 0,
    selectedModHash ?? 0,
  ].join('-')

  const route = newRoutePrefix + slugValues

  router.push(route)
}
watch([$$(selectedModHash), $$(selectedPerkHashes), $$(selectedMasterworkHash)], updateRouteOnChange)

const favicon = computed(() => useBungieUrl(weapon.displayProperties.highResIcon ?? weapon.displayProperties.icon ?? ''))
const description = computed(() => {
  const perkList = selectedPerks
    .map(p => p?.perk.trait?.displayProperties.name)
    .filter(a => a).join(', ')
  const hasPerks = Boolean(perkList)

  const mod = selectedMod?.mod?.displayProperties.name
  const hasMod = Boolean(mod)

  const rawMasterworkTier = selectedMasterworkItem.value?.displayProperties.name.toLowerCase()
  const masterworkTier = rawMasterworkTier === 'masterwork' ? 'max tier' : rawMasterworkTier
  const rawMasterworkStatistic = selectedMasterworkArrayEntry?.statistic
  const masterworkStatistic = rawMasterworkStatistic && masterworkStatisticToTerm(rawMasterworkStatistic)

  const prefix = `${weaponName} (${weapon.itemTypeDisplayName}) `
  const description = [prefix,
    hasPerks ? `with ${perkList}` : '',
    mod ? `${hasPerks ? ', ' : 'with '} ${mod} mod` : '',
    masterworkStatistic ? `${hasPerks || hasMod ? ' and' : 'with '} ${masterworkTier} ${masterworkStatistic} masterwork` : '',
  ].join('')
  return description
})

useHead({
  title: weaponName,
  meta: [
    {
      property: 'og:title',
      content: weaponName
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'description',
      content: description
    },
    {
      property: 'og:image', content: favicon
    },
  ],
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