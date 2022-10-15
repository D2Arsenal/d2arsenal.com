<script setup lang="ts">
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
  masterwork: DestinyInventoryItemDefinition,
  modelValue: number | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', mod: number | null): void
}>()

const updateMasterwork = (masterwork: number) => {
  emit('update:modelValue', masterwork)
}

</script>
<template>
  <div>
    !
  </div>
</template>