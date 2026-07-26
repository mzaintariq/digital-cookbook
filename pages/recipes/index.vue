<template>
  <div>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-ink-900 dark:text-paper-50 mb-2 md:mb-8">Recipes</h1>
      <!-- badeen-display-regular -->
      <!-- zaika | ذائقہ -->

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="w-5 h-5 text-ink-500 dark:text-paper-400" />
          </div>
          <input v-model="searchTerm" type="text" placeholder="Search recipes"
            class="block w-full pl-10 pr-3 py-2 border border-paper-400 dark:border-paper-700 rounded-lg leading-5 bg-paper-50 dark:bg-paper-900 placeholder-ink-600 dark:placeholder-paper-400 focus:outline-none focus:placeholder-ink-500 dark:focus:placeholder-paper-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
        </div>

        <div v-if="categoryOptions.length > 0" class="mt-4 max-w-full overflow-x-auto pb-2 -mb-2">
          <div class="flex w-max min-w-full gap-2" role="group" aria-label="Filter recipes by category">
            <button
              type="button"
              :aria-pressed="selectedCategory === null"
              :class="categoryButtonClasses(selectedCategory === null)"
              @click="selectCategory(null)"
            >
              <span v-if="selectedCategory === null" aria-hidden="true">✓</span>
              All
            </button>
            <button
              v-for="category in categoryOptions"
              :key="category.key"
              type="button"
              :aria-pressed="selectedCategory === category.key"
              :class="categoryButtonClasses(selectedCategory === category.key)"
              @click="selectCategory(category.key)"
            >
              <span v-if="selectedCategory === category.key" aria-hidden="true">✓</span>
              {{ category.label }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-error-600">{{ error }}</p>
      </div>

      <div v-else-if="recipes.length === 0" class="text-center py-12">
        <p class="text-ink-700 dark:text-paper-200">No recipes available yet.</p>
      </div>

      <div v-else-if="filteredRecipes.length === 0" class="text-center py-12">
        <p class="text-ink-700 dark:text-paper-200 mb-4">No recipes match your current search and category filters.</p>
        <button
          type="button"
          class="min-h-11 px-4 py-2 rounded-md border border-paper-400 dark:border-paper-700 text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-paper-50 dark:focus-visible:ring-offset-paper-950"
          @click="resetFilters"
        >
          Clear filters
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="recipe in filteredRecipes" :key="recipe.id"
          class="bg-paper-50 dark:bg-paper-900 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden relative">
          <NuxtLink :to="`/recipes/${recipe.slug}`" class="block">
            <div v-if="recipe.thumbnailUrl" class="aspect-[4/3] w-full bg-paper-200 dark:bg-paper-800">
              <img
                :src="recipe.thumbnailUrl"
                :alt="recipe.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-bold text-ink-900 dark:text-paper-50">{{ recipe.title }}</h2>
              <!-- Edit Icon (only when logged in) -->
              <NuxtLink v-if="isLoggedIn" :to="`/admin/recipes/${recipe.id}`" @click.stop
                class="text-ink-500 dark:text-paper-400 hover:text-brand-primary transition-colors"
                title="Edit Recipe">
                <IconEdit class="w-5 h-5" />
              </NuxtLink>
            </div>
            <h3 class="text-sm font-normal text-ink-600 dark:text-paper-300 mb-2">{{ recipe?.description }}</h3>

            <div class="flex flex-wrap items-center gap-4 text-sm text-ink-700 dark:text-paper-200 mb-3">
              <div class="flex items-center gap-2">
                <IconClock class="w-4 h-4 text-ink-500 dark:text-paper-400 flex-shrink-0" />
                <span>{{ totalTime(recipe) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <IconPlus class="w-4 h-4 text-ink-500 dark:text-paper-400 flex-shrink-0" />
                <span>{{ recipe.ingredients.length }} {{ recipe.ingredients.length === 1 ? 'ingredient' : 'ingredients' }}</span>
              </div>
              <div v-if="recipe.servings != null" class="flex items-center gap-2">
                <IconServings class="w-4 h-4 text-ink-500 dark:text-paper-400 flex-shrink-0" />
                <span>Serves: {{ recipe.servings }}</span>
              </div>
            </div>

            <div v-if="recipe.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span v-for="tag in recipe.tags" :key="tag" class="px-2 py-1 bg-paper-100 dark:bg-paper-800 text-ink-800 dark:text-paper-100 text-xs rounded">
                {{ tag }}
              </span>
            </div>
            </div>
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
import IconClock from '~/components/icons/IconClock.vue'
import IconPlus from '~/components/icons/IconPlus.vue'
import IconServings from '~/components/icons/IconServings.vue'

interface CategoryOption {
  key: string
  label: string
}

const route = useRoute()
const router = useRouter()
const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const isLoggedIn = ref(false)
const searchTerm = ref('')
const selectedCategory = ref<string | null>(null)

function normalizeTag(tag: string): string {
  return tag.trim().toLocaleLowerCase()
}

const categoryOptions = computed<CategoryOption[]>(() => {
  const categories = new Map<string, string>()

  recipes.value.forEach((recipe) => {
    recipe.tags.forEach((tag) => {
      const label = tag.trim()
      const key = normalizeTag(tag)

      if (key && !categories.has(key)) {
        categories.set(key, label)
      }
    })
  })

  return [...categories.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))
})

function categoryButtonClasses(isSelected: boolean): string[] {
  return [
    'min-h-11 shrink-0 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
    'focus-visible:ring-offset-paper-50 dark:focus-visible:ring-offset-paper-950',
    isSelected
      ? 'border-brand-primary bg-brand-primary text-paper-50'
      : 'border-paper-400 dark:border-paper-700 bg-paper-50 dark:bg-paper-900 text-ink-800 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800',
  ]
}

async function updateCategoryQuery(category: string | null, replace = false) {
  const query = { ...route.query }

  if (category) {
    query.category = category
  } else {
    delete query.category
  }

  const navigation = { query }
  await (replace ? router.replace(navigation) : router.push(navigation))
}

function selectCategory(category: string | null) {
  if (selectedCategory.value === category) return

  selectedCategory.value = category
  void updateCategoryQuery(category)
}

function resetFilters() {
  searchTerm.value = ''
  selectCategory(null)
}

watch(
  [() => route.query.category, categoryOptions, loading],
  ([queryCategory, categories, isLoading]) => {
    if (isLoading) return

    const rawCategory = Array.isArray(queryCategory) ? queryCategory[0] : queryCategory
    if (typeof rawCategory !== 'string' || !rawCategory.trim()) {
      selectedCategory.value = null
      return
    }

    const normalizedCategory = normalizeTag(rawCategory)
    const isAvailable = categories.some((category) => category.key === normalizedCategory)

    selectedCategory.value = isAvailable ? normalizedCategory : null
    if (!isAvailable) {
      void updateCategoryQuery(null, true)
    }
  },
  { immediate: true }
)

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

// Apply the selected category and the existing text search together.
const filteredRecipes = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  return recipes.value.filter((recipe) => {
    const categoryMatch = selectedCategory.value === null
      || recipe.tags.some((tag) => normalizeTag(tag) === selectedCategory.value)

    if (!categoryMatch) return false
    if (!term) return true

    const titleMatch = recipe.title.toLowerCase().includes(term)
    const descriptionMatch = recipe.description?.toLowerCase().includes(term) ?? false
    const tagsMatch = recipe.tags.some(tag => tag.toLowerCase().includes(term))

    return titleMatch || descriptionMatch || tagsMatch
  })
})

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
  loginCheckIntervalId = setInterval(checkLoginStatus, 5000)
})

onUnmounted(() => {
  clearInterval(loginCheckIntervalId)
})
</script>
