import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { getProjects } from '@/lib/data'
import { ProjectsBoard } from './projects-board'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage(): Promise<ReactNode> {
  const projects = await getProjects()
  return (
    <>
      <PageHeader description="Every project of the workspace, with its status and owner." title="Projects" />
      <ProjectsBoard projects={projects} />
    </>
  )
}
