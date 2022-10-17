<script setup lang="ts">
import { Tippy } from 'vue-tippy'

defineProps<{
  heading: string,
  subheading?: string,
  description?: string,
  subDescription?: string,
  stats?: any
}>()
</script>

<template>
  <Tippy :delay="0" :duration="[0, 0]" placement="left-end" :arrow="false">
    <slot />
    <template #content>
      <div class="w-96 max-w-96 border-t-8 bg-black text-white rounded-sm px-4 pt-1 pb-4 border-t-white -mt-1">
        <header>
          <p class="uppercase text-xl">{{heading}}</p>
          <span>{{subheading}}</span>
        </header>
        <section class="mt-4">
          <pre class="font-sans text-sm whitespace-pre-wrap">{{description}}</pre>
          <pre>{{subDescription}}</pre>
          <div>
            {{stats}}
          </div>
        </section>
      </div>
    </template>
  </Tippy>
</template>