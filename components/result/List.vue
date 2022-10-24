<script setup lang="ts">
import type { MinimalWeapon } from '~~/utils/weapon.js';

defineProps<{
  weapons: MinimalWeapon[],
}>()
</script>
  
<template>
  <ul>
    <ResultItem 
      v-for="weapon in weapons"
      :hash="weapon.hash" 
      :icon="weapon.icon"
      :name="weapon.name"
      :watermark="weapon.watermark"
    />
  </ul>
</template>