import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'plume-session'
export const COLOR_MODE_COOKIE = 'plume-color-mode'

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
