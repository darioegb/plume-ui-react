import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { LanguageSwitcher } from '@/components/language-switcher'
import { getUser } from '@/lib/session'
import { LoginForm } from './login-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('login')
  return { title: t('title') }
}

export default async function LoginPage(): Promise<ReactNode> {
  if (await getUser()) redirect('/')
  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher />
      </div>
      <LoginForm />
    </main>
  )
}
