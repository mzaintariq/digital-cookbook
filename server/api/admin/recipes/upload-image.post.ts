import { randomUUID } from 'node:crypto'
import { readMultipartFormData } from 'h3'
import prisma from '../../../utils/prisma'
import { getAdminSession } from '../../../utils/auth'
import { getSupabaseAdmin } from '../../../utils/supabaseAdmin'
import {
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_RECIPE_IMAGES,
  extForMime,
  isAllowedImageMime,
  RECIPE_IMAGES_BUCKET,
  recipeImagePublicUrl,
} from '../../../utils/recipeImageStorage'

export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Admin access required',
    })
  }

  const parts = await readMultipartFormData(event)
  if (!parts?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expected multipart form data',
    })
  }

  let recipeId: string | undefined
  let fileBuffer: Buffer | undefined
  let mime = 'application/octet-stream'

  for (const p of parts) {
    if (p.name === 'recipeId' && p.data) {
      recipeId = p.data.toString('utf8').trim()
    }
    if (p.name === 'file' && p.filename && p.data?.length) {
      fileBuffer = p.data
      if (p.type) mime = p.type
    }
  }

  if (!recipeId) {
    throw createError({ statusCode: 400, statusMessage: 'recipeId is required' })
  }
  if (!fileBuffer?.length) {
    throw createError({ statusCode: 400, statusMessage: 'file is required' })
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Recipe not found' })
  }

  const count = await prisma.recipeImage.count({ where: { recipeId } })
  if (count >= MAX_RECIPE_IMAGES) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum 5 images per recipe',
    })
  }

  if (!isAllowedImageMime(mime)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Only JPEG, PNG, or WebP are allowed',
    })
  }

  if (fileBuffer.length > MAX_IMAGE_UPLOAD_BYTES) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File is too large (max 10MB)',
    })
  }

  const ext = extForMime(mime)
  if (!ext) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image type' })
  }

  const storagePath = `${recipeId}/${randomUUID()}.${ext}`
  const contentType = mime.split(';')[0]?.trim() || `image/${ext === 'jpg' ? 'jpeg' : ext}`

  const supabase = getSupabaseAdmin()
  const { error } = await supabase.storage.from(RECIPE_IMAGES_BUCKET).upload(storagePath, fileBuffer, {
    contentType,
    upsert: false,
  })

  if (error) {
    console.error('Supabase upload error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image',
    })
  }

  return {
    storagePath,
    url: recipeImagePublicUrl(storagePath),
  }
})
