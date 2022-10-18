
<script setup lang="ts">
const props = defineProps<{
  names: string[],
  modelValue?: number
}>()
const slots = useSlots()
const slotNames = Object.keys(slots)

const slotNamesWithTitle = computed(() => slotNames.map((name, i) => {
  return {
    name,
    title: props.names[i]
  }
}).filter(o => o.title))

const emit = defineEmits<{
  (event: 'update:modelValue', tabIndex: number): void
}>()


const setActive = (index: number) => {
  emit('update:modelValue', index)
}

</script>

<template>
  <div>
    <nav class="flex items-center space-x-2">
      <AppButton v-for="{name, title}, i in slotNamesWithTitle" :key="name"
        :is-active="modelValue === i" @click="setActive(i)">{{ title }}</AppButton>
    </nav>
    <div class="mt-4">
      <slot :name="modelValue" />
    </div>
  </div>
</template>
