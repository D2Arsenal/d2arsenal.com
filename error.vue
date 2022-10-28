<script setup lang="ts">
import LogoWithFontSvg from '~/assets/img/d2a-logo-with-font.svg?component'

const props = defineProps<{
  error: {
    url?: string,
    statusCode: string,
    message?: string,
  }
}>()

const heading = computed(() => props.error.statusCode === "404" ? 'Page not found' : 'Something went wrong')
const description = computed(() => props.error.message ||
  (props.error.statusCode === "404"
    ? 'Sorry, we couldn\'t find the page you\'re looking for.'
    : 'An error occurred while trying to load the page.')
)

const handleError = () => clearError({ redirect: '/' })

useHead({
  title: `${props.error.statusCode} - ${heading} - D2 Arsenal`
})
</script>

<template>
  <div class="flex min-h-screen flex-col pt-16 pb-12">
    <main class="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div class="flex flex-shrink-0 justify-center">
        <a href="/" class="inline-flex">
          <span class="sr-only">D2 Arsenal</span>
          <LogoWithFontSvg class="h-12 w-auto" />
        </a>
      </div>
      <div class="py-16">
        <div class="text-center">
          <p class="text-base font-semibold text-yellow-600">{{ error.statusCode }}</p>
          <h1 class="mt-2 text-4xl font-bold tracking-tight text-gray-200 sm:text-5xl">{{ heading }}</h1>
          <p class="mt-2 text-base text-gray-300">{{ description }}</p>
          <div class="mt-6">
            <a href="/" @click.prevent="handleError"
              class="text-base font-medium text-yellow-600 hover:text-yellow-500">
              Go back home
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
