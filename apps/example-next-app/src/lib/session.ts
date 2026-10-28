import { cookies } from 'next/headers'
import type { ColorModeSetting } from 'plume-ui-react'
import { defaultBrand, isBrand, type BrandId } from '@/theme'
import { userFromEmail, type User } from '@/lib/user'

export const SESSION_COOKIE = 'plume-session'
export const COLOR_MODE_COOKIE = 'plume-color-mode'
export const BRAND_COOKIE = 'plume-brand'

// Simulated session: a real app would sign the cookie or keep a server-side session.
export async function getUser(): Promise<User | null> {
  const email = (await cookies()).get(SESSION_COOKIE)?.value
  return email ? userFromEmail(email) : null
}

// Without a saved choice the app follows the browser's color scheme.
export async function getColorMode(): Promise<ColorModeSetting> {
  const value = (await cookies()).get(COLOR_MODE_COOKIE)?.value
  return value === 'light' || value === 'dark' ? value : 'system'
}

export async function getBrand(): Promise<BrandId> {
  const value = (await cookies()).get(BRAND_COOKIE)?.value
  return isBrand(value) ? value : defaultBrand
}
