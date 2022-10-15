<script setup lang="ts">
import { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinySandboxPerkDefinition } from 'bungie-api-ts/destiny2';

defineProps<{
  weapon: DestinyInventoryItemDefinition,
  damageTypes: DestinyDamageTypeDefinition[],
  perks: DestinySandboxPerkDefinition[],
  masterwork: DestinyInventoryItemDefinition[],
  mod?: DestinyInventoryItemDefinition
}>()

</script>

<template>
  <div class="max-w-full text-white grid grid-cols-1">
    <div class="relative p-12 flex flex-col col-start-1 row-start-1">
      <div class="flex justify-between">
        <div class="flex">
          <div class="inline-flex relative border-2 border-white mr-4">
            <WeaponIcon :icon="weapon.displayProperties.icon" :watermark="weapon.iconWatermark" />
          </div>
          <div>
            <h1 class="text-4xl bold uppercase">{{ weapon.displayProperties.name }}</h1>
            <h2 class="text2xl uppercase">{{ weapon.itemTypeDisplayName }}</h2>
          </div>
        </div>
        <div>
          <div v-for="dt in damageTypes" :key="dt.hash">
            <img class="w-16 h-16" :src="useBungieUrl(dt.displayProperties.icon)" loading="lazy" aria-hidden>
          </div>
        </div>
      </div>
      <div>
        <WeaponStatsSummary />
      </div>
      <div class="mt-auto flex justify-end">
        <WeaponUsedPerks />
      </div>
    </div>
    <img class="col-start-1 col-end-3 row-start-1 object-cover" :src="useBungieUrl(weapon.screenshot)" loading="lazy">
  </div>
</template>