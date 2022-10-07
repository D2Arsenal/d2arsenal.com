<script setup>
import { useManifestStore } from '~/store/manifest'

const manifestStore = useManifestStore()
manifestStore.init()

</script>

<template>
  <pre>
    {{ manifestStore.version }}
    {{manifestStore.manifest ? 'manifest loaded' : 'manifest empty'}}
  </pre>
</template>