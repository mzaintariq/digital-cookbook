<template>
  <div class="min-h-screen bg-gray-50">
    <!-- <div class="container mx-auto px-4 py-8 max-w-7xl"> -->
    <div class="container mx-auto px-4 py-8 w-full">
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-600 text-sm">{{ error }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading recipe...</p>
      </div>

      <form ref="recipeFormRef" v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Column: Recipe General Information -->
          <div class="lg:col-span-1 space-y-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">RECIPE GENERAL INFORMATION</h2>

            <!-- Photo Upload Placeholder -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <svg class="mx-auto h-12 w-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-blue-500 font-medium mb-1">Upload Photo</p>
                <p class="text-sm text-gray-500">PNG or JPEG (max. 10MB)</p>
                <p class="text-xs text-gray-400 mt-2">Coming soon</p>
              </div>
            </div>

            <!-- Recipe Name -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Recipe name *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="eg: Savory Stuffed Bell Peppers"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Slug (only show in edit mode) -->
            <div v-if="isEditMode">
              <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
                Slug * (unique, lowercase, hyphens)
              </label>
              <input
                id="slug"
                v-model="form.slug"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Number of Servings -->
            <div>
              <label for="servings" class="block text-sm font-medium text-gray-700 mb-1">
                Number of serving
              </label>
              <div class="relative">
                <input
                  id="servings"
                  v-model.number="form.servings"
                  type="number"
                  min="1"
                  placeholder="eg: 4 or 3-5"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">person</span>
                </div>
              </div>
            </div>

            <!-- Cook Duration -->
            <div>
              <label for="cookTimeMinutes" class="block text-sm font-medium text-gray-700 mb-1">
                Cook duration *
              </label>
              <div class="relative">
                <input
                  id="cookTimeMinutes"
                  v-model.number="form.cookTimeMinutes"
                  type="number"
                  required
                  min="0"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Rating -->
            <div>
              <label for="rating" class="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5) *
              </label>
              <input
                id="rating"
                v-model.number="form.rating"
                type="number"
                required
                min="1"
                max="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                v-model="form.tags"
                type="text"
                placeholder="pakistani, curry, spicy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Set Recipe As (Publish/Draft) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">Published</span>
                <button
                  type="button"
                  @click="form.published = !form.published"
                  :class="[
                    'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    form.published ? 'bg-blue-500' : 'bg-gray-300'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                      form.published ? 'translate-x-3.5' : 'translate-x-0.5'
                    ]"
                  />
                </button>
                <span class="text-xs text-gray-500">{{ form.published ? 'Visible to everyone' : 'Saved as draft' }}</span>
              </div>
            </div>

            <!-- Recipe Description -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Recipe description
              </label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="4"
                placeholder="Describe your recipe..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Right Column: Recipe Detail -->
          <div class="lg:col-span-3 space-y-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">RECIPE DETAIL</h2>

            <!-- Ingredients Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Ingredients</label>
              <draggable
                v-model="form.ingredients"
                item-key="id"
                handle=".drag-handle"
                :animation="200"
                :force-fallback="true"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
                class="space-y-3"
              >
                <template #item="{ element: ingredient, index }">
                  <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="5" r="1.5"/>
                        <circle cx="16" cy="5" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/>
                        <circle cx="16" cy="12" r="1.5"/>
                        <circle cx="9" cy="19" r="1.5"/>
                        <circle cx="16" cy="19" r="1.5"/>
                      </svg>
                    </div>
                    <div class="flex-1 grid grid-cols-12 gap-2">
                      <!-- Quantity with unit inside -->
                      <div class="col-span-3 relative">
                        <input
                          v-model.number="ingredient.quantity"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="4"
                          class="w-full px-2 py-1.5 pr-24 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div class="absolute inset-y-0 right-0 w-20 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                          <span class="text-sm text-gray-700 mr-1">{{ ingredient.unit }}</span>
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <select
                          v-model="ingredient.unit"
                          class="absolute inset-y-0 right-0 w-20 opacity-0 cursor-pointer"
                        >
                          <option value="pcs">pcs</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="oz">oz</option>
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="lb">lb</option>
                          <option value="pinch">pinch</option>
                          <option value="clove">clove</option>
                        </select>
                      </div>
                      <!-- Alternate size with unit inside -->
                      <div v-if="ingredient.detailedSize" class="col-span-3 relative">
                        <input
                          v-model.number="ingredient.detailedSize.amount"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="15"
                          class="w-full px-2 py-1.5 pr-24 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <div class="absolute inset-y-0 right-0 w-20 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                          <span class="text-sm text-gray-700 mr-1">{{ ingredient.detailedSize.unit }}</span>
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <select
                          v-model="ingredient.detailedSize.unit"
                          class="absolute inset-y-0 right-0 w-20 opacity-0 cursor-pointer"
                        >
                          <option value="oz">oz</option>
                          <option value="grams">grams</option>
                        </select>
                      </div>
                      <input
                        v-model="ingredient.name"
                        type="text"
                        placeholder="eg: Large bell peppers (any color)"
                        :class="[
                          'px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500',
                          ingredient.detailedSize ? 'col-span-6' : 'col-span-9'
                        ]"
                      />
                      <div class="col-span-12 flex items-center gap-2 mt-1">
                        <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                          <span class="mr-2">Alternate size</span>
                          <button
                            type="button"
                            @click="ingredient.detailedSize = ingredient.detailedSize ? null : { amount: 0, unit: 'oz' }"
                            :class="[
                              'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                              ingredient.detailedSize ? 'bg-blue-500' : 'bg-gray-300'
                            ]"
                          >
                            <span
                              :class="[
                                'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                ingredient.detailedSize ? 'translate-x-3.5' : 'translate-x-0.5'
                              ]"
                            />
                          </button>
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeIngredient(index)"
                      class="pt-2 text-red-500 hover:text-red-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </template>
              </draggable>
              <button
                type="button"
                @click="addIngredient"
                class="mt-3 flex w-full justify-center items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add ingredients
              </button>
            </div>

            <!-- Directions Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Directions</label>
              <draggable
                v-model="form.steps"
                item-key="id"
                handle=".drag-handle"
                :animation="200"
                :force-fallback="true"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
                class="space-y-3"
              >
                <template #item="{ element: step, index }">
                  <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="9" cy="5" r="1.5"/>
                        <circle cx="16" cy="5" r="1.5"/>
                        <circle cx="9" cy="12" r="1.5"/>
                        <circle cx="16" cy="12" r="1.5"/>
                        <circle cx="9" cy="19" r="1.5"/>
                        <circle cx="16" cy="19" r="1.5"/>
                      </svg>
                    </div>
                    <div class="flex gap-2 w-full">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-medium text-gray-700">{{ String(index + 1).padStart(2, '0') }}</span>
                      </div>
                      <textarea
                        v-model="step.description"
                        rows="2"
                        placeholder="eg: Preheat your oven to 375°F (190°C)..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      @click="removeStep(index)"
                      class="pt-2 text-red-500 hover:text-red-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </template>
              </draggable>
              <button
                type="button"
                @click="addStep"
                class="mt-3 flex w-full justify-center items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add directions
              </button>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-red-600 text-sm">{{ error }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

