<template>
  <div class="min-h-[calc(100vh-80px)]">
    <div class="w-full px-4 py-6 md:py-8">
      <div v-if="loading" class="text-center py-12">
        <Loader />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-error-600">{{ error }}</p>
      </div>

      <div v-else-if="recipe" class="relative mx-auto px-2 md:px-4 max-w-7xl">
        <!-- Header Section -->
        <div class="mb-4 md:mb-8">
          <!-- Category Tag -->
          <div v-if="recipe.tags.length > 0" class="mb-4">
            <span
              class="inline-block px-4 py-1.5 bg-brand-primary-100 text-brand-primary-800 text-sm font-medium rounded-full">
              {{ recipe.tags[0]?.toUpperCase() }}
            </span>
          </div>

          <!-- Title and Edit Icon -->
          <div class="flex items-center gap-3 mb-3 flex-row md:flex-wrap justify-between w-full">
            <h1 class="text-4xl md:text4xl lg:text-5xl font-bold text-ink-800 leading-tight">{{ recipe.title }}</h1>

            <!-- Edit Icon (only when logged in) -->
            <NuxtLink v-if="isLoggedIn" :to="`/admin/recipes/${recipe.id}`"
              class="text-ink-800 hover:text-brand-primary transition-colors flex-shrink-0" title="Edit Recipe">
              <IconEdit class="w-5 h-5 lg:w-6 lg:h-6" />
            </NuxtLink>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-lg text-brand-primary mb-6">
            {{ recipe.description }}
          </p>

          <div class="bg-paper-50 p-4 rounded-lg border border-brand-primary shadow-md pl-4 lg:pl-8 mr-auto w-full lg:w-fit">
            <div class="flex flex-nowrap md:flex-wrap items-start md:items-center justify-between md:justify-start gap-3 md:gap-4 lg:gap-6">
              <!-- Prep Time -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconClock class="w-5 h-5 md:w-5 md:h-5 text-ink-500 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Prep</span>
                  <span class="text-ink-800 text-md md:text-sm">{{ recipe.prepTimeMinutes != null ? `${recipe.prepTimeMinutes} min` : 'N/A' }}</span>
                </div>
              </div>

              <!-- Cook Time -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconClock class="w-5 h-5 md:w-5 md:h-5 text-ink-500 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Cook</span>
                  <span class="text-ink-800 text-md md:text-sm">{{ recipe.cookTimeMinutes }} min</span>
                </div>
              </div>

              <!-- Serves -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconServings class="w-5 h-5 md:w-5 md:h-5 text-ink-500 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Serves</span>
                  <span class="text-ink-800 text-md md:text-sm">{{ recipe.servings ? `${recipe.servings} ${recipe.servings === 1 ? 'person' : 'people'}` : 'N/A' }}</span>
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
          <div class="order-1 lg:flex-shrink-0 lg:w-80 bg-paper-50 rounded-lg border border-brand-primary shadow-md p-6">
            <h2 class="text-2xl font-semibold text-ink-900 mb-4">Ingredients</h2>

            <!-- Serving size adjuster: scale ingredient quantities -->
            <div class="mb-4">
              <div class="w-full inline-flex overflow-hidden rounded-lg border border-paper-300 bg-paper-50">
                <div
                  v-for="(opt, i) in scaleOptions"
                  :key="opt.value"
                  class="flex-1"
                >
                  <input
                    :id="`serving-size-${opt.value}-${recipe?.id ?? 'recipe'}`"
                    v-model="scaleFactor"
                    type="radio"
                    :name="`serving-size-adjuster-${recipe?.id ?? 'recipe'}`"
                    :value="opt.value"
                    class="sr-only"
                  >

                  <label
                    :for="`serving-size-${opt.value}-${recipe?.id ?? 'recipe'}`"
                    class="flex w-full items-center justify-center py-2 text-sm font-medium cursor-pointer transition-colors select-none
                          border-r border-paper-300 last:border-r-0"
                    :class="scaleFactor === opt.value
                      ? 'bg-brand-primary-50 text-brand-primary-700'
                      : 'bg-transparent text-ink-600 hover:bg-paper-100'"
                  >
                    <span>{{ opt.label }}</span>
                    <IconClose class="w-4 h-4" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Grouped by Category -->
            <div v-if="groupedIngredients.categories.length > 0 || groupedIngredients.uncategorized.length > 0"
              class="space-y-6">
              <!-- Each Category -->
              <div v-for="category in groupedIngredients.categories" :key="category.name" class="space-y-2">
                <h3 class="text-sm font-bold text-brand-primary-600 uppercase tracking-wide pb-1">
                  {{ category.name }}:
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="(ingredient, idx) in category.ingredients"
                    :key="idx"
                    class="flex items-center gap-3 text-brand-primary-600"
                  >
                    <span class="h-2.5 w-2.5 rounded-full bg-brand-primary shrink-0"></span>
                    <span class="whitespace-pre-line leading-relaxed">{{ ingredient }}</span>
                  </li>
                </ul>
              </div>

              <!-- Uncategorized -->
              <div v-if="groupedIngredients.uncategorized.length > 0" class="space-y-2">
                <h3 v-if="groupedIngredients.categories.length > 0"
                  class="text-sm font-bold text-brand-primary-600 uppercase tracking-wide pb-1">
                  Other Ingredients:
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="(ingredient, idx) in groupedIngredients.uncategorized"
                    :key="idx"
                    class="flex items-center gap-3 text-brand-primary-600"
                  >
                    <span class="h-2.5 w-2.5 rounded-full bg-brand-primary shrink-0"></span>
                    <span class="whitespace-pre-line leading-relaxed">{{ ingredient }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Fallback: No categories (backward compatibility) -->
            <ul v-else class="list-disc list-outside space-y-2 text-ink-800 pl-4">
              <li v-for="(ingredient, idx) in formattedIngredients" :key="idx" class="whitespace-pre-line">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <!-- Directions and Notes -->
          <div class="order-2 lg:flex-1 space-y-6">
            <!-- Directions -->
            <div>
              <h2 class="text-2xl font-semibold text-ink-900 mb-4">Directions</h2>

              <!-- Grouped by Category -->
              <div v-if="groupedSteps.categories.length > 0 || groupedSteps.uncategorized.length > 0" class="space-y-6">
                <!-- Each Category -->
                <div v-for="category in groupedSteps.categories" :key="category.name" class="space-y-3">
                  <h3 class="text-sm font-bold text-brand-primary-600 uppercase tracking-wide pb-1">
                    {{ category.name }}:
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-brand-primary-600 pl-8 [&_li::marker]:text-brand-primary">
                    <li v-for="(step, idx) in category.steps" :key="idx" class="pl-2">
                      <div class="space-y-2">
                        <div>{{ step.description }}</div>
                        <!-- Sub-steps -->
                        <ol v-if="step.subSteps && step.subSteps.length > 0"
                          class="list-[lower-alpha] list-outside space-y-1 text-brand-primary ml-4 mt-1">
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
                  <h3 v-if="groupedSteps.categories.length > 0"
                    class="text-sm font-bold text-brand-primary-600 uppercase tracking-wide pb-1">
                    Additional Steps:
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-brand-primary-600 pl-8 [&_li::marker]:text-brand-primary">
                    <li v-for="(step, idx) in groupedSteps.uncategorized" :key="idx" class="pl-2">
                      <div class="space-y-2">
                        <div>{{ step.description }}</div>
                        <!-- Sub-steps -->
                        <ol v-if="step.subSteps && step.subSteps.length > 0"
                          class="list-[lower-alpha] list-outside space-y-1 text-brand-primary ml-4 mt-1">
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
              <ol v-else class="list-decimal list-outside space-y-3 text-ink-800 pl-4">
                <li v-for="(step, idx) in recipe.steps" :key="idx" class="pl-2">
                  {{ step.description }}
                </li>
              </ol>
            </div>

            <!-- Notes -->
            <div v-if="recipe.notes" class=" bg-paper-50 rounded-lg">
              <h3 class="text-sm font-bold text-brand-primary-600 uppercase tracking-wide mb-2">*Notes:</h3>
              <p class="text-brand-primary-600 whitespace-pre-line pl-4">{{ recipe.notes }}</p>
            </div>

            <!-- Video URL -->
            <div v-if="recipe.videoUrl" class="flex items-center gap-2 bg-paper-50 rounded-lg">
              <a :href="recipe.videoUrl" target="_blank" rel="noopener noreferrer"
                class="text-sm font-semibold text-brand-primary hover:text-brand-primary-800 underline">
                Watch Video
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <!-- <div class="mt-6 pt-6 border-t border-paper-300 text-sm text-ink-600 flex gap-6">
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
import IconServings from '~/components/icons/IconServings.vue'
import IconClose from '~/components/icons/IconClose.vue'

const route = useRoute()
const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isLoggedIn = ref(false)
const scaleFactor = ref(1)
let loginCheckIntervalId: ReturnType<typeof setInterval>

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

const scaleOptions = [
  { value: 0.5, label: '½' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
]

function formatIngredient(ing: Ingredient, scale: number = 1): string {
  if (ing.toTaste) {
    let result = `${ing.name} (to taste)`
    if (ing.alternateIngredient) {
      result += `\n(or ${ing.alternateIngredient})`
    }
    return result
  }

  const qty = ing.quantity * scale
  const formattedQty = formatQuantity(qty, ing.unit)
  const unitLower = ing.unit.toLowerCase()

  // Format alternate size if present (also scaled)
  let altSize = ''
  if (ing.detailedSize) {
    const altQty = formatQuantity(ing.detailedSize.amount * scale, ing.detailedSize.unit)
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
  return recipe.value.ingredients.map((ing: Ingredient) => formatIngredient(ing, scaleFactor.value))
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
    const formatted = formatIngredient(ing, scaleFactor.value)
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
  loginCheckIntervalId = setInterval(checkLoginStatus, 5000)
})

onUnmounted(() => {
  clearInterval(loginCheckIntervalId)
})
</script>
