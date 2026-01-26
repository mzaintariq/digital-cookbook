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

      <form ref="recipeFormRef" v-else @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Left Column: Recipe General Information -->
          <div class="lg:col-span-1 space-y-6">
            <h2 class="text-l font-semibold text-gray-900 mb-4">RECIPE GENERAL INFORMATION</h2>

            <!-- Photo Upload Placeholder -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <p class="text-brand-primary font-medium mb-1">Upload Photo</p>
                <p class="text-sm text-gray-500">PNG or JPEG (max. 10MB)</p>
                <p class="text-xs text-gray-400 mt-2">Coming soon</p>
              </div>
            </div>

            <!-- Recipe Name -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Recipe name *
              </label>
              <input id="title" v-model="form.title" type="text" required placeholder="eg: Savory Stuffed Bell Peppers"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea id="description" v-model="form.description" rows="3"
                placeholder="Brief description of the recipe..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <!-- Slug -->
            <div>
              <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
                Slug * (unique, lowercase, hyphens)
              </label>
              <input id="slug" v-model="form.slug" type="text" required @input="slugManuallyChanged = true"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <!-- Set Recipe As (Publish/Draft) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">Published</span>
                <button type="button" @click="form.published = !form.published" :class="[
                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                  form.published ? 'bg-brand-primary' : 'bg-gray-300'
                ]">
                  <span :class="[
                    'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                    form.published ? 'translate-x-3.5' : 'translate-x-0.5'
                  ]" />
                </button>
                <span class="text-xs text-gray-500">{{ form.published ? 'Visible to everyone' : 'Saved as draft'
                  }}</span>
              </div>
            </div>

            <!-- Number of Servings -->
            <div>
              <label for="servings" class="block text-sm font-medium text-gray-700 mb-1">
                Number of serving
              </label>
              <div class="relative">
                <input id="servings" v-model.number="form.servings" type="number" min="1" placeholder="eg: 4 or 3-5"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">person</span>
                </div>
              </div>
            </div>

            <!-- Cook Time -->
            <div>
              <label for="cookTimeMinutes" class="block text-sm font-medium text-gray-700 mb-1">
                Cook time *
              </label>
              <div class="relative">
                <input id="cookTimeMinutes" v-model.number="form.cookTimeMinutes" type="number" required min="0"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Prep Time -->
            <div>
              <label for="prepTimeMinutes" class="block text-sm font-medium text-gray-700 mb-1">
                Prep time
              </label>
              <div class="relative">
                <input id="prepTimeMinutes" v-model.number="form.prepTimeMinutes" type="number" min="0"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Rest Time -->
            <div>
              <label for="restTimeMinutes" class="block text-sm font-medium text-gray-700 mb-1">
                Rest time
              </label>
              <div class="relative">
                <input id="restTimeMinutes" v-model.number="form.restTimeMinutes" type="number" min="0"
                  class="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-gray-700 text-sm">minute</span>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input id="tags" v-model="form.tags" type="text" placeholder="pakistani, curry, spicy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <!-- Credit -->
            <div>
              <label for="credit" class="block text-sm font-medium text-gray-700 mb-1">
                Credit
              </label>
              <input id="credit" v-model="form.credit" type="text" placeholder="eg: Recipe by Chef John"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>

            <!-- Video URL -->
            <div>
              <label for="videoUrl" class="block text-sm font-medium text-gray-700 mb-1">
                Video URL
              </label>
              <input id="videoUrl" v-model="form.videoUrl" type="url"
                placeholder="eg: https://www.youtube.com/watch?v=..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
          </div>

          <!-- Right Column: Recipe Detail -->
          <div class="lg:col-span-3 space-y-6">
            <h2 class="text-l font-semibold text-gray-900 mb-4">RECIPE DETAIL</h2>

            <!-- Ingredients Section -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700">Ingredients</label>
                <div class="flex gap-2">
                  <Button v-if="!showAddCategory" type="button" @click="showAddCategory = true" variant="reverse-primary" size="xs">
                    + Add Category
                  </Button>
                  <div v-else class="flex gap-2">
                    <input v-model="newCategoryName" type="text" placeholder="Category name"
                      @keyup.enter="addCategory"
                      @keyup.esc="showAddCategory = false; newCategoryName = ''"
                      class="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      autofocus />
                    <button type="button" @click="addCategory"
                      class="px-3 py-1.5 text-xs bg-brand-primary text-white rounded-md hover:bg-brand-primary-600 transition-colors">
                      Add
                    </button>
                    <button type="button" @click="showAddCategory = false; newCategoryName = ''"
                      class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <!-- Category Sections -->
              <draggable 
                v-if="categories.length > 0"
                :model-value="categories"
                @update:model-value="updateCategoryOrder"
                item-key="category"
                handle=".category-drag-handle"
                :animation="200"
                :force-fallback="true"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
                class="space-y-4">
                <template #item="{ element: category }">
                  <div class="border border-gray-300 rounded-lg p-4 bg-white">
                    <!-- Category Header -->
                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 h-8">
                      <div class="flex items-center gap-2 flex-1">
                        <div v-if="editingCategory !== category" class="category-drag-handle cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <IconDragHandle class="w-4 h-4" />
                        </div>
                        <input v-if="editingCategory === category" v-model="newCategoryName" type="text"
                          @keyup.enter="saveCategoryEdit(category)"
                          @keyup.esc="cancelCategoryEdit"
                          @blur="saveCategoryEdit(category)"
                          class="px-2 py-1 text-sm font-semibold border border-brand-primary rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          autofocus />
                        <h3 v-else class="text-sm font-semibold text-gray-900 uppercase">{{ category }}</h3>
                      </div>
                      <div class="flex items-center gap-2">
                        <button type="button" 
                          v-if="editingCategory !== category"
                          @click="startEditCategory(category)"
                          class="text-xs text-gray-500 hover:text-gray-700">
                          Edit
                        </button>
                        <button type="button" 
                          v-else
                          @click="saveCategoryEdit(category)"
                          class="text-xs text-brand-primary hover:text-brand-primary-600">
                          Done
                        </button>
                        <button type="button" @click="deleteCategory(category)"
                          class="text-red-500 hover:text-red-700">
                          <IconClose class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  <!-- Ingredients in this category -->
                  <draggable 
                    :model-value="ingredientsByCategory.grouped[category] || []"
                    @update:model-value="(newList: Ingredient[]) => {
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
                    }"
                    item-key="id" 
                    handle=".drag-handle" 
                    :animation="200"
                    :force-fallback="true" 
                    ghost-class="sortable-ghost" 
                    chosen-class="sortable-chosen"
                    drag-class="sortable-drag" 
                    group="ingredients"
                    class="space-y-2">
                    <template #item="{ element: ingredient }">
                      <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <IconDragHandle class="w-5 h-5" />
                        </div>
                        <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                          <!-- Quantity with unit inside -->
                          <div v-if="!ingredient.toTaste" class="md:col-span-2 relative">
                            <input v-model.number="ingredient.quantity" type="number" min="0" step="any" placeholder="4"
                              class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            <div
                              class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                              <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.unit }}</span>
                              <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            </div>
                            <select v-model="ingredient.unit"
                              class="absolute inset-y-0 right-0 w-12 md:w-16 opacity-0 cursor-pointer">
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
                          <!-- "To taste" text when checked -->
                          <div v-else class="md:col-span-1 flex items-center text-sm text-gray-600 italic">
                            to taste
                          </div>
                          <!-- Alternate size with unit inside -->
                          <div v-if="ingredient.detailedSize && !ingredient.toTaste" class="md:col-span-2 relative">
                            <input v-model.number="ingredient.detailedSize.amount" type="number" min="0" step="any"
                              placeholder="15"
                              class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            <div
                              class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                              <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.detailedSize.unit }}</span>
                              <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            </div>
                            <select v-model="ingredient.detailedSize.unit"
                              class="absolute inset-y-0 right-0 w-16 md:w-20 opacity-0 cursor-pointer">
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                              <option value="oz">oz</option>
                            </select>
                          </div>
                          <input v-model="ingredient.name" type="text" placeholder="eg: Large bell peppers (any color)"
                            :class="[
                              'px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary',
                              ingredient.detailedSize
                                ? (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-8')
                                : (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-10')
                            ]" />
                          <div class="md:col-span-12 flex flex-wrap items-center gap-3 md:gap-4 mt-1">
                            <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">To taste</span>
                              <button type="button"
                                @click="ingredient.toTaste = !ingredient.toTaste; handleToTasteChange(ingredient)" :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  ingredient.toTaste ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  ingredient.toTaste ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                            <label v-if="!ingredient.toTaste"
                              class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">Alternate size</span>
                              <button type="button"
                                @click="ingredient.detailedSize = ingredient.detailedSize ? null : { amount: 0, unit: 'oz' }"
                                :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  ingredient.detailedSize ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  ingredient.detailedSize ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                            <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">Alternate ingredient</span>
                              <button type="button"
                                @click="ingredient.alternateIngredient = (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? null : ''"
                                :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                          </div>
                          <!-- Alternate Ingredient Text Field -->
                          <div
                            v-if="ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined"
                            class="md:col-span-12 mt-2">
                            <input v-model="ingredient.alternateIngredient" type="text"
                              placeholder="eg: or use butter instead"
                              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                          </div>
                        </div>
                        <button type="button" @click="removeIngredient(form.ingredients.findIndex(i => i.id === ingredient.id))"
                          class="pt-2 text-red-500 hover:text-red-700 flex-shrink-0">
                          <IconTrash class="w-5 h-5" />
                        </button>
                      </div>
                    </template>
                  </draggable>

                  <Button type="button" @click="addIngredient(category)" variant="dashed" size="sm" class="mt-2 w-full flex justify-center items-center gap-2">
                    <IconPlus class="w-4 h-4" />
                    Add ingredient
                  </Button>
                  </div>
                </template>
              </draggable>

              <!-- Uncategorized Section (no box/title) -->
              <div class="mt-4 space-y-3">
                  <draggable 
                    v-if="ingredientsByCategory.uncategorized.length > 0"
                    :model-value="ingredientsByCategory.uncategorized"
                    @update:model-value="(newList: Ingredient[]) => {
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
                    }"
                    item-key="id" 
                    handle=".drag-handle" 
                    :animation="200"
                    :force-fallback="true" 
                    ghost-class="sortable-ghost" 
                    chosen-class="sortable-chosen"
                    drag-class="sortable-drag" 
                    group="ingredients"
                    class="space-y-3">
                    <template #item="{ element: ingredient }">
                      <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <IconDragHandle class="w-5 h-5" />
                        </div>
                        <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                          <!-- Quantity with unit inside -->
                          <div v-if="!ingredient.toTaste" class="md:col-span-2 relative">
                            <input v-model.number="ingredient.quantity" type="number" min="0" step="any" placeholder="4"
                              class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            <div
                              class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                              <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.unit }}</span>
                              <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            </div>
                            <select v-model="ingredient.unit"
                              class="absolute inset-y-0 right-0 w-12 md:w-16 opacity-0 cursor-pointer">
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
                          <!-- "To taste" text when checked -->
                          <div v-else class="md:col-span-1 flex items-center text-sm text-gray-600 italic">
                            to taste
                          </div>
                          <!-- Alternate size with unit inside -->
                          <div v-if="ingredient.detailedSize && !ingredient.toTaste" class="md:col-span-2 relative">
                            <input v-model.number="ingredient.detailedSize.amount" type="number" min="0" step="any"
                              placeholder="15"
                              class="w-full px-2 py-1.5 pr-20 md:pr-18 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                            <div
                              class="absolute inset-y-0 right-0 w-16 md:w-16 flex items-center justify-end border-l border-gray-300 pl-2 pr-2 pointer-events-none bg-gray-50 rounded-r border-r border-t border-b border-gray-300">
                              <span class="text-xs md:text-sm text-gray-700 mr-1">{{ ingredient.detailedSize.unit }}</span>
                              <IconChevronDown class="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                            </div>
                            <select v-model="ingredient.detailedSize.unit"
                              class="absolute inset-y-0 right-0 w-16 md:w-20 opacity-0 cursor-pointer">
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                              <option value="oz">oz</option>
                            </select>
                          </div>
                          <input v-model="ingredient.name" type="text" placeholder="eg: Large bell peppers (any color)"
                            :class="[
                              'px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary',
                              ingredient.detailedSize
                                ? (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-8')
                                : (ingredient.toTaste ? 'md:col-span-11' : 'md:col-span-10')
                            ]" />
                          <div class="md:col-span-12 flex flex-wrap items-center gap-3 md:gap-4 mt-1">
                            <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">To taste</span>
                              <button type="button"
                                @click="ingredient.toTaste = !ingredient.toTaste; handleToTasteChange(ingredient)" :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  ingredient.toTaste ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  ingredient.toTaste ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                            <label v-if="!ingredient.toTaste"
                              class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">Alternate size</span>
                              <button type="button"
                                @click="ingredient.detailedSize = ingredient.detailedSize ? null : { amount: 0, unit: 'oz' }"
                                :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  ingredient.detailedSize ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  ingredient.detailedSize ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                            <label class="flex items-center text-xs text-gray-600 cursor-pointer">
                              <span class="mr-2">Alternate ingredient</span>
                              <button type="button"
                                @click="ingredient.alternateIngredient = (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? null : ''"
                                :class="[
                                  'relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
                                  (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'bg-brand-primary' : 'bg-gray-300'
                                ]">
                                <span :class="[
                                  'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                  (ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined) ? 'translate-x-3.5' : 'translate-x-0.5'
                                ]" />
                              </button>
                            </label>
                          </div>
                          <!-- Alternate Ingredient Text Field -->
                          <div
                            v-if="ingredient.alternateIngredient !== null && ingredient.alternateIngredient !== undefined"
                            class="md:col-span-12 mt-2">
                            <input v-model="ingredient.alternateIngredient" type="text"
                              placeholder="eg: or use butter instead"
                              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                          </div>
                        </div>
                        <button type="button" @click="removeIngredient(form.ingredients.findIndex(i => i.id === ingredient.id))"
                          class="pt-2 text-red-500 hover:text-red-700 flex-shrink-0">
                          <IconTrash class="w-5 h-5" />
                        </button>
                      </div>
                    </template>
                  </draggable>

                  <Button type="button" @click="addIngredient()" variant="reverse-primary" size="sm" class="mt-3 flex w-full justify-center items-center gap-2">
                    <IconPlus class="w-5 h-5" />
                    Add ingredient
                  </Button>
                </div>
            </div>


            <!-- Directions Section -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700">Directions</label>
                <div class="flex gap-2">
                  <Button v-if="!showAddStepCategory" type="button" @click="showAddStepCategory = true" variant="reverse-primary" size="xs">
                    + Add Category
                  </Button>
                  <div v-else class="flex gap-2">
                    <input v-model="newStepCategoryName" type="text" placeholder="Category name"
                      @keyup.enter="addStepCategory"
                      @keyup.esc="showAddStepCategory = false; newStepCategoryName = ''"
                      class="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                      autofocus />
                    <button type="button" @click="addStepCategory"
                      class="px-3 py-1.5 text-xs bg-brand-primary text-white rounded-md hover:bg-brand-primary-600 transition-colors">
                      Add
                    </button>
                    <button type="button" @click="showAddStepCategory = false; newStepCategoryName = ''"
                      class="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <!-- Category Sections -->
              <draggable 
                v-if="stepCategories.length > 0"
                :model-value="stepCategories"
                @update:model-value="updateStepCategoryOrder"
                item-key="category"
                handle=".step-category-drag-handle"
                :animation="200"
                :force-fallback="true"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
                class="space-y-4">
                <template #item="{ element: category }">
                  <div class="border border-gray-300 rounded-lg p-4 bg-white">
                    <!-- Category Header -->
                    <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 h-8">
                      <div class="flex items-center gap-2 flex-1">
                        <div v-if="editingStepCategory !== category" class="step-category-drag-handle cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <IconDragHandle class="w-4 h-4" />
                        </div>
                        <input v-if="editingStepCategory === category" v-model="newStepCategoryName" type="text"
                          @keyup.enter="saveStepCategoryEdit(category)"
                          @keyup.esc="cancelStepCategoryEdit"
                          @blur="saveStepCategoryEdit(category)"
                          class="px-2 py-1 text-sm font-semibold border border-brand-primary rounded focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          autofocus />
                        <h3 v-else class="text-sm font-semibold text-gray-900 uppercase">{{ category }}</h3>
                      </div>
                      <div class="flex items-center gap-2">
                        <button type="button" 
                          v-if="editingStepCategory !== category"
                          @click="startEditStepCategory(category)"
                          class="text-xs text-gray-500 hover:text-gray-700">
                          Edit
                        </button>
                        <button type="button" 
                          v-else
                          @click="saveStepCategoryEdit(category)"
                          class="text-xs text-brand-primary hover:text-brand-primary-600">
                          Done
                        </button>
                        <button type="button" @click="deleteStepCategory(category)"
                          class="text-red-500 hover:text-red-700">
                          <IconClose class="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <!-- Steps in this category -->
                    <draggable 
                      :model-value="stepsByCategory.grouped[category] || []"
                      @update:model-value="(newList: Step[]) => {
                        newList.forEach((step: Step) => {
                          step.category = category
                        })
                        rebuildStepsPreservingCategoryOrderWithNewList(category, newList)
                      }"
                      item-key="id" 
                      handle=".drag-handle" 
                      :animation="200"
                      :force-fallback="true" 
                      ghost-class="sortable-ghost" 
                      chosen-class="sortable-chosen"
                      drag-class="sortable-drag" 
                      class="space-y-3">
                      <template #item="{ element: step, index }">
                        <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                            <IconDragHandle class="w-5 h-5" />
                          </div>
                          <div class="flex-1 space-y-2">
                            <div class="flex items-start gap-2">
                              <span class="text-sm font-medium text-gray-700 pt-2 flex-shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
                              <textarea v-model="step.description" rows="2"
                                placeholder="eg: Preheat your oven to 375°F (190°C)..."
                                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                              <button type="button" @click="removeStep(form.steps.findIndex(s => s.id === step.id))"
                                class="pt-2 text-red-500 hover:text-red-700 flex-shrink-0">
                                <IconTrash class="w-5 h-5" />
                              </button>
                            </div>
                            
                            <!-- Sub-steps -->
                            <div v-if="step.subSteps && step.subSteps.length > 0" class="ml-6 space-y-2">
                              <draggable 
                                v-model="step.subSteps"
                                item-key="id"
                                handle=".drag-handle"
                                :animation="200"
                                :force-fallback="true"
                                ghost-class="sortable-ghost"
                                chosen-class="sortable-chosen"
                                drag-class="sortable-drag"
                                class="space-y-2">
                                <template #item="{ element: subStep, index: subIndex }">
                                  <div class="flex items-start gap-2 p-2 border border-gray-200 rounded bg-white">
                                    <div class="drag-handle cursor-move pt-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                                      <IconDragHandle class="w-4 h-4" />
                                    </div>
                                    <span class="text-xs font-medium text-gray-600 pt-1 flex-shrink-0">{{ String.fromCharCode(97 + subIndex) }}</span>
                                    <textarea v-model="subStep.description" rows="1"
                                      placeholder="Sub-step description..."
                                      class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                    <button type="button" @click="removeSubStep(step, subIndex)"
                                      class="pt-1 text-red-500 hover:text-red-700 flex-shrink-0">
                                      <IconTrash class="w-4 h-4" />
                                    </button>
                                  </div>
                                </template>
                              </draggable>
                            </div>
                            
                            <!-- Add Sub-step button -->
                            <button type="button" @click="addSubStep(step)"
                              class="ml-6 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                              <IconPlus class="w-3 h-3" />
                              Add sub-step
                            </button>
                          </div>
                        </div>
                      </template>
                    </draggable>

                    <Button type="button" @click="addStep(category)" variant="dashed" size="sm" class="mt-2 w-full flex justify-center items-center gap-2">
                      <IconPlus class="w-4 h-4" />
                      Add step
                    </Button>
                  </div>
                </template>
              </draggable>

              <!-- Uncategorized Steps Section -->
              <div class="mt-4 space-y-3">
                <draggable 
                  v-if="stepsByCategory.uncategorized.length > 0"
                  :model-value="stepsByCategory.uncategorized"
                  @update:model-value="(newList: Step[]) => {
                    newList.forEach((step: Step) => {
                      step.category = null
                    })
                    rebuildStepsPreservingCategoryOrderWithNewListForUncategorized(newList)
                  }"
                  item-key="id" 
                  handle=".drag-handle" 
                  :animation="200"
                  :force-fallback="true" 
                  ghost-class="sortable-ghost" 
                  chosen-class="sortable-chosen"
                  drag-class="sortable-drag" 
                  class="space-y-3">
                  <template #item="{ element: step, index }">
                    <div class="flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div class="drag-handle cursor-move pt-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <IconDragHandle class="w-5 h-5" />
                      </div>
                      <div class="flex-1 space-y-2">
                        <div class="flex items-start gap-2">
                          <span class="text-sm font-medium text-gray-700 pt-2 flex-shrink-0">{{ String(index + 1).padStart(2, '0') }}</span>
                          <textarea v-model="step.description" rows="2"
                            placeholder="eg: Preheat your oven to 375°F (190°C)..."
                            class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                          <button type="button" @click="removeStep(form.steps.findIndex(s => s.id === step.id))"
                            class="pt-2 text-red-500 hover:text-red-700 flex-shrink-0">
                            <IconTrash class="w-5 h-5" />
                          </button>
                        </div>
                        
                        <!-- Sub-steps -->
                        <div v-if="step.subSteps && step.subSteps.length > 0" class="ml-6 space-y-2">
                          <draggable 
                            v-model="step.subSteps"
                            item-key="id"
                            handle=".drag-handle"
                            :animation="200"
                            :force-fallback="true"
                            ghost-class="sortable-ghost"
                            chosen-class="sortable-chosen"
                            drag-class="sortable-drag"
                            class="space-y-2">
                            <template #item="{ element: subStep, index: subIndex }">
                              <div class="flex items-start gap-2 p-2 border border-gray-200 rounded bg-white">
                                <div class="drag-handle cursor-move pt-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                                  <IconDragHandle class="w-4 h-4" />
                                </div>
                                <span class="text-xs font-medium text-gray-600 pt-1 flex-shrink-0">{{ String.fromCharCode(97 + subIndex) }}</span>
                                <textarea v-model="subStep.description" rows="1"
                                  placeholder="Sub-step description..."
                                  class="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-primary" />
                                <button type="button" @click="removeSubStep(step, subIndex)"
                                  class="pt-1 text-red-500 hover:text-red-700 flex-shrink-0">
                                  <IconTrash class="w-4 h-4" />
                                </button>
                              </div>
                            </template>
                          </draggable>
                        </div>
                        
                        <!-- Add Sub-step button -->
                        <button type="button" @click="addSubStep(step)"
                          class="ml-6 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                          <IconPlus class="w-3 h-3" />
                          Add sub-step
                        </button>
                      </div>
                    </div>
                  </template>
                </draggable>

                <Button type="button" @click="addStep()" variant="reverse-primary" size="sm" class="mt-3 flex w-full justify-center items-center gap-2">
                  <IconPlus class="w-5 h-5" />
                  Add step
                </Button>
              </div>
            </div>

            <!-- Notes Section -->
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea id="notes" v-model="form.notes" rows="4" placeholder="Additional notes, tips, or variations..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
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
import IconTrash from '~/components/icons/IconTrash.vue'
import IconPlus from '~/components/icons/IconPlus.vue'
import IconDragHandle from '~/components/icons/IconDragHandle.vue'
import IconChevronDown from '~/components/icons/IconChevronDown.vue'
import IconClose from '~/components/icons/IconClose.vue'
import Button from '~/components/Button.vue'
import type { Recipe, Ingredient as RecipeIngredient, Step as RecipeStep, SubStep as RecipeSubStep } from '~/types/recipe'

