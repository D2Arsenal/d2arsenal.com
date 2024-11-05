<script setup lang="ts">
import type { Mod } from '~/utils/mods'

const { mods, modelValue } = defineProps<{
  mods: Mod[]
  canApplyAdeptMods: boolean
  modelValue: number | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', mod: number | null): void
}>()

const isAdeptMod = (mod?: Mod) => mod?.mod.name.startsWith('Adept')

const modTabs = computed(() => [
  { mods: mods.filter(m => !isAdeptMod(m)), name: 'Normal' },
  { mods: mods.filter(m => isAdeptMod(m)), name: 'Adept' },
])

const selectedMod = computed(() => mods.find(({ mod }) => mod.hash === modelValue))

const activeModTabIndex = ref(isAdeptMod(selectedMod.value) ? 1 : 0)
const activeModTab = computed(() => modTabs.value[activeModTabIndex.value])

const updateMod = (hash: number) => {
  emit('update:modelValue', modelValue === hash ? null : hash)
}
</script>

<template>
  <Card heading="Weapon mods">
    <div v-if="canApplyAdeptMods" class="space-x-2">
      <AppButton
        v-for="({ name }, i) in modTabs" :key="name" :is-active="i === activeModTabIndex"
        @click="activeModTabIndex = i"
      >
        {{ name }}
      </AppButton>
    </div>
    <ul class="grid grid-cols-5 grid-cols-6 sm:grid-cols-8 md:grid-cols-5 xl:grid-cols-8 gap-4 sm:gap-x-0 sm:gap-y-6 md:gap-y-8 mt-4">
      <li v-for="{ mod, subDescription, stats } in activeModTab.mods" :key="mod.hash">
        <Plug
          is-squared :is-selected="mod.hash === modelValue" :item="mod" :sub-description="subDescription"
          :stats="stats" @click="updateMod(mod.hash)"
        />
      </li>
    </ul>
  </Card>
</template>
