import { getAdminSession } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''
  
  // Only protect /admin routes (except /admin/login)
  if (url.startsWith('/admin') && !url.startsWith('/admin/login')) {
    const session = await getAdminSession(event)
    
    if (!session) {
      // Check if it's a page request (not an API request)
      const isApiRequest = url.startsWith('/api/')
      
      if (isApiRequest) {
        // For API requests, return 401 error
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized - Admin access required',
        })
      } else {
        // For page requests, redirect to login
        return sendRedirect(event, '/admin/login', 302)
      }
    }
    
    // Attach session to event context for use in API routes
    event.context.adminSession = session
  }
})

