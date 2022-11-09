<script setup lang="ts">
const { baseValue, newValue } = defineProps<{
  baseValue: number
  newValue: number
}>()

const difference = $computed(() => newValue - baseValue)
const didChange = $computed(() => difference !== 0)
const isPositive = $computed(() => difference > 0)

const whiteBarWidth = computed(() => isPositive
  ? baseValue
  : baseValue + difference,
)

const extraBarWidth = computed(() => Math.abs(difference))
</script>

<template>
  <div
    class="flex border-gray-700 text-xs sm:text-base bg-white/50"
    :class="didChange ? { 'text-green-900': isPositive, 'text-red-900': !isPositive } : 'text-gray-900'"
  >
    <span class="bg-white flex items-center transition-[width] duration-300" :style="{ width: `${whiteBarWidth}%` }">
      <span class="absolute pl-1">
        {{ newValue }}
        <template v-if="didChange">
          ({{ isPositive ? '+' : '' }}{{ difference }})
        </template>
      </span>
    </span>
    <span class="transition-[width] duration-300" :class="[isPositive ? 'bg-green-500' : 'bg-red-600']" :style="{ width: `${extraBarWidth}%` }" />
  </div>
</template>
