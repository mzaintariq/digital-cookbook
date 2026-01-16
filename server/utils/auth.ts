import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'
import { parseCookies } from 'h3'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface AdminSession {
  email: string
  isAdmin: true
}

export async function createAdminToken(email: string): Promise<string> {
  const token = await new SignJWT({ email, isAdmin: true } as AdminSession)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.isAdmin && payload.email) {
      return payload as AdminSession
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

