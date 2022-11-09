<script setup lang="ts">
import { Tippy } from 'vue-tippy'
import type { Stat } from '~/utils/stats'

defineProps<{
  heading: string
  subheading?: string
  description?: string
  subDescription?: string
  craftingLevel?: number
  warning?: string
  stats?: Stat[]
  enhancedDescription?: string
  enhancedSubDescription?: string
  enhancedCraftingLevel?: number
  enhancedStats?: Stat[]
  isDisabled?: boolean
}>()

const tooltipPlacement = useState<'bottom-end' | 'left-end'>('bottom-end')
onMounted(() => {
  if (window.innerWidth >= 1000) {
    tooltipPlacement.value = 'left-end'
  }
})
</script>

<template>
  <Tippy :delay="0" :duration="[0, 0]" :placement="tooltipPlacement" :arrow="false">
    <slot />
    <template #content>
      <div
        v-if="!isDisabled"
        class="w-96 max-w-96 border-t-8 bg-black/90 text-white rounded-sm pt-1 pb-4 border-t-white"
      >
        <header class="bg-black px-4 -mt-1 py-1">
          <p class="uppercase text-xl font-bold">
            {{ heading }}
          </p>
          <span>{{ subheading }}</span>
        </header>
        <p v-if="warning" class="px-4 text-xs py-2 mt-4 bg-red-500/50">
          {{ warning }}
        </p>
        <section class="mt-4 text-sm whitespace-pre-wrap px-4">
          <p>{{ description }}</p>
          <p class="mt-1 text-gray-400">
            {{ subDescription }}
          </p>
          <TooltipStats v-if="stats?.length" :stats="stats" />
        </section>
        <template v-if="enhancedDescription">
          <header
            class="mt-2 text-sm text-yellow-500 uppercase bg-gradient-to-b from-yellow-500/25 to-transparent px-4 py-1 border-t-yellow-500 border-t"
          >
            Enhanced Benefits
          </header>
          <section class="mt-2 text-sm whitespace-pre-wrap px-4">
            <p>{{ enhancedDescription }}</p>
            <p class="mt-1 text-gray-400">
              {{ enhancedSubDescription }}
            </p>
            <TooltipStats v-if="enhancedStats?.length" :stats="enhancedStats" />
          </section>
        </template>
      </div>
    </template>
  </Tippy>
</template>
