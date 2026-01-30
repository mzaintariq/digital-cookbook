<template>
  <div class="h-full flex items-center justify-center min-h-0">
    <div class="text-center">
      <h1 class="mb-6 w-full flex items-center justify-center">
        <!-- Mobile: Urdu on top, English on bottom (upside down) -->
        <LogoTypeBothCentered class="h-[10rem] w-auto shrink-0 text-brand-primary md:hidden" aria-hidden />
        <!-- Desktop: single combined logo -->
        <LogoTypeBoth class="hidden md:block h-[8rem] w-auto shrink-0 text-brand-primary" aria-hidden />
      </h1>
      <div class="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
        <Button @click="navigateTo('/recipes')" variant="reverse-primary" size="sm" class="w-full md:w-40">
          Browse
        </Button>
        <Button v-if="isLoggedIn" @click="navigateTo('/admin/recipes/new')" variant="primary" size="sm" class="w-full md:w-40">
          Add
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

import Button from '~/components/Button.vue'
import LogoTypeBoth from '~/components/logos/LogoTypeBothReverse.svg?component'
import LogoTypeBothCentered from '~/components/logos/LogoTypeBothCentered.svg?component'

const isLoggedIn = ref(false)

async function checkLoginStatus() {
  try {
    const session = await $fetch('/api/admin/session')
    isLoggedIn.value = session.loggedIn
  } catch {
    isLoggedIn.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
  // Refresh login status periodically
  setInterval(checkLoginStatus, 5000)
})
</script>
