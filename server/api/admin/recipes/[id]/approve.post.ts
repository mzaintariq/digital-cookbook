import prisma from '../../../../utils/prisma'
import { getAdminSession } from '../../../../utils/auth'

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

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Recipe ID is required',
      })
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        status: 'publish',
        approvedBy: session.email,
      },
    })

    return recipe
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Recipe not found',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to publish recipe',
    })
  }
})

