import { createError } from 'h3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { RECIPE_IMAGES_BUCKET } from './recipeImageStorage'

let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Image storage is not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)',
    })
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}

export async function removeRecipeImageObjectsFromStorage(storagePaths: string[]): Promise<void> {
  if (storagePaths.length === 0) return
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.warn('Skipping recipe image storage cleanup: Supabase env not set')
    return
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { error } = await supabase.storage.from(RECIPE_IMAGES_BUCKET).remove(storagePaths)
  if (error) {
    console.error('Supabase storage remove error:', error.message)
  }
}
