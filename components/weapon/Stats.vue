<script setup lang="ts">
import type { DestinyStatGroupDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js';
import type { Mod } from '~/utils/mods';

import { getStatGroupEntryForItem, getStatsForItem, getStatsForStatGroup, Stat } from '~/utils/stats';
import { Perk } from '~/utils/perks';


const props = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition,
  perks: Array<Perk | null>,
  masterwork?: PrunedDestinyInventoryItemDefinition,
  mod?: Mod,
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>
  stats?: DefinitionRecord<DestinyStatDefinition>
}>()

type FormattedStat = Stat & {
  augmentedValue: number
}

const statGroupEntry = computed(() => props.statGroups && getStatGroupEntryForItem(props.weapon, props.statGroups))
const availableStats = computed(() => {
  if (!props.stats || !statGroupEntry.value) {
    return []
  }
  return getStatsForStatGroup(statGroupEntry.value, props.stats)
})

const modStats = computed(() => {
  if (!props.mod) {
    return {}
  }
  return statsArrayToObject(props.mod.stats)
})

// TODO: Check why this is not directly provided in the perks obj
const perkStats = computed(() => {
  if (!props.stats || !props.statGroups) {
    return {}
  }
  const statsArray = props.perks
    .flatMap(p => p && getStatsForItem(props.stats!, p.trait!, props.statGroups!))
    .filter((s): s is Stat => Boolean(s && s?.value !== 0))

  return statsArrayToObject(statsArray)
})

const statsArrayToObject = (statsArray: Stat[]) => statsArray.reduce((obj, s) => {
  if (!obj[s.hash]) {
    obj[s.hash] = s
    return obj
  }

  obj[s.hash].value += s.value
  return obj
}, {} as Record<string, Stat>)

const weaponStats = computed(() => {
  if (!availableStats.value || !statGroupEntry.value) {
    return []
  }
  return getStatsForItem(availableStats.value, props.weapon, statGroupEntry.value)
})

const allStats = computed(() => weaponStats.value.slice()
  .sort((a, b) => {
    if (a.displayType === 'bar' && b.displayType !== 'bar') {
      return -1
    }
    if (a.displayType !== 'bar' && b.displayType === 'bar') {
      return 1
    }
    return 0
  })
  .map((stat) => {
    const perkStatValue = perkStats.value[stat.hash]?.value ?? 0
    const modStatValue = modStats.value[stat.hash]?.value ?? 0
    const res: FormattedStat = {
      ...stat,
      augmentedValue: stat.value + perkStatValue + modStatValue
    }
    return res
  }))


</script>
<template>
  <ul class="grid grid-cols-2 md:grid-cols-1 gap-2 text-xs sm:text-base">
    <li class="grid grid-cols-6 sm:grid-cols-3 break-inside-avoid" v-for="stat in allStats" :key="stat.hash">
      <div class="col-span-3 sm:col-span-1 overflow-hidden pr-8 sm:pr-4">
        <span :title="stat.name" class="text-right whitespace-nowrap">{{ stat.name }}</span>
      </div>
      <WeaponStatsBar class="col-span-3 sm:col-span-2" v-if="stat.value && stat.displayType === 'bar'" :base-value="stat.value"
        :new-value="stat.augmentedValue" />
      <span v-else>{{ stat.augmentedValue }}</span>
    </li>
  </ul>
</template>