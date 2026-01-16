import { getAdminSession } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  
  // Only protect /admin routes (except /admin/login)
  if (url.startsWith('/admin') && !url.startsWith('/admin/login')) {
    const session = await getAdminSession(event)
    
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Admin access required',
      })
    }
    
    // Attach session to event context for use in API routes
    event.context.adminSession = session
  }
})

