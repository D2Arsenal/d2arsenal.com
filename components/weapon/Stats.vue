<script setup lang="ts">
import type { DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { DefinitionRecord } from '~/types'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js'
import type { Mod } from '~/utils/mods'

import type { Stat } from '~/utils/stats'
import { STAT_ORDER, getStatGroupEntryForItem, getStatsForItem } from '~/utils/stats'
import type { Perk } from '~/utils/perks'
import { toTransformedPerks } from '~/utils/perks'

const props = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition
  perks: Array<{ perk: Perk; isEnhanced: boolean } | null>
  masterwork?: PrunedDestinyInventoryItemDefinition
  mod?: Mod
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>
  stats?: DefinitionRecord<DestinyStatDefinition>
}>()

type FormattedStat = Stat & {
  augmentedValue: number
}

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

// TODO: set up enhanced perk stats
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

const allStats = computed(() => weaponStats.value.slice()
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
</script>

<template>
  <ul class="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs sm:text-base">
    <li v-for="stat in allStats" :key="stat.hash" class="grid grid-cols-6 sm:grid-cols-3 break-inside-avoid">
      <div class="col-span-3 sm:col-span-1 overflow-hidden pr-8 sm:pr-4">
        <span :title="stat.name" class="text-right whitespace-nowrap">{{ stat.name }}</span>
      </div>
      <WeaponStatsBar
        v-if="stat.displayType === 'bar'" class="col-span-3 sm:col-span-2"
        :base-value="stat.value" :new-value="stat.augmentedValue"
      />
      <span v-else>{{ stat.augmentedValue }}{{ stat.displayType === 'ms' ? 'ms' : '' }}</span>
    </li>
  </ul>
</template>
