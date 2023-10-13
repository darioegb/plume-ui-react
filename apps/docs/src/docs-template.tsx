import type { ReactNode } from 'react'
import {
  Title,
  Description,
  Primary,
  Controls,
  Source,
  Stories,
} from '@storybook/blocks'
import { Button } from '@plume-ui-react/lib'

const GITHUB_URL =
  'https://github.com/darioegb/plume-ui-react/tree/main/packages/components/'
const NPM_URL = 'https://www.npmjs.com/package/@plume-ui-react/'
const COLOR_GRAY = '#000000a6'
const COLOR_RED = 'red'

interface IconLinkButtonProps {
  icon: ReactNode
  href: string
  text: string
}

function extractWordBeforeDocsFromURL(): string {
  const url = window.location.href
  const match = /(?<word>\w+)--docs/.exec(url)
  const wordBeforeDocs = match?.groups?.word ?? ''
  const capitalizedWord =
    wordBeforeDocs.charAt(0).toUpperCase() + wordBeforeDocs.slice(1)
  return capitalizedWord
}

function IconLinkButton({
  icon,
  href,
  text,
}: Readonly<IconLinkButtonProps>): JSX.Element {
  return (
    <a className="flex" href={href} rel="noopener" target="_blank">
      <Button iconLeft={icon} size="sm" variant="outline">
        <p style={{ color: COLOR_GRAY, margin: 0 }}>{text}</p>
      </Button>
    </a>
  )
}

function ButtonGroup({
  componentName,
}: Readonly<{
  componentName: string
}>): JSX.Element {
  const componentNameLowerCase = componentName.toLowerCase()

  return (
    <div className="flex gap-2" style={{ marginBlockEnd: '2rem' }}>
      <IconLinkButton
        href={`${GITHUB_URL}${componentNameLowerCase}`}
        icon={
          <svg
            aria-hidden="true"
            fill="black"
            focusable="false"
            height="1.25rem"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 496 512"
            width="1.25rem"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
          </svg>
        }
        text="Source"
      />
      <IconLinkButton
        href={`${NPM_URL}${componentNameLowerCase}`}
        icon={
          <svg
            aria-hidden="true"
            fill={COLOR_RED}
            focusable="false"
            height="2rem"
            stroke="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            width="2rem"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z" />
          </svg>
        }
        text={`@plume-ui-react/${componentNameLowerCase}`}
      />
    </div>
  )
}

function Footer(): JSX.Element {
  return (
    <footer className="p-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Plume UI is created in 🇦🇷 by Dario E
          Gonzalez B
        </p>
      </div>
    </footer>
  )
}

function DocsTemplate(): JSX.Element {
  const componentName = extractWordBeforeDocsFromURL()
  return (
    <>
      <div className="container">
        <Title />
        <Description />
        <ButtonGroup componentName={componentName} />
        <h2>Import</h2>
        <Source
          code={`import { ${componentName} } from '@plume-ui-react/lib'`}
          dark
        />
        <h2>Usage</h2>
        <Primary />
        <h2>Inputs</h2>
        <p>The component accepts the following inputs (props):</p>
        <Controls />
        <hr />
        <h2>Additional variations</h2>
        <p>Listed below are additional variations of the {componentName}.</p>
        <Stories includePrimary={false} title="" />
      </div>
      <Footer />
    </>
  )
}

export default DocsTemplate
