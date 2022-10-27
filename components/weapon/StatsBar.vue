<script setup lang="ts">
const props = defineProps<{
  baseValue: number,
  newValue: number,
}>()

// TODO: max/min value

const difference = computed(() => props.newValue - props.baseValue)
const didChange = computed(() => difference.value !== 0)
const isPositive = computed(() => difference.value > 0)

const whiteBarWidth = computed(() => isPositive.value
  ? props.baseValue
  : props.baseValue + difference.value
)

const extraBarWidth = computed(() => Math.abs(difference.value))

</script>
<template>
  <div class="flex border-gray-700 text-xs sm:text-base bg-white/25"
    :class="didChange ? {'text-green-800': isPositive, 'text-red-700': !isPositive } : 'text-gray-900'">
    <span class="bg-white flex items-center transition-[width] duration-300" :style="{width: `${whiteBarWidth}%`}">
      <span class="absolute pl-1">
        {{ newValue }}
        <template v-if="didChange">
          ({{ isPositive ? '+' : '' }}{{ difference }})
        </template>
      </span>
    </span>
    <span class="transition-[width] duration-300" :class="[isPositive ? 'bg-green-600' : 'bg-red-700']" :style="{width: `${extraBarWidth}%`}" />
  </div>
</template>