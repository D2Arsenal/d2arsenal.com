<script setup lang="ts">
import type { DestinyStatGroupDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';
import { getStatGroupEntryForItem, getStatsForItem, getStatsForStatGroup, Stat } from '~/utils/stats';
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js';


const props = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition,
  perks: Array<PrunedDestinyInventoryItemDefinition | null>,
  masterwork?: PrunedDestinyInventoryItemDefinition,
  mod?: PrunedDestinyInventoryItemDefinition,
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

const perkStats = computed(() => {
  if (!props.stats || !props.statGroups) {
    return {}
  }
  const statsArray = props.perks
    .flatMap(p => p && getStatsForItem(props.stats!, p, props.statGroups!))
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

const allStats = computed(() =>
  Object.fromEntries(weaponStats.value.map((stat) => {
    const perkStatValue = perkStats.value[stat.hash]?.value ?? 0
    const res: FormattedStat = {
      ...stat,
      augmentedValue: stat.value + perkStatValue
    }
    return [stat.hash, res]
  }))
)


</script>
<template>
  <ul class="flex flex-col text-sm space-y-2">
    <li class="grid grid-cols-3 break-inside-avoid" v-for="stat, hash in allStats" :key="hash">
      <span class="text-right pr-4">{{stat.name}}</span>
      <WeaponStatsBar class="col-span-2" v-if="stat.value && stat.displayType === 'bar'" :base-value="stat.value"
        :new-value="stat.augmentedValue" />
      <span v-else>{{ stat.augmentedValue }}</span>
    </li>
  </ul>
</template>