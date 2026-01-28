<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input id="username" v-model="form.username" type="text" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter username" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input id="password" v-model="form.password" type="password" required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter password" />
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <button type="submit" :disabled="loading"
          class="w-full bg-brand-primary-600 text-white py-2 px-4 rounded-md hover:bg-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
const form = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

// Redirect if already logged in
onMounted(async () => {
  try {
    await $fetch('/api/admin/recipes')
    await navigateTo('/admin/recipes')
  } catch {
    // Not logged in, stay on login page
  }
})

async function handleLogin() {
  try {
    loading.value = true
    error.value = null

    await $fetch('/api/admin/login', {
      method: 'POST',
      body: form,
    })

    await navigateTo('/admin/recipes')
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>
