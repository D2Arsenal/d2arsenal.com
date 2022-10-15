<script setup lang="ts">
defineProps<{
  hash: number,
  icon: string,
  name: string,
  watermark?: string,
}>()
</script>

<template>
  <li>
    <NuxtLink class="relative flex items-center border hover:bg-gray-300 hover:border-gray-400" :to="`/weapons/${hash}`">
      <WeaponIcon :icon="icon" :watermark="watermark" />
      <span class="ml-4">
        {{ name }}
      </span>
    </NuxtLink>
  </li>
</template>