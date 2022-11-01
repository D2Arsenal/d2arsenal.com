<script setup lang="ts">
import pkg from '~/package.json'

const year = new Date().getFullYear()
const { version } = pkg
</script>
<template>
  <footer class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between mx-4 mb-2 text-gray-500">
    <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
      <span>© {{ year }} - D2 Arsenal v{{ version }}</span>
      <span>
        <span class="hidden sm:inline">
        &bull;
      </span>
      <span>
        <NuxtLink href="/discord/" target="_blank">
          Discord
        </NuxtLink>
        &bull;
        <NuxtLink href="/twitter/" target="_blank">
          Twitter
        </NuxtLink>
        &bull;
        <NuxtLink to="/donate/">
          Donate
        </NuxtLink>
      </span>
      </span>
    </div>
    <div>Destiny 2 & all related media © Bungie</div>
  </footer>
</template>