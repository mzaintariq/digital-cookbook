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
          <!-- <div v-if="recipe.tags.length > 0" class="mb-4">
            <span
              class="inline-block px-4 py-1.5 bg-brand-primary-100 dark:bg-brand-primary-900 text-brand-primary-800 dark:text-paper-500 text-sm font-medium rounded-full">
              {{ recipe.tags[0]?.toUpperCase() }}
            </span>
          </div> -->

          <!-- Title and Edit Icon -->
          <div class="flex items-center gap-3 mb-3 flex-row md:flex-wrap justify-between w-full">
            <h1 class="text-4xl md:text4xl lg:text-5xl font-bold text-ink-800 dark:text-paper-100 leading-tight">{{ recipe.title }}</h1>

            <!-- Edit Icon (only when logged in) -->
            <NuxtLink v-if="isLoggedIn" :to="`/admin/recipes/${recipe.id}`"
              class="text-ink-800 dark:text-paper-100 hover:text-brand-primary transition-colors flex-shrink-0" title="Edit Recipe">
              <IconEdit class="w-5 h-5 lg:w-6 lg:h-6" />
            </NuxtLink>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-lg text-brand-primary mb-6">
            {{ recipe.description }}
          </p>

          <div class="bg-paper-50 dark:bg-paper-900 p-4 rounded-lg border border-brand-primary shadow-md pl-4 lg:pl-8 mr-auto w-full lg:w-fit">
            <div class="flex flex-nowrap md:flex-wrap items-start md:items-center justify-between md:justify-start gap-3 md:gap-4 lg:gap-6">
              <!-- Prep Time -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconClock class="w-5 h-5 md:w-5 md:h-5 text-ink-500 dark:text-paper-400 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Prep</span>
                  <span class="text-ink-800 dark:text-paper-100 text-md md:text-sm">{{ recipe.prepTimeMinutes != null ? `${recipe.prepTimeMinutes} min` : 'N/A' }}</span>
                </div>
              </div>

              <!-- Cook Time -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconClock class="w-5 h-5 md:w-5 md:h-5 text-ink-500 dark:text-paper-400 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Cook</span>
                  <span class="text-ink-800 dark:text-paper-100 text-md md:text-sm">{{ recipe.cookTimeMinutes }} min</span>
                </div>
              </div>

              <!-- Serves -->
              <div class="flex items-start gap-1.5 md:gap-2 flex-shrink-0">
                <IconServings class="w-5 h-5 md:w-5 md:h-5 text-ink-500 dark:text-paper-400 flex-shrink-0 mt-0.5 md:mt-0" />
                <div class="flex flex-col md:flex-row md:items-center md:gap-2 min-w-0 min-w-[72px]">
                  <span class="text-brand-primary text-xs font-medium uppercase tracking-wide">Serves</span>
                  <span class="text-ink-800 dark:text-paper-100 text-md md:text-sm">{{ servingsLabel }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Share Recipe -->
          <div class="mt-4 flex flex-wrap items-center w-full justify-between md:gap-2 md:justify-start print:hidden">
            <!-- <span class="mr-1 text-sm font-medium text-ink-600 dark:text-paper-300">Share:</span> -->
            <button type="button" @click="copyRecipeLink"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              :aria-label="linkCopied ? 'Recipe link copied' : 'Copy recipe link'">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {{ linkCopied ? 'Copied!' : 'Copy link' }}
            </button>


            <a :href="whatsAppShareUrl" target="_blank" rel="noopener noreferrer"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Share recipe on WhatsApp">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2a9.84 9.84 0 0 0-8.43 14.91L2 22l5.21-1.57A9.99 9.99 0 1 0 12.04 2Zm0 17.98a8.06 8.06 0 0 1-4.11-1.13l-.3-.18-3.09.93.95-3-.2-.31a7.84 7.84 0 1 1 6.75 3.69Zm4.42-5.87c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.19a7.31 7.31 0 0 1-1.34-1.66c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28Z" />
              </svg>
              <!-- WhatsApp -->
            </a>
            <a :href="facebookShareUrl" target="_blank" rel="noopener noreferrer"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Share recipe on Facebook">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 22v-9h3l.45-3.5H13.5V7.27c0-1.01.28-1.7 1.73-1.7h1.85V2.45a24.8 24.8 0 0 0-2.7-.14c-2.67 0-4.5 1.63-4.5 4.62V9.5h-3V13h3v9h3.62Z" />
              </svg>
              <!-- Facebook -->
            </a>
            <a :href="textMessageShareUrl"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Share recipe by text message">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                <path d="M8 10h.01M12 10h.01M16 10h.01" />
              </svg>
              <!-- Text message -->
            </a>
            <a :href="twitterShareUrl" target="_blank" rel="noopener noreferrer"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Share recipe on X">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.24 2H21l-6.03 6.9L22.06 22H16.5l-4.35-5.69L7.17 22H4.4l6.46-7.38L4.06 2h5.7l3.93 5.2L18.24 2Zm-.97 17.7h1.53L8.93 4.18H7.29L17.27 19.7Z" />
              </svg>
              <!-- X / Twitter -->
            </a>
            <!-- <a :href="emailShareUrl"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Share recipe by email">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Email
            </a> -->
            <button type="button" @click="printRecipe"
              class="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-300 px-3 py-2 text-sm text-ink-800 transition-colors hover:bg-paper-100 dark:border-paper-800 dark:text-paper-100 dark:hover:bg-paper-800"
              aria-label="Print recipe">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M6 9V2h12v7" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <!-- Print -->
            </button>
          </div>
        </div>

        <!-- Main Content: Ingredients, Directions, Notes -->
        <!-- Mobile: Stacked vertically (ingredients first, then directions, then notes) -->
        <!-- Desktop: Ingredients and steps side by side with flexbox -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Ingredients Card -->
          <div class="order-1 lg:flex-shrink-0 lg:w-80 bg-paper-50 dark:bg-paper-900 rounded-lg border border-brand-primary shadow-md p-6">
            <h2 class="text-2xl font-semibold text-ink-900 dark:text-paper-100 mb-4">Ingredients</h2>

            <!-- Serving size adjuster: scale ingredient quantities -->
            <div class="mb-4">
              <div class="w-full inline-flex overflow-hidden rounded-lg border border-paper-300 dark:border-paper-800 bg-paper-50 dark:bg-paper-900 print:w-auto">
                <div
                  v-for="(opt, i) in scaleOptions"
                  :key="opt.value"
                  class="flex-1"
                  :class="scaleFactor !== opt.value ? 'print:hidden' : ''"
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
                          border-r border-paper-300 dark:border-paper-800 last:border-r-0 print:border-r-0 print:px-4"
                    :class="scaleFactor === opt.value
                      ? 'bg-brand-primary-50 dark:bg-brand-primary-900 text-brand-primary-700 dark:text-paper-300'
                      : 'bg-transparent text-ink-600 dark:text-paper-300 hover:bg-paper-100 dark:hover:bg-paper-800'"
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
                <h3 class="text-sm font-bold text-brand-primary-600 dark:text-paper-400 uppercase tracking-wide pb-1">
                  {{ category.name }}:
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="(ingredient, idx) in category.ingredients"
                    :key="idx"
                    class="flex items-center gap-3 text-brand-primary-600 dark:text-paper-500"
                  >
                    <span class="h-2.5 w-2.5 rounded-full bg-brand-primary shrink-0"></span>
                    <span class="whitespace-pre-line leading-relaxed">{{ ingredient }}</span>
                  </li>
                </ul>
              </div>

              <!-- Uncategorized -->
              <div v-if="groupedIngredients.uncategorized.length > 0" class="space-y-2">
                <h3 v-if="groupedIngredients.categories.length > 0"
                  class="text-sm font-bold text-brand-primary-600 dark:text-paper-400 uppercase tracking-wide pb-1">
                  Other Ingredients:
                </h3>
                <ul class="space-y-2">
                  <li
                    v-for="(ingredient, idx) in groupedIngredients.uncategorized"
                    :key="idx"
                    class="flex items-center gap-3 text-brand-primary-600 dark:text-paper-500"
                  >
                    <span class="h-2.5 w-2.5 rounded-full bg-brand-primary shrink-0"></span>
                    <span class="whitespace-pre-line leading-relaxed">{{ ingredient }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Fallback: No categories (backward compatibility) -->
            <ul v-else class="list-disc list-outside space-y-2 text-ink-800 dark:text-paper-100 pl-4">
              <li v-for="(ingredient, idx) in formattedIngredients" :key="idx" class="whitespace-pre-line">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <!-- Directions and Notes -->
          <div class="order-2 lg:flex-1 space-y-6">
            <!-- Directions -->
            <div>
              <h2 class="text-2xl font-semibold text-ink-900 dark:text-paper-100 dark:text-paper-50 mb-4">Directions</h2>

              <!-- Grouped by Category -->
              <div v-if="groupedSteps.categories.length > 0 || groupedSteps.uncategorized.length > 0" class="space-y-6">
                <!-- Each Category -->
                <div v-for="category in groupedSteps.categories" :key="category.name" class="space-y-3">
                  <h3 class="text-sm font-bold text-brand-primary-600 dark:text-paper-400 uppercase tracking-wide pb-1">
                    {{ category.name }}:
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-brand-primary-600 dark:text-paper-500 pl-8 [&_li::marker]:text-brand-primary dark:[&_li::marker]:text-paper-100">
                    <li v-for="(step, idx) in category.steps" :key="idx" class="pl-2">
                      <div class="space-y-2">
                        <div>{{ step.description }}</div>
                        <!-- Sub-steps -->
                        <ol v-if="step.subSteps && step.subSteps.length > 0"
                          class="list-[lower-alpha] list-outside space-y-1 text-brand-primary dark:text-paper-500 ml-4 mt-1">
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
                    class="text-sm font-bold text-brand-primary-600 dark:text-paper-400 uppercase tracking-wide pb-1">
                    Additional Steps:
                  </h3>
                  <ol class="list-decimal list-outside space-y-3 text-brand-primary-600 dark:text-paper-500 pl-8 [&_li::marker]:text-brand-primary dark:[&_li::marker]:text-paper-100">
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
              <ol v-else class="list-decimal list-outside space-y-3 text-ink-800 dark:text-paper-100 pl-4">
                <li v-for="(step, idx) in recipe.steps" :key="idx" class="pl-2">
                  {{ step.description }}
                </li>
              </ol>
            </div>

            <!-- Notes -->
            <div v-if="recipe.notes" class=" bg-paper-100 p-4 dark:bg-paper-900 rounded-lg">
              <h3 class="text-sm font-bold text-brand-primary-600 dark:text-paper-400 uppercase tracking-wide mb-2">*Notes:</h3>
              <p class="text-brand-primary-600 dark:text-paper-500 whitespace-pre-line pl-4">{{ recipe.notes }}</p>
            </div>

            <!-- Video URL -->
            <div v-if="recipe.videoUrl" class="flex items-center gap-2 bg-paper-100 p-4 dark:bg-paper-900 rounded-lg print:hidden">
              <a :href="recipe.videoUrl" target="_blank" rel="noopener noreferrer"
                class="text-sm font-semibold text-brand-primary dark:text-paper-200 hover:text-brand-primary-800 dark:hover:text-paper-400  underline">
                Watch Video
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <!-- <div class="mt-6 pt-6 border-t border-paper-300 dark:border-paper-800 text-sm text-ink-600 dark:text-paper-300 flex gap-6">
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
const linkCopied = ref(false)
let loginCheckIntervalId: ReturnType<typeof setInterval>
let copyFeedbackTimeoutId: ReturnType<typeof setTimeout> | undefined

const recipePath = computed(() => `/recipes/${encodeURIComponent(String(route.params.slug))}`)
const recipeShareUrl = computed(() => process.client
  ? `${window.location.origin}${recipePath.value}`
  : recipePath.value
)
const shareMessage = computed(() => `Check out ${recipe.value?.title || 'this recipe'}: ${recipeShareUrl.value}`)
const whatsAppShareUrl = computed(() => `https://wa.me/?text=${encodeURIComponent(shareMessage.value)}`)
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeShareUrl.value)}`)
const textMessageShareUrl = computed(() => `sms:?body=${encodeURIComponent(shareMessage.value)}`)
const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage.value)}`)
const emailShareUrl = computed(() => {
  const subject = `Recipe: ${recipe.value?.title || 'Digital Cookbook'}`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage.value)}`
})

function printRecipe() {
  window.print()
}

async function copyRecipeLink() {
  try {
    await navigator.clipboard.writeText(recipeShareUrl.value)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = recipeShareUrl.value
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }

  linkCopied.value = true
  clearTimeout(copyFeedbackTimeoutId)
  copyFeedbackTimeoutId = setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

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

/** Base recipe servings × ingredient scale (½, 1×, 2×, 3×). */
const servingsLabel = computed(() => {
  const base = recipe.value?.servings
  if (!base) return 'N/A'
  const n = Math.round(base * scaleFactor.value * 1000) / 1000
  const countStr =
    Number.isInteger(n) || Math.abs(n - Math.round(n)) < 1e-6
      ? String(Math.round(n))
      : n.toFixed(2).replace(/\.?0+$/, '')
  const noun = Math.abs(n - 1) < 1e-6 ? 'person' : 'people'
  return `${countStr} ${noun}`
})

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
  clearTimeout(copyFeedbackTimeoutId)
})
</script>
