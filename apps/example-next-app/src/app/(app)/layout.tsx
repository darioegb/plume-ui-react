import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { getUser } from '@/lib/session'

export default async function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>): Promise<ReactNode> {
  const user = await getUser()
  if (!user) redirect('/login')
  return <AppShell user={user}>{children}</AppShell>
}
