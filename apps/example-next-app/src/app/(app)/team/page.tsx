import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { getTeam } from '@/lib/data'
import { TeamDirectory } from './team-directory'

export const metadata: Metadata = { title: 'Team' }

export default async function TeamPage(): Promise<ReactNode> {
  const team = await getTeam()
  return (
    <>
      <PageHeader description="The people working on your projects." title="Team" />
      <TeamDirectory team={team} />
    </>
  )
}
