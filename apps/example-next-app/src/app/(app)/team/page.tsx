import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { EmptyState, Icon } from 'plume-ui-react'
import { TeamIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = { title: 'Team' }

export default function TeamPage(): ReactNode {
  return (
    <>
      <PageHeader description="The people working on your projects." title="Team" />
      <EmptyState
        description="The team directory arrives in the next step of this example."
        icon={
          <Icon>
            <TeamIcon />
          </Icon>
        }
        title="Nothing here yet"
        variant="outline"
      />
    </>
  )
}