interface Ingredient {
  id: string
  quantity: number
  unit: string
  name: string
  toTaste?: boolean
  detailedSize?: {
    amount: number
    unit: string
  } | null
  alternateIngredient?: string | null
  category?: string | null
}

interface SubStep {
  id: string
  description: string
}

interface Step {
  id: string
  description: string
  category?: string | null
  subSteps?: SubStep[]
}

const route = useRoute()
const recipeId = route.params.id as string
const isEditMode = recipeId !== 'new'
const slugManuallyChanged = ref(false)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  credit: '',
  videoUrl: '',
  servings: null as number | null,
  cookTimeMinutes: 0,
  prepTimeMinutes: null as number | null,
  restTimeMinutes: null as number | null,
  tags: '',
  notes: '',
  published: false,
  ingredients: [] as Ingredient[],
  steps: [] as Step[],
})

const loading = ref(isEditMode)
const saving = ref(false)
const error = ref<string | null>(null)
const recipeFormRef = ref<HTMLFormElement | null>(null)

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Watch form.title and auto-generate slug if not manually changed
watch(() => form.title, (newTitle) => {
  // Only send title update to header if in edit mode
  if (process.client && isEditMode) {
    window.dispatchEvent(new CustomEvent('recipe-title-update', {
      detail: { title: newTitle || null }
    }))
  }

  // Auto-generate slug from title if slug hasn't been manually changed
  if (!slugManuallyChanged.value && newTitle) {
    form.slug = generateSlug(newTitle)
  }
}, { immediate: true })

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