import draggable from 'vuedraggable'

interface Ingredient {
  id: string
  quantity: number
  unit: string
  name: string
  detailedSize?: {
    amount: number
    unit: string
  } | null
}

interface Step {
  id: string
  description: string
}

const route = useRoute()
const recipeId = route.params.id as string
const isEditMode = recipeId !== 'new'

const form = reactive({
  title: '',
  slug: '',
  servings: null as number | null,
  cookTimeMinutes: 0,
  tags: '',
  notes: '',
  rating: 3,
  published: false,
  ingredients: [] as Ingredient[],
  steps: [] as Step[],
})

const loading = ref(isEditMode)
const saving = ref(false)
const error = ref<string | null>(null)
const recipeFormRef = ref<HTMLFormElement | null>(null)

// Watch form.title and dispatch event to header
watch(() => form.title, (newTitle) => {
  if (process.client) {
    window.dispatchEvent(new CustomEvent('recipe-title-update', { 
      detail: { title: newTitle || null } 
    }))
  }
}, { immediate: true })

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function addIngredient() {
  form.ingredients.push({
    id: generateId(),
    quantity: 1,
    unit: 'pcs',
    name: '',
    detailedSize: null,
  })
}

function removeIngredient(index: number) {
  form.ingredients.splice(index, 1)
}

