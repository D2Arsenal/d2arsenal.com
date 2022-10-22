<script setup lang="ts">
import { COMMON_PERK_LENGTH } from '~/utils/perks.js';
import { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js';

const props = defineProps<{
  masterwork?: PrunedDestinyInventoryItemDefinition,
  mod?: PrunedDestinyInventoryItemDefinition,
  perks?: Array<PrunedDestinyInventoryItemDefinition | null>,
  isExotic: boolean
}>()

const perkColumns = computed(() => Array.from({ length: COMMON_PERK_LENGTH }, (_, i) => ({
  perk: props.perks?.[i + 1] ?? undefined
})))

const emit = defineEmits<{
  (e: 'reset:masterwork'): void,
  (e: 'reset:mod'): void,
  (e: 'reset:perk', colIndex: number): void
}>()

const resetPerk = (colIndex: number) => {
  emit('reset:perk', colIndex)
}

const resetMasterwork = () => {
  emit('reset:masterwork')
}

const resetMod = () => {
  emit('reset:mod')
}

</script>
<template>
  <div>
    <div class="flex space-x-6">
      <Plug v-if="perks?.[0]" :item="perks?.[0]" is-disabled :is-squared="!isExotic" />
      <Plug v-for="(col, i) in perkColumns" :is-disabled="!col.perk" :item="col.perk" @click="resetPerk(i)" />
      <Plug v-if="perks?.[5]" :item="perks?.[5]" @click="resetPerk(4)" />
      <Plug :item="mod" :is-disabled="!mod" is-squared @click="resetMod" />
      <Plug :item="masterwork" :is-disabled="!masterwork" is-squared @click="resetMasterwork" />
    </div>
  </div>
</template>