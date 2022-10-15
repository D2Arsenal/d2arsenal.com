<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

defineProps<{
  weapons: DestinyInventoryItemDefinition[],
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