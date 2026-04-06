import { createError } from 'h3'
import type { Prisma } from '@prisma/client'
import prisma from './prisma'
import { isStoragePathForRecipe, MAX_RECIPE_IMAGES } from './recipeImageStorage'
import { removeRecipeImageObjectsFromStorage } from './supabaseAdmin'

export interface NormalizedRecipeImageInput {
  storagePath: string
  sortOrder: number
  isThumbnail: boolean
}

export function assertValidRecipeImagesPayload(
  images: unknown,
  recipeId: string
): NormalizedRecipeImageInput[] {
  if (!Array.isArray(images)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'images must be an array',
    })
  }
  if (images.length > MAX_RECIPE_IMAGES) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum 5 images per recipe',
    })
  }
  if (images.length > 0) {
    const thumbs = images.filter((i: { isThumbnail?: boolean }) => i?.isThumbnail === true)
    if (thumbs.length !== 1) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Exactly one image must be marked as thumbnail when any images are present',
      })
    }
  }

  const out: NormalizedRecipeImageInput[] = []
  for (let i = 0; i < images.length; i++) {
    const item = images[i] as { storagePath?: unknown; sortOrder?: unknown; isThumbnail?: unknown }
    if (!item || typeof item.storagePath !== 'string' || !item.storagePath.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: `images[${i}]: storagePath is required`,
      })
    }
    const path = item.storagePath.trim()
    if (!isStoragePathForRecipe(path, recipeId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid image path for this recipe',
      })
    }
    out.push({
      storagePath: path,
      sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : i,
      isThumbnail: item.isThumbnail === true,
    })
  }

  const paths = new Set(out.map((o) => o.storagePath))
  if (paths.size !== out.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Duplicate image paths are not allowed',
    })
  }

  return out
}

export async function replaceRecipeImagesForRecipe(
  recipeId: string,
  normalized: NormalizedRecipeImageInput[]
): Promise<void> {
  const existing = await prisma.recipeImage.findMany({
    where: { recipeId },
    select: { storagePath: true },
  })
  const oldPaths = new Set(existing.map((e) => e.storagePath))
  const newPaths = new Set(normalized.map((n) => n.storagePath))
  const toRemoveFromStorage = [...oldPaths].filter((p) => !newPaths.has(p))

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.recipeImage.deleteMany({ where: { recipeId } })
    if (normalized.length > 0) {
      await tx.recipeImage.createMany({
        data: normalized.map((row) => ({
          recipeId,
          storagePath: row.storagePath,
          sortOrder: row.sortOrder,
          isThumbnail: row.isThumbnail,
        })),
      })
    }
  })

  if (toRemoveFromStorage.length > 0) {
    await removeRecipeImageObjectsFromStorage(toRemoveFromStorage)
  }
}
