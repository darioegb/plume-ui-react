import type { ReactNode } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import type StackBlitzSdk from '@stackblitz/sdk'
import {
  Anchor,
  Canvas,
  Description,
  DocsContext,
  SourceContext,
  Subheading,
  useSourceProps,
} from '@storybook/addon-docs/blocks'
import type { buildSandbox } from './stackblitz-sandbox'

type Locals = Record<string, Record<string, string>>

interface Tools {
  build: typeof buildSandbox
  locals: Locals
  sdk: typeof StackBlitzSdk
}

interface DocsStory {
  fileName: string
  id: string
  moduleExport: object
  name: string
  title: string
  withToolbar: boolean
}

const PACKAGE_DIR = 'packages/plume-ui-react/'

const STACKBLITZ_LOGO = (
  <svg aria-hidden="true" fill="currentColor" focusable="false" height="12" viewBox="0 0 28 28" width="12">
    <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z" />
  </svg>
)

function useStackBlitzTools(): Tools | null {
  const [tools, setTools] = useState<Tools | null>(null)
  useEffect(() => {
    let active = true
    Promise.all([
      import('@stackblitz/sdk'),
      import('./stackblitz-sandbox'),
      import('./story-locals.generated.json'),
    ])
      .then(([{ default: sdk }, { buildSandbox: build }, { default: locals }]) => {
        if (active) setTools({ build, locals: locals, sdk })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])
  return tools
}

const localsOf = (tools: Tools, fileName: string): Record<string, string> => {
  const start = fileName.indexOf(PACKAGE_DIR)
  return start < 0 ? {} : (tools.locals[fileName.slice(start + PACKAGE_DIR.length)] ?? {})
}

function StoryExample({ story, tools }: Readonly<{ story: DocsStory; tools: Tools | null }>): ReactNode {
  const docsContext = useContext(DocsContext)
  const sourceContext = useContext(SourceContext)
  const { code = '' } = useSourceProps({ of: story.moduleExport, __forceInitialArgs: true }, docsContext, sourceContext)
  const open = (): void => {
    if (!tools || !code) return
    const component = story.title.split('/').pop() ?? story.title
    tools.sdk.openProject(
      {
        title: `${component} - ${story.name}`,
        description: `Plume UI React: ${story.title} - ${story.name}`,
        template: 'node',
        files: tools.build(code, story.id, localsOf(tools, story.fileName)),
      },
      { openFile: 'src/App.tsx', newWindow: true },
    )
  }
  const latestOpen = useRef(open)
  useEffect(() => {
    latestOpen.current = open
  })
  return (
    <Anchor storyId={story.id}>
      <Subheading>{story.name}</Subheading>
      <Description of={story.moduleExport} />
      <Canvas
        additionalActions={[{ title: <>{STACKBLITZ_LOGO} Open in StackBlitz</>, onClick: () => latestOpen.current() }]}
        of={story.moduleExport}
        source={{ __forceInitialArgs: true }}
        story={{ __forceInitialArgs: true }}
        withToolbar={story.withToolbar}
      />
    </Anchor>
  )
}

function StoryExamples(): ReactNode {
  const { componentStories, projectAnnotations, getStoryContext } = useContext(DocsContext)
  const tools = useStackBlitzTools()
  const filter = (
    projectAnnotations.parameters?.docs as { stories?: { filter?: (...args: unknown[]) => boolean } } | undefined
  )?.stories?.filter
  let stories = componentStories()
  if (filter) stories = stories.filter((story) => filter(story, getStoryContext(story)))
  if (stories.some((story) => story.tags?.includes('autodocs'))) {
    stories = stories.filter((story) => story.tags?.includes('autodocs') && !story.usesMount)
  }
  return (
    <>
      {stories.map((story) => (
        <StoryExample
          key={story.id}
          story={{
            fileName: String(story.parameters.fileName),
            id: story.id,
            moduleExport: story.moduleExport as object,
            name: story.name,
            title: story.title,
            withToolbar:
              (story.parameters.docs as { canvas?: { withToolbar?: boolean } } | undefined)?.canvas?.withToolbar ??
              false,
          }}
          tools={tools}
        />
      ))}
    </>
  )
}

export default StoryExamples
