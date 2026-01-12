import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required',
      })
    }

    // Convert ingredients and instructions to JSON arrays if they're strings
    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients
      : body.ingredients
        ? body.ingredients.split('\n').filter((line: string) => line.trim())
        : []
    
    const instructions = Array.isArray(body.instructions)
      ? body.instructions
      : body.instructions
        ? body.instructions.split('\n').filter((line: string) => line.trim())
        : []

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title,
        description: body.description || null,
        ingredients: ingredients,
        instructions: instructions,
        prepTime: body.prepTime ? parseInt(body.prepTime) : null,
        cookTime: body.cookTime ? parseInt(body.cookTime) : null,
        servings: body.servings ? parseInt(body.servings) : null,
      },
    })

    return recipe
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create recipe',
    })
  }
})

