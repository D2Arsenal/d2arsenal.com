<script setup lang="ts">
import { useManifestStore } from '~/store/manifest'

const route = useRoute()
const config = useRuntimeConfig()
const canonical = computed(() => {
  const { path, query } = route
  const pathWithoutTrailing = path.replace(/\/$/, '')
  const url = new URL(pathWithoutTrailing, config.public.siteUrl)
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value as string)
  }
  return url.toString()
})

// TODO: Meta tags and so on
useHead({
  titleTemplate: t => t ? `${t} - D2 Arsenal` : 'D2 Arsenal - Craft your favorite weapon',
  link: [
    { rel: 'icon', key: 'favicon', href: usePWAIcon('64') },
    { rel: 'canonical', href: canonical },
  ],
})

const manifestStore = useManifestStore()
await manifestStore.init()

onBeforeMount(() => {
  // Load weapons for search only on client-side
  manifestStore.loadMinimalWeapons()
})
</script>

<template>
  <div class="h-full">
    <AppSidebar />
    <div class="flex flex-col justify-center lg:pl-64 xl:pl-80 min-h-screen">
      <main class="flex-auto">
        <NuxtPage />
      </main>
      <AppFooter class="flex-grow-0" />
    </div>
  </div>
</template>