// Category management for ingredients
const editingCategory = ref<string | null>(null)
const newCategoryName = ref('')
const showAddCategory = ref(false)

// Category management for steps
const editingStepCategory = ref<string | null>(null)
const newStepCategoryName = ref('')
const showAddStepCategory = ref(false)

// Computed: Get all unique categories ordered by first appearance in ingredients
const categories = computed(() => {
  const categoryOrder: string[] = []
  const seen = new Set<string>()
  
  // Iterate through ingredients in order to preserve category order
  form.ingredients.forEach(ing => {
    if (ing.category && ing.category.trim()) {
      const cat = ing.category.trim()
      if (!seen.has(cat)) {
        categoryOrder.push(cat)
        seen.add(cat)
      }
    }
  })
  
  return categoryOrder
})

// Computed: Group ingredients by category
const ingredientsByCategory = computed(() => {
  const grouped: { [key: string]: Ingredient[] } = {}
  const uncategorized: Ingredient[] = []
  
  form.ingredients.forEach(ing => {
    if (ing.category && ing.category.trim()) {
      const cat = ing.category.trim()
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push(ing)
    } else {
      uncategorized.push(ing)
    }
  })
  
  return { grouped, uncategorized }
})

// Helper function to rebuild ingredients array while preserving category order
function rebuildIngredientsPreservingCategoryOrder() {
  // Get current category order
  const currentCategoryOrder = categories.value
  const ingredientsByCat: { [key: string]: Ingredient[] } = {}
  const uncategorized: Ingredient[] = []
  
  form.ingredients.forEach(ing => {
    if (ing.category && ing.category.trim()) {
      const cat = ing.category.trim()
      if (!ingredientsByCat[cat]) {
        ingredientsByCat[cat] = []
      }
      ingredientsByCat[cat].push(ing)
    } else {
      uncategorized.push(ing)
    }
  })
  
  // Rebuild ingredients array in current category order
  const reordered: Ingredient[] = []
  currentCategoryOrder.forEach(cat => {
    if (ingredientsByCat[cat]) {
      reordered.push(...ingredientsByCat[cat])
    }
  })
  // Add uncategorized at the end
  reordered.push(...uncategorized)
  
  form.ingredients = reordered
}

