<script setup lang="ts">
const { baseValue, newValue, isSmallerBetter } = defineProps<{
  baseValue: number
  newValue: number
  isSmallerBetter?: boolean
}>()

const difference = $computed(() => newValue - baseValue)
const didChange = $computed(() => difference !== 0)
const isPositive = $computed(() => difference > 0)

const whiteBarWidth = computed(() => isPositive
  ? baseValue
  : baseValue + difference,
)

const extraBarWidth = computed(() => Math.abs(difference))

const textClasses = computed(() => didChange
  ? {
      'text-green-900': isSmallerBetter ? !isPositive : isPositive,
      'text-red-900': isSmallerBetter ? isPositive : !isPositive,
    }
  : 'text-gray-900')

const extraBarClass = computed(() => ({
  'bg-green-500': isSmallerBetter ? !isPositive : isPositive,
  'bg-red-600': isSmallerBetter ? isPositive : !isPositive,
}))
</script>

<template>
  <div class="flex border-gray-700 text-xs sm:text-base bg-white/50" :class="textClasses">
    <span class="bg-white flex items-center transition-[width] duration-300" :style="{ width: `${whiteBarWidth}%` }">
      <span class="absolute pl-1">
        {{ newValue }}
        <template v-if="didChange">
          ({{ isPositive ? '+' : '' }}{{ difference }})
        </template>
      </span>
    </span>
    <span class="transition-[width] duration-300" :class="extraBarClass" :style="{ width: `${extraBarWidth}%` }" />
  </div>
</template>
