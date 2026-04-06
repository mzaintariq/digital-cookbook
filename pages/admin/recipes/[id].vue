<template>
  <div class="min-h-screen bg-paper-50">
    <!-- <div class="container mx-auto px-4 py-8 max-w-7xl"> -->
    <div class="container mx-auto px-4 py-8 w-full">
      <div v-if="error" class="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
        <p class="text-error-600 text-sm">{{ error }}</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <Loader />
      </div>

      <form ref="recipeFormRef" v-else @submit.prevent="handleSubmit" novalidate>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Column: Recipe General Information -->
          <div class="lg:col-span-1 space-y-6">
            <h2 class="text-l font-semibold text-ink-900 mb-4">RECIPE GENERAL INFORMATION</h2>

            <!-- Recipe images (max 5, one thumbnail) -->
            <div>
              <label class="block text-sm font-medium text-ink-800 mb-2">Recipe images</label>
              <p class="text-xs text-ink-600 mb-2">
                Up to 5 images. Choose one thumbnail for the recipe list. JPEG, PNG, or WebP, max 10MB each.
              </p>
              <p v-if="!isEditMode" class="text-sm text-ink-700 mb-3 rounded-md bg-paper-100 px-3 py-2">
                Save the recipe once. You will return to this page to upload images.
              </p>
              <p v-if="imageUploadError" class="text-sm text-error-600 mb-2">{{ imageUploadError }}</p>

              <draggable
                v-if="form.images.length > 0"
                :model-value="form.images"
                item-key="storagePath"
                handle=".recipe-image-drag-handle"
                :animation="200"
                :force-fallback="true"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
                class="space-y-2 mb-3"
                @update:model-value="reorderRecipeFormImages"
              >
                <template #item="{ element: img, index }">
                  <div class="flex items-center gap-2 sm:gap-3 p-2 border border-paper-300 rounded-lg bg-paper-50">
                    <div class="recipe-image-drag-handle cursor-move pt-1 text-ink-500 hover:text-ink-700 shrink-0">
                      <IconDragHandle class="w-5 h-5" />
                    </div>
                    <img
                      :src="img.url"
                      alt=""
                      class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                    />
                    <label class="flex items-center gap-2 text-sm text-ink-800 shrink-0 cursor-pointer">
                      <input
                        type="radio"
                        name="recipe-thumbnail"
                        class="text-brand-primary focus:ring-brand-primary"
                        :checked="img.isThumbnail"
                        @change="setRecipeFormThumbnail(index)"
                      />
                      <span>Thumbnail</span>
                    </label>
                    <button
                      type="button"
                      class="ml-auto text-error-500 hover:text-error-700 p-1 shrink-0"
                      title="Remove image"
                      @click="removeRecipeFormImage(index)"
                    >
                      <IconTrash class="w-5 h-5" />
                    </button>
                  </div>
                </template>
              </draggable>

              <input
                ref="recipeImageFileInputRef"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="sr-only"
                @change="onRecipeImageFileSelected"
              />
              <Button
                type="button"
                variant="dashed"
                size="sm"
                class="w-full flex justify-center items-center gap-2"
                :disabled="!isEditMode || form.images.length >= 5 || imageUploading"
                @click="recipeImageFileInputRef?.click()"
              >
                <IconPlus class="w-4 h-4" />
                {{ imageUploading ? 'Uploading…' : 'Add image' }}
              </Button>
            </div>

            <!-- Recipe Name -->
            <div>
              <label for="title" class="flex items-center gap-1 text-sm font-medium text-ink-800 mb-1">
                Recipe name <span class="text-ink-600 text-xs font-normal">(required)</span>
              </label>
              <input id="title" v-model="form.title" type="text" required placeholder="eg: Savory Stuffed Bell Peppers"
                :class="getInputClasses('title')" @input="delete fieldErrors.title" />
              <p v-if="fieldErrors.title" class="mt-1 text-sm text-error-600">{{ fieldErrors.title }}</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-ink-800 mb-1">
                Description
              </label>
              <textarea id="description" v-model="form.description" rows="3"
                placeholder="Brief description of the recipe..." :class="getTextareaClasses('description')"
                @input="delete fieldErrors.description" />
              <p v-if="fieldErrors.description" class="mt-1 text-sm text-error-600">{{ fieldErrors.description }}</p>
            </div>

            <!-- Slug -->
            <div>
              <label for="slug" class="flex items-center gap-1 text-sm font-medium text-ink-800 mb-1">
                Slug <span class="text-ink-600 text-xs font-normal">(required)</span>
              </label>
              <input id="slug" v-model="form.slug" type="text" required placeholder="eg: savory-stuffed-bell-peppers"
                @input="slugManuallyChanged = true; delete fieldErrors.slug" :class="getInputClasses('slug')" />
              <p v-if="fieldErrors.slug" class="mt-1 text-sm text-error-600">{{ fieldErrors.slug }}</p>
            </div>

            <!-- Set Recipe As (Publish/Draft) -->
            <div>
              <label class="block text-sm font-medium text-ink-800 mb-2">Status</label>
              <div class="flex items-center gap-3">
                <span class="text-sm text-ink-700">Published</span>
                <button type="button" @click="form.published = !form.published" :class="[
                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                  form.published ? 'bg-brand-primary' : 'bg-paper-300'
                ]">
                  <span :class="[
                    'inline-block h-3 w-3 transform rounded-full bg-paper-50 transition-transform',
                    form.published ? 'translate-x-3.5' : 'translate-x-0.5'
                  ]" />
                </button>
                <span class="text-xs text-ink-600">{{ form.published ? 'Visible to everyone' : 'Saved as draft'
                }}</span>
              </div>
            </div>

            <!-- Number of Servings -->
            <div>
              <label for="servings" class="block text-sm font-medium text-ink-800 mb-1">
                Number of serving
              </label>
              <div class="relative">
                <input id="servings" v-model.number="form.servings" type="number" min="1" placeholder="eg: 4 or 5"
                  class="w-full px-3 py-2 pr-20 border border-paper-400 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-ink-800 text-sm">person</span>
                </div>
              </div>
            </div>

            <!-- Cook Time -->
            <div>
              <label for="cookTimeMinutes" class="block text-sm font-medium text-ink-800 mb-1">
                Cook duration
              </label>
              <div class="relative">
                <input id="cookTimeMinutes" v-model.number="form.cookTimeMinutes" type="number" required min="0"
                  :class="getInputClasses('cookTimeMinutes') + ' pr-20'" @input="delete fieldErrors.cookTimeMinutes" />
                <p v-if="fieldErrors.cookTimeMinutes" class="mt-1 text-sm text-error-600">{{ fieldErrors.cookTimeMinutes
                  }}</p>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-ink-800 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Prep Time -->
            <div>
              <label for="prepTimeMinutes" class="block text-sm font-medium text-ink-800 mb-1">
                Prep duration
              </label>
              <div class="relative">
                <input id="prepTimeMinutes" v-model.number="form.prepTimeMinutes" type="number" min="0"
                  class="w-full px-3 py-2 pr-20 border border-paper-400 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-ink-800 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Rest Time -->
            <div>
              <label for="restTimeMinutes" class="block text-sm font-medium text-ink-800 mb-1">
                Rest duration
              </label>
              <div class="relative">
                <input id="restTimeMinutes" v-model.number="form.restTimeMinutes" type="number" min="0"
                  class="w-full px-3 py-2 pr-20 border border-paper-400 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-ink-800 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <TagInput v-model="form.tags" label="Tags" placeholder="Type and press Enter to add tags"
              :error-message="fieldErrors.tags" input-id="tags"
              @update:model-value="form.tags = $event; delete fieldErrors.tags" />

            <!-- Credit -->
            <div>
              <label for="credit" class="block text-sm font-medium text-ink-800 mb-1">
                Credit
              </label>
              <input id="credit" v-model="form.credit" type="text" placeholder="eg: Recipe by Zain"
                :class="getInputClasses('credit')" @input="delete fieldErrors.credit" />
              <p v-if="fieldErrors.credit" class="mt-1 text-sm text-error-600">{{ fieldErrors.credit }}</p>
            </div>

            <!-- Video URL -->
            <div>
              <label for="videoUrl" class="block text-sm font-medium text-ink-800 mb-1">
                Video URL
              </label>
              <input id="videoUrl" v-model="form.videoUrl" type="url"
                placeholder="eg: https://www.youtube.com/watch?v=..." :class="getInputClasses('videoUrl')"
                @input="delete fieldErrors.videoUrl" />
              <p v-if="fieldErrors.videoUrl" class="mt-1 text-sm text-error-600">{{ fieldErrors.videoUrl }}</p>
            </div>
          </div>

          <!-- Right Column: Recipe Detail -->
          <div class="lg:col-span-3 space-y-6 min-w-0">
            <h2 class="text-l font-semibold text-ink-900 mb-4">RECIPE DETAIL</h2>

            <!-- Ingredients Section -->
            <div>
              <div class="flex items-center justify-between mb-3" :class="{ 'max-md:justify-end': showAddCategory }">
                <label class="block text-sm font-medium text-ink-800" :class="{ 'max-md:hidden': showAddCategory }">Ingredients</label>
                <AddCategoryInput :show-input="showAddCategory" :value="newCategoryName" @show="showAddCategory = true"
                  @update:value="newCategoryName = $event" @add="addCategory"
                  @cancel="showAddCategory = false; newCategoryName = ''" />
              </div>

              <!-- Category Sections -->
              <draggable v-if="categories.length > 0" :model-value="categories"
                @update:model-value="updateCategoryOrder" item-key="category" handle=".category-drag-handle"
                :animation="200" :force-fallback="true" ghost-class="sortable-ghost" chosen-class="sortable-chosen"
                drag-class="sortable-drag" class="space-y-4">
                <template #item="{ element: category }">
                  <div :ref="el => { if (el) ingredientCategoryRefs[category] = el as HTMLElement }" :class="[
                    'border rounded-lg p-4 transition-[background-color,border-color] duration-500',
                    highlightedIngredientCategory === category
                      ? 'border-brand-primary bg-brand-primary-50 shadow-md'
                      : 'border-paper-400 bg-paper-50'
                  ]">
                    <CategoryHeader :category="category" :is-editing="editingCategory === category"
                      :edit-value="newCategoryName" drag-handle-class="category-drag-handle"
                      @edit="startEditCategory(category)" @update:edit-value="newCategoryName = $event"
                      @save="saveCategoryEdit(category)" @cancel="cancelCategoryEdit"
                      @delete="deleteCategory(category)" />

                    <!-- Ingredients in this category -->
                    <draggable :model-value="ingredientsByCategory.grouped[category] || []" @update:model-value="(newList: Ingredient[]) => {
                      // Update category for all ingredients in this list
                      newList.forEach((ing: Ingredient) => {
                        ing.category = category
                      })
                      // Rebuild ingredients array while preserving category order
                      // Use newList for this category to preserve the new order
                      const currentCategoryOrder: string[] = categories
                      const ingredientsByCat: { [key: string]: Ingredient[] } = {}
                      const uncategorized: Ingredient[] = []

                      // Get ingredients from other categories
                      form.ingredients.forEach(ing => {
                        const ingCat = ing.category && ing.category.trim()
                        if (ingCat && ingCat !== category) {
                          if (!ingredientsByCat[ingCat]) {
                            ingredientsByCat[ingCat] = []
                          }
                          ingredientsByCat[ingCat].push(ing)
                        } else if (!ingCat) {
                          uncategorized.push(ing)
                        }
                      })

                      // Use newList for the current category (preserves the new order)
                      ingredientsByCat[category] = newList

                      // Rebuild ingredients array in current category order
                      const reordered: Ingredient[] = []
                      currentCategoryOrder.forEach((cat: string) => {
                        if (ingredientsByCat[cat]) {
                          reordered.push(...ingredientsByCat[cat])
                        }
                      })
                      // Add uncategorized at the end
                      reordered.push(...uncategorized)

                      form.ingredients = reordered
                    }" item-key="id" handle=".drag-handle" :animation="200" :force-fallback="true"
                      ghost-class="sortable-ghost" chosen-class="sortable-chosen" drag-class="sortable-drag"
                      group="ingredients" class="space-y-2">
                      <template #item="{ element: ingredient }">
                        <div class="flex items-start gap-2 p-3 border border-paper-300 rounded-lg bg-paper-50">
                          <div class="drag-handle cursor-move pt-2 text-ink-500 hover:text-ink-700 flex-shrink-0">
                            <IconDragHandle class="w-5 h-5" />
                          </div>
                          <IngredientInput :ingredient="ingredient" @to-taste-change="handleToTasteChange" />
                          <button type="button"
                            @click="removeIngredient(form.ingredients.findIndex(i => i.id === ingredient.id))"
                            class="pt-2 text-error-500 hover:text-error-700 flex-shrink-0">
                            <IconTrash class="w-5 h-5" />
                          </button>
                        </div>
                      </template>
                    </draggable>

                    <Button type="button" @click="addIngredient(category)" variant="dashed" size="sm"
                      class="mt-2 w-full flex justify-center items-center gap-2">
                      <IconPlus class="w-4 h-4" />
                      Add ingredient
                    </Button>
                  </div>
                </template>
              </draggable>

              <!-- Uncategorized Section (no box/title) -->
              <div class="mt-4 space-y-3">
                <draggable v-if="ingredientsByCategory.uncategorized.length > 0"
                  :model-value="ingredientsByCategory.uncategorized" @update:model-value="(newList: Ingredient[]) => {
                    // Remove category from all ingredients in this list
                    newList.forEach((ing: Ingredient) => {
                      ing.category = null
                    })
                    // Rebuild ingredients array while preserving category order
                    // Use newList for uncategorized to preserve the new order
                    const currentCategoryOrder: string[] = categories
                    const ingredientsByCat: { [key: string]: Ingredient[] } = {}

                    // Get ingredients from all categories
                    form.ingredients.forEach(ing => {
                      const ingCat = ing.category && ing.category.trim()
                      if (ingCat) {
                        if (!ingredientsByCat[ingCat]) {
                          ingredientsByCat[ingCat] = []
                        }
                        ingredientsByCat[ingCat].push(ing)
                      }
                    })

                    // Rebuild ingredients array in current category order
                    const reordered: Ingredient[] = []
                    currentCategoryOrder.forEach((cat: string) => {
                      if (ingredientsByCat[cat]) {
                        reordered.push(...ingredientsByCat[cat])
                      }
                    })
                    // Add uncategorized at the end (use newList to preserve order)
                    reordered.push(...newList)

                    form.ingredients = reordered
                  }" item-key="id" handle=".drag-handle" :animation="200" :force-fallback="true"
                  ghost-class="sortable-ghost" chosen-class="sortable-chosen" drag-class="sortable-drag"
                  group="ingredients" class="space-y-3">
                  <template #item="{ element: ingredient }">
                    <div class="flex items-start gap-2 p-3 border border-paper-300 rounded-lg bg-paper-50">
                      <div class="drag-handle cursor-move pt-2 text-ink-500 hover:text-ink-700 flex-shrink-0">
                        <IconDragHandle class="w-5 h-5" />
                      </div>
                      <IngredientInput :ingredient="ingredient" @to-taste-change="handleToTasteChange" />
                      <button type="button"
                        @click="removeIngredient(form.ingredients.findIndex(i => i.id === ingredient.id))"
                        class="pt-2 text-error-500 hover:text-error-700 flex-shrink-0">
                        <IconTrash class="w-5 h-5" />
                      </button>
                    </div>
                  </template>
                </draggable>

                <Button type="button" @click="addIngredient()" variant="reverse-primary" size="sm"
                  class="mt-3 flex w-full justify-center items-center gap-2">
                  <IconPlus class="w-5 h-5" />
                  Add ingredient
                </Button>
              </div>
            </div>


            <!-- Directions Section -->
            <div>
              <div class="flex items-center justify-between mb-3" :class="{ 'max-md:justify-end': showAddStepCategory }">
                <label class="block text-sm font-medium text-ink-800" :class="{ 'max-md:hidden': showAddStepCategory }">Directions</label>
                <AddCategoryInput :show-input="showAddStepCategory" :value="newStepCategoryName"
                  @show="showAddStepCategory = true" @update:value="newStepCategoryName = $event" @add="addStepCategory"
                  @cancel="showAddStepCategory = false; newStepCategoryName = ''" />
              </div>

              <!-- Category Sections -->
              <draggable v-if="stepCategories.length > 0" :model-value="stepCategories"
                @update:model-value="updateStepCategoryOrder" item-key="category" handle=".step-category-drag-handle"
                :animation="200" :force-fallback="true" ghost-class="sortable-ghost" chosen-class="sortable-chosen"
                drag-class="sortable-drag" class="space-y-4">
                <template #item="{ element: category }">
                  <div :ref="el => { if (el) stepCategoryRefs[category] = el as HTMLElement }" :class="[
                    'border rounded-lg p-4 transition-[background-color,border-color] duration-500 min-w-0 overflow-hidden',
                    highlightedStepCategory === category
                      ? 'border-brand-primary bg-brand-primary-50 shadow-md'
                      : 'border-paper-400 bg-paper-50'
                  ]">
                    <CategoryHeader :category="category" :is-editing="editingStepCategory === category"
                      :edit-value="newStepCategoryName" drag-handle-class="step-category-drag-handle"
                      @edit="startEditStepCategory(category)" @update:edit-value="newStepCategoryName = $event"
                      @save="saveStepCategoryEdit(category)" @cancel="cancelStepCategoryEdit"
                      @delete="deleteStepCategory(category)" />

                    <!-- Steps in this category -->
                    <draggable :model-value="stepsByCategory.grouped[category] || []" @update:model-value="(newList: Step[]) => {
                      newList.forEach((step: Step) => {
                        step.category = category
                      })
                      rebuildStepsPreservingCategoryOrderWithNewList(category, newList)
                    }" item-key="id" handle=".drag-handle" :animation="200" :force-fallback="true"
                      ghost-class="sortable-ghost" chosen-class="sortable-chosen" drag-class="sortable-drag"
                      group="steps" class="space-y-3">
                      <template #item="{ element: step, index }">
                        <StepInput :step="step" :index="index"
                          @remove="removeStep(form.steps.findIndex(s => s.id === step.id))"
                          @add-sub-step="addSubStep(step)" @remove-sub-step="removeSubStep(step, $event)" />
                      </template>
                    </draggable>

                    <Button type="button" @click="addStep(category)" variant="dashed" size="sm"
                      class="mt-2 w-full flex justify-center items-center gap-2">
                      <IconPlus class="w-4 h-4" />
                      Add step
                    </Button>
                  </div>
                </template>
              </draggable>

              <!-- Uncategorized Steps Section -->
              <div class="mt-4 space-y-3 min-w-0 overflow-hidden">
                <draggable v-if="stepsByCategory.uncategorized.length > 0" :model-value="stepsByCategory.uncategorized"
                  @update:model-value="(newList: Step[]) => {
                    newList.forEach((step: Step) => {
                      step.category = null
                    })
                    rebuildStepsPreservingCategoryOrderWithNewListForUncategorized(newList)
                  }" item-key="id" handle=".drag-handle" :animation="200" :force-fallback="true"
                  ghost-class="sortable-ghost" chosen-class="sortable-chosen" drag-class="sortable-drag" group="steps"
                  class="space-y-3">
                  <template #item="{ element: step, index }">
                    <StepInput :step="step" :index="index"
                      @remove="removeStep(form.steps.findIndex(s => s.id === step.id))" @add-sub-step="addSubStep(step)"
                      @remove-sub-step="removeSubStep(step, $event)" />
                  </template>
                </draggable>

                <Button type="button" @click="addStep()" variant="reverse-primary" size="sm"
                  class="mt-3 flex w-full justify-center items-center gap-2">
                  <IconPlus class="w-5 h-5" />
                  Add step
                </Button>
              </div>
            </div>

            <!-- Notes Section -->
            <div>
              <label for="notes" class="block text-sm font-medium text-ink-800 mb-2">
                Notes
              </label>
              <textarea id="notes" v-model="form.notes" rows="4" placeholder="Additional notes, tips, or variations..."
                :class="getTextareaClasses('notes')" @input="delete fieldErrors.notes" />
              <p v-if="fieldErrors.notes" class="mt-1 text-sm text-error-600">{{ fieldErrors.notes }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import IconTrash from '~/components/icons/IconTrash.vue'
import IconPlus from '~/components/icons/IconPlus.vue'
import IconDragHandle from '~/components/icons/IconDragHandle.vue'
import Button from '~/components/Button.vue'
import IngredientInput from '~/components/IngredientInput.vue'
import StepInput from '~/components/StepInput.vue'
import CategoryHeader from '~/components/CategoryHeader.vue'
import AddCategoryInput from '~/components/AddCategoryInput.vue'
import TagInput from '~/components/TagInput.vue'
import { computed, toRef } from 'vue'
import { useRecipeForm } from '~/composables/useRecipeForm'
import { useRecipeCategories } from '~/composables/useRecipeCategories'
import { useRecipeIngredients } from '~/composables/useRecipeIngredients'
import { useRecipeSteps } from '~/composables/useRecipeSteps'
import type { Ingredient, Step } from '~/types/recipe'

const route = useRoute()
const recipeId = computed(() => {
  const raw = route.params.id
  return (Array.isArray(raw) ? raw[0] : raw) as string
})

// Form composable
const {
  form,
  loading,
  saving,
  error,
  fieldErrors,
  recipeFormRef,
  isEditMode,
  slugManuallyChanged,
  generateId,
  getInputClasses,
  getTextareaClasses,
  loadRecipe,
  handleSubmit,
  imageUploading,
  imageUploadError,
  setRecipeFormThumbnail,
  removeRecipeFormImage,
  reorderRecipeFormImages,
  uploadRecipeImage,
} = useRecipeForm(recipeId)

const recipeImageFileInputRef = ref<HTMLInputElement | null>(null)

async function onRecipeImageFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) {
    await uploadRecipeImage(file)
  }
}

