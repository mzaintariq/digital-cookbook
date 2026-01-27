import type { Step } from '~/types/recipe'

export function useRecipeSteps(
  steps: Ref<Step[]>,
  generateId: () => string,
  stepCategories: ComputedRef<string[]>
) {
  function addStep(category?: string) {
    steps.value.push({
      id: generateId(),
      description: '',
      category: category || null,
      subSteps: [],
    })
  }

  function removeStep(index: number) {
    steps.value.splice(index, 1)
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

  function rebuildStepsPreservingCategoryOrder() {
    const currentCategoryOrder = stepCategories.value
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
    currentCategoryOrder.forEach((cat: string) => {
      if (stepsByCat[cat]) {
        reordered.push(...stepsByCat[cat])
      }
    })
    reordered.push(...uncategorized)
    
    steps.value = reordered
  }

  function rebuildStepsPreservingCategoryOrderWithNewList(category: string, newList: Step[]) {
    const currentCategoryOrder = stepCategories.value
    const stepsByCat: { [key: string]: Step[] } = {}
    const uncategorized: Step[] = []
    
    steps.value.forEach(step => {
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
    
    steps.value = reordered
  }

  function rebuildStepsPreservingCategoryOrderWithNewListForUncategorized(newList: Step[]) {
    const currentCategoryOrder = stepCategories.value
    const stepsByCat: { [key: string]: Step[] } = {}
    
    steps.value.forEach(step => {
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
    
    steps.value = reordered
  }

  return {
    addStep,
    removeStep,
    addSubStep,
    removeSubStep,
    rebuildStepsPreservingCategoryOrder,
    rebuildStepsPreservingCategoryOrderWithNewList,
    rebuildStepsPreservingCategoryOrderWithNewListForUncategorized,
  }
}
