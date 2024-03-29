<script setup lang="ts">
import type { DestinyDamageTypeDefinition } from 'bungie-api-ts/destiny2'
import type { DefinitionRecord } from '~/types'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition } from '~/types/destiny.js'
import type { Mod } from '~/utils/mods'
import { isExotic } from '~/utils/weapon'
import type { Perk } from '~/utils/perks'

const { weapon } = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition
  damageTypes: DestinyDamageTypeDefinition[]
  perks: Array<{ perk: Perk; isEnhanced: boolean } | null>
  masterwork?: PrunedDestinyInventoryItemDefinition
  mod?: Mod
  statGroups?: DefinitionRecord<PrunedDestinyStatGroupDefinition>
  stats?: DefinitionRecord<PrunedDestinyStatDefinition>
}>()

const emit = defineEmits<{
  (e: 'resetMasterwork'): void
  (e: 'resetMod'): void
  (e: 'resetPerk', colIndex: number): void
}>()

const isExoticWeapon = computed(() => isExotic(weapon))
</script>

<template>
  <div class="max-w-full text-white grid grid-cols-1">
    <div class="relative z-[2] p-4 flex flex-col col-start-1 row-start-1">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="inline-block relative border-2 border-white mr-4">
              <WeaponIcon size="lg" :icon="weapon.icon" :watermark="weapon.iconWatermark" />
            </div>
          </div>
          <div class="uppercase -mt-2">
            <h1 class="text-lg sm:text-3xl font-bold">
              {{ weapon.name }}
            </h1>
            <h2 class="text-sm sm:text-base leading-tight">
              {{ weapon.itemTypeDisplayName }}
            </h2>
          </div>
        </div>
        <div class="flex-shrink-0">
          <div v-for="dt in damageTypes" :key="dt.hash">
            <img class="w-12 h-12" :src="useBungieUrl(dt.displayProperties.icon)" loading="lazy" aria-hidden>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <WeaponStats
          class="2xl:w-7/12" :weapon="weapon" :damage-types="damageTypes" :masterwork="masterwork" :mod="mod"
          :stat-groups="statGroups" :perks="perks" :stats="stats"
        />
      </div>
      <div class="flex justify-center sm:justify-end md:justify-center lg:justify-end mt-4 md:mt-8 2xl:mt-auto md:mb-2 lg:mb-4">
        <WeaponPreset
          :masterwork="masterwork" :perks="perks" :mod="mod" :is-exotic="isExoticWeapon"
          @reset-mod="emit('resetMod')" @reset-masterwork="emit('resetMasterwork')"
          @reset-perk="emit('resetPerk', $event)"
        />
      </div>
    </div>
    <div class="col-start-1 col-end-3 row-start-1 h-full z-[1] bg-black/10" />
    <img
      class="col-start-1 col-end-3 row-start-1 h-full object-center object-cover"
      :src="useBungieUrl(weapon.screenshot)"
    >
  </div>
</template>
