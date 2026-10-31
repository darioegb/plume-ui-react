import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardBody, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('newProject')
  return (
    <SkeletonPage label={t('loading')}>
      <div className="flex max-w-[40rem] flex-col gap-6">
        <div className="flex gap-6">
          {[1, 2, 3].map((item) => (
            <div className="flex items-center gap-2" key={item}>
              <Skeleton height={32} shape="circle" width={32} />
              <Skeleton width="5rem" />
            </div>
          ))}
        </div>
        <Card variant="outline">
          <CardBody>
            <div className="flex flex-col gap-5">
              <Skeleton height={40} shape="rect" />
              <Skeleton height={88} shape="rect" />
              <Skeleton height={40} shape="rect" />
            </div>
          </CardBody>
        </Card>
      </div>
    </SkeletonPage>
  )
}
