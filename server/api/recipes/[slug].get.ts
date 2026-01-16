import prisma from '../../utils/prisma'

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

    return recipe
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

