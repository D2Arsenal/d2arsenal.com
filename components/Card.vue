<script setup lang="ts">
  withDefaults(defineProps<{
    headingTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5',
    heading: string
  }>(), {
    headingTag: 'h2'
  })
</script>
<template>
  <div class="bg-gray-900 p-5">
  <component :is="headingTag" class="uppercase pb-3 border-b border-b-gray-500 text-sm mb-4">{{ heading }}</component>
  <slot />
  </div>
</template>