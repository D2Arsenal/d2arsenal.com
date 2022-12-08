<script setup lang="ts">
import { DestinyItemSubType } from 'bungie-api-ts/destiny2'
import type { DefinitionRecord } from '~/types'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition } from '~/types/destiny.js'
import type { Mod } from '~/utils/mods'

import type { FormattedStat, Stat } from '~/utils/stats'
import { STAT_ORDER, getStatGroupEntryForItem, getStatsForItem } from '~/utils/stats'
import type { Perk, TransformedPerk } from '~/utils/perks'
import { toTransformedPerks } from '~/utils/perks'
import type { RawRange } from '~/utils/range'
import { calculateRange } from '~/utils/range'

const props = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition
  perks: Array<{ perk: Perk; isEnhanced: boolean } | null>
  masterwork?: PrunedDestinyInventoryItemDefinition
  mod?: Mod
  statGroups?: DefinitionRecord<PrunedDestinyStatGroupDefinition>
  stats?: DefinitionRecord<PrunedDestinyStatDefinition>
}>()

const statsArrayToObject = (statsArray: Stat[]) => statsArray.reduce((obj, s) => {
  if (!obj[s.hash]) {
    obj[s.hash] = s
    return obj
  }

  obj[s.hash].value += s.value
  return obj
}, {} as Record<string, Stat>)

const statGroupEntry = computed(() => props.statGroups && getStatGroupEntryForItem(props.weapon, props.statGroups))

const modStats = computed(() => {
  if (!props.mod) {
    return {}
  }

  return statsArrayToObject(props.mod.stats)
})

const transformedPerks = $computed(() => toTransformedPerks(props.perks))

const perkStats = computed(() => {
  if (!props.stats || !props.statGroups) {
    return {}
  }

  const statsArray = transformedPerks
    .flatMap(p => p?.isEnhanced ? p?.enhancedStats : p?.stats)
    .filter((s): s is Stat => Boolean(s && s?.value !== 0))

  return statsArrayToObject(statsArray)
})

const masterworkStats = computed(() => {
  if (!props.masterwork || !props.stats || !statGroupEntry.value) {
    return {}
  }
  const stats = getStatsForItem(props.stats, props.masterwork, statGroupEntry.value)
  return statsArrayToObject(stats)
})

const weaponStats = computed(() => {
  if (!props.stats || !statGroupEntry.value) {
    return []
  }

  return getStatsForItem(props.stats, props.weapon, statGroupEntry.value)
})

const allWeaponStats = $computed(() => weaponStats.value.slice()
  .sort((a, b) => STAT_ORDER.indexOf(a.hash) - STAT_ORDER.indexOf(b.hash))
  .map((stat) => {
    const perkStatValue = perkStats.value[stat.hash]?.value ?? 0
    const modStatValue = modStats.value[stat.hash]?.value ?? 0
    const masterworkStatValue = masterworkStats.value[stat.hash]?.value ?? 0
    const rawValue = stat.value + perkStatValue + modStatValue + masterworkStatValue

    const augmentedValue = Math.max(0, Math.min(stat.maximumValue, rawValue))
    const res: FormattedStat = {
      ...stat,
      augmentedValue,
    }
    return res
  }),
)

const formateRange = (rawRange: RawRange) => {
  if (!rawRange) {
    return ''
  }

  const isShotgun = props.weapon.itemSubType === DestinyItemSubType.Shotgun

  if (isShotgun || typeof rawRange === 'number') {
    return `${rawRange}m`
  }
  const hip = rawRange.hasSeraph ? rawRange.hipSR : rawRange.hip
  const scope = rawRange.hasSeraph || rawRange.hasRangefinder ? rawRange.adsRF : rawRange.ads
  return `${hip}m / ${scope}m`
}

const rawRange = $computed(() => {
  const value = calculateRange(transformedPerks.filter((a): a is TransformedPerk => a !== null), allWeaponStats, props.weapon, true)
  const augmentedValue = calculateRange(transformedPerks.filter((a): a is TransformedPerk => a !== null), allWeaponStats, props.weapon)
  if (!value || !augmentedValue) {
    return
  }

  return {
    name: 'Damage Falloff',
    value: typeof value === 'number' ? value : value.hip,
    augmentedValue: typeof augmentedValue === 'number' ? augmentedValue : augmentedValue.hip,
    displayType: 'none',
    isSmallerBetter: false,
    showAs: augmentedValue && formateRange(augmentedValue),
  } as FormattedStat
})

const statsWithRange = computed(() => [...allWeaponStats, ...(rawRange?.value ? [rawRange] : [])])
</script>

<template>
  <ul class="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs sm:text-base">
    <li v-for="stat in statsWithRange" :key="stat.name" class="grid grid-cols-6 break-inside-avoid">
      <div class="col-span-3 sm:col-span-2 md:col-span-3 xl:col-span-2 overflow-hidden pr-8 sm:pr-4">
        <span :title="stat.name" class="text-right whitespace-nowrap">{{ stat.name }}</span>
      </div>
      <WeaponStatsBar
        v-if="stat.displayType === 'bar'" class="col-span-3 sm:col-span-4 md:col-span-3 xl:col-span-4"
        :base-value="stat.value" :new-value="stat.augmentedValue" :is-smaller-better="stat.isSmallerBetter"
      />
      <span v-else class="flex items-center col-span-3 sm:col-span-4 md:col-span-3 xl:col-span-4">
        <WeaponStatsPlain
          class="mr-4" :base-value="stat.value" :new-value="stat.augmentedValue"
          :display-type="stat.displayType" :is-smaller-better="stat.isSmallerBetter" :show-as="stat.showAs"
        />
        <WeaponRecoilDirection v-if="stat.name === 'Recoil Direction'" :value="stat.augmentedValue" />
      </span>
    </li>
  </ul>
</template>
