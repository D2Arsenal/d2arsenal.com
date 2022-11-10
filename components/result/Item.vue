<script setup lang="ts">
const props = defineProps<{
  hash: number
  icon: string
  name: string
  watermark?: string
}>()
// TODO: Fix active class
// TODO: Disable link if already on the page / do not navigate

// TODO: revert after telesto fun is over
const TELESTO_IMG = '/common/destiny2_content/icons/977b96607460863e36260a5428bdd4c3.jpg'

const hoverElement = ref()
const isHovering = useElementHover(hoverElement)
const actualIcon = computed(() => isHovering.value ? TELESTO_IMG : props.icon)
</script>

<template>
  <li ref="hoverElement">
    <NuxtLink
      active-class="bg-gray-900 border-yellow-600"
      class="peer relative flex items-center border border-gray-700 hover:bg-gray-900 hover:border-gray-700"
      :to="`/en/weapons/${hash}/`"
    >
      <WeaponIcon :icon="actualIcon" :watermark="watermark" />
      <span class="ml-4">
        {{ name }}
      </span>
    </NuxtLink>
  </li>
</template>
