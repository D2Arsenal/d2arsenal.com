<script setup lang="ts">
import { masterworkStatisticToTerm } from '~/utils/masterwork.js'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js'

interface Props {
  options: {
    statistic: string
    data: {
      benefits: PrunedDestinyInventoryItemDefinition[]
      hash: number
      active: boolean
    }
  }[]
  isExoticWeapon?: boolean
  modelValue: number | null
}
const { options, modelValue } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', masterwork: number | null): void
}>()

const statisticsIndex = $computed(() => {
  const index = options.findIndex(({ data }) => data.benefits.some(b => b.hash === modelValue))
  return index === -1 ? null : index
})

const activeTabIndex = computed(() => statisticsIndex ?? -1)

const currentIndex = $computed(() => statisticsIndex !== null
  ? options[statisticsIndex].data.benefits.findIndex(b => b.hash === modelValue)
  : null)
const currentLevel = computed(() => currentIndex !== null
  ? currentIndex + 1
  : 1)

const updateMasterwork = (hash: number | null) => {
  emit('update:modelValue', hash)
}

// TODO: Exotic Catalyst!

const updateMasterworkForLevel = (level: number) => {
  if (statisticsIndex === null) {
    return
  }
  if (!level) {
    updateMasterwork(null)
    return
  }

  const masterwork = options[statisticsIndex].data.benefits[level - 1]
  updateMasterwork(masterwork.hash)
}

const updateMasterworkForStatisticIndex = (index: number) => {
  const masterwork = options[index].data.benefits[currentIndex ?? 0]
  updateMasterwork(masterwork.hash)
}

const resetMasterwork = () => {
  updateMasterwork(null)
}

const onMasterworkTypeSwitch = (index: number) => {
  if (index === statisticsIndex) {
    resetMasterwork()
    return
  }
  updateMasterworkForStatisticIndex(index)
}

const buttonNames = computed(() => options.map(o => masterworkStatisticToTerm(o.statistic)))
</script>

<template>
  <Card :heading="isExoticWeapon ? 'Exotic catalyst is WIP' : 'Weapon masterwork'">
    <div v-if="isExoticWeapon">
      <h2>Exotic catalysts are not available in D2 Arsenal yet</h2>
    </div>
    <div v-if="!buttonNames.length && !isExoticWeapon">
      <h2>There are no masterworks for this weapon</h2>
    </div>
    <nav v-if="!isExoticWeapon" class="flex flex-wrap xl:flex-nowrap">
      <AppButton
        v-for="title, i in buttonNames" :key="title" class="mr-2 mt-2 md:mt-4 xl:mt-2"
        :is-active="activeTabIndex === i" @click="onMasterworkTypeSwitch(i)"
      >
        {{ title }}
      </AppButton>
    </nav>
    <div class="flex w-full mt-8" :class="!modelValue && 'invisible'">
      <AppNumberInput
        :min-value="0" :max-value="10" :model-value="currentLevel"
        @update:model-value="updateMasterworkForLevel"
      />
    </div>
  </Card>
</template>
