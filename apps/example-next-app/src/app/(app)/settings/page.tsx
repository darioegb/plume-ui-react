import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { SettingsForm } from './settings-form'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage(): ReactNode {
  return (
    <>
      <PageHeader description="Appearance, notifications and the workspace." title="Settings" />
      <SettingsForm />
    </>
  )
}