function addStep() {
  form.steps.push({
    id: generateId(),
    description: '',
  })
}

function removeStep(index: number) {
  form.steps.splice(index, 1)
}

// Listen for save event from header
onMounted(async () => {
  const handleHeaderSave = () => {
    if (recipeFormRef.value) {
      recipeFormRef.value.requestSubmit()
    }
  }
  
  window.addEventListener('recipe-form-submit', handleHeaderSave)
  
  // Update saving state for header
  watch(saving, (newValue) => {
    if (process.client) {
      window.dispatchEvent(new CustomEvent('recipe-form-saving', { detail: { saving: newValue } }))
    }
  }, { immediate: true })
  
  // Load recipe if editing, or add defaults for new recipe
  if (isEditMode) {
    await loadRecipe()
  } else {
    // New recipe - add default blank ingredient and step
    form.ingredients.push({
      id: generateId(),
      quantity: 1,
      unit: 'pcs',
      name: '',
      detailedSize: null,
    })
    form.steps.push({
      id: generateId(),
      description: '',
    })
  }
})

async function loadRecipe() {
  if (!isEditMode) return
  
  try {
    const recipes = await $fetch('/api/admin/recipes')
    const recipe = recipes.find((r: any) => r.id === recipeId)
    
    if (!recipe) {
      error.value = 'Recipe not found'
      return
    }

    form.title = recipe.title
    form.slug = recipe.slug
    form.servings = recipe.servings || null
    form.cookTimeMinutes = recipe.cookTimeMinutes
    form.tags = recipe.tags.join(', ')
    form.notes = recipe.notes || ''
    form.rating = recipe.rating
    form.published = recipe.status === 'publish'

    // Convert ingredients from JSON to structured format
    if (Array.isArray(recipe.ingredients)) {
      form.ingredients = recipe.ingredients.map((ing: any) => ({
        id: generateId(),
        quantity: ing.quantity || 1,
        unit: ing.unit || 'pcs',
        name: ing.name || '',
        detailedSize: ing.detailedSize || null,
      }))
    } else {
      form.ingredients = []
    }

    // Convert steps from string array to structured format
    if (Array.isArray(recipe.steps)) {
      form.steps = recipe.steps.map((step: string) => ({
        id: generateId(),
        description: step,
      }))
    } else {
      form.steps = []
    }
  } catch (err: any) {
    if (err.statusCode === 401) {
      await navigateTo('/admin/login')
    } else {
      error.value = 'Failed to load recipe'
    }
  } finally {
    loading.value = false
  }
}


async function handleSubmit() {
  try {
    saving.value = true
    error.value = null

    // Auto-generate slug from title if creating new recipe
    if (!isEditMode && !form.slug && form.title) {
      form.slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Convert form data to API format
    const submitData = {
      ...form,
      ingredients: form.ingredients.map(ing => ({
        quantity: ing.quantity,
        unit: ing.unit,
        name: ing.name,
        ...(ing.detailedSize && { detailedSize: ing.detailedSize }),
      })),
      steps: form.steps.map(step => step.description),
      tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
    }

    if (isEditMode) {
      await $fetch(`/api/admin/recipes/${recipeId}`, {
        method: 'PUT',
        body: submitData,
      })
    } else {
      await $fetch('/api/recipes', {
        method: 'POST',
        body: submitData,
      })
    }

    // Dispatch success notification
    if (process.client) {
      window.dispatchEvent(new CustomEvent('recipe-saved', {
        detail: { message: isEditMode ? 'Recipe updated successfully!' : 'Recipe created successfully!' }
      }))
      
      // Small delay to show notification before navigation
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    await navigateTo('/admin/recipes')
  } catch (err: any) {
    error.value = err.data?.statusMessage || (isEditMode ? 'Failed to update recipe' : 'Failed to create recipe')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Drag and drop styling */
:deep(.sortable-ghost) {
  opacity: 0.4;
  background: #e5e7eb;
}

:deep(.sortable-chosen) {
  opacity: 0.8;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.sortable-drag) {
  opacity: 0.8;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: grabbing;
}
</style>

