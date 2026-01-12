<template>
  <div class="container">
    <h1>Recipe Vault</h1>
    
    <!-- Recipe Form -->
    <form @submit.prevent="submitRecipe" class="recipe-form">
      <h2>Add New Recipe</h2>
      
      <div class="form-group">
        <label for="title">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          placeholder="e.g., Chocolate Chip Cookies"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          placeholder="Optional description..."
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="prepTime">Prep Time (minutes)</label>
          <input
            id="prepTime"
            v-model.number="form.prepTime"
            type="number"
            min="0"
            placeholder="15"
          />
        </div>

        <div class="form-group">
          <label for="cookTime">Cook Time (minutes)</label>
          <input
            id="cookTime"
            v-model.number="form.cookTime"
            type="number"
            min="0"
            placeholder="30"
          />
        </div>

        <div class="form-group">
          <label for="servings">Servings</label>
          <input
            id="servings"
            v-model.number="form.servings"
            type="number"
            min="1"
            placeholder="4"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients *</label>
        <textarea
          id="ingredients"
          v-model="form.ingredients"
          rows="6"
          required
          placeholder="Enter one ingredient per line&#10;e.g.,&#10;2 cups flour&#10;1 cup sugar&#10;3 eggs"
        />
      </div>

      <div class="form-group">
        <label for="instructions">Instructions *</label>
        <textarea
          id="instructions"
          v-model="form.instructions"
          rows="8"
          required
          placeholder="Enter one step per line&#10;e.g.,&#10;Preheat oven to 350°F&#10;Mix dry ingredients&#10;Bake for 20 minutes"
        />
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Saving...' : 'Save Recipe' }}
      </button>
    </form>

    <!-- Recipes List -->
    <div class="recipes-list">
      <h2>Recipes ({{ recipes.length }})</h2>
      
      <div v-if="loadingRecipes" class="loading">Loading recipes...</div>
      
      <div v-else-if="recipes.length === 0" class="empty-state">
        No recipes yet. Add your first recipe above!
      </div>

      <div v-else class="recipes-grid">
        <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
          <h3>{{ recipe.title }}</h3>
          
          <p v-if="recipe.description" class="description">
            {{ recipe.description }}
          </p>

          <div class="recipe-meta">
            <span v-if="recipe.prepTime">Prep: {{ recipe.prepTime }}min</span>
            <span v-if="recipe.cookTime">Cook: {{ recipe.cookTime }}min</span>
            <span v-if="recipe.servings">{{ recipe.servings }} servings</span>
          </div>

          <div class="recipe-content">
            <div v-if="Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0">
              <strong>Ingredients:</strong>
              <ul>
                <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx">
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div v-if="Array.isArray(recipe.instructions) && recipe.instructions.length > 0">
              <strong>Instructions:</strong>
              <ol>
                <li v-for="(instruction, idx) in recipe.instructions" :key="idx">
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>

          <div class="recipe-date">
            Added {{ new Date(recipe.createdAt).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Recipe {
  id: string
  title: string
  description: string | null
  ingredients: string[]
  instructions: string[]
  prepTime: number | null
  cookTime: number | null
  servings: number | null
  createdAt: string
  updatedAt: string
}

const form = reactive({
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  prepTime: null as number | null,
  cookTime: null as number | null,
  servings: null as number | null,
})

const recipes = ref<Recipe[]>([])
const loading = ref(false)
const loadingRecipes = ref(true)

// Fetch recipes on mount
onMounted(async () => {
  await fetchRecipes()
})

async function fetchRecipes() {
  try {
    loadingRecipes.value = true
    const data = await $fetch<Recipe[]>('/api/recipes')
    recipes.value = data
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
  } finally {
    loadingRecipes.value = false
  }
}

async function submitRecipe() {
  try {
    loading.value = true
    
    await $fetch('/api/recipes', {
      method: 'POST',
      body: {
        title: form.title,
        description: form.description || null,
        ingredients: form.ingredients,
        instructions: form.instructions,
        prepTime: form.prepTime,
        cookTime: form.cookTime,
        servings: form.servings,
      },
    })

    // Reset form
    form.title = ''
    form.description = ''
    form.ingredients = ''
    form.instructions = ''
    form.prepTime = null
    form.cookTime = null
    form.servings = null

    // Refresh recipes list
    await fetchRecipes()
  } catch (error) {
    console.error('Failed to save recipe:', error)
    alert('Failed to save recipe. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #444;
}

.recipe-form {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.submit-btn {
  background: #4CAF50;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #45a049;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.recipes-list {
  margin-top: 3rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.recipe-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.recipe-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recipe-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.description {
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
}

.recipe-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #777;
}

.recipe-content {
  margin-top: 1rem;
}

.recipe-content ul,
.recipe-content ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.recipe-content li {
  margin: 0.25rem 0;
  color: #555;
}

.recipe-date {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.85rem;
  color: #999;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>

