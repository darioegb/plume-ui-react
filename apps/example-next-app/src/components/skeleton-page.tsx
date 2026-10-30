import type { ReactNode } from 'react'
import { Skeleton } from 'plume-ui-react'

// The shared shape of every loading state: the title and the description, then the content of the page.
export function SkeletonPage({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>): ReactNode {
  return (
    <div aria-busy="true" aria-label={label} className="flex flex-col gap-6" role="status">
      <div className="flex flex-col gap-2">
        <Skeleton height={28} width="min(12rem, 60%)" />
        <Skeleton width="min(22rem, 90%)" />
      </div>
      {children}
    </div>
  )
}
