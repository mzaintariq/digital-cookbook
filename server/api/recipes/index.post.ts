import prisma from '../../utils/prisma'
import { getAdminSession } from '../../utils/auth'
import { assertValidRecipeImagesPayload } from '../../utils/recipeImagesSync'
import { serializeAdminRecipe } from '../../utils/recipeSerialization'
import type { Ingredient, Step, SubStep } from '~/types/recipe'

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

    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and slug are required',
      })
    }

    // Handle structured ingredients (array of objects)
    let ingredients: Ingredient[] = []
    if (Array.isArray(body.ingredients)) {
      // Validate and clean ingredient objects
      ingredients = body.ingredients.map((ing: Partial<Ingredient>) => ({
        quantity: parseFloat(String(ing.quantity)) || 1,
        unit: ing.unit || 'pcs',
        name: ing.name || '',
        toTaste: ing.toTaste || false,
        ...(ing.detailedSize && {
          detailedSize: {
            amount: parseFloat(String(ing.detailedSize.amount)) || 0,
            unit: ing.detailedSize.unit || 'oz'
          }
        }),
        ...(ing.alternateIngredient !== null && ing.alternateIngredient !== undefined && { alternateIngredient: ing.alternateIngredient }),
        ...(ing.category && ing.category.trim() && { category: ing.category.trim() })
      })).filter((ing: Ingredient) => ing.name.trim())
    }

    // Handle steps (array of structured objects)
    let steps: Step[] = []
    if (Array.isArray(body.steps)) {
      steps = body.steps.map((step: Partial<Step>) => ({
        id: step.id || `step-${Math.random().toString(36).substr(2, 9)}`,
        description: step.description || '',
        ...(step.category && step.category.trim() && { category: step.category.trim() }),
        ...(step.subSteps && Array.isArray(step.subSteps) && step.subSteps.length > 0 && {
          subSteps: step.subSteps.map((sub: Partial<SubStep>) => ({
            id: sub.id || `substep-${Math.random().toString(36).substr(2, 9)}`,
            description: sub.description || ''
          }))
        })
      })).filter((step: Step) => step.description.trim())
    }

    // Convert tags from comma-separated string to array
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags
        ? body.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : []

    const imagesPayload = 'images' in body ? body.images : undefined

    const created = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description || null,
          credit: body.credit || null,
          videoUrl: body.videoUrl || null,
          ingredients: ingredients as any, // Store as JSON
          steps: steps as any, // Store as JSON
          cookTimeMinutes: parseInt(body.cookTimeMinutes) || 0,
          prepTimeMinutes: body.prepTimeMinutes ? parseInt(body.prepTimeMinutes) : null,
          restTimeMinutes: body.restTimeMinutes ? parseInt(body.restTimeMinutes) : null,
          servings: body.servings ? parseInt(body.servings) : null,
          tags: tags,
          notes: body.notes || null,
          approvedBy: body.published ? session.email : 'System',
          status: body.published ? 'publish' : 'draft',
        },
      })

      if (imagesPayload !== undefined) {
        const normalized = assertValidRecipeImagesPayload(imagesPayload, recipe.id)
        if (normalized.length > 0) {
          await tx.recipeImage.createMany({
            data: normalized.map((row) => ({
              recipeId: recipe.id,
              storagePath: row.storagePath,
              sortOrder: row.sortOrder,
              isThumbnail: row.isThumbnail,
            })),
          })
        }
      }

      return recipe
    })

    const full = await prisma.recipe.findUniqueOrThrow({
      where: { id: created.id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    })

    return serializeAdminRecipe(full)
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'A recipe with this slug already exists',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create recipe',
    })
  }
})

