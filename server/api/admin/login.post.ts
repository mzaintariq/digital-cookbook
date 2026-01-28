import { createAdminToken, verifyAdminPassword } from '../../utils/auth'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username and password are required',
      })
    }

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminUsername || !adminPasswordHash) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Admin credentials not configured',
      })
    }

    // Verify username
    if (username !== adminUsername) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    // Verify password
    const isValid = await verifyAdminPassword(password, adminPasswordHash)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    // Create token
    const token = await createAdminToken(username)

    // Set cookie
    setCookie(event, 'admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed',
    })
  }
})

