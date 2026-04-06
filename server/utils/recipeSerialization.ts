import type { Recipe, RecipeImage } from '@prisma/client'
import { recipeImagePublicUrl } from './recipeImageStorage'

type RecipeWithImages = Recipe & { images?: RecipeImage[] }

export function serializeAdminRecipe(recipe: RecipeWithImages) {
  const { images, ...rest } = recipe
  const serializedImages = (images ?? []).map((img) => ({
    id: img.id,
    storagePath: img.storagePath,
    sortOrder: img.sortOrder,
    isThumbnail: img.isThumbnail,
    url: recipeImagePublicUrl(img.storagePath),
  }))
  return {
    ...rest,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    images: serializedImages,
  }
}

export function serializePublicRecipe(recipe: RecipeWithImages) {
  const { images, ...rest } = recipe
  const thumb = images?.find((i) => i.isThumbnail)
  const thumbnailUrl = thumb ? recipeImagePublicUrl(thumb.storagePath) : null
  return {
    ...rest,
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    thumbnailUrl,
  }
}