// Function to reorder ingredients when categories are reordered
function updateCategoryOrder(newCategoryOrder: string[]) {
  // Get all ingredients grouped by category
  const ingredientsByCat: { [key: string]: Ingredient[] } = {}
  const uncategorized: Ingredient[] = []
  
  form.ingredients.forEach(ing => {
    if (ing.category && ing.category.trim()) {
      const cat = ing.category.trim()
      if (!ingredientsByCat[cat]) {
        ingredientsByCat[cat] = []
      }
      ingredientsByCat[cat].push(ing)
    } else {
      uncategorized.push(ing)
    }
  })
  
  // Rebuild ingredients array in new category order
  const reordered: Ingredient[] = []
  newCategoryOrder.forEach(cat => {
    if (ingredientsByCat[cat]) {
      reordered.push(...ingredientsByCat[cat])
    }
  })
  // Add uncategorized at the end
  reordered.push(...uncategorized)
  
  form.ingredients = reordered
}

function addCategory() {
  if (newCategoryName.value.trim()) {
    // Add a new ingredient with this category
    addIngredient(newCategoryName.value.trim())
    showAddCategory.value = false
    newCategoryName.value = ''
  }
}

function startEditCategory(category: string) {
  editingCategory.value = category
  newCategoryName.value = category
}

