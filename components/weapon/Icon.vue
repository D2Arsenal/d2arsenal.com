<script setup lang="ts">
type IconSize = 'sm' | 'lg' | 'xl' | 'auto'
const SIZES: Record<IconSize, string> = {
  sm: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  auto: 'w-auto h-auto'
}
const { size = 'lg' } = defineProps<{ icon: string, watermark?: string, size?: IconSize }>()

const sizeClass = computed(() => SIZES[size])

</script> 

<template>
  <img v-if="icon" :class="sizeClass" :src="useBungieUrl(icon)" aria-hidden="true" loading="lazy">
  <img v-if="watermark" :src="useBungieUrl(watermark)" aria-hidden="true" class="absolute inset-0" :class="sizeClass"
    loading="lazy">
</template>