import type { ReactNode } from 'react'
import { Heading, Text } from 'plume-ui-react'

export function PageHeader({
  description,
  title,
}: Readonly<{ description: string; title: string }>): ReactNode {
  return (
    <header className="flex flex-col gap-1">
      <Heading level={1} size={3}>
        {title}
      </Heading>
      <Text muted>{description}</Text>
    </header>
  )
}
