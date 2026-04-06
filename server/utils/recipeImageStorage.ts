export const RECIPE_IMAGES_BUCKET = 'recipe-images'
export const MAX_RECIPE_IMAGES = 5
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function extForMime(mime: string): string | null {
  const m = mime.toLowerCase().split(';')[0]?.trim()
  if (m === 'image/jpeg') return 'jpg'
  if (m === 'image/png') return 'png'
  if (m === 'image/webp') return 'webp'
  return null
}

export function isAllowedImageMime(mime: string): boolean {
  const m = mime.toLowerCase().split(';')[0]?.trim()
  if (!m) return false
  return ALLOWED_MIME.has(m)
}

export function recipeImagePublicUrl(storagePath: string): string {
  const base = process.env.SUPABASE_URL?.replace(/\/$/, '')
  if (!base) return ''
  return `${base}/storage/v1/object/public/${RECIPE_IMAGES_BUCKET}/${storagePath}`
}

export function storagePathPatternForRecipe(recipeId: string): RegExp {
  return new RegExp(
    `^${recipeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\\.(jpg|jpeg|png|webp)$`,
    'i'
  )
}

export function isStoragePathForRecipe(storagePath: string, recipeId: string): boolean {
  return storagePathPatternForRecipe(recipeId).test(storagePath)
}
