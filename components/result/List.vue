<script setup lang="ts">
import type { PrunedDestinyInventoryItemDefinition } from '~~/types/destiny.js';

defineProps<{
  weapons: PrunedDestinyInventoryItemDefinition[],
}>()
</script>
  
<template>
  <ul>
    <ResultItem 
      v-for="weapon in weapons"
      :hash="weapon.hash" 
      :icon="weapon.displayProperties.icon"
      :name="weapon.displayProperties.name"
      :watermark="weapon.iconWatermark"
    />
  </ul>
</template>