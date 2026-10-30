import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Skeleton } from 'plume-ui-react'
import { SkeletonPage } from '@/components/skeleton-page'

export default async function Loading(): Promise<ReactNode> {
  const t = await getTranslations('projects')
  return (
    <SkeletonPage label={t('loading')}>
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="min-w-56 max-sm:w-full max-sm:min-w-0" height={40} shape="rect" />
        <Skeleton className="w-72 max-sm:w-full max-sm:min-w-0" height={40} shape="rect" />
        <Skeleton className="w-60 max-sm:w-full max-sm:min-w-0" height={40} shape="rect" />
      </div>
      <Skeleton width="6rem" />
      <div className="flex flex-col gap-2">
        <Skeleton height={32} shape="rect" />
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton height={56} key={item} shape="rect" />
        ))}
      </div>
    </SkeletonPage>
  )
}
