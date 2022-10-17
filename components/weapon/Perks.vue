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
  <div ref="test" class="flex justify-center">
    <ul v-for="perkColumn, i in perks">
      <li v-for="perk in perkColumn">
        <Plug :item="perk.trait" :is-selected="isSelected(i, perk.trait?.hash)" @click="setPerk(i, perk.trait!.hash)" />
      </li>
    </ul>
  </div>
</template>