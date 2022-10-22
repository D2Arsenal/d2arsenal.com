<script setup lang="ts">
import type { DestinyDamageTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js';
import type { Mod } from '~/utils/mods';
import { isExotic } from '~/utils/weapon';

const props = defineProps<{
  weapon: PrunedDestinyInventoryItemDefinition,
  damageTypes: DestinyDamageTypeDefinition[],
  perks: Array<PrunedDestinyInventoryItemDefinition | null>,
  masterwork?: PrunedDestinyInventoryItemDefinition,
  mod?: Mod,
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>,
  stats?: DefinitionRecord<DestinyStatDefinition>
}>()

const isExoticWeapon = computed(() => isExotic(props.weapon))

const emit = defineEmits<{
  (e: 'reset:masterwork'): void,
  (e: 'reset:mod'): void,
  (e: 'reset:perk', colIndex: number): void
}>()

</script>

<template>
  <div class="max-w-full text-white grid grid-cols-1">
    <div class="relative p-4 flex flex-col col-start-1 row-start-1">
      <div class="flex justify-between">
        <div class="flex items-center">
          <div>
            <div class="inline-block relative border-2 border-white mr-4">
              <WeaponIcon size="lg" :icon="weapon.displayProperties.icon" :watermark="weapon.iconWatermark" />
            </div>
          </div>
          <div class="uppercase -mt-2">
            <h1 class="text-3xl font-bold">{{ weapon.displayProperties.name }}</h1>
            <h2 class="leading-tight">{{ weapon.itemTypeDisplayName }}</h2>
          </div>
        </div>
        <div>
          <div v-for="dt in damageTypes" :key="dt.hash">
            <img class="w-12 h-12" :src="useBungieUrl(dt.displayProperties.icon)" loading="lazy" aria-hidden>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <WeaponStats class="w-7/12" :weapon="weapon" :damage-types="damageTypes" :masterwork="masterwork" :mod="mod"
          :stat-groups="statGroups" :perks="perks" :stats="stats" />
      </div>
      <div class="mt-auto flex justify-end">
        <WeaponPreset @reset:mod="emit('reset:mod')" @reset:masterwork="emit('reset:masterwork')" @reset:perk="emit('reset:perk', $event)" :masterwork="masterwork" :perks="perks" :mod="mod" :is-exotic="isExoticWeapon" />
      </div>
    </div>
    <img class="col-start-1 col-end-3 row-start-1 object-cover" :src="useBungieUrl(weapon.screenshot)" loading="lazy">
  </div>
</template>