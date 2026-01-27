export interface Ingredient {
  id?: string
  quantity: number
  unit: string
  name: string
  toTaste?: boolean
  detailedSize?: {
    amount: number
    unit: string
  } | null
  alternateIngredient?: string | null
  category?: string | null
}

export interface SubStep {
  id: string
  description: string
}

export interface Step {
  id: string
  description: string
  category?: string | null
  subSteps?: SubStep[]
}

export interface Recipe {
  id: string
  title: string
  slug: string
  description?: string | null
  credit?: string | null
  videoUrl?: string | null
  ingredients: Ingredient[]
  steps: Step[]
  cookTimeMinutes: number
  prepTimeMinutes?: number | null
  restTimeMinutes?: number | null
  servings?: number | null
  tags: string[]
  notes?: string | null
  approvedBy: string
  status: string
  createdAt: string | Date
  updatedAt: string | Date
}
