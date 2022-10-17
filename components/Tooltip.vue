<script setup lang="ts">
import { Tippy } from 'vue-tippy'
import { Stat } from '~/utils/stats';

defineProps<{
  heading: string,
  subheading?: string,
  description?: string,
  subDescription?: string,
  stats?: Stat[],
  isDisabled?: boolean
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
  <Tippy :delay="0" :duration="[0, 0]" placement="left-end" :arrow="false">
    <slot />
    <template #content>
      <div v-if="!isDisabled" class="w-96 max-w-96 border-t-8 bg-black/75 text-white rounded-sm pt-1 pb-4 border-t-white">
        <header class="bg-black/90 px-4 -mt-1">
          <p class="uppercase text-xl font-bold">{{heading}}</p>
          <span>{{subheading}}</span>
        </header>
        <section class="mt-4 text-sm whitespace-pre-wrap px-4">
          <p>{{description}}</p>
          <p class="mt-1 text-gray-400">{{ subDescription }}</p>
          <div class="border-t mt-4 pt-2 border-t-white" v-if="stats?.length">
            <ul>
              <li class="grid grid-cols-5 w-2/3" v-for="stat in stats"
                :key="stat.name">
                <span class="col-span-4">
                  {{ stat.name }}
                </span>
                <span class="tabular-nums" :class="classForStatValue(stat.value)">
                  {{ signForStatValue(stat.value) }} {{ abs(stat.value) }}
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </template>
  </Tippy>
</template>