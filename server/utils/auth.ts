import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import bcrypt from 'bcrypt'
import { createError, parseCookies } from 'h3'

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET

  if (!secret?.trim()) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JWT authentication is not configured',
    })
  }

  return new TextEncoder().encode(secret)
}

export interface AdminSession {
  email: string
  isAdmin: true
}

export async function createAdminToken(email: string): Promise<string> {
  const payload: JWTPayload = { email, isAdmin: true }
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret())

  return token
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  const secret = getJwtSecret()

  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.isAdmin && payload.email && typeof payload.email === 'string') {
      return { email: payload.email, isAdmin: true }
    }
    return null
  } catch {
    return null
  }
}

export async function verifyAdminPassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, hashedPassword)
}

export function getAdminTokenFromRequest(event: any): string | null {
  const cookies = parseCookies(event)
  return cookies.admin_token || null
}

export async function getAdminSession(event: any): Promise<AdminSession | null> {
  const token = getAdminTokenFromRequest(event)
  if (!token) return null
  return verifyAdminToken(token)
}
