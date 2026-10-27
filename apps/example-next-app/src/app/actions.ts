'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COLOR_MODE_COOKIE, SESSION_COOKIE } from '@/lib/session'

export interface SignInState {
  email?: string
  errors?: { email?: string; password?: string }
}

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const errors: SignInState['errors'] = {}
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (password.length < 6) errors.password = 'Use at least 6 characters.'
  if (errors.email || errors.password) return { email, errors }

  ;(await cookies()).set(SESSION_COOKIE, email, { httpOnly: true, path: '/', sameSite: 'lax' })
  redirect('/')
}

export async function signOut(): Promise<void> {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/login')
}

export async function saveColorMode(mode: string): Promise<void> {
  if (mode !== 'light' && mode !== 'dark') return
  ;(await cookies()).set(COLOR_MODE_COOKIE, mode, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}
