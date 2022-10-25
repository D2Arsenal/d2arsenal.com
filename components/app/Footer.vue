<script setup lang="ts">
import pkg from '~/package.json'

const year = new Date().getFullYear()
const { version } = pkg
</script>
<template>
  <footer class="flex justify-between mx-4 mb-2 text-gray-500">
    <div>
      © {{ year }} - D2 Arsenal v{{ version }}
      &bull;
      Discord
      &bull;
      Twitter
    </div>
    <div>Destiny 2 & all related media © Bungie</div>
  </footer>
</template>