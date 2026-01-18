<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Recipe Management</h1>
        <div class="flex gap-4">
          <NuxtLink
            to="/admin/recipes/new"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + New Recipe
          </NuxtLink>
          <!-- <button
            @click="handleLogout"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Logout
          </button> -->
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipes...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="recipe in recipes" :key="recipe.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ recipe.title }}</div>
                <div class="text-sm text-gray-500">{{ recipe.slug }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full',
                    recipe.status === 'publish'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ recipe.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ recipe.cookTimeMinutes }} min
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <NuxtLink
                  :to="`/admin/recipes/${recipe.id}`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </NuxtLink>
                <button
                  v-if="recipe.status === 'draft'"
                  @click="publishRecipe(recipe.id)"
                  class="text-green-600 hover:text-green-900"
                >
                  Publish
                </button>
                <button
                  v-else
                  @click="unpublishRecipe(recipe.id)"
                  class="text-yellow-600 hover:text-yellow-900"
                >
                  Unpublish
                </button>
                <button
                  @click="deleteRecipe(recipe.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
interface Recipe {
  id: string
  title: string
  slug: string
  cookTimeMinutes: number
  status: string
}

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  await fetchRecipes()
})

async function fetchRecipes() {
  try {
    loading.value = true
    error.value = null
    const data = await $fetch<Recipe[]>('/api/admin/recipes')
    recipes.value = data
  } catch (err: any) {
    if (err.statusCode === 401) {
      await navigateTo('/admin/login')
    } else {
      error.value = 'Failed to load recipes'
    }
  } finally {
    loading.value = false
  }
}

async function publishRecipe(id: string) {
  try {
    await $fetch(`/api/admin/recipes/${id}/approve`, { method: 'POST' })
    await fetchRecipes()
  } catch (err) {
    alert('Failed to publish recipe')
  }
}

async function unpublishRecipe(id: string) {
  try {
    await $fetch(`/api/admin/recipes/${id}/unapprove`, { method: 'POST' })
    await fetchRecipes()
  } catch (err) {
    alert('Failed to unpublish recipe')
  }
}

async function deleteRecipe(id: string) {
  if (!confirm('Are you sure you want to delete this recipe?')) return

  try {
    await $fetch(`/api/admin/recipes/${id}`, { method: 'DELETE' })
    await fetchRecipes()
  } catch (err) {
    alert('Failed to delete recipe')
  }
}

async function handleLogout() {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  } catch (err) {
    await navigateTo('/admin/login')
  }
}
</script>

