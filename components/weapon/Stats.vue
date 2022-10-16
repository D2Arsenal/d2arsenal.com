<script setup lang="ts">
import type { DestinyInventoryItemDefinition, DestinyStatGroupDefinition, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';


const props = defineProps<{
  weapon: DestinyInventoryItemDefinition,
  perks: Array<DestinyInventoryItemDefinition|null>,
  masterwork?: DestinyInventoryItemDefinition,
  mod?: DestinyInventoryItemDefinition,
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>
  stats?: DefinitionRecord<DestinyStatDefinition>
}>()

const statGroupEntry = computed(() => {
  const statHash = props.weapon.stats?.statGroupHash
  if (!statHash) {
    return
  }
  return props.statGroups?.[statHash]
})
const availableStats = computed(() => {
  return statGroupEntry.value?.scaledStats.map(s => props.stats?.[s.statHash])
})

const DISALLOWED_FOR_STAT_BAR = [4284893193, 3871231066, 2961396640, 447667954, 1931675084, 2715839340]
const shouldShowStatBarForStatHash = (hash?: number) => Boolean(hash && !DISALLOWED_FOR_STAT_BAR.includes(hash))

const formattedStats = computed(() =>
  availableStats.value
    ?.map(stat => {
      const investmentValue = props.weapon.investmentStats.find(e => e.statTypeHash === stat?.hash)?.value
      const interpolations = statGroupEntry.value?.scaledStats.find(s => s.statHash === stat?.hash)?.displayInterpolation ?? []

      return {
        name: stat?.displayProperties.name,
        hash: stat?.hash,
        shouldShowStatBar: shouldShowStatBarForStatHash(stat?.hash),
        value: interpolations.find(i => i.value === investmentValue)?.weight ?? investmentValue
      }
    })
    .filter(x => x.name)
    .sort((a, b) => {
      if(a.shouldShowStatBar){
        return -1
      }
      if(b.shouldShowStatBar){
        return 1
      }
      return 0
    })
)


</script>
<template>
  <ul class="flex flex-col text-sm space-y-2">
    <li class="grid grid-cols-3 break-inside-avoid" v-for="stat in formattedStats" :key="stat.hash">
      <span class="text-right pr-4">{{stat.name}}</span>
      <WeaponStatsBar class="col-span-2" v-if="stat.value && stat.shouldShowStatBar" :base-value="stat.value"
        :new-value="stat.value" />
      <span v-else>{{ stat.value }}</span>
    </li>
  </ul>
</template>