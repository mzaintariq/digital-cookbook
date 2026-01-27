<template>
  <div class="min-h-[calc(100vh-80px)]">
    <div class="w-full px-4 py-8">
      <!-- <NuxtLink to="/recipes" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to recipes
      </NuxtLink> -->

      <div v-if="loading" class="text-center py-12">
        <Loader />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="recipe" class="relative mx-auto px-4 max-w-7xl">
        <!-- Header Section -->
        <div class="mb-8">
          <!-- Category Tag -->
          <div v-if="recipe.tags.length > 0" class="mb-4">
            <span
              class="inline-block px-4 py-1.5 bg-brand-primary-100 text-brand-primary-800 text-sm font-medium rounded-full">
              {{ recipe.tags[0]?.toUpperCase() }}
            </span>
          </div>

          <!-- Title and Edit Icon -->
          <div class="flex items-center gap-3 mb-3 flex-wrap">
            <h1 class="text-3xl lg:text-5xl font-bold text-text-dark leading-tight">{{ recipe.title }}</h1>

            <!-- Edit Icon (only when logged in) -->
            <NuxtLink v-if="isLoggedIn" :to="`/admin/recipes/${recipe.id}`"
              class="p-2 text-text-dark hover:text-brand-primary transition-colors flex-shrink-0" title="Edit Recipe">
              <IconEdit class="w-5 h-5 lg:w-6 lg:h-6" />
            </NuxtLink>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-lg text-brand-primary mb-6">
            {{ recipe.description }}
          </p>

          <div class="bg-white-100 p-4 rounded-lg shadow-md pl-4 lg:pl-8 mr-auto w-full lg:w-fit">
            <div class="flex flex-wrap items-center gap-4 lg:gap-6">
              <!-- Prep Time -->
              <div class="flex items-center gap-2">
                <IconClock class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div class="flex items-center gap-2">
                  <div class="text-brand-primary text-xs font-medium uppercase tracking-wide">Prep</div>
                  <div class="text-text-dark text-sm">
                    {{ recipe.prepTimeMinutes != null ? `${recipe.prepTimeMinutes} min` : 'N/A' }}
                  </div>
                </div>
              </div>

              <!-- Cook Time -->
              <div class="flex items-center gap-2">
                <IconClock class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div class="flex items-center gap-2">
                  <div class="text-brand-primary text-xs font-medium uppercase tracking-wide">Cook</div>
                  <div class="text-text-dark text-sm">
                    {{ recipe.cookTimeMinutes }} min
                  </div>
                </div>
              </div>

              <!-- Serves -->
              <div class="flex items-center gap-2">
                <IconUsers class="w-5 h-5 text-gray-400 flex-shrink-0" />
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
        <!-- Desktop: Ingredients and steps side by side with flexbox -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Ingredients Card -->
          <div class="order-1 lg:flex-shrink-0 lg:w-64 xl:w-72 bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>

            <!-- Grouped by Category -->
            <div v-if="groupedIngredients.categories.length > 0 || groupedIngredients.uncategorized.length > 0"
              class="space-y-6">
              <!-- Each Category -->
              <div v-for="category in groupedIngredients.categories" :key="category.name" class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                  {{ category.name }}
                </h3>
                <ul class="list-disc list-outside space-y-2 text-gray-700 pl-4">
                  <li v-for="(ingredient, idx) in category.ingredients" :key="idx" class="whitespace-pre-line">
                    {{ ingredient }}
                  </li>
                </ul>
              </div>

              <!-- Uncategorized -->
              <div v-if="groupedIngredients.uncategorized.length > 0" class="space-y-2">
                <h3 v-if="groupedIngredients.categories.length > 0" class="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                  Other Ingredients
                </h3>
                <ul class="list-disc list-outside space-y-2 text-gray-700 pl-4">
                  <li v-for="(ingredient, idx) in groupedIngredients.uncategorized" :key="idx"
                    class="whitespace-pre-line">
                    {{ ingredient }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Fallback: No categories (backward compatibility) -->
            <ul v-else class="list-disc list-outside space-y-2 text-gray-700 pl-4">
              <li v-for="(ingredient, idx) in formattedIngredients" :key="idx" class="whitespace-pre-line">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <!-- Directions and Notes -->
          <div class="order-2 lg:flex-1 space-y-6">
            <!-- Directions -->
            <div>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Directions</h2>

              <!-- Grouped by Category -->
              <div v-if="groupedSteps.categories.length > 0 || groupedSteps.uncategorized.length > 0" class="space-y-6">
                <!-- Each Category -->
                <div v-for="category in groupedSteps.categories" :key="category.name" class="space-y-3">
                  <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                    {{ category.name }}
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-gray-700 pl-4">
                    <li v-for="(step, idx) in category.steps" :key="idx" class="pl-2">
                      <div class="space-y-2">
                        <div>{{ step.description }}</div>
                        <!-- Sub-steps -->
                        <ol v-if="step.subSteps && step.subSteps.length > 0"
                          class="list-[lower-alpha] list-outside space-y-1 text-gray-600 ml-4 mt-1">
                          <li v-for="(subStep, subIdx) in step.subSteps" :key="subIdx" class="pl-2">
                            {{ subStep.description }}
                          </li>
                        </ol>
                      </div>
                    </li>
                  </ol>
                </div>

                <!-- Uncategorized -->
                <div v-if="groupedSteps.uncategorized.length > 0" class="space-y-3">
                  <h3 v-if="groupedSteps.categories.length > 0" class="text-sm font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200 pb-1">
                    Additional Steps
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-gray-700 pl-4">
                    <li v-for="(step, idx) in groupedSteps.uncategorized" :key="idx" class="pl-2">
                      <div class="space-y-2">
                        <div>{{ step.description }}</div>
                        <!-- Sub-steps -->
                        <ol v-if="step.subSteps && step.subSteps.length > 0"
                          class="list-[lower-alpha] list-outside space-y-1 text-gray-600 ml-4 mt-1">
                          <li v-for="(subStep, subIdx) in step.subSteps" :key="subIdx" class="pl-2">
                            {{ subStep.description }}
                          </li>
                        </ol>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <!-- Fallback: No categories (backward compatibility) -->
              <ol v-else class="list-decimal list-outside space-y-3 text-gray-700 pl-4">
                <li v-for="(step, idx) in recipe.steps" :key="idx" class="pl-2">
                  {{ step.description }}
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
              <a :href="recipe.videoUrl" target="_blank" rel="noopener noreferrer"
                class="text-brand-primary hover:text-brand-primary-800 underline">
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

import type { Recipe, Ingredient, Step, SubStep } from '~/types/recipe'
import IconEdit from '~/components/icons/IconEdit.vue'
import IconClock from '~/components/icons/IconClock.vue'
import IconUsers from '~/components/icons/IconUsers.vue'

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

// Format a single ingredient
function formatIngredient(ing: Ingredient): string {
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

const formattedIngredients = computed(() => {
  if (!recipe.value) return []
  return recipe.value.ingredients.map((ing: Ingredient) => formatIngredient(ing))
})

// Group ingredients by category, preserving order from ingredients array
const groupedIngredients = computed(() => {
  if (!recipe.value) return { categories: [], uncategorized: [] }

  const categoriesMap: { [key: string]: { name: string; ingredients: string[] } } = {}
  const uncategorized: string[] = []
  const categoryOrder: string[] = []
  const seenCategories = new Set<string>()

  // Iterate through ingredients in order to preserve category order
  recipe.value.ingredients.forEach((ing: Ingredient) => {
    const formatted = formatIngredient(ing)
    const category = ing.category ? ing.category.trim() : null

    if (category) {
      if (!categoriesMap[category]) {
        categoriesMap[category] = { name: category, ingredients: [] }
        // Track category order by first appearance
        if (!seenCategories.has(category)) {
          categoryOrder.push(category)
          seenCategories.add(category)
        }
      }
      categoriesMap[category].ingredients.push(formatted)
    } else {
      uncategorized.push(formatted)
    }
  })

  // Build categories array in the order they first appeared
  const categories = categoryOrder.map(cat => categoriesMap[cat]).filter((cat): cat is { name: string; ingredients: string[] } => cat !== undefined)

  return { categories, uncategorized }
})

// Group steps by category, preserving order from steps array
const groupedSteps = computed(() => {
  if (!recipe.value) return { categories: [], uncategorized: [] }

  const categoriesMap: { [key: string]: { name: string; steps: Step[] } } = {}
  const uncategorized: Step[] = []
  const categoryOrder: string[] = []
  const seenCategories = new Set<string>()

  // Iterate through steps in order to preserve category order
  recipe.value.steps.forEach((step: Step) => {
    const category = step.category ? step.category.trim() : null

    if (category) {
      if (!categoriesMap[category]) {
        categoriesMap[category] = { name: category, steps: [] }
        // Track category order by first appearance
        if (!seenCategories.has(category)) {
          categoryOrder.push(category)
          seenCategories.add(category)
        }
      }
      categoriesMap[category].steps.push(step)
    } else {
      uncategorized.push(step)
    }
  })

  // Build categories array in the order they first appeared
  const categories = categoryOrder.map(cat => categoriesMap[cat]).filter((cat): cat is { name: string; steps: Step[] } => cat !== undefined)

  return { categories, uncategorized }
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
