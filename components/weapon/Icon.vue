<script setup lang="ts">
defineProps<{icon: string, watermark?: string}>()
</script> 

<template>
  <img v-if="icon" :src="useBungieUrl(icon)" aria-hidden class="w-16 h-16" loading="lazy">
  <img v-if="watermark" :src="useBungieUrl(watermark)" aria-hidden class="w-16 h-16 absolute inset-0" loading="lazy">
</template>