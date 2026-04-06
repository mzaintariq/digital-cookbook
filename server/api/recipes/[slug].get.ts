import prisma from '../../utils/prisma'
import { serializePublicRecipe } from '../../utils/recipeSerialization'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug is required',
      })
    }

    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        images: {
          where: { isThumbnail: true },
          take: 1,
        },
      },
    })

    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found',
      })
    }

    // Public endpoint - only return if published
    if (recipe.status !== 'publish') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found',
      })
    }

    return serializePublicRecipe(recipe)
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recipe',
    })
  }
})

