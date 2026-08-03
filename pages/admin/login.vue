<template>
  <div class="min-h-full flex items-center justify-center py-20 px-4">
    <div class="max-w-md w-full bg-paper-50 dark:bg-paper-950 rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-ink-900 dark:text-paper-50 mb-6 text-center">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-ink-800 dark:text-paper-100 mb-1">
            Username
          </label>
          <input id="username" v-model="form.username" type="text" required
            class="w-full px-3 py-2 border border-paper-400 dark:border-paper-700 dark:bg-paper-950 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter username" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-ink-800 dark:text-paper-100 mb-1">
            Password
          </label>
          <input id="password" v-model="form.password" type="password" required
            class="w-full px-3 py-2 border border-paper-400 dark:border-paper-700 dark:bg-paper-950 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            placeholder="Enter password" />
        </div>

        <div v-if="error" class="text-error-600 text-sm">{{ error }}</div>

        <button type="submit" :disabled="loading"
          class="w-full bg-brand-primary-600 text-paper-50 py-2 px-4 rounded-md hover:bg-brand-primary disabled:bg-paper-400 dark:disabled:bg-paper-700 disabled:cursor-not-allowed">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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
