<script setup lang="ts">
import type { MinimalWeapon } from '~/utils/weapon'

defineProps<{
  weapons: MinimalWeapon[]
  hasMore: boolean
}>()
</script>

<template>
  <ul>
    <ResultItem
      v-for="weapon in weapons"
      :key="weapon.hash"
      :hash="weapon.hash"
      :icon="weapon.icon"
      :name="weapon.name"
      :watermark="weapon.watermark"
    />
  </ul>
</template>
