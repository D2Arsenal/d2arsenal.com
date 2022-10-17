<script setup lang="ts">
import { Perk } from '~/utils/perks';

const props = defineProps<{
  perks: Perk[][],
  modelValue: number[],
}>()

const emit = defineEmits<{ (event: 'update:modelValue', value: any): void }>()

const setPerk = (columnIndex: number, hash: number) => {
  const newPerks = [...props.modelValue]
  newPerks[columnIndex] = hash
  emit('update:modelValue', newPerks)
}

const isSelected = (columnIndex: number, hash?: number) => props.modelValue[columnIndex] === hash

</script>
<template>
  <div class="bg-gray-900 p-5">
    <h2 class="uppercase pb-3 border-b border-b-gray-500 text-sm">Weapon perks</h2>
    <div class="flex mt-8 justify-center space-x-4">
    <ul class="space-y-4" v-for="perkColumn, i in perks">
      <li v-for="perk in perkColumn">
        <Plug :item="perk.trait" :is-selected="isSelected(i, perk.trait?.hash)" @click="setPerk(i, perk.trait!.hash)" :sub-description="perk.subDescription" :stats="perk.stats" />
      </li>
    </ul>
  </div>
  </div>
</template>