// Categories composable
const {
  editingCategory,
  newCategoryName,
  showAddCategory,
  categories,
  ingredientsByCategory,
  updateCategoryOrder,
  startEditCategory,
  saveCategoryEdit,
  cancelCategoryEdit,
  deleteCategory,
  editingStepCategory,
  newStepCategoryName,
  showAddStepCategory,
  stepCategories,
  stepsByCategory,
  updateStepCategoryOrder,
  startEditStepCategory,
  saveStepCategoryEdit,
  cancelStepCategoryEdit,
  deleteStepCategory,
} = useRecipeCategories(
  toRef(form, 'ingredients'),
  toRef(form, 'steps')
)

// Ingredients composable
const {
  addIngredient,
  removeIngredient,
  handleToTasteChange,
} = useRecipeIngredients(
  computed(() => form.ingredients),
  generateId,
  newCategoryName,
  showAddCategory
)

// Steps composable
const {
  addStep,
  removeStep,
  addSubStep,
  removeSubStep,
  rebuildStepsPreservingCategoryOrderWithNewList,
  rebuildStepsPreservingCategoryOrderWithNewListForUncategorized,
} = useRecipeSteps(
  toRef(form, 'steps'),
  generateId,
  stepCategories
)

// Refs for scrolling to categories
const ingredientCategoryRefs = ref<Record<string, HTMLElement>>({})
const stepCategoryRefs = ref<Record<string, HTMLElement>>({})

