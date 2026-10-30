'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { LOCALE_COOKIE, isLocale } from '@/i18n/config'
import { addProject, getProjects, type NewProjectInput } from '@/lib/data'
import { BRAND_COOKIE, COLOR_MODE_COOKIE, SESSION_COOKIE, getUser } from '@/lib/session'
import { isBrand } from '@/theme'
import { validateNewProject, type NewProjectErrors, type ValidationKey } from '@/lib/validation'

export interface SignInState {
  email?: string
  errors?: { email?: ValidationKey; password?: ValidationKey }
}

export async function signIn(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const errors: SignInState['errors'] = {}
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'emailInvalid'
  if (password.length < 6) errors.password = 'passwordShort'
  if (errors.email || errors.password) return { email, errors }

  ;(await cookies()).set(SESSION_COOKIE, email, { httpOnly: true, path: '/', sameSite: 'lax' })
  redirect('/')
}

export async function signOut(): Promise<void> {
  ;(await cookies()).delete(SESSION_COOKIE)
  redirect('/login')
}

export async function saveColorMode(mode: string): Promise<void> {
  if (mode !== 'light' && mode !== 'dark' && mode !== 'system') return
  ;(await cookies()).set(COLOR_MODE_COOKIE, mode, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}

export async function createProject(
  input: NewProjectInput,
): Promise<{ errors?: NewProjectErrors; name?: string }> {
  if (!(await getUser())) redirect('/login')
  const existing = await getProjects()
  const errors = validateNewProject(
    input,
    existing.map((project) => project.name),
  )
  if (Object.keys(errors).length > 0) return { errors }

  const project = await addProject({ ...input, name: input.name.trim() })
  revalidatePath('/')
  revalidatePath('/projects')
  return { name: project.name }
}

export async function saveBrand(brand: string): Promise<void> {
  if (!isBrand(brand)) return
  ;(await cookies()).set(BRAND_COOKIE, brand, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}

export async function saveLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return
  ;(await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
}
