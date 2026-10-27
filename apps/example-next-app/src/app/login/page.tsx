import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/session'
import { LoginForm } from './login-form'
import styles from './login.module.css'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage(): Promise<ReactNode> {
  if (await getUser()) redirect('/')
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  )
}
