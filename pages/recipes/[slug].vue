<template>
  <div>
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <NuxtLink to="/recipes" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to recipes
      </NuxtLink>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipe...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="recipe" class="bg-white rounded-lg shadow-md p-8 relative">
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-4xl font-bold text-gray-900">{{ recipe.title }}</h1>
          
          <!-- Edit Icon (only when logged in) -->
          <NuxtLink
            v-if="isLoggedIn"
            :to="`/admin/recipes/${recipe.id}`"
            class="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Recipe"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-6 text-gray-600 mb-6">
          <span>⏱️ {{ recipe.cookTimeMinutes }} minutes</span>
          <span v-if="recipe.servings">👥 {{ recipe.servings }} servings</span>
          <span>⭐ {{ '⭐'.repeat(recipe.rating) }}</span>
        </div>

        <div v-if="recipe.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in recipe.tags"
            :key="tag"
            class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li v-for="(ingredient, idx) in formattedIngredients" :key="idx">
              {{ ingredient }}
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Steps</h2>
          <ol class="list-decimal list-inside space-y-3 text-gray-700">
            <li v-for="(step, idx) in recipe.steps" :key="idx" class="pl-2">
              {{ step }}
            </li>
          </ol>
        </div>

        <div v-if="recipe.notes" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold text-gray-900 mb-2">Notes</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ recipe.notes }}</p>
        </div>

        <div class="pt-6 border-t border-gray-200 text-sm text-gray-500">
          Published by {{ recipe.approvedBy }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Ingredient {
  quantity: number
  unit: string
  name: string
  detailedSize?: {
    amount: number
    unit: string
  }
}

interface Recipe {
  id: string
  title: string
  slug: string
  ingredients: Ingredient[] | string[]
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

const route = useRoute()
const recipe = ref<Recipe | null>(null)
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

const formattedIngredients = computed(() => {
  if (!recipe.value) return []
  
  return recipe.value.ingredients.map((ing: any) => {
    // Handle structured ingredients
    if (typeof ing === 'object' && ing.quantity !== undefined) {
      let formatted = `${ing.quantity} ${ing.unit} ${ing.name}`
      if (ing.detailedSize) {
        formatted += ` (${ing.detailedSize.amount} ${ing.detailedSize.unit})`
      }
      return formatted
    }
    // Fallback for string ingredients (backward compatibility)
    return ing
  })
})

onMounted(async () => {
  // Check login status
  await checkLoginStatus()
  
  // Fetch recipe
  try {
    loading.value = true
    const data = await $fetch<Recipe>(`/api/recipes/${route.params.slug}`)
    recipe.value = data
  } catch (err: any) {
    error.value = err.statusMessage || 'Failed to load recipe'
  } finally {
    loading.value = false
  }
  
  // Refresh login status periodically
  setInterval(checkLoginStatus, 5000)
})
</script>

