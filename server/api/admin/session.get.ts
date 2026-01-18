import { getAdminSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  
  if (session) {
    return { 
      loggedIn: true,
      email: session.email 
    }
  }
  
  return { 
    loggedIn: false 
  }
})

