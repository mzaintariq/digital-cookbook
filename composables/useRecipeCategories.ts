import type { Ingredient, Step } from '~/types/recipe'

export function useRecipeCategories(
  ingredients: Ref<Ingredient[]>,
  steps: Ref<Step[]>
) {
  // Ingredient category state
  const editingCategory = ref<string | null>(null)
  const newCategoryName = ref('')
  const showAddCategory = ref(false)

  // Step category state
  const editingStepCategory = ref<string | null>(null)
  const newStepCategoryName = ref('')
  const showAddStepCategory = ref(false)

  // Ingredient categories
  const categories = computed(() => {
    const categoryOrder: string[] = []
    const seen = new Set<string>()
    
    ingredients.value.forEach(ing => {
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

  const ingredientsByCategory = computed(() => {
    const grouped: { [key: string]: Ingredient[] } = {}
    const uncategorized: Ingredient[] = []
    
    ingredients.value.forEach(ing => {
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

  // Step categories
  const stepCategories = computed(() => {
    const categoryOrder: string[] = []
    const seen = new Set<string>()
    
    steps.value.forEach(step => {
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

  const stepsByCategory = computed(() => {
    const grouped: { [key: string]: Step[] } = {}
    const uncategorized: Step[] = []
    
    steps.value.forEach(step => {
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

  // Ingredient category functions
  function updateCategoryOrder(newCategoryOrder: string[]) {
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
    newCategoryOrder.forEach(cat => {
      if (ingredientsByCat[cat]) {
        reordered.push(...ingredientsByCat[cat])
      }
    })
    reordered.push(...uncategorized)
    
    ingredients.value = reordered
  }

  function startEditCategory(category: string) {
    editingCategory.value = category
    newCategoryName.value = category
  }

  function saveCategoryEdit(oldCategory: string) {
    if (newCategoryName.value.trim() && newCategoryName.value.trim() !== oldCategory) {
      ingredients.value.forEach(ing => {
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
    ingredients.value.forEach(ing => {
      if (ing.category === category) {
        ing.category = null
      }
    })
  }

  // Step category functions
  function updateStepCategoryOrder(newCategoryOrder: string[]) {
    const stepsByCat: { [key: string]: Step[] } = {}
    const uncategorized: Step[] = []
    
    steps.value.forEach(step => {
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
    
    steps.value = reordered
  }

  function startEditStepCategory(category: string) {
    editingStepCategory.value = category
    newStepCategoryName.value = category
  }

  function saveStepCategoryEdit(oldCategory: string) {
    if (newStepCategoryName.value.trim() && newStepCategoryName.value.trim() !== oldCategory) {
      steps.value.forEach(step => {
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
    steps.value.forEach(step => {
      if (step.category === category) {
        step.category = null
      }
    })
  }

  return {
    // Ingredient category state
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
    // Step category state
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
  }
}
