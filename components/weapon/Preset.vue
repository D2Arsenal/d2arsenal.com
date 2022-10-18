<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

// TODO: Intrinsic?

const props = defineProps<{
  masterwork?: DestinyInventoryItemDefinition,
  mod?: DestinyInventoryItemDefinition,
  frame?: DestinyInventoryItemDefinition,
  perks?: Array<DestinyInventoryItemDefinition | null>
}>()

const perkColumns = computed(() => Array.from({ length: 4 }, (_, i) => ({
  perk: props.perks?.[i - 1] ?? undefined
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
      <Plug v-if="frame" is-squared :item="frame" />
      <Plug v-for="(col,i) in perkColumns" :is-disabled="!col.perk" :item="col.perk" @click="resetPerk(i)" />
      <!-- TODO: Origin trait! -->
      <Plug :item="mod" :is-disabled="!mod" is-squared @click="resetMod" />
      <Plug :item="masterwork" :is-disabled="!masterwork" is-squared @click="resetMasterwork" />
    </div>
  </div>
</template>