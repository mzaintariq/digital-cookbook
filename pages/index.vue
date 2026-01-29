<template>
  <div class="h-full flex items-center justify-center min-h-0">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-6">
        Recipe Vault
      </h1>
      <div class="flex items-center justify-center gap-4">
        <Button @click="navigateTo('/recipes')" variant="secondary" size="md" class="w-40">
          Browse
        </Button>
        <Button v-if="isLoggedIn" @click="navigateTo('/admin/recipes/new')" variant="primary" size="md" class="w-40">
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
