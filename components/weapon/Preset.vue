<script setup lang="ts">
import type { Perk } from '~/utils/perks'
import { COMMON_PERK_LENGTH, toTransformedPerks } from '~/utils/perks'

import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny'
import type { Mod } from '~/utils/mods'

const { perks } = defineProps<{
  masterwork?: PrunedDestinyInventoryItemDefinition
  mod?: Mod
  perks: Array<{ perk: Perk; isEnhanced: boolean } | null>
  isExotic: boolean
}>()

const emit = defineEmits<{
  (e: 'resetMasterwork'): void
  (e: 'resetMod'): void
  (e: 'resetPerk', colIndex: number): void
}>()

const transformedPerks = $computed(() => toTransformedPerks(perks))

const perkColumns = computed(() => Array.from({ length: COMMON_PERK_LENGTH }, (_, i) => transformedPerks?.[i + 1] ?? undefined))

const resetPerk = (colIndex: number) => {
  emit('resetPerk', colIndex)
}

const resetMasterwork = () => {
  emit('resetMasterwork')
}

const resetMod = () => {
  emit('resetMod')
}
</script>

<template>
  <div class="flex space-x-4 sm:space-x-8 md:space-x-3.5 xl:space-x-4.5 2xl:space-x-6">
    <Plug
      v-if="transformedPerks?.[0]" can-shrink :item="transformedPerks[0]?.trait" :stats="transformedPerks[0]?.stats"
      is-disabled :is-squared="!isExotic"
    />
    <Plug
      v-for="(perk, i) in perkColumns" :key="perk?.hash ?? i" can-shrink :is-disabled="!perk"
      :item="perk?.trait"
      :stats="perk?.isEnhanced ? perk?.enhancedStats : perk?.stats"
      :sub-description="perk?.isEnhanced ? perk?.enhancedSubDescription : perk?.subDescription" :has-enhanced="perk?.hasEnhanced" :is-enhanced="perk?.isEnhanced" :is-selected="!!perk"
      @click="resetPerk(i)"
    />
    <Plug
      v-if="transformedPerks?.[5]" can-shrink :item="transformedPerks[5]?.trait" :stats="transformedPerks[5]?.stats"
      :has-enhanced="transformedPerks[5]?.hasEnhanced" :is-enhanced="transformedPerks[5]?.isEnhanced"
      :is-selected="!!transformedPerks[5]" @click="resetPerk(4)"
    />
    <Plug
      can-shrink :item="mod?.mod" :stats="mod?.stats"
      placeholder="/common/destiny2_content/icons/54fa140e3e70ea7e5bd29b623ef75518.png" :is-disabled="!mod"
      :sub-description="mod?.subDescription" is-squared @click="resetMod"
    />
    <Plug
      can-shrink :item="masterwork"
      placeholder="/common/destiny2_content/icons/62890cb9e33bbed6a3587a1064dc860e.png" :is-disabled="!masterwork"
      is-squared @click="resetMasterwork"
    />
  </div>
</template>
