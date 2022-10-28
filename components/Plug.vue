<script setup lang="ts">
import type { Stat } from '~/utils/stats';
import type { PrunedDestinyInventoryItemDefinition } from '~~/types/destiny.js';

const props = defineProps<{
  item?: PrunedDestinyInventoryItemDefinition,
  isSquared?: boolean,
  isSelected?: boolean,
  isDisabled?: boolean,
  isDemoted?: boolean,
  canShrink?: boolean,
  subDescription?: string,
  warning?: string,
  placeholder?: string,
  stats?: Stat[],
}>()

const computedClasses = computed(() => [
  {
    'rounded-full': !props.isSquared
  },
  props.isSelected && 'bg-blue-500/75',
  props.canShrink ? 'h-7 w-7 md:h-12 md:w-12' : 'h-12 w-12'
])

const icon = computed(() => props.item?.displayProperties.icon ?? props.placeholder ?? '')

const beforeClass = computed(() => `enabled:before:absolute enabled:before:top-0 enabled:before:left-0 enabled:before:w-full enabled:before:h-full ${props.isSquared ? '' : 'enabled:before:rounded-full '}enabled:before:transition-color enabled:before:duration-400 enabled:hover:before:bg-gray-300/25`)
const afterClass = computed(() => `enabled:after:absolute enabled:after:top-0 enabled:after:left-0 enabled:after:w-full enabled:after:h-full ${props.isSquared ? '' : 'enabled:after:rounded-full '}enabled:after:transform enabled:after:transform-gpu enabled:after:scale-110 enabled:after:ease-in-out enabled:after:transition-shadow enabled:after:duration-400 enabled:hover:after:shadow-[0_0_0_1px]`)

</script>


<template>
  <Tooltip :is-disabled="!item" :heading="item?.displayProperties.name ?? ''" :subheading="item?.itemTypeDisplayName"
    :description="item?.displayProperties.description" :sub-description="subDescription" :warning="warning" :stats="stats">
    <button class="border-2 relative flex justify-center items-center shadow-white"
      :class="[computedClasses, beforeClass, afterClass]" :disabled="isDisabled">
      <span class="relative" :class="{ 'opacity-50': isDemoted }">
        <WeaponIcon :icon="icon" size="auto" :watermark="item?.iconWatermark" />
      </span>
    </button>
  </Tooltip>
</template>