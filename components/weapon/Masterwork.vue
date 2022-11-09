<script lang="ts" setup>
import { masterworkStatisticToTerm } from '~/utils/masterwork.js'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js'

type Props = {
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

const statisticsIndex = $computed(() => {
  const index = options.findIndex(({ data }) => data.benefits.some(b => b.hash === modelValue))
  return index === -1 ? null : index
})

const activeTabIndex = computed(() => statisticsIndex ?? -1)

const currentIndex = $computed(() => statisticsIndex !== null ? options[statisticsIndex].data.benefits.findIndex(b => b.hash === modelValue) : null)
const currentLevel = computed(() => currentIndex !== null ? currentIndex + 1 : 1)

const emit = defineEmits<{
  (event: 'update:modelValue', masterwork: number | null): void
}>()

const updateMasterwork = (hash: number | null) => {
  emit('update:modelValue', hash)
}

// TODO: Exotic Catalyst!

const updateMasterworkForLevel = (event: Event) => {
  if (statisticsIndex === null) {
    return
  }

  const level = (<HTMLInputElement>event.target).valueAsNumber
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
    <nav v-if="!isExoticWeapon" class="flex flex-wrap sm:flex-nowrap items-center">
      <AppButton v-for="title, i in buttonNames" :key="title" class="mr-2 mt-2" :is-active="activeTabIndex === i"
        @click="onMasterworkTypeSwitch(i)">
        {{ title }}
      </AppButton>
    </nav>
    <div class="grid grid-cols-5 w-full mt-8" :class="!modelValue && 'invisible'">
      <label>
        <span class="sr-only">Masterwork Level</span>
        <input :disabled="!modelValue"
          class="appearance-none cursor-pointer bg-transparent w-12 h-12 pl-4 m-0 text-xl border border-white"
          type="number" min="0" max="10" :value="currentLevel" @change="updateMasterworkForLevel">
      </label>
      <AppRangeInput :disabled="!modelValue" wrapper-class="col-span-4 w-full" class="w-full h-full" type="range"
        min="0" max="10" :value="currentLevel" @change="updateMasterworkForLevel" />
    </div>
  </Card>
</template>

<style scoped lang="pcss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  @apply appearance-none m-0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
