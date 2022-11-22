<script setup lang="ts">
defineProps<{
  isActive?: boolean
}>()
</script>

<template>
  <button class="border border-white px-2 py-1 uppercase text-lg md:text-sm" :class="{ 'bg-yellow-600/80': isActive }">
    <slot />
  </button>
</template>

