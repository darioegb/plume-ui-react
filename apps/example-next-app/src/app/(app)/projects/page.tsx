import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { EmptyState, Icon } from 'plume-ui-react'
import { FolderIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsPage(): ReactNode {
  return (
    <>
      <PageHeader description="Every project of the workspace, with its status and owners." title="Projects" />
      <EmptyState
        description="The project list arrives in the next step of this example."
        icon={
          <Icon>
            <FolderIcon />
          </Icon>
        }
        title="Nothing here yet"
        variant="outline"
      />
    </>
  )
}
