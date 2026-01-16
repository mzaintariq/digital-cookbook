import prisma from '../../../utils/prisma'
import { getAdminSession } from '../../../utils/auth'

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

    await prisma.recipe.delete({
      where: { id },
    })

    return { success: true }
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
      statusMessage: 'Failed to delete recipe',
    })
  }
})

