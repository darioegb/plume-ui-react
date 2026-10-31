import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardBody, CardHeader, Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('dashboard')
  return (
    <SkeletonPage label={t('loading')}>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} variant="outline">
            <CardBody>
              <div className="flex flex-col items-start gap-2">
                <Skeleton width="60%" />
                <Skeleton height={32} width="35%" />
                <Skeleton width="45%" />
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
      <Card variant="outline">
        <CardHeader>
          <Skeleton width="9rem" />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-5">
            {[1, 2, 3, 4].map((item) => (
              <Skeleton height={40} key={item} shape="rect" />
            ))}
          </div>
        </CardBody>
      </Card>
    </SkeletonPage>
  )
}
