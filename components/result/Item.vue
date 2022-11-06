<script setup lang="ts">
defineProps<{
  hash: number,
  icon: string,
  name: string,
  watermark?: string,
}>()
// TODO: Fix active class
// TODO: Disable link if already on the page / do not navigate
</script>

<template>
  <li>
    <NuxtLink active-class="bg-gray-900 border-yellow-600"
      class="peer relative flex items-center border border-gray-700 hover:bg-gray-900 hover:border-gray-700"
      :to="`/en/weapons/${hash}/`">
      <WeaponIcon :icon="icon" :watermark="watermark" />
      <span class="ml-4">
        {{ name }}
      </span>
    </NuxtLink>
  </li>
</template>