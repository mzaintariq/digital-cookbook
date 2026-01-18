import prisma from '../../utils/prisma'
import { getAdminSession } from '../../utils/auth'

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
    })

    return recipes
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

