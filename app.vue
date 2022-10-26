<script setup lang="ts">
import { useManifestStore } from '~/store/manifest'

const manifestStore = useManifestStore()
await manifestStore.init()

// TODO: 
// TODO: Meta tags and so on
useHead({
  titleTemplate: t => t ? `${t} - D2 Arsenal` : 'D2 Arsenal - Craft your favorite weapon',
  // TODO: How to "delete" tag?
  // TODO: Wrong type here
  // @ts-ignore
  link: [{ key: 'favicon' }]
})
</script>

<template>
  <div class="h-full">
    <AppSidebar />

    <div class="flex flex-col justify-center lg:pl-96 min-h-screen">
      <main class="flex-auto">
        <NuxtPage />
      </main>
      <AppFooter class="flex-grow-0" />
    </div>
  </div>
</template>