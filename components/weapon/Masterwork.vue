<script setup lang="ts">
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
  options: {
    statistic: string,
    data: {
      benefits: DestinyInventoryItemDefinition[],
      hash: number,
      active: boolean
    }
  }[],
  modelValue: number | null
}>()

const statisticsIndex = computed(() => {
  const index = props.options.findIndex(({ data }) => data.benefits.some(b => b.hash === props.modelValue))
  return index === -1 ? null : index
})

const activeTabIndex = computed(() => statisticsIndex.value ? statisticsIndex.value + 1 : 0)

const currentIndex = computed(() => statisticsIndex.value !== null ? props.options[statisticsIndex.value].data.benefits.findIndex(b => b.hash === props.modelValue) : null)
const currentLevel = computed(() => currentIndex.value !== null ? currentIndex.value + 1 : 0)

const emit = defineEmits<{
  (event: 'update:modelValue', masterwork: number | null): void
}>()

// TODO: Does not work yet


const updateMasterwork = (hash: number | null) => {
  emit('update:modelValue', hash)
}

const updateMasterworkForLevel = (event: InputEvent) => {
  const level = (<HTMLInputElement>event.target).valueAsNumber
  if (!level) {
    updateMasterwork(null)
    return
  }

  if (!statisticsIndex.value) {
    return
  }

  const masterwork = props.options[statisticsIndex.value].data.benefits[level - 1]
  updateMasterwork(masterwork.hash)
}

const updateMasterworkForStatisticIndex = (index: number) => {
  const masterwork = props.options[index].data.benefits[currentIndex.value ?? 0]
  updateMasterwork(masterwork.hash)
}

const resetMasterwork = () => {
  updateMasterwork(null)
}

const onTabChange = (index: number) => {
  debugger
  if(!index) {
    resetMasterwork()
    return
  }
  updateMasterworkForStatisticIndex(index-1)
}

const tabNames = computed(() => ['None'].concat(props.options.map(o => o.statistic)))

</script>
<template>
  <Card heading="Weapon masterwork">
    <AppTabs :model-value="activeTabIndex" @update:modelValue="onTabChange" :names="tabNames">
      <template #[0] />
      <template v-for="(stat, i) in options" #[i+1]>
        isActive: {{i === statisticsIndex ? 'Yes' : 'No'}}
        {{ stat.statistic }}
      </template>
    </AppTabs>
    <label>
      <input type="number" min="0" max="10" :value="currentLevel" @change="updateMasterworkForLevel">
      <input type="range" min="0" max="10" :value="currentLevel" @change="updateMasterworkForLevel">
    </label>
  </Card>
</template>