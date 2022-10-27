<script setup lang="ts">
import type { Mod } from '~/utils/mods';

const props = defineProps<{
  mods: Mod[],
  canApplyAdeptMods: boolean,
  modelValue: number | null
}>()

const isAdeptMod = (mod?: Mod) => mod?.mod.displayProperties.name.startsWith('Adept');

const modTabs = computed(() => [
  { mods: props.mods.filter(m => !isAdeptMod(m)), name: 'Normal' },
  { mods: props.mods.filter(m => isAdeptMod(m)), name: 'Adept' },
])

const selectedMod = computed(() => props.mods.find(({ mod }) => mod.hash === props.modelValue))

const activeModTabIndex = ref(isAdeptMod(selectedMod.value) ? 1 : 0)
const activeModTab = computed(() => modTabs.value[activeModTabIndex.value])


const emit = defineEmits<{
  (event: 'update:modelValue', mod: number | null): void
}>()

const updateMod = (hash: number) => {
  emit('update:modelValue', props.modelValue === hash ? null : hash)
}

</script>
<template>
  <Card heading="Weapon mods">
    <div class="space-x-2" v-if="canApplyAdeptMods">
      <AppButton v-for="({name}, i) in modTabs" :is-active="i === activeModTabIndex" @click="activeModTabIndex = i">{{name}}</AppButton>
    </div>
    <ul class="grid grid-cols-7 sm:grid-cols-8 gap-4 mt-4">
      <li v-for="{mod, subDescription} in activeModTab.mods" :key="mod.hash">
        <Plug is-squared :is-selected="mod.hash === modelValue" :item="mod" @click="updateMod(mod.hash)" :sub-description="subDescription" />
      </li>
    </ul>
  </Card>
</template>