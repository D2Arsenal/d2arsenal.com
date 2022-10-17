<script setup lang="ts">
import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import type { Stat } from '~/utils/stats';

const props = defineProps<{
  item?: DestinyInventoryItemDefinition,
  isSquared?: boolean,
  isSelected?: boolean,
  subDescription?: string,
  stats?: Stat[]
}>()

const computedClasses = computed(() => [{
  'rounded-full': !props.isSquared
}, props.isSelected && 'bg-blue-500/75'])

const icon = computed(() => props.item?.displayProperties.icon ?? '')

const beforeClass = computed(() => `before:absolute before:top-0 before:left-0 before:w-full before:h-full ${props.isSquared ? '' : 'before:rounded-full '}before:transition-color before:duration-400 hover:before:bg-gray-300/25`)
const afterClass = computed(() => `after:absolute after:top-0 after:left-0 after:w-full after:h-full ${props.isSquared ? '' : 'after:rounded-full '}after:transform after:transform-gpu after:scale-110 after:ease-in-out after:transition-shadow after:duration-400 hover:after:shadow-[0_0_0_1px]`)

</script>


<template>
  <Tooltip :is-disabled="!item" :heading="item?.displayProperties.name ?? ''" :subheading="item?.itemTypeDisplayName"
    :description="item?.displayProperties.description" :sub-description="subDescription" :stats="stats">
    <button class="border-2 relative disabled:border-none h-16 w-16 flex justify-center items-center shadow-white"
      :class="[computedClasses, beforeClass, afterClass]">
      <span class="relative">
        <WeaponIcon :icon="icon" :watermark="item?.iconWatermark" />
      </span>
    </button>
  </Tooltip>
</template>