<script setup lang="ts">
type IconSize = 'sm' | 'lg'
const SIZES: Record<IconSize, string> = {
  sm: 'w-8 h-8',
  lg: 'w-12 h-12'
}
const props = withDefaults(defineProps<{ icon: string, watermark?: string, size?: IconSize }>(), {
  size: 'lg'
})

const sizeClass = computed(() => SIZES[props.size])

</script> 

<template>
  <img v-if="icon" :class="sizeClass" :src="useBungieUrl(icon)" aria-hidden loading="lazy">
  <img v-if="watermark" :src="useBungieUrl(watermark)" aria-hidden class="absolute inset-0" :class="sizeClass"
    loading="lazy">
</template>