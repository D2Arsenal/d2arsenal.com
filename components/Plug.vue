<script setup lang="ts">
import type { Stat } from '~/utils/stats'
import type { PrunedDestinyInventoryItemDefinition } from '~~/types/destiny.js'

const props = defineProps<{
  item?: PrunedDestinyInventoryItemDefinition
  subDescription?: string
  stats?: Stat[]
  // Enhanced info
  enhancedItem?: PrunedDestinyInventoryItemDefinition
  enhancedSubDescription?: string
  enhancedStats?: Stat[]
  // Crafting
  craftingLevel?: number
  enhancedCraftingLevel?: number
  // Misc
  warning?: string
  // Visual info
  placeholder?: string
  isSquared?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  isDemoted?: boolean
  hasEnhanced?: boolean
  isEnhanced?: boolean
  canShrink?: boolean
}>()

const computedClasses = computed(() => [
  {
    'rounded-full': !props.isSquared,
    'bg-gradient-radial from-yellow-500/75': props.isEnhanced,
  },
  props.isSelected && 'bg-blue-500/75',
  // TODO: Move to weapon icon!
  props.canShrink ? 'h-8 w-8 sm:h-10 sm:w-10 md:h-8 md:w-8 lg:h-8 lg:w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12' : 'h-12 w-12',
])

const icon = computed(() => props.item?.icon ?? props.placeholder ?? '')

const beforeClass = computed(() => `enabled:before:absolute enabled:before:top-0 enabled:before:left-0 enabled:before:w-full enabled:before:h-full ${props.isSquared ? '' : 'enabled:before:rounded-full '}enabled:before:transition-color enabled:before:duration-400 enabled:hover:before:bg-gray-300/25`)
const afterClass = computed(() => `enabled:after:absolute enabled:after:top-0 enabled:after:left-0 enabled:after:w-full enabled:after:h-full ${props.isSquared ? '' : 'enabled:after:rounded-full '}enabled:after:transform enabled:after:transform-gpu enabled:after:scale-110 enabled:after:ease-in-out enabled:after:transition-shadow enabled:after:duration-400 enabled:hover:after:shadow-[0_0_0_1px]`)
</script>

<template>
  <Tooltip
    :is-disabled="!item" :heading="item?.name ?? ''" :subheading="item?.itemTypeDisplayName"
    :description="item?.description" :sub-description="subDescription" :warning="warning" :stats="stats"
    :crafting-level="craftingLevel" :enhanced-crafting-level="enhancedCraftingLevel"
    :enhanced-description="enhancedItem?.description"
    :enhanced-sub-description="enhancedSubDescription" :enhanced-stats="enhancedStats"
  >
    <button
      class="border-2 relative flex justify-center items-center shadow-white"
      :class="[computedClasses, beforeClass, afterClass]" :title="item?.name ?? ''" :disabled="isDisabled"
    >
      <span class="relative" :class="{ 'opacity-50': isDemoted }">
        <Icon v-if="hasEnhanced" name="heroicons:arrow-up-20-solid" class="absolute h-4 top-0 -left-3" :class="isEnhanced && 'text-yellow-500'" />
        <WeaponIcon :icon="icon" size="auto" :watermark="item?.iconWatermark" />
      </span>
    </button>
  </Tooltip>
</template>
