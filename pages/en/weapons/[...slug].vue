<script setup lang="ts">
import { useManifestStore } from '~/store/manifest'
import { PERK_LENGTH, PERK_NONE, changePerkStatus } from '~/utils/perks'
import { buildMods } from '~/utils/mods'
import { isExotic } from '~/utils/weapon'
import { masterworkStatisticToTerm } from '~~/utils/masterwork.js'

import type { Perk } from '~/utils/perks'

// Avoid re-rendering of the page component on hash switch
definePageMeta({
  key: route => (route.params.slug as string[])[0],
})

const manifestStore = useManifestStore()

const [weaponHash, possibleAttributes] = useRoute().params.slug as [string, string?]

const { data, error } = await useFetch(`/api/weapons/${weaponHash}`, { key: weaponHash })

if (error.value) {
  throw createError({
    statusCode: error.value.data.statusCode,
    message: error.value.data.message ?? error.value.data.statusMessage,
    fatal: true,
  })
}

function decodeHashes(str?: string) {
  const [rawPerks, rawMasterwork, rawMod] = str?.split('-') ?? []
  const transformedPerks = rawPerks?.split(',').map(Number) ?? []
  const perks = transformedPerks.concat(Array.from({ length: PERK_LENGTH - 1 - transformedPerks.length }, () => PERK_NONE))

  return {
    perks,
    masterwork: rawMasterwork ? Number(rawMasterwork) : null,
    mod: rawMod ? Number(rawMod) : null,
  }
}
const decodedHashes = decodeHashes(possibleAttributes)

const weapon = $computed(() => data.value!.weapon)
const weaponName = $computed(() => weapon.name)
const isExoticWeapon = computed(() => isExotic(weapon))
const damageTypes = computed(() => weapon.damageTypeHashes.map(hash => manifestStore.damageTypes[hash]) ?? [])

const statGroups = $computed(() => manifestStore.data?.statGroups)
const stats = $computed(() => manifestStore.data?.statDefs)

const mods = $computed(() => manifestStore.data ? buildMods(manifestStore.mods, stats!, statGroups!, manifestStore.data!.sandboxPerks) : [])
const canApplyAdeptMods = computed(() => weaponName.includes('(Adept)'))
let selectedModHash = $ref(decodedHashes.mod)
const selectedMod = $computed(() => mods.find(m => m.mod?.hash === selectedModHash))
function resetMod() {
  selectedModHash = null
}

const perks = $computed(() => data.value?.perks ?? { perks: [], curatedPerks: [] })
// Hides intrinsic perks
const perksToDisplay = $computed(() => ({ perks: perks?.perks.slice(1), curatedPerks: perks?.curatedPerks }))

const selectedPerkHashes = $ref(decodedHashes.perks)
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
      isEnhanced: isEnhancedPerk(perk, hash),
    }
  })
})

// TODO: Rename, no actual reset but "cycle"
function resetPerk(colIndex: number) {
  const indexWithIntrinsics = colIndex + 1
  selectedPerkHashes[colIndex] = changePerkStatus(selectedPerks[indexWithIntrinsics]!.perk, selectedPerkHashes[colIndex])
}

const masterwork = $computed(() => data.value?.masterwork)

let selectedMasterworkHash = $ref(decodedHashes.masterwork)
const selectedMasterworkArrayEntry = $computed(() => masterwork?.find(mw => mw.data.benefits.find(i => i.hash === selectedMasterworkHash)))
const selectedMasterworkItem = computed(() => selectedMasterworkArrayEntry?.data.benefits.find(i => i.hash === selectedMasterworkHash))
function resetMasterwork() {
  selectedMasterworkHash = null
}

const router = useRouter()
function updateRouteOnChange() {
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

const favicon = computed(() => useBungieUrl(weapon.icon ?? ''))
const ogImage = computed(() => useBungieUrl(weapon.screenshot ?? ''))
const description = computed(() => {
  const perkList = selectedPerks
    .map(p => p?.perk.trait?.name)
    .filter(a => a).join(', ')
  const hasPerks = Boolean(perkList)

  const mod = selectedMod?.mod?.name
  const hasMod = Boolean(mod)

  const rawMasterworkTier = selectedMasterworkItem.value?.name.toLowerCase()
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
      hid: 'description',
      name: 'description',
      content: description,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: weaponName,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: favicon,
    },
    {
      hid: 'og:image:width',
      property: 'og:image:width',
      content: undefined,
    },
    {
      hid: 'og:image:height',
      property: 'og:image:height',
      content: undefined,
    },
  ],
  link: [{ rel: 'icon', href: favicon, key: 'favicon' }],
})
</script>

<template>
  <div class="grid md:gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 md:p-5">
    <div class="grid md:gap-4 grid-cols-1 md:grid-cols-5 2xl:col-span-2">
      <WeaponSummary
        v-if="weapon" class="md:col-span-5" :weapon="weapon" :damage-types="damageTypes"
        :masterwork="selectedMasterworkItem" :mod="selectedMod" :stat-groups="statGroups" :stats="stats"
        :perks="selectedPerks" @reset-masterwork="resetMasterwork" @reset-mod="resetMod"
        @reset-perk="resetPerk($event)"
      />
      <div class="hidden 2xl:block 2xl:col-span-2">
        <WeaponExtras />
      </div>
      <div class="md:col-span-5 2xl:col-span-3 flex flex-col">
        <WeaponMasterwork
          v-if="masterwork" v-model="selectedMasterworkHash" :options="masterwork"
          :is-exotic-weapon="isExoticWeapon"
        />
        <WeaponMods
          v-if="mods" v-model="selectedModHash" class="md:mt-4" :mods="mods"
          :can-apply-adept-mods="canApplyAdeptMods"
        />
      </div>
    </div>
    <WeaponPerks v-if="perks" v-model="selectedPerkHashes" :perks="perksToDisplay!" />
    <WeaponExtras class="2xl:hidden" />
  </div>
</template>
