'use client'

import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  ProgressBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from 'plume-ui-react'
import type { Project } from '@/lib/data'
import { formatDue } from '@/lib/format'
import { statusColor } from '@/lib/status'

export function ProjectDrawer({
  onComplete,
  onOpenChange,
  onRemove,
  open,
  project,
}: Readonly<{
  onComplete: (project: Project) => void
  onOpenChange: (open: boolean) => void
  onRemove: (project: Project) => void
  open: boolean
  project: Project | null
}>): ReactNode {
  const t = useTranslations('projects')
  const tDrawer = useTranslations('projects.drawer')
  const tStatus = useTranslations('status')
  const tVisibility = useTranslations('visibility')
  const locale = useLocale()

  const activity = (current: Project): { text: string; when: string }[] => [
    { text: tDrawer('updatedPlan', { name: current.owner }), when: tDrawer('daysAgo', { count: 2 }) },
    {
      text: tDrawer('commented', { name: current.team[1] ?? current.owner }),
      when: tDrawer('daysAgo', { count: 4 }),
    },
    { text: tDrawer('created', { name: current.owner }), when: tDrawer('weeksAgo', { count: 3 }) },
  ]

  return (
    <Drawer onOpenChange={onOpenChange} open={open && project !== null}>
      <DrawerContent>
        {project ? (
          <>
            <DrawerHeader>{project.name}</DrawerHeader>
            <DrawerBody>
              <Tabs>
                <TabList>
                  <Tab label={tDrawer('overview')} />
                  <Tab label={tDrawer('activity')} />
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="flex flex-col gap-4 py-4">
                      <p>{project.description || t('noDescription')}</p>
                      <dl className="grid grid-cols-[max-content_1fr] items-center gap-x-4 gap-y-3 [&_dt]:text-(--plume-muted)">
                        <dt>{tDrawer('status')}</dt>
                        <dd>
                          <Badge colorScheme={statusColor[project.status]} dot variant="subtle">
                            {tStatus(project.status)}
                          </Badge>
                        </dd>
                        <dt>{tDrawer('due')}</dt>
                        <dd>{formatDue(project.due, locale)}</dd>
                        <dt>{tDrawer('owner')}</dt>
                        <dd className="flex items-center gap-2 text-sm text-(--plume-muted)">
                          <Avatar name={project.owner} size="sm" />
                          {project.owner}
                        </dd>
                        <dt>{tDrawer('team')}</dt>
                        <dd>
                          <AvatarGroup max={5} size="sm">
                            {project.team.map((member) => (
                              <Avatar key={member} name={member} />
                            ))}
                          </AvatarGroup>
                        </dd>
                        <dt>{tDrawer('visibility')}</dt>
                        <dd>
                          <Badge colorScheme="salmon" variant="subtle">
                            {tVisibility(project.visibility)}
                          </Badge>
                        </dd>
                      </dl>
                      <ProgressBar
                        aria-label={tDrawer('progress')}
                        colorScheme={statusColor[project.status]}
                        showValue
                        value={project.progress}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <ul className="flex flex-col gap-3 py-4">
                      {activity(project).map((event) => (
                        <li key={event.text}>
                          {event.text}
                          <span className="block text-sm text-(--plume-muted)">{event.when}</span>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="error" onClick={() => onRemove(project)} variant="ghost">
                {t('delete')}
              </Button>
              <DrawerClose>
                <Button
                  disabled={project.status === 'done'}
                  onClick={() => onComplete(project)}
                  variant="outline"
                >
                  {t('markAsDone')}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
