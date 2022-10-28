
<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import Fuse from 'fuse.js'
import { useManifestStore } from '~/store/manifest';
import LogoWithFontSvg from '~/assets/img/d2a-logo-with-font.svg'

const manifestStore = useManifestStore()

const query = ref('')

const fuse = computed(() => new Fuse(manifestStore.weapons, {
  keys: ['name'],
  threshold: 0.2
}))

// TODO: Debounce?
const filteredWeaponsWithoutSlice = computed(() => {
  if (query.value.length < 2) {
    return manifestStore.weapons
  }
  return fuse.value.search(query.value, { limit: 26 }).map(({ item }) => item)
})

const filteredWeapons = computed(() => {
  const weapons = filteredWeaponsWithoutSlice.value.slice(0, 25)
  const hasMore = filteredWeaponsWithoutSlice.value.length > 25
  return { weapons, hasMore }
})

const route = useRoute()
const isMobileSearchOpen = ref(false)
watch(() => route.path, () => {
  isMobileSearchOpen.value = false
})

const handleMobileSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.value) {
    isMobileSearchOpen.value = false
    return
  }
  isMobileSearchOpen.value = true
}


</script>

<template>
  <div class="min-h-full">
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-96 lg:flex-col lg:border-r lg:border-gray-700 lg:bg-slate-800 lg:pt-5 lg:pb-4">
      <NuxtLink to="/" class="flex flex-shrink-0 items-center px-6">
        <LogoWithFontSvg title="D2 Arsenal" alt="D2 Arsenal" class="text-gray-200" />
      </NuxtLink>
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="mt-2 flex h-0 flex-1 flex-col">
        <!-- Sidebar Search -->
        <div class="mt-4 px-3">
          <label for="search" class="sr-only">Search</label>
          <div class="relative mt-1 rounded-md shadow-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
              <MagnifyingGlassIcon class="mr-3 h-4 w-4 text-gray-100" aria-hidden="true" />
            </div>
            <input type="text" name="search" id="search" v-model="query"
              class="block w-full rounded-md border-gray-100 placeholder-gray-100 bg-gray-900 text-gray-100 pl-9 focus:ring-indigo-800 sm:text-sm py-4"
              placeholder="Search" />
          </div>
        </div>
        <ResultList class="mt-4 overflow-y-auto" :weapons="filteredWeapons.weapons"
          :has-more="filteredWeapons.hasMore" />
      </div>
    </div>
    <!-- Main column -->
    <div class="flex flex-col lg:pl-64">
      <!-- Search header -->
      <div class="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-800 bg-black lg:hidden">
        <div class="flex flex-1 justify-between sm:px-6 lg:px-8">
          <div class="flex flex-1">
            <form class="flex w-full md:ml-0" action="#" method="GET">
              <label for="search-field" class="sr-only">Search</label>
              <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                </div>
                <input id="search-field" v-model="query" name="search-field"
                  class="block w-full rounded-md border-gray-100 placeholder-gray-100 bg-gray-900 text-gray-100 pl-9 focus:ring-indigo-800 sm:text-sm py-4"
                  placeholder="Search weapon" type="search" @input="handleMobileSearchInput" />
                <div v-if="isMobileSearchOpen" class="bg-slate-800">
                  <ResultList class="overflow-y-auto" :weapons="filteredWeapons.weapons"
                    :has-more="filteredWeapons.hasMore" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>