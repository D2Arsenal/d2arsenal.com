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
  <div class="flex justify-center">
    <ul v-for="perkColumn, i in perks">
      <li v-for="perk in perkColumn">
        <button :class="isSelected(i, perk.trait?.hash) && 'bg-blue-500'" @click="setPerk(i, perk.trait!.hash)">
          <WeaponIcon :icon="perk.trait?.displayProperties.icon ?? ''" :watermark="perk.trait?.iconWatermark" />
        </button>
      </li>
    </ul>
  </div>
</template>