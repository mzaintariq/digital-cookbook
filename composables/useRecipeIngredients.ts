import type { Ingredient } from '~/types/recipe'

export function useRecipeIngredients(
  ingredients: Ref<Ingredient[]>,
  generateId: () => string,
  newCategoryName: Ref<string>,
  showAddCategory: Ref<boolean>
) {
  function addIngredient(category?: string) {
    ingredients.value.push({
      id: generateId(),
      quantity: 1,
      unit: 'pcs',
      name: '',
      toTaste: false,
      detailedSize: null,
      alternateIngredient: null,
      category: category || null,
    })
    
    if (newCategoryName.value.trim() && !category) {
      const lastIngredient = ingredients.value[ingredients.value.length - 1]
      if (lastIngredient) {
        lastIngredient.category = newCategoryName.value.trim()
        newCategoryName.value = ''
        showAddCategory.value = false
      }
    }
  }

  function removeIngredient(index: number) {
    ingredients.value.splice(index, 1)
  }

  function handleToTasteChange(ingredient: Ingredient) {
    if (ingredient.toTaste) {
      ingredient.detailedSize = null
    }
  }

  function rebuildIngredientsPreservingCategoryOrder(categories: string[]) {
    const currentCategoryOrder = categories
    const ingredientsByCat: { [key: string]: Ingredient[] } = {}
    const uncategorized: Ingredient[] = []
    
    ingredients.value.forEach(ing => {
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
    
    const reordered: Ingredient[] = []
    currentCategoryOrder.forEach(cat => {
      if (ingredientsByCat[cat]) {
        reordered.push(...ingredientsByCat[cat])
      }
    })
    reordered.push(...uncategorized)
    
    ingredients.value = reordered
  }

  return {
    addIngredient,
    removeIngredient,
    handleToTasteChange,
    rebuildIngredientsPreservingCategoryOrder,
  }
}
