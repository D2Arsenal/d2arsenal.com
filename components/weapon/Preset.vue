<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
  masterwork?: DestinyInventoryItemDefinition,
  mod?: DestinyInventoryItemDefinition,
  frame?: DestinyInventoryItemDefinition,
  perks?: Array<DestinyInventoryItemDefinition|null>
}>()

</script>
<template>
  <div>
    <div class="flex space-x-8">
      <div class="relative">
        <WeaponIcon v-if="frame" :icon="frame.displayProperties.icon"/>
      </div>
      <div v-for="i in 4" class="relative rounded-full border-2 h-16 w-16 flex justify-center items-center">
        <!-- TODO: Nicer please -->
        <WeaponIcon v-if="perks?.[i-1]" :icon="perks[i-1]?.displayProperties.icon ?? ''"/>
      </div>
      <!-- TODO: Origin trait! -->
      <div class="relative">
        <WeaponIcon v-if="mod" :icon="mod.displayProperties.icon" />
      </div>
      <div class="relative">
        <WeaponIcon v-if="masterwork" :icon="masterwork?.displayProperties.icon" :watermark="masterwork?.iconWatermark" />
      </div>
    </div>
  </div>
</template>