<script setup lang="ts">
// TODO: REMOVE before release
import { useManifestStore } from '~/store/manifest';

const manifestStore = useManifestStore()

const hash = ref<number>()
const selectedItem = computed(() => hash && manifestStore.data?.weaponTraits.find(m => m.hash === Number(hash.value)))
</script>

<template>
  <div class="min-h-screen">
    <label class="mt-8">
      Lookup item by hash:
      <input class="text-black placeholder-black" v-model="hash" placeholder="839105230">
    </label>
    <pre>
      {{ selectedItem ?? ('No item found for ' + hash)}}
    </pre>
  </div>
</template>