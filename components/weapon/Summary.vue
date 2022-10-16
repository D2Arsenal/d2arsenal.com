<script setup lang="ts">
import type { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinySandboxPerkDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';

defineProps<{
  weapon: DestinyInventoryItemDefinition,
  damageTypes: DestinyDamageTypeDefinition[],
  perks: DestinySandboxPerkDefinition[],
  masterwork?: DestinyInventoryItemDefinition,
  mod?: DestinyInventoryItemDefinition,
  statGroups?: DefinitionRecord<DestinyStatGroupDefinition>,
  stats?: DefinitionRecord<DestinyStatDefinition>
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
            <h1 class="text-2xl bold">{{ weapon.displayProperties.name }}</h1>
            <h2 class="text-lg">{{ weapon.itemTypeDisplayName }}</h2>
          </div>
        </div>
        <div>
          <div v-for="dt in damageTypes" :key="dt.hash">
            <img class="w-12 h-12" :src="useBungieUrl(dt.displayProperties.icon)" loading="lazy" aria-hidden>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <WeaponStats class="w-1/2" :weapon="weapon" :damage-types="damageTypes" :masterwork="masterwork" :mod="mod"
          :stat-groups="statGroups" :perks="perks" :stats="stats" />
      </div>
      <div class="mt-auto flex justify-end">
        <WeaponPreset :masterwork="masterwork" :mod="mod" />
      </div>
    </div>
    <img class="col-start-1 col-end-3 row-start-1 object-cover" :src="useBungieUrl(weapon.screenshot)" loading="lazy">
  </div>
</template>