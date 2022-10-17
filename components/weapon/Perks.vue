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
        <Tooltip 
        :heading="perk.trait?.displayProperties.name ?? 'None'"
        :subheading="perk.trait?.itemTypeDisplayName"
        :description="perk.trait?.displayProperties.description"
        :sub-description="perk?.subDescription"
        >
          <button :class="isSelected(i, perk.trait?.hash) && 'bg-blue-500'"
            @click="setPerk(i, perk.trait!.hash)">
            <WeaponIcon :icon="perk.trait?.displayProperties.icon ?? ''" :watermark="perk.trait?.iconWatermark" />
          </button>
        </Tooltip>
      </li>
    </ul>
  </div>
</template>