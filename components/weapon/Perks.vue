<script setup lang="ts">
import { CANNOT_ROLL_PERK_WARNING as WARNING, PERK_NONE } from '~/utils/perks';
import type { Perk } from '~/utils/perks';

const { perks, modelValue } = defineProps<{
  perks: { perks: Perk[][], curatedPerks: Perk[][]},
  modelValue: number[],
}>()

const hasCuratedRoll = computed(() => perks.curatedPerks.some(c => c.length))

const emit = defineEmits<{ (event: 'update:modelValue', value: any): void }>()

const setPerk = (columnIndex: number, hash: number) => {
  const newPerks = [...modelValue]
  newPerks[columnIndex] = newPerks[columnIndex] === hash ? PERK_NONE : hash
  emit('update:modelValue', newPerks)
}

const isSelected = (columnIndex: number, hash?: number) => modelValue[columnIndex] === hash
</script>
<template>
  <div>
    <Card heading="Weapon perks">
      <div class="flex mt-8 justify-center divide-x-2 divide-slate-500">
        <ul class="px-4 space-y-4" v-for="perkColumn, i in perks.perks">
          <li v-for="perk in perkColumn">
            <Plug :item="perk.trait" :is-selected="isSelected(i, perk.trait?.hash)"
              @click="setPerk(i, perk.trait!.hash)" :sub-description="perk.subDescription"
              :warning="perk.currentlyCanRoll ? undefined : WARNING" :is-demoted="!perk.currentlyCanRoll"
              :stats="perk.stats" />
          </li>
        </ul>
      </div>
    </Card>
    <Card v-if="hasCuratedRoll" heading="Curated roll">
    <div class="flex mt-8 justify-center divide-x-2 divide-slate-500">
      <ul class="px-4 space-y-4" v-for="perkColumn, i in perks.curatedPerks">
        <li v-for="perk in perkColumn">
          <Plug :item="perk.trait" :is-selected="isSelected(i, perk.trait?.hash)" @click="setPerk(i, perk.trait!.hash)"
            :sub-description="perk.subDescription" :warning="perk.currentlyCanRoll ? undefined : WARNING"
            :is-demoted="!perk.currentlyCanRoll" :stats="perk.stats" />
        </li>
      </ul>
    </div>
  </Card>
  </div>
</template>