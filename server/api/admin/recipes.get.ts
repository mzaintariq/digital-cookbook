import prisma from '../../utils/prisma'
import { getAdminSession } from '../../utils/auth'
import { serializeAdminRecipe } from '../../utils/recipeSerialization'

export default defineEventHandler(async (event) => {
  try {
    // Check admin authentication
    const session = await getAdminSession(event)
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      })
    }

    // Return all recipes (draft + published) for admin
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return recipes.map((recipe) => serializeAdminRecipe(recipe))
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Error fetching recipes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch recipes',
    })
  }
})