function saveCategoryEdit(oldCategory: string) {
  if (newCategoryName.value.trim() && newCategoryName.value.trim() !== oldCategory) {
    // Update all ingredients with this category
    form.ingredients.forEach(ing => {
      if (ing.category === oldCategory) {
        ing.category = newCategoryName.value.trim()
      }
    })
  }
  editingCategory.value = null
  newCategoryName.value = ''
}

function cancelCategoryEdit() {
  editingCategory.value = null
  newCategoryName.value = ''
}

function deleteCategory(category: string) {
  // Remove category from all ingredients (move to uncategorized)
  form.ingredients.forEach(ing => {
    if (ing.category === category) {
      ing.category = null
    }
  })
}

function addIngredient(category?: string) {
  form.ingredients.push({
    id: generateId(),
    quantity: 1,
    unit: 'pcs',
    name: '',
    toTaste: false,
    detailedSize: null,
    alternateIngredient: null,
    category: category || null,
  })
  
  // If adding to a new category, set it
  if (newCategoryName.value.trim() && !category) {
    const lastIngredient = form.ingredients[form.ingredients.length - 1]
    if (lastIngredient) {
      lastIngredient.category = newCategoryName.value.trim()
      newCategoryName.value = ''
      showAddCategory.value = false
    }
  }
}

