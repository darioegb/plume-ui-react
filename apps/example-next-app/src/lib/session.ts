import { cookies } from 'next/headers'
import { defaultBrand, isBrand, type BrandId } from '@/theme'

export const SESSION_COOKIE = 'plume-session'
export const COLOR_MODE_COOKIE = 'plume-color-mode'
export const BRAND_COOKIE = 'plume-brand'

export interface User {
  email: string
  name: string
}

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export function userFromEmail(email: string): User {
  const name = email.split('@')[0].split(/[._-]/).filter(Boolean).map(capitalize).join(' ')
  return { email, name: name || 'Guest' }
}

// Simulated session: a real app would sign the cookie or keep a server-side session.
export async function getUser(): Promise<User | null> {
  const email = (await cookies()).get(SESSION_COOKIE)?.value
  return email ? userFromEmail(email) : null
}

export async function getColorMode(): Promise<'light' | 'dark'> {
  return (await cookies()).get(COLOR_MODE_COOKIE)?.value === 'dark' ? 'dark' : 'light'
}

export async function getBrand(): Promise<BrandId> {
  const value = (await cookies()).get(BRAND_COOKIE)?.value
  return isBrand(value) ? value : defaultBrand
}
