<script setup lang="ts">
const props = defineProps<{
  hash: number,
  icon: string,
  name: string,
  watermark: string,
}>()
</script>

<template>
  <div>
    {{ props }}
  </div>
</template>