function removeIngredient(index: number) {
  form.ingredients.splice(index, 1)
}

function handleToTasteChange(ingredient: Ingredient) {
  // Clear detailedSize when toTaste is enabled
  if (ingredient.toTaste) {
    ingredient.detailedSize = null
  }
}

// Computed: Get all unique step categories ordered by first appearance
const stepCategories = computed(() => {
  const categoryOrder: string[] = []
  const seen = new Set<string>()
  
  // Iterate through steps in order to preserve category order
  form.steps.forEach(step => {
    if (step.category && step.category.trim()) {
      const cat = step.category.trim()
      if (!seen.has(cat)) {
        categoryOrder.push(cat)
        seen.add(cat)
      }
    }
  })
  
  return categoryOrder
})

// Computed: Group steps by category
const stepsByCategory = computed(() => {
  const grouped: { [key: string]: Step[] } = {}
  const uncategorized: Step[] = []
  
  form.steps.forEach(step => {
    if (step.category && step.category.trim()) {
      const cat = step.category.trim()
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push(step)
    } else {
      uncategorized.push(step)
    }
  })
  
  return { grouped, uncategorized }
})

// Helper function to rebuild steps array while preserving category order
function rebuildStepsPreservingCategoryOrder() {
  const currentCategoryOrder = stepCategories.value
  const stepsByCat: { [key: string]: Step[] } = {}
  const uncategorized: Step[] = []
  
  form.steps.forEach(step => {
    if (step.category && step.category.trim()) {
      const cat = step.category.trim()
      if (!stepsByCat[cat]) {
        stepsByCat[cat] = []
      }
      stepsByCat[cat].push(step)
    } else {
      uncategorized.push(step)
    }
  })
  
  const reordered: Step[] = []
  currentCategoryOrder.forEach((cat: string) => {
    if (stepsByCat[cat]) {
      reordered.push(...stepsByCat[cat])
    }
  })
  reordered.push(...uncategorized)
  
  form.steps = reordered
}

