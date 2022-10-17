<script setup lang="ts">
import type { DestinyInventoryItemDefinition, DestinyStatGroupDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';
import { getStatGroupEntryForItem, getStatsForItem, getStatsForStatGroup } from '~/utils/stats';


const props = defineProps<{
  weapon: DestinyInventoryItemDefinition,
  perks: Array<DestinyInventoryItemDefinition | null>,
  masterwork?: DestinyInventoryItemDefinition,
  mod?: DestinyInventoryItemDefinition,
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>
  stats?: DefinitionRecord<DestinyStatDefinition>
}>()

const statGroupEntry = computed(() => props.statGroups && getStatGroupEntryForItem(props.weapon, props.statGroups))
const availableStats = computed(() => {
  if (!props.stats || !statGroupEntry.value) {
    return []
  }
  return getStatsForStatGroup(statGroupEntry.value, props.stats)
})
const formattedStats = computed(() => {
  if (!availableStats.value || !statGroupEntry.value) {
    return []
  }
  return getStatsForItem(availableStats.value, props.weapon, statGroupEntry.value)
})

watchEffect(() => {
  console.log(formattedStats.value)
})

</script>
<template>
  <ul class="flex flex-col text-sm space-y-2">
    <li class="grid grid-cols-3 break-inside-avoid" v-for="stat in formattedStats" :key="stat.hash">
      <span class="text-right pr-4">{{stat.name}}</span>
      <WeaponStatsBar class="col-span-2" v-if="stat.value && stat.displayType === 'bar'" :base-value="stat.value"
        :new-value="stat.value" />
      <span v-else>{{ stat.value }}</span>
    </li>
  </ul>
</template>