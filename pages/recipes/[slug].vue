<template>
  <div class="min-h-[calc(100vh-80px)]">
    <div class="w-full px-4 py-8">
      <!-- <NuxtLink to="/recipes" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to recipes
      </NuxtLink> -->

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipe...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="recipe" class="relative mx-auto px-4 lg:px-[12rem]">
        <!-- Header Section -->
        <div class="mb-8">
          <!-- Category Tag -->
          <div v-if="recipe.tags.length > 0" class="mb-4">
            <span
              class="inline-block px-4 py-1.5 bg-brand-primary-100 text-brand-primary-800 text-sm font-medium rounded-full"
            >
              {{ recipe.tags[0].toUpperCase() }}
            </span>
          </div>

          <!-- Title and Edit Icon -->
          <div class="flex items-center gap-3 mb-3 flex-wrap">
            <h1 class="text-3xl lg:text-5xl font-bold text-text-dark leading-tight">{{ recipe.title }}</h1>
            
            <!-- Edit Icon (only when logged in) -->
            <NuxtLink
              v-if="isLoggedIn"
              :to="`/admin/recipes/${recipe.id}`"
              class="p-2 text-text-dark hover:text-brand-primary transition-colors flex-shrink-0"
              title="Edit Recipe"
            >
              <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </NuxtLink>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-lg text-brand-primary mb-6">
            {{ recipe.description }}
          </p>

          <!-- <div class="flex items-center gap-6 text-gray-600">
            <span>⏱️ {{ recipe.cookTimeMinutes }} minutes</span>
            <span v-if="recipe.servings">👥 {{ recipe.servings }} servings</span>
            <span>⭐ {{ '⭐'.repeat(recipe.rating) }}</span>
          </div> -->

          <div class="bg-white-100 p-4 rounded-lg shadow-md pl-4 lg:pl-8 mr-auto w-full lg:w-fit">
            <div class="flex flex-wrap items-center gap-4 lg:gap-6">
              <!-- Prep Time -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex items-center gap-2">
                  <div class="text-brand-primary text-xs font-medium uppercase tracking-wide">Prep</div>
                  <div class="text-text-dark text-sm">
                    {{ recipe.prepTimeMinutes ? `${recipe.prepTimeMinutes} min` : 'N/A' }}
                  </div>
                </div>
              </div>

              <!-- Cook Time -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex items-center gap-2">
                  <div class="text-brand-primary text-xs font-medium uppercase tracking-wide">Cook</div>
                  <div class="text-text-dark text-sm">
                    {{ recipe.cookTimeMinutes }} min
                  </div>
                </div>
              </div>

              <!-- Serves -->
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <div class="flex items-center gap-2">
                  <div class="text-brand-primary text-xs font-medium uppercase tracking-wide">Serves</div>
                  <div class="text-text-dark text-sm">
                    {{ recipe.servings ? `${recipe.servings} ${recipe.servings === 1 ? 'person' : 'people'}` : 'N/A' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Main Content: Ingredients, Directions, Notes -->
        <!-- Mobile: Stacked vertically (ingredients first, then directions, then notes) -->
        <!-- Desktop: Ingredients (left 1/4) and Directions+Notes (right 3/4) -->
        <div class="flex flex-col lg:grid lg:grid-cols-4 gap-6">
          <!-- Ingredients Card -->
          <div class="order-1 lg:col-span-1 bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <ul class="list-disc list-outside space-y-2 text-gray-700 pl-4">
              <li v-for="(ingredient, idx) in formattedIngredients" :key="idx" class="whitespace-pre-line">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <!-- Directions and Notes -->
          <div class="order-2 lg:col-span-3 space-y-6">
            <!-- Directions -->
            <div>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Directions</h2>
              <ol class="list-decimal list-outside space-y-3 text-gray-700 pl-4">
                <li v-for="(step, idx) in recipe.steps" :key="idx" class="pl-2">
                  {{ step }}
                </li>
              </ol>
            </div>

            <!-- Notes -->
            <div v-if="recipe.notes" class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">Notes</h3>
              <p class="text-gray-700 whitespace-pre-line">{{ recipe.notes }}</p>
            </div>

            <!-- Video URL -->
            <div v-if="recipe.videoUrl" class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-2">Video</h3>
              <a
                :href="recipe.videoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-primary hover:text-brand-primary-800 underline"
              >
                Watch Video
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <!-- <div class="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 flex gap-6">
          <p>
            Published by {{ recipe.approvedBy }}
          </p>
          <p>
            Credits to {{ recipe.credit }}
          </p>
        </div> -->
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
  description?: string | null
  credit?: string | null
  videoUrl?: string | null
  ingredients: Ingredient[] | string[]
  steps: string[]
  cookTimeMinutes: number
  servings?: number | null
  tags: string[]
  notes: string | null
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

// Function to convert decimal to fraction
function decimalToFraction(decimal: number): string {
  // Common fractions mapping with Unicode characters
  const commonFractions: { [key: number]: string } = {
    0.125: '⅛',
    0.25: '¼',
    0.33: '⅓',
    0.333: '⅓',
    0.375: '⅜',
    0.5: '½',
    0.66: '⅔',
    0.667: '⅔',
    0.75: '¾',
    0.875: '⅞',
  }

  // Check if it's a whole number
  if (decimal % 1 === 0) {
    return decimal.toString()
  }

  // Check for common fractions (with small tolerance for floating point)
  for (const [key, value] of Object.entries(commonFractions)) {
    if (Math.abs(decimal - parseFloat(key)) < 0.01) {
      return value
    }
  }

  // For numbers like 1.5, 2.5, etc., convert to mixed numbers
  const whole = Math.floor(decimal)
  const fractional = decimal - whole
  
  if (whole > 0 && fractional > 0) {
    // Check if fractional part matches a common fraction
    for (const [key, value] of Object.entries(commonFractions)) {
      if (Math.abs(fractional - parseFloat(key)) < 0.01) {
        return `${whole} ${value}`
      }
    }
  }

  // Fallback: return the decimal rounded to 2 places
  return decimal.toFixed(2).replace(/\.?0+$/, '')
}

// Function to format quantity with fraction conversion for specific units
function formatQuantity(quantity: number, unit: string): string {
  const fractionUnits = ['cup', 'cups', 'tbsp', 'tbsp', 'tsp', 'tsp']
  
  if (fractionUnits.includes(unit.toLowerCase())) {
    return decimalToFraction(quantity)
  }
  
  // For other units, return as is (with decimal if needed)
  if (quantity % 1 === 0) {
    return quantity.toString()
  }
  return quantity.toFixed(2).replace(/\.?0+$/, '')
}

// Units that should have no space between number and unit
const noSpaceUnits = ['g', 'kg', 'ml', 'l', 'oz']

const formattedIngredients = computed(() => {
  if (!recipe.value) return []
  
  return recipe.value.ingredients.map((ing: any) => {
    // Handle structured ingredients
    if (typeof ing === 'object' && ing.quantity !== undefined) {
      // If "to taste" is checked, show name with "(to taste)" at the end
      if (ing.toTaste) {
        let result = `${ing.name} (to taste)`
        // Add alternate ingredient if present
        if (ing.alternateIngredient) {
          result += `\n(or ${ing.alternateIngredient})`
        }
        return result
      }
      
      const formattedQty = formatQuantity(ing.quantity, ing.unit)
      const unitLower = ing.unit.toLowerCase()
      
      // Format alternate size if present
      let altSize = ''
      if (ing.detailedSize) {
        const altQty = formatQuantity(ing.detailedSize.amount, ing.detailedSize.unit)
        const altUnitLower = ing.detailedSize.unit.toLowerCase()
        const altUnitFormatted = noSpaceUnits.includes(altUnitLower) 
          ? altUnitLower 
          : ` ${altUnitLower}`
        altSize = ` (${altQty}${altUnitFormatted})`
      }
      
      // Format main quantity and unit
      let mainPart = ''
      if (unitLower === 'pcs') {
        // Don't show unit for pcs
        mainPart = formattedQty
      } else if (noSpaceUnits.includes(unitLower)) {
        // No space for g, kg, ml, l, oz
        mainPart = `${formattedQty}${unitLower}`
      } else {
        // Space for other units
        mainPart = `${formattedQty} ${ing.unit}`
      }
      
      // Combine: quantity + unit + (alt size) + name
      let result = `${mainPart}${altSize} ${ing.name}`
      
      // Add alternate ingredient if present
      if (ing.alternateIngredient) {
        result += `\n(or ${ing.alternateIngredient})`
      }
      
      return result
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

