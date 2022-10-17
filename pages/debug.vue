<script setup lang="ts">
// TODO: REMOVE before release
import { useManifestStore } from '~/store/manifest';
import { getStatsForItem } from '~~/utils/stats.js';

const manifestStore = useManifestStore()

const hash = ref<number>()
const selectedItem = computed(() => hash && manifestStore.data?.weaponTraits.find(m => m.hash === Number(hash.value)))
const stats = computed(() => {
  if (!selectedItem.value) {
    return
  }
  getStatsForItem(
    manifestStore.data!.statDefs,
    selectedItem.value,
    manifestStore.data!.statGroups,
  )
})
</script>

<template>
  <div class="min-h-screen">
    <label class="mt-8">
      Lookup item by hash:
      <input class="text-black placeholder-black" v-model="hash" placeholder="839105230">
    </label>
    <pre>
      {{ stats }}
    </pre>
    <pre>
      {{ selectedItem ?? ('No item found for ' + hash)}}
    </pre>
  </div>
</template>