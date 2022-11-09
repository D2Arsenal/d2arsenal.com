<script setup lang="ts">
import type { Stat } from '~/utils/stats'

defineProps<{
  stats?: Stat[]
}>()

const signForStatValue = (value: number) =>
  value === 0
    ? '±'
    : value > 0
      ? '+'
      : '-'
const classForStatValue = (value: number) =>
  value === 0
    ? ''
    : value > 0
      ? 'text-green-700'
      : 'text-red-700'

const abs = Math.abs
</script>

<template>
  <div v-if="stats?.length" class="border-t mt-4 pt-2 border-t-white">
    <ul>
      <li v-for="stat in stats" :key="stat.name" class="grid grid-cols-5 w-2/3">
        <span class="col-span-4">
          {{ stat.name }}
        </span>
        <span class="tabular-nums" :class="classForStatValue(stat.value)">
          {{ signForStatValue(stat.value) }} {{ abs(stat.value) }}
        </span>
      </li>
    </ul>
  </div>
</template>