// Helper function to rebuild steps with new list for a specific category
function rebuildStepsPreservingCategoryOrderWithNewList(category: string, newList: Step[]) {
  const currentCategoryOrder = stepCategories.value
  const stepsByCat: { [key: string]: Step[] } = {}
  const uncategorized: Step[] = []
  
  form.steps.forEach(step => {
    const stepCat = step.category && step.category.trim()
    if (stepCat && stepCat !== category) {
      if (!stepsByCat[stepCat]) {
        stepsByCat[stepCat] = []
      }
      stepsByCat[stepCat].push(step)
    } else if (!stepCat) {
      uncategorized.push(step)
    }
  })
  
  stepsByCat[category] = newList
  
  const reordered: Step[] = []
  currentCategoryOrder.forEach((cat: string) => {
    if (stepsByCat[cat]) {
      reordered.push(...stepsByCat[cat])
    }
  })
  reordered.push(...uncategorized)
  
  form.steps = reordered
}

// Helper function to rebuild steps with new list for uncategorized
function rebuildStepsPreservingCategoryOrderWithNewListForUncategorized(newList: Step[]) {
  const currentCategoryOrder = stepCategories.value
  const stepsByCat: { [key: string]: Step[] } = {}
  
  form.steps.forEach(step => {
    const stepCat = step.category && step.category.trim()
    if (stepCat) {
      if (!stepsByCat[stepCat]) {
        stepsByCat[stepCat] = []
      }
      stepsByCat[stepCat].push(step)
    }
  })
  
  const reordered: Step[] = []
  currentCategoryOrder.forEach((cat: string) => {
    if (stepsByCat[cat]) {
      reordered.push(...stepsByCat[cat])
    }
  })
  reordered.push(...newList)
  
  form.steps = reordered
}

