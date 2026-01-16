<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="mb-6">
        <NuxtLink to="/admin/recipes" class="text-blue-600 hover:text-blue-800">
          ← Back to recipes
        </NuxtLink>
      </div>

      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Recipe</h1>

      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-1">
            Slug * (unique, lowercase, hyphens)
          </label>
          <input
            id="slug"
            v-model="form.slug"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="chicken-karahi"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="cookTimeMinutes" class="block text-sm font-medium text-gray-700 mb-1">
              Cooking Time (minutes) *
            </label>
            <input
              id="cookTimeMinutes"
              v-model.number="form.cookTimeMinutes"
              type="number"
              required
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="spiceLevel" class="block text-sm font-medium text-gray-700 mb-1">
              Spice Level (1-5) *
            </label>
            <input
              id="spiceLevel"
              v-model.number="form.spiceLevel"
              type="number"
              required
              min="1"
              max="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

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

        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            v-model="form.tags"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="pakistani, curry, spicy"
          />
        </div>

        <div>
          <label for="ingredients" class="block text-sm font-medium text-gray-700 mb-1">
            Ingredients * (one per line)
          </label>
          <textarea
            id="ingredients"
            v-model="form.ingredients"
            required
            rows="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2 cups chicken&#10;1 onion&#10;2 tomatoes"
          />
        </div>

        <div>
          <label for="steps" class="block text-sm font-medium text-gray-700 mb-1">
            Steps * (one per line)
          </label>
          <textarea
            id="steps"
            v-model="form.steps"
            required
            rows="10"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Heat oil in a pan&#10;Add onions and cook until golden&#10;Add chicken and cook for 10 minutes"
          />
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="flex items-center">
            <input
              v-model="form.published"
              type="checkbox"
              class="mr-2"
            />
            <span class="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Save Recipe' }}
          </button>
          <NuxtLink
            to="/admin/recipes"
            class="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  title: '',
  slug: '',
  ingredients: '',
  steps: '',
  cookTimeMinutes: 0,
  spiceLevel: 1,
  tags: '',
  notes: '',
  rating: 3,
  published: false,
})

const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    await $fetch('/api/recipes', {
      method: 'POST',
      body: form,
    })

    await navigateTo('/admin/recipes')
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Failed to create recipe'
  } finally {
    loading.value = false
  }
}
</script>

