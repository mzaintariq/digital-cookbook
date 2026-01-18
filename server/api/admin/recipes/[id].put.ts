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

    // Handle structured ingredients (array of objects)
    let ingredients: any[] = []
    if (Array.isArray(body.ingredients)) {
      // Validate and clean ingredient objects
      ingredients = body.ingredients.map((ing: any) => ({
        quantity: parseFloat(ing.quantity) || 1,
        unit: ing.unit || 'pcs',
        name: ing.name || '',
        ...(ing.detailedSize && {
          detailedSize: {
            amount: parseFloat(ing.detailedSize.amount) || 0,
            unit: ing.detailedSize.unit || 'oz'
          }
        })
      })).filter((ing: any) => ing.name.trim())
    }
    
    // Handle steps (array of objects or strings)
    let steps: string[] = []
    if (Array.isArray(body.steps)) {
      // If steps are objects with description, extract descriptions
      if (body.steps.length > 0 && typeof body.steps[0] === 'object' && body.steps[0].description) {
        steps = body.steps.map((step: any) => step.description || '').filter((s: string) => s.trim())
      } else if (typeof body.steps[0] === 'string') {
        steps = body.steps.filter((s: string) => s.trim())
      }
    } else if (typeof body.steps === 'string') {
      steps = body.steps.split('\n').filter((line: string) => line.trim())
    }

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
        ingredients: ingredients as any, // Store as JSON
        steps: steps,
        cookTimeMinutes: parseInt(body.cookTimeMinutes) || 0,
        servings: body.servings ? parseInt(body.servings) : null,
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

