import type { ReactNode } from 'react'
import { getLocale, getTranslations } from 'next-intl/server'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardBody,
  CardHeader,
  ProgressBar,
} from 'plume-ui-react'
import { PageHeader } from '@/components/page-header'
import { getDashboard } from '@/lib/data'
import { formatDue, formatNumber } from '@/lib/format'
import { getUser } from '@/lib/session'
import { statusColor } from '@/lib/status'

// A Server Component: Card, Badge and ProgressBar render on the server, and only the Avatars hydrate.
export default async function DashboardPage(): Promise<ReactNode> {
  const [user, { metrics, projects }, locale, t, tStatus] = await Promise.all([
    getUser(),
    getDashboard(),
    getLocale(),
    getTranslations('dashboard'),
    getTranslations('status'),
  ])
  const firstName = user?.name.split(' ')[0] ?? t('guest')

  return (
    <>
      <PageHeader description={t('description')} title={t('title', { name: firstName })} />

      <section aria-label={t('keyNumbers')} className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} variant="outline">
            <CardBody>
              <div className="flex flex-col items-start gap-2">
                <span className="text-body-sm text-muted">{t(`metrics.${metric.id}.label`)}</span>
                <span className="text-[2rem] leading-none font-bold">{formatNumber(metric.value, locale)}</span>
                <Badge colorScheme={metric.trend === 'up' ? 'success' : 'warning'} size="sm" variant="subtle">
                  {t(`metrics.${metric.id}.change`, { change: metric.change })}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card variant="outline">
        <CardHeader>{t('activeProjects')}</CardHeader>
        <CardBody>
          <ul className="flex flex-col gap-5">
            {projects.map((project) => (
              <li
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[minmax(10rem,1.2fr)_6.5rem_minmax(8rem,2fr)_7.5rem]"
                key={project.id}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{project.name}</span>
                  <span className="text-body-sm text-muted">{t('due', { date: formatDue(project.due, locale) })}</span>
                </div>
                <Badge
                  className="justify-self-start"
                  colorScheme={statusColor[project.status]}
                  dot
                  variant="subtle"
                >
                  {tStatus(project.status)}
                </Badge>
                <ProgressBar
                  aria-label={t('progress', { name: project.name })}
                  className="order-3 col-span-full md:order-none md:col-auto"
                  colorScheme={statusColor[project.status]}
                  showValue
                  value={project.progress}
                />
                <AvatarGroup
                  className="order-4 col-span-full justify-self-start md:order-none md:col-auto md:justify-self-end"
                  max={3}
                  size="sm"
                >
                  {project.team.map((member) => (
                    <Avatar key={member} name={member} />
                  ))}
                </AvatarGroup>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </>
  )
}