// Function to reorder steps when categories are reordered
function updateStepCategoryOrder(newCategoryOrder: string[]) {
  const stepsByCat: { [key: string]: Step[] } = {}
  const uncategorized: Step[] = []
  
  form.steps.forEach(step => {
    if (step.category && step.category.trim()) {
      const cat = step.category.trim()
      if (!stepsByCat[cat]) {
        stepsByCat[cat] = []
      }
      stepsByCat[cat].push(step)
    } else {
      uncategorized.push(step)
    }
  })
  
  const reordered: Step[] = []
  newCategoryOrder.forEach((cat: string) => {
    if (stepsByCat[cat]) {
      reordered.push(...stepsByCat[cat])
    }
  })
  reordered.push(...uncategorized)
  
  form.steps = reordered
}

function addStepCategory() {
  if (newStepCategoryName.value.trim()) {
    addStep(newStepCategoryName.value.trim())
    showAddStepCategory.value = false
    newStepCategoryName.value = ''
  }
}

function startEditStepCategory(category: string) {
  editingStepCategory.value = category
  newStepCategoryName.value = category
}

function saveStepCategoryEdit(oldCategory: string) {
  if (newStepCategoryName.value.trim() && newStepCategoryName.value.trim() !== oldCategory) {
    form.steps.forEach(step => {
      if (step.category === oldCategory) {
        step.category = newStepCategoryName.value.trim()
      }
    })
  }
  editingStepCategory.value = null
  newStepCategoryName.value = ''
}

function cancelStepCategoryEdit() {
  editingStepCategory.value = null
  newStepCategoryName.value = ''
}

function deleteStepCategory(category: string) {
  form.steps.forEach(step => {
    if (step.category === category) {
      step.category = null
    }
  })
}

function addStep(category?: string) {
  form.steps.push({
    id: generateId(),
    description: '',
    category: category || null,
    subSteps: [],
  })
}

function removeStep(index: number) {
  form.steps.splice(index, 1)
}

function addSubStep(step: Step) {
  if (!step.subSteps) {
    step.subSteps = []
  }
  step.subSteps.push({
    id: generateId(),
    description: '',
  })
}

function removeSubStep(step: Step, subStepIndex: number) {
  if (step.subSteps) {
    step.subSteps.splice(subStepIndex, 1)
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

async function loadRecipe() {
  if (!isEditMode) return

  try {
    const recipes = await $fetch<Recipe[]>('/api/admin/recipes')
    const recipe = recipes.find((r: Recipe) => r.id === recipeId)

    if (!recipe) {
      error.value = 'Recipe not found'
      return
    }

    form.title = recipe.title
    form.slug = recipe.slug
    form.servings = recipe.servings || null
    form.cookTimeMinutes = recipe.cookTimeMinutes
    form.prepTimeMinutes = recipe.prepTimeMinutes || null
    form.restTimeMinutes = recipe.restTimeMinutes || null
    form.description = recipe.description || ''
    form.credit = recipe.credit || ''
    form.videoUrl = recipe.videoUrl || ''
    form.tags = recipe.tags.join(', ')
    form.notes = recipe.notes || ''
    form.published = recipe.status === 'publish'

    // In edit mode, slug is already set, so mark as manually changed
    slugManuallyChanged.value = true

    // Convert ingredients from JSON to structured format
    if (Array.isArray(recipe.ingredients)) {
      form.ingredients = recipe.ingredients.map((ing: RecipeIngredient) => ({
        id: generateId(),
        quantity: ing.quantity || 1,
        unit: ing.unit || 'pcs',
        name: ing.name || '',
        toTaste: ing.toTaste || false,
        detailedSize: ing.detailedSize || null,
        alternateIngredient: ing.alternateIngredient || null,
        category: ing.category || null,
      }))
    } else {
      form.ingredients = []
    }

    // Convert steps from array to structured format
    if (Array.isArray(recipe.steps)) {
      form.steps = recipe.steps.map((step: RecipeStep) => ({
        id: step.id || generateId(),
        description: step.description || '',
        category: step.category || null,
        subSteps: (step.subSteps || []).map((sub: RecipeSubStep) => ({
          id: sub.id || generateId(),
          description: sub.description || '',
        })),
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

    // Ensure slug is set (fallback if watch didn't trigger)
    if (!form.slug && form.title) {
      form.slug = generateSlug(form.title)
    }

    // Convert form data to API format
    const submitData = {
      ...form,
      ingredients: form.ingredients.map(ing => ({
        quantity: ing.quantity,
        unit: ing.unit,
        name: ing.name,
        toTaste: ing.toTaste || false,
        ...(ing.detailedSize && { detailedSize: ing.detailedSize }),
        ...(ing.alternateIngredient !== null && ing.alternateIngredient !== undefined && { alternateIngredient: ing.alternateIngredient }),
        ...(ing.category && ing.category.trim() && { category: ing.category.trim() }),
      })),
      steps: form.steps.map(step => ({
        id: step.id,
        description: step.description,
        ...(step.category && step.category.trim() && { category: step.category.trim() }),
        ...(step.subSteps && step.subSteps.length > 0 && { subSteps: step.subSteps }),
      })),
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

/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
