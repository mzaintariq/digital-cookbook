import prisma from '../../utils/prisma'

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
    })
    return recipes
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recipes',
    })
  }
})

