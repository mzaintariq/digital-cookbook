<template>
  <div>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Recipes</h1>

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="w-5 h-5 text-gray-400" />
          </div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search recipes by name, tags, or description..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          />
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipes...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="recipes.length === 0" class="text-center py-12">
        <p class="text-gray-600">No recipes available yet.</p>
      </div>

      <div v-else-if="filteredRecipes.length === 0" class="text-center py-12">
        <p class="text-gray-600">No recipes match your search.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="recipe in filteredRecipes" :key="recipe.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative">
          <NuxtLink :to="`/recipes/${recipe.slug}`" class="block">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ recipe.title }}</h2>

            <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>⏱️ {{ totalTime(recipe) }}</span>
            </div>

            <div v-if="recipe.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span v-for="tag in recipe.tags" :key="tag" class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {{ tag }}
              </span>
            </div>

          </NuxtLink>

          <!-- Edit Icon (only when logged in) -->
          <NuxtLink v-if="isLoggedIn" :to="`/admin/recipes/${recipe.id}`" @click.stop
            class="absolute top-4 right-4 p-2 text-gray-400 hover:text-brand-primary transition-colors"
            title="Edit Recipe">
            <IconEdit class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { Recipe } from '~/types/recipe'
import IconEdit from '~/components/icons/IconEdit.vue'
import IconSearch from '~/components/icons/IconSearch.vue'

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isLoggedIn = ref(false)
const searchTerm = ref('')

function totalTime(recipe: Recipe): string {
  const prep = recipe.prepTimeMinutes ?? 0
  const totalMinutes = recipe.cookTimeMinutes + prep
  
  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (minutes === 0) {
    return `${hours}hr`
  }
  
  return `${hours}hr ${minutes}min`
}

// Filter recipes based on search term
const filteredRecipes = computed(() => {
  if (!searchTerm.value.trim()) {
    return recipes.value
  }

  const term = searchTerm.value.toLowerCase().trim()
  return recipes.value.filter((recipe) => {
    const titleMatch = recipe.title.toLowerCase().includes(term)
    const descriptionMatch = recipe.description?.toLowerCase().includes(term) ?? false
    const tagsMatch = recipe.tags.some(tag => tag.toLowerCase().includes(term))
    
    return titleMatch || descriptionMatch || tagsMatch
  })
})

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
