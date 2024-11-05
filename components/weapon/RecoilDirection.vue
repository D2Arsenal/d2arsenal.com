<script setup lang="ts">
const { value } = defineProps<{
  value: number
}>()
const verticalScale = 0.8
const maxSpread = 180

const direction = computed(() => {
  return Math.sin((value + 5) * (Math.PI / 10)) * (100 - value) * verticalScale * (Math.PI / 180)
})
const x = computed(() => {
  return Math.sin(direction.value)
})
const y = computed(() => {
  return Math.cos(direction.value)
})
const spread = computed(() => {
  return (100 - value) / 100 * (maxSpread / 2) * (Math.PI / 180) * Math.sign(direction.value)
})
const xSpreadMore = computed(() => {
  return Math.sin(direction.value + spread.value)
})
const ySpreadMore = computed(() => {
  return Math.cos(direction.value + spread.value)
})
const xSpreadLess = computed(() => {
  return Math.sin(direction.value - spread.value)
})
const ySpreadLess = computed(() => {
  return Math.cos(direction.value - spread.value)
})

const pathD = computed(() => `M1,1 L${1 + xSpreadMore.value},${1 - ySpreadMore.value} A1,1 0 0,${direction.value < 0 ? '1' : '0'} ${1 + xSpreadLess.value},${1 - ySpreadLess.value} Z`)
</script>

<template>
  <svg height="12" viewBox="0 0 2 1">
    <circle r="1" cx="1" cy="1" class="text-slate-600 stroke-light-50 fill-current" />
    <path v-if="value <= 95" :d="pathD" class="text-light-50 fill-current" />
    <line
      v-else
      :x1="1 - x"
      :y1="1 + y"
      :x2="1 + x"
      :y2="1 - y"
      stroke="white"
      stroke-width="0.1"
    />
  </svg>
</template>
