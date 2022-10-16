<script setup lang="ts">
const props = defineProps<{
  baseValue: number,
  newValue: number,
}>()

const difference = computed(() => props.newValue - props.baseValue)
const didChange = computed(() => difference.value !== 0)
const isPositive = computed(() => difference.value > 0)

</script>
<template>
  <div class="flex border-gray-700 text-base font-semibold bg-white/25 text-gray-900"
    :class="didChange && {'text-green-700': isPositive, 'text-red-700': !isPositive}">
    <span class="bg-white flex" :style="{width: `${baseValue}%`}">
      <span class="absolute pl-1">
        {{ newValue }}
        <template v-if="didChange">
          ({{isPositive ? '+' : '-' }}{{ difference }})
        </template>
      </span>
    </span>
    <span v-if="didChange" :class="isPositive ? 'bg-green-600' : 'bg-red-600'" :style="{width: `${difference}%`}" />
  </div>
</template>