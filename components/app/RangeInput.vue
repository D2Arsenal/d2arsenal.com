<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
defineProps<{
  wrapperClass?: string
}>()
</script>

<template>
  <div class="border border-white px-4 py-2" :class="wrapperClass">
    <input type="range" v-bind="$attrs">
  </div>
</template>

<style lang="pcss" scoped>
input[type=range] {
  @apply appearance-none cursor-pointer;
}

input[type=range]::-webkit-slider-runnable-track, input[type=range]::-moz-range-track {
  @apply appearance-none bg-white h-[2px];
}

input[type=range]::-webkit-slider-thumb, input[type=range]::-moz-range-thumb {
  @apply appearance-none h-4 w-4 relative transform rotate-45 z-10 bg-black;
}
</style>
