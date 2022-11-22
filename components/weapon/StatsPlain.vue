<script setup lang="ts">
const { baseValue, newValue, isSmallerBetter } = defineProps<{
  baseValue: number
  newValue: number
  isSmallerBetter?: boolean
  displayType?: string
}>()

const difference = $computed(() => newValue - baseValue)
const didChange = $computed(() => difference !== 0)
const isPositive = $computed(() => difference > 0)

const didImprove = $computed(() => isSmallerBetter ? !isPositive : isPositive)

const iconName = computed(() => didImprove ? 'heroicons:chevron-double-up-20-solid' : 'heroicons:chevron-double-down-20-solid')
const iconClasses = computed(() => didChange
  ? {
      'text-green-500': didImprove,
      'text-red-600': !didImprove,
    }
  : 'invisible')
</script>

<template>
  <span class="flex items-center">
    <span class="text-light-50 text-shadow-md">
      {{ newValue }}{{ displayType === 'ms' ? 'ms' : '' }}
    </span>
    <Icon class="text-shadow-md h-5 w-5" :class="iconClasses" :name="iconName" />
  </span>
</template>
