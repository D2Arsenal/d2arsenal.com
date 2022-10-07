<script setup lang="ts">
  const props = defineProps<{
    hasCraftingLevel: boolean,
    hasEnhanced: boolean,
    image: string,
    isActive: boolean,
    isElemCap: boolean,
    isFrame: boolean,
    isMod: boolean,
    isPerk: boolean,
    isRetired: boolean,
    isWatermark: Boolean,
  }>()
  </script>
  
  <template>
    <div>
      {{ props }}
    </div>
  </template>