// Track newly added categories for highlighting
const highlightedIngredientCategory = ref<string | null>(null)
const highlightedStepCategory = ref<string | null>(null)

// Helper functions
function addCategory() {
  if (newCategoryName.value.trim()) {
    const categoryName = newCategoryName.value.trim()
    addIngredient(categoryName)
    showAddCategory.value = false
    newCategoryName.value = ''

    // Highlight and scroll to the new category after DOM updates
    nextTick(() => {
      const categoryElement = ingredientCategoryRefs.value[categoryName]
      if (categoryElement) {
        highlightedIngredientCategory.value = categoryName
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Remove highlight after animation
        setTimeout(() => {
          highlightedIngredientCategory.value = null
        }, 2000)
      }
    })
  }
}

function addStepCategory() {
  if (newStepCategoryName.value.trim()) {
    const categoryName = newStepCategoryName.value.trim()
    addStep(categoryName)
    showAddStepCategory.value = false
    newStepCategoryName.value = ''

    // Highlight and scroll to the new category after DOM updates
    nextTick(() => {
      const categoryElement = stepCategoryRefs.value[categoryName]
      if (categoryElement) {
        highlightedStepCategory.value = categoryName
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

        // Remove highlight after animation
        setTimeout(() => {
          highlightedStepCategory.value = null
        }, 2000)
      }
    })
  }
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
      toTaste: false,
      detailedSize: null,
      alternateIngredient: null,
    })
    form.steps.push({
      id: generateId(),
      description: '',
    })
  }
})
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

/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Prevent iOS zoom on input focus (iOS zooms when font-size < 16px) */
@media (max-width: 768px) {
  :deep(input),
  :deep(textarea),
  :deep(select) {
    font-size: 16px;
  }
}
</style>
