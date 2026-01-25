export interface Ingredient {
  quantity: number
  unit: string
  name: string
  toTaste?: boolean
  detailedSize?: {
    amount: number
    unit: string
  }
  alternateIngredient?: string | null
  category?: string | null
}

export interface Recipe {
  id: string
  title: string
  slug: string
  description?: string | null
  credit?: string | null
  videoUrl?: string | null
  ingredients: Ingredient[] | string[]
  steps: string[]
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
