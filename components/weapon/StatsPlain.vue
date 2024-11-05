<script setup lang="ts">
const { baseValue, newValue, isSmallerBetter, showAs, displayType } = defineProps<{
  baseValue: number
  newValue: number
  isSmallerBetter?: boolean
  displayType?: string
  hideIcon?: boolean
  showAs?: string
}>()

const difference = computed(() => newValue - baseValue)
const didChange = computed(() => difference.value !== 0)
const isPositive = computed(() => difference.value > 0)

const didImprove = computed(() => isSmallerBetter ? !isPositive.value : isPositive.value)

const iconName = computed(() => didImprove.value ? 'heroicons:chevron-double-up-20-solid' : 'heroicons:chevron-double-down-20-solid')
const iconClasses = computed(() => didChange.value
  ? {
      'text-green-500': didImprove.value,
      'text-red-600': !didImprove.value,
    }
  : 'invisible')

const formattedValue = computed(() => {
  if (showAs) {
    return showAs
  }

  return newValue + (displayType === 'ms' ? ' ms' : '')
})
</script>

<template>
  <span class="flex items-center">
    <span class="text-light-50 text-shadow-md">
      {{ formattedValue }}
    </span>
    <Icon v-if="!hideIcon" class="text-shadow-md h-5 w-5" :class="iconClasses" :name="iconName" />
  </span>
</template>
