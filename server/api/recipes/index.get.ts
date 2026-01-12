import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const recipes = await prisma.recipe.findMany({
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

