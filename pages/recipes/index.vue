<template>
  <div>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Recipes</h1>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipes...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <div v-else-if="recipes.length === 0" class="text-center py-12">
        <p class="text-gray-600">No recipes available yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="recipe in recipes"
          :key="recipe.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative"
        >
          <NuxtLink
            :to="`/recipes/${recipe.slug}`"
            class="block"
          >
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ recipe.title }}</h2>
            
            <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>⏱️ {{ recipe.cookTimeMinutes }} min</span>
            </div>

            <div v-if="recipe.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in recipe.tags"
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {{ tag }}
              </span>
            </div>

            <div class="text-sm text-gray-500">
              Rating: {{ '⭐'.repeat(recipe.rating) }}
            </div>
          </NuxtLink>
          
          <!-- Edit Icon (only when logged in) -->
          <NuxtLink
            v-if="isLoggedIn"
            :to="`/admin/recipes/${recipe.id}`"
            @click.stop
            class="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Recipe"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Recipe {
  id: string
  title: string
  slug: string
  ingredients: any[]
  steps: string[]
  cookTimeMinutes: number
  servings?: number | null
  tags: string[]
  notes: string | null
  rating: number
  approvedBy: string
  status: string
  createdAt: string
  updatedAt: string
}

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isLoggedIn = ref(false)

// Check login status
async function checkLoginStatus() {
  try {
    const session = await $fetch('/api/admin/session')
    isLoggedIn.value = session.loggedIn
  } catch {
    isLoggedIn.value = false
  }
}

onMounted(async () => {
  // Check login status
  await checkLoginStatus()
  
  // Fetch recipes
  try {
    loading.value = true
    error.value = null
    const data = await $fetch<Recipe[]>('/api/recipes')
    recipes.value = data
  } catch (err: any) {
    console.error('Failed to fetch recipes:', err)
    error.value = 'Failed to load recipes. Please try again later.'
  } finally {
    loading.value = false
  }
  
  // Refresh login status periodically
  setInterval(checkLoginStatus, 5000)
})
</script>

