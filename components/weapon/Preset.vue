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
  item: props.perks?.[i - 1] ?? undefined
})))

</script>
<template>
  <div>
    <div class="flex space-x-6">
      <div class="relative">
        <WeaponIcon v-if="frame" :icon="frame.displayProperties.icon" />
      </div>
      <Plug v-for="col in perkColumns" :item="col.item" />
      <!-- TODO: Origin trait! -->
      <Plug :item="mod" is-squared />
      <Plug :item="masterwork" is-squared />
    </div>
  </div>
</template>