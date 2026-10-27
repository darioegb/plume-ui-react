import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { EmptyState, Icon } from 'plume-ui-react'
import { SettingsIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage(): ReactNode {
  return (
    <>
      <PageHeader description="Workspace preferences, notifications and appearance." title="Settings" />
      <EmptyState
        description="The settings arrive in the next step of this example."
        icon={
          <Icon>
            <SettingsIcon />
          </Icon>
        }
        title="Nothing here yet"
        variant="outline"
      />
    </>
  )
}
