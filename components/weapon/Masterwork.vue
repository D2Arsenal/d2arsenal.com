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

const currentIndex = computed(() => statisticsIndex.value !== null ? props.options[statisticsIndex.value].data.benefits.findIndex(b => b.hash === props.modelValue) : null)
const currentLevel = computed(() => currentIndex.value !== null ? currentIndex.value + 1 : 0)

const emit = defineEmits<{
  (event: 'update:modelValue', masterwork: number | null): void
}>()


const updateMasterwork = (hash: number | null) => {
  emit('update:modelValue', hash)
}

const updateMasterworkForLevel = (event: InputEvent) => {
  const level = (<HTMLInputElement>event.target).valueAsNumber
  if (!level) {
    updateMasterwork(null)
    return
  }

  if(!statisticsIndex.value) {
    return
  }

  const masterwork = props.options[statisticsIndex.value].data.benefits[level - 1]
  updateMasterwork(masterwork.hash)
}

const updateMasterworkForStatisticIndex = (index: number) => {
  const masterwork = props.options[index].data.benefits[currentIndex.value ?? 0]
  updateMasterwork(masterwork.hash)
}


</script>
<template>
  <div>
    <div v-for="(stat, i) in options">
      isActive: {{i === statisticsIndex ? 'Yes' : 'No'}}
      {{ stat.statistic }}
      <button @click="updateMasterworkForStatisticIndex(i)">Choose!</button>
    </div>
    <label>
      Masterwork Level: {{ currentLevel }}
      <input type="range" min="0" max="10" :value="currentLevel" @change="updateMasterworkForLevel">
    </label>
  </div>
</template>