import prisma from '../../utils/prisma'
import { serializePublicRecipe } from '../../utils/recipeSerialization'

export default defineEventHandler(async (event) => {
  try {
    // Public endpoint - only return published recipes
    const recipes = await prisma.recipe.findMany({
      where: {
        status: 'publish',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          where: { isThumbnail: true },
          take: 1,
        },
      },
    })

    return recipes.map((recipe) => serializePublicRecipe(recipe))
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recipes',
    })
  }
})

