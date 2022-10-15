<script setup lang="ts">
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

const props = defineProps<{
  mods: DestinyInventoryItemDefinition[],
  canApplyAdeptMods: boolean,
  modelValue: number | null
}>()

const modTabs = computed(() => [
  props.mods.filter(m => !m.displayProperties.name.startsWith('Adept')),
  props.mods.filter(m => m.displayProperties.name.startsWith('Adept'))
])

const activeModTabIndex = ref(0)
const activeModTab = computed(() => modTabs.value[activeModTabIndex.value])

const emit = defineEmits<{
  (event: 'update:modelValue', mod: number | null): void
}>()

const updateMod = (hash: number) => {
  emit('update:modelValue', props.modelValue === hash ? null : hash)
}

</script>
<template>
  <div>
    <div v-if="canApplyAdeptMods">
      <button @click="activeModTabIndex = 0">Normal</button>
      <button @click="activeModTabIndex = 1">Adept</button>
    </div>
    <ul class="grid grid-cols-6">
      <li v-for="mod in activeModTab">
        <button @click="updateMod(mod.hash)">
          <img :src="useBungieUrl(mod.displayProperties.icon)" class="w-16 h-16" />
        </button>
      </li>
    </ul>
  </div>
</template>