
<script setup lang="ts">
const props = defineProps<{
  names: string[],
  modelValue: number
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
      <button v-for="{name, title}, i in slotNamesWithTitle" :key="name" class="border border-white px-2 uppercase text-sm"
        :class="{'bg-yellow-600/80': modelValue === i}" @click="setActive(i)">{{ title }}</button>
    </nav>
    <div class="mt-4">
      <slot :name="modelValue" />
    </div>
  </div>
</template>
