import { computed, reactive, ref, watch, toValue, type MaybeRefOrGetter } from 'vue'
import type { Recipe, Ingredient, Step, SubStep, RecipeImageDto } from '~/types/recipe'

export interface RecipeFormImage {
  storagePath: string
  url: string
  sortOrder: number
  isThumbnail: boolean
}

export interface RecipeForm {
  title: string
  slug: string
  description: string
  credit: string
  videoUrl: string
  servings: number | null
  cookTimeMinutes: number
  prepTimeMinutes: number
  restTimeMinutes: number
  tags: string
  notes: string
  published: boolean
  ingredients: Ingredient[]
  steps: Step[]
  images: RecipeFormImage[]
}

export function useRecipeForm(recipeIdSource: MaybeRefOrGetter<string>) {
  const recipeId = computed(() => toValue(recipeIdSource))
  const isEditMode = computed(() => recipeId.value !== 'new')
  const slugManuallyChanged = ref(false)

  const form = reactive<RecipeForm>({
    title: '',
    slug: '',
    description: '',
    credit: '',
    videoUrl: '',
    servings: null,
    cookTimeMinutes: 0,
    prepTimeMinutes: 0,
    restTimeMinutes: 0,
    tags: '',
    notes: '',
    published: false,
    ingredients: [],
    steps: [],
    images: [],
  })

  const loading = ref(recipeId.value !== 'new')
  const saving = ref(false)
  const error = ref<string | null>(null)
  const fieldErrors = reactive<Record<string, string>>({})
  const recipeFormRef = ref<HTMLFormElement | null>(null)

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  function getInputClasses(fieldName: string): string {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors'
    const hasError = fieldErrors[fieldName]

    if (hasError) {
      return `${baseClasses} border-error-600 focus:ring-error-600 focus:border-error-600 bg-error-50`
    }
    return `${baseClasses} border-paper-400 focus:ring-brand-primary`
  }

  function getTextareaClasses(fieldName: string): string {
    return getInputClasses(fieldName)
  }

  // Watch form.title and auto-generate slug if not manually changed
  watch(() => form.title, (newTitle) => {
    if (process.client && isEditMode.value) {
      window.dispatchEvent(new CustomEvent('recipe-title-update', {
        detail: { title: newTitle || null }
      }))
    }

    if (!slugManuallyChanged.value && newTitle) {
      form.slug = generateSlug(newTitle)
    }
  }, { immediate: true })

  watch(recipeId, async (newId, oldId) => {
    if (oldId === 'new' && newId !== 'new') {
      loading.value = true
      error.value = null
      await loadRecipe()
    }
  })

  async function loadRecipe() {
    if (!isEditMode.value) return

    try {
      const recipes = await $fetch<Recipe[]>('/api/admin/recipes')
      const recipe = recipes.find((r: Recipe) => r.id === recipeId.value)

      if (!recipe) {
        error.value = 'Recipe not found'
        return
      }

      form.title = recipe.title
      form.slug = recipe.slug
      form.servings = recipe.servings || null
      form.cookTimeMinutes = recipe.cookTimeMinutes
      form.prepTimeMinutes = recipe.prepTimeMinutes ?? 0
      form.restTimeMinutes = recipe.restTimeMinutes ?? 0
      form.description = recipe.description || ''
      form.credit = recipe.credit || ''
      form.videoUrl = recipe.videoUrl || ''
      form.tags = recipe.tags.join(', ')
      form.notes = recipe.notes || ''
      form.published = recipe.status === 'publish'

      slugManuallyChanged.value = true

      if (Array.isArray(recipe.images) && recipe.images.length > 0) {
        form.images = [...recipe.images]
          .sort((a: RecipeImageDto, b: RecipeImageDto) => a.sortOrder - b.sortOrder)
          .map((img: RecipeImageDto) => ({
            storagePath: img.storagePath,
            url: img.url,
            sortOrder: img.sortOrder,
            isThumbnail: img.isThumbnail,
          }))
      } else {
        form.images = []
      }

      if (Array.isArray(recipe.ingredients)) {
        form.ingredients = recipe.ingredients.map((ing: Ingredient) => ({
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

      if (Array.isArray(recipe.steps)) {
        form.steps = recipe.steps.map((step: Step) => ({
          id: step.id || generateId(),
          description: step.description || '',
          category: step.category || null,
          subSteps: (step.subSteps || []).map((sub: SubStep) => ({
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
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])

    let hasErrors = false

    if (!form.title || !form.title.trim()) {
      fieldErrors.title = 'Title is required'
      hasErrors = true
    }

    if (!form.slug || !form.slug.trim()) {
      fieldErrors.slug = 'Slug is required'
      hasErrors = true
    }

    if (form.images.length > 0) {
      const thumbs = form.images.filter((i) => i.isThumbnail)
      if (thumbs.length !== 1) {
        error.value = 'Select exactly one image as the thumbnail.'
        hasErrors = true
      }
    }

    if (hasErrors) {
      return
    }

    try {
      saving.value = true
      error.value = null

      if (!form.slug && form.title) {
        form.slug = generateSlug(form.title)
      }

      const imagesPayload = form.images.map((img, index) => ({
        storagePath: img.storagePath,
        sortOrder: index,
        isThumbnail: img.isThumbnail,
      }))

      const submitData = {
        ...form,
        images: imagesPayload,
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

      if (isEditMode.value) {
        await $fetch(`/api/admin/recipes/${recipeId.value}`, {
          method: 'PUT',
          body: submitData,
        })
      } else {
        const created = await $fetch<Recipe>('/api/recipes', {
          method: 'POST',
          body: submitData,
        })
        if (process.client) {
          window.dispatchEvent(new CustomEvent('recipe-saved', {
            detail: { message: 'Recipe created successfully!' },
          }))
          await new Promise(resolve => setTimeout(resolve, 400))
        }
        await navigateTo(`/admin/recipes/${created.id}`)
        return
      }

      if (process.client) {
        window.dispatchEvent(new CustomEvent('recipe-saved', {
          detail: { message: 'Recipe updated successfully!' },
        }))

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      await navigateTo('/admin/recipes')
    } catch (err: any) {
      if (err.data?.errors && typeof err.data.errors === 'object') {
        const topLevelFields = ['title', 'slug', 'description', 'servings', 'cookTimeMinutes', 'prepTimeMinutes', 'restTimeMinutes', 'tags', 'credit', 'videoUrl', 'notes']
        Object.keys(err.data.errors).forEach(field => {
          if (topLevelFields.includes(field) || !field.includes('.')) {
            const errorMsg = Array.isArray(err.data.errors[field])
              ? err.data.errors[field][0]
              : err.data.errors[field]
            fieldErrors[field] = errorMsg
          }
        })
        error.value = null
      } else if (err.data?.statusMessage) {
        const statusMessage = err.data.statusMessage
        error.value = statusMessage

        const lowerMessage = statusMessage.toLowerCase()
        if (lowerMessage.includes('title') && lowerMessage.includes('required')) {
          if (!form.title || !form.title.trim()) {
            fieldErrors.title = 'Title is required'
          }
        }
        if (lowerMessage.includes('slug') && lowerMessage.includes('required')) {
          if (!form.slug || !form.slug.trim()) {
            fieldErrors.slug = 'Slug is required'
          }
        }
        if (lowerMessage.includes('title and slug are required')) {
          if (!form.title || !form.title.trim()) {
            fieldErrors.title = 'Title is required'
          }
          if (!form.slug || !form.slug.trim()) {
            fieldErrors.slug = 'Slug is required'
          }
        }
      } else {
        error.value = err.message || 'Failed to save recipe'
      }
    } finally {
      saving.value = false
    }
  }

  const imageUploading = ref(false)
  const imageUploadError = ref<string | null>(null)

  function syncThumbnailDefaults() {
    if (form.images.length === 0) return
    if (!form.images.some((i) => i.isThumbnail)) {
      const first = form.images[0]
      if (first) first.isThumbnail = true
    }
  }

  function setRecipeFormThumbnail(index: number) {
    form.images.forEach((img, i) => {
      img.isThumbnail = i === index
    })
  }

  function removeRecipeFormImage(index: number) {
    form.images.splice(index, 1)
    syncThumbnailDefaults()
  }

  function reorderRecipeFormImages(newList: RecipeFormImage[]) {
    newList.forEach((img, i) => {
      img.sortOrder = i
    })
    form.images = newList
  }

  async function uploadRecipeImage(file: File) {
    imageUploadError.value = null
    if (!isEditMode.value) {
      imageUploadError.value = 'Save the recipe first, then add images.'
      return
    }
    if (form.images.length >= 5) {
      imageUploadError.value = 'Maximum 5 images per recipe.'
      return
    }
    imageUploading.value = true
    try {
      const fd = new FormData()
      fd.append('recipeId', recipeId.value)
      fd.append('file', file)
      const res = await $fetch<{ storagePath: string, url: string }>('/api/admin/recipes/upload-image', {
        method: 'POST',
        body: fd,
      })
      const isFirst = form.images.length === 0
      form.images.push({
        storagePath: res.storagePath,
        url: res.url,
        sortOrder: form.images.length,
        isThumbnail: isFirst,
      })
      syncThumbnailDefaults()
    } catch (err: any) {
      imageUploadError.value =
        err.data?.statusMessage || err.message || 'Failed to upload image'
    } finally {
      imageUploading.value = false
    }
  }

  return {
    form,
    loading,
    saving,
    error,
    fieldErrors,
    recipeFormRef,
    isEditMode,
    slugManuallyChanged,
    generateId,
    generateSlug,
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
  }
}
