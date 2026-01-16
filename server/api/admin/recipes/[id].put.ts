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

    const body = await readBody(event)

    // Convert ingredients and steps from newline-separated strings to arrays
    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients
      : body.ingredients
        ? body.ingredients.split('\n').filter((line: string) => line.trim())
        : []
    
    const steps = Array.isArray(body.steps)
      ? body.steps
      : body.steps
        ? body.steps.split('\n').filter((line: string) => line.trim())
        : []

    // Convert tags from comma-separated string to array
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags
        ? body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : []

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        ingredients: ingredients,
        steps: steps,
        cookTimeMinutes: parseInt(body.cookTimeMinutes) || 0,
        spiceLevel: parseInt(body.spiceLevel) || 1,
        tags: tags,
        notes: body.notes || null,
        rating: parseInt(body.rating) || 3,
        approvedBy: body.published ? session.email : 'System',
        status: body.published ? 'publish' : 'draft',
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
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'A recipe with this slug already exists',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update recipe',
    })
  }
})

