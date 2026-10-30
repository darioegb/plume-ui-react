import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardBody, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('team')
  return (
    <SkeletonPage label={t('loading')}>
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="min-w-72 max-sm:w-full max-sm:min-w-0" height={40} shape="rect" />
      </div>
      <Skeleton height={36} shape="rect" width="min(16rem, 100%)" />
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4 pt-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <li key={item}>
            <Card variant="outline">
              <CardBody>
                <div className="flex items-center gap-3">
                  <Skeleton height={48} shape="circle" width={48} />
                  <div className="flex flex-col gap-2">
                    <Skeleton width="8rem" />
                    <Skeleton width="6rem" />
                  </div>
                </div>
                <div className="my-3 flex min-h-6 flex-wrap gap-1.5">
                  <Skeleton height={24} shape="rect" width={64} />
                  <Skeleton height={24} shape="rect" width={80} />
                </div>
                <Skeleton height={32} shape="rect" width={80} />
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </SkeletonPage>
  )
}
