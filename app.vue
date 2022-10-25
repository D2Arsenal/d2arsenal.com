<script setup lang="ts">
import { useManifestStore } from '~/store/manifest'

const manifestStore = useManifestStore()
await manifestStore.init()

// TODO: Meta tags and so on
useHead({
  titleTemplate: t => t ? `${t} - D2 Arsenal` : 'D2 Arsenal - Craft your favorite weapon'
})
</script>

<template>
  <div class="h-full">
    <AppSidebar />

    <div class="flex flex-col lg:pl-96">
      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </div>
</template>