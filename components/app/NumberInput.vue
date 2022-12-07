<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  minValue?: number
  maxValue?: number
}>()

const emit = defineEmits(['update:modelValue'])

const decrement = () => {
  emit('update:modelValue', props.modelValue - 1)
}

const increment = () => {
  emit('update:modelValue', props.modelValue + 1)
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const { value } = target
  emit('update:modelValue', value)
}

const onKeyDown = (event: KeyboardEvent) => {
  const { key } = event
  if (key === 'ArrowUp') {
    return increment()
  }
  if (key === 'ArrowDown') {
    return decrement()
  }
  return false
}
</script>

<template>
  <div class="h-10 w-32">
    <div class="flex flex-row h-10 w-full relative bg-transparent mt-1">
      <button
        :disabled="typeof minValue !== 'undefined' && modelValue === (minValue)"
        class="border border-gray-100 h-full w-20 disabled:text-gray-50/25" @click="decrement"
      >
        <span class="m-auto text-2xl font-thin">−</span>
      </button>
      <input
        type="number" :min="minValue" :max="maxValue"
        class="bg-transparent border-t border-b border-gray-100 border-b-gray-100 text-center w-full font-semibold text-md flex items-center"
        v-bind="$attrs" :value="modelValue" @keydown.prevent="onKeyDown" @input="onInput"
      >
      <button
        :disabled="typeof maxValue !== 'undefined' && modelValue === (maxValue)"
        class="border border-gray-100 h-full w-20 disabled:text-gray-50/25"
        @click="increment"
      >
        <span class="m-auto text-2xl font-thin">+</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  @apply appearance-none m-0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
