import type { StoryObj, Meta } from '@storybook/react'
import { useState } from 'react'
import { Tabs } from '..'
import { TabList } from '../tab-list'
import { Tab } from '../tab'
import { TabPanels } from '../tab-panels'
import { TabPanel } from '../tab-panel'

const commonTabs = (
  <>
    <TabList>
      <Tab label="One" />
      <Tab label="Two" />
      <Tab label="Three" />
    </TabList>
    <TabPanels>
      <TabPanel>
        <p>one!</p>
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
      <TabPanel>
        <p>three!</p>
      </TabPanel>
    </TabPanels>
  </>
)

/**
 * Enhance user interactions with the Button component,
 * featuring customizable styles for triggering actions within forms, dialogs, and other contexts.
 * With support for various sizes and states,
 * it facilitates actions such as form submissions, dialog interactions, and deletion or cancellation operations.
 */
export default {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  decorators: [(Story) => <div style={{ width: '50vw' }}>{Story()}</div>],
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    index: {
      control: 'number',
      description: 'Index of the initially active tab.',
      table: {
        defaultValue: { summary: 0 },
        type: { summary: 'number' },
      },
    },
    alignment: {
      control: 'radio',
      options: ['left', 'center', 'right'],
      description: 'Alignment of the tabs within the container.',
      table: {
        defaultValue: { summary: 'left' },
        type: { summary: '"left" | "center" | "right"' },
      },
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'dark', 'light'],
      description: 'Custom color scheme for the tabs.',
      table: {
        type: { summary: 'string' },
      },
    },
    isLazy: {
      control: 'boolean',
      description: 'Enable lazy loading for tab content.',
      if: { arg: 'disabled', truthy: false },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    onChange: {
      action: 'tabChanged',
      description: 'Function triggered when a tab is changed.',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tab list.',
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: '"horizontal" | "vertical"' },
      },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tabs.',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: '"sm" | "md" | "lg"' },
      },
    },
    variant: {
      control: 'select',
      options: ['underline', 'rounded', 'enclosed', 'segment', 'unstyled'],
      description: 'Variant of the tabs.',
      table: {
        defaultValue: { summary: 'underline' },
        type: { summary: '"underline" | "rounded" | "enclosed" | "segment" | "unstyled"' },
      },
    },
  },
} satisfies Meta<typeof Tabs>

type Story = StoryObj<typeof Tabs>

// This is the default tabs
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs>
  <TabList>
    <Tab label="One" />
    <Tab label="Two" />
    <Tab label="Three" />
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        `,
      },
    },
  },
  args: {
    children: commonTabs,
  },
}

/**
 * This is a list o tabs with different sizes.
 * Just adding the **size** prop. We support 3 sizes **sm**, **md**, **lg**.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs
  colorScheme="primary"
  size="sm"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  size="md"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  size="lg"
>
  {commonTabs}
</Tabs>
          `,
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <Tabs colorScheme="primary" size="sm">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" size="md">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" size="lg">
        {commonTabs}
      </Tabs>
    </div>
  ),
}

/**
 * This is a list o tabs with different alignments.
 * Just adding the **alignment** prop. We support 3 alignments **left**, **center**, **right**.
 */
export const Alignments: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs
  alignment="left"
  colorScheme="primary"
>
  {commonTabs}
</Tabs>
<Tabs
  alignment="center"
  colorScheme="primary"
>
  {commonTabs}
</Tabs>
<Tabs
  alignment="right"
  colorScheme="primary"
>
  {commonTabs}
</Tabs>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-rows-3">
      <Tabs alignment="left" colorScheme="primary">
        {commonTabs}
      </Tabs>
      <Tabs alignment="center" colorScheme="primary">
        {commonTabs}
      </Tabs>
      <Tabs alignment="right" colorScheme="primary">
        {commonTabs}
      </Tabs>
    </div>
  ),
}

/**
 * This is a list o tabs with different orientations.
 * Just adding the **orientation** prop. We support 2 orientations **horizontal**, **vertical**.
 */
export const Orientations: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs
  colorScheme="primary"
  orientation="horizontal"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  orientation="vertical"
>
  {commonTabs}
</Tabs>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      <Tabs colorScheme="primary" orientation="horizontal">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" orientation="vertical">
        {commonTabs}
      </Tabs>
    </div>
  ),
}

/**
 * This is a list o tabs with different variants.
 * Just adding the **variant** prop in one of these values **underline**, **rounded**, **enclosed**, **segment** and **unstyled**.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs
  colorScheme="primary"
  variant="underline"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  variant="rounded"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  variant="enclosed"
>
  {commonTabs}
</Tabs>
<Tabs
  colorScheme="primary"
  variant="segment"
>
  {commonTabs}
</Tabs>
<Tabs
  variant="unstyled"
>
  {commonTabs}
</Tabs>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Tabs colorScheme="primary" variant="underline">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" variant="rounded">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" variant="enclosed">
        {commonTabs}
      </Tabs>
      <Tabs colorScheme="primary" variant="segment">
        {commonTabs}
      </Tabs>
      <Tabs variant="unstyled">{commonTabs}</Tabs>
    </div>
  ),
}

/**
 * This is a list o tabs with different colors.
 * Just adding the **colorScheme** prop.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs>
  {commonTabs}
</Tabs>
<Tabs colorScheme="primary">
  {commonTabs}
</Tabs>
<Tabs rScheme="secondary">
  {commonTabs}
</Tabs>
<Tabs rScheme="info">
  {commonTabs}
</Tabs>
<Tabs rScheme="warning">
  {commonTabs}
</Tabs>
<Tabs rScheme="error">
  {commonTabs}
</Tabs>
<Tabs rScheme="success">
  {commonTabs}
</Tabs>
<Tabs rScheme="dark">
  {commonTabs}
</Tabs>
  `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Tabs>{commonTabs}</Tabs>
      <Tabs colorScheme="primary">{commonTabs}</Tabs>
      <Tabs colorScheme="secondary">{commonTabs}</Tabs>
      <Tabs colorScheme="info">{commonTabs}</Tabs>
      <Tabs colorScheme="warning">{commonTabs}</Tabs>
      <Tabs colorScheme="error">{commonTabs}</Tabs>
      <Tabs colorScheme="success">{commonTabs}</Tabs>
      <Tabs colorScheme="dark">{commonTabs}</Tabs>
    </div>
  ),
}

/**
 * This is a disabled tab.
 * Just adding the **disabled** prop in true.
 * The disabled state add **.disabled** class,
 * that contain **opacity: .5** and **cursor: not-allowed**.
 */
export const Disabled: Story = {
  args: {
    colorScheme: 'primary',
    children: (
      <>
        <TabList>
          <Tab label="One" />
          <Tab disabled label="Two" />
          <Tab label="Three" />
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<Tabs>
  <TabList>
    <Tab label="One" />
    <Tab disabled label="Two" />
    <Tab label="Three" />
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        `,
      },
    },
  },
}

/**
 * This is a story for lazy-loaded tabs.
 * Just set the **isLazy** prop to true.
 */
export const LazyTabs: Story = {
  args: {
    colorScheme: 'primary',
    isLazy: true,
    children: commonTabs,
  },
}

/**
 * This is a tabs with extra content.
 * Just adding the **extraContentLeft** & **extraContentRight** prop in tab object.
 */
export const ExtraContent: Story = {
  args: {
    colorScheme: 'primary',
    children: (
      <>
        <TabList>
          <Tab
            extraContentLeft={
              <svg
                fill="none"
                height="1rem"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="1rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
            label="One"
          />
          <Tab
            extraContentLeft={
              <svg
                fill="none"
                height="1rem"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="1rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            }
            label="Two"
          />
          <Tab
            extraContentRight={
              <svg
                fill="none"
                height="1rem"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="1rem"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
            label="Three"
          />
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: `<Tabs>
  <TabList>
    <Tab 
      extraContent={
        <svg
          fill="none"
          height="1rem"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      } 
      label="One" 
    />
    <Tab
      extraContent={
        <svg
          fill="none"
          height="1rem"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="10" r="3" />
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
      } 
      label="Two" 
    />
    <Tab
      extraContent={
        <svg
          fill="none"
          height="1rem"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1rem"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      }
      isExtraContentRight 
      label="Three" 
    />
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        `,
      },
    },
  },
}

/**
 * Example of tabs with custom classes from tailwind
 */
export const Tailwind: Story = {
  args: {
    children: commonTabs,
    className: 'underline-tabs',
    variant: 'unstyled',
  },
  parameters: {
    docs: {
      source: {
        code: `// global.css
/* Tailwind custom tabs underline styles */
.underline-tabs div[role="tablist"] {
  @apply border-b border-gray-200 dark:border-gray-700 flex gap-x-4;
}

.underline-tabs button[aria-selected="true"] {
  @apply py-2 border-b-2 border-solid border-blue-500 text-blue-500;
}

.underline-tabs div[role="tabpanel"] {
  @apply mt-3;
}
// custom-tab.tsx
<Tabs>
  <TabList className="underline-tabs">
    <Tab label="One" />
    <Tab label="Two" />
    <Tab label="Three" />
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
        `,
      },
    },
  },
}

export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [activeIndex, setActiveIndex] = useState(0)
const handleOnChange = (i: number): void => { setActiveIndex(i); }
return (
  <Tabs onChange={handleOnChange} variant="unstyled">
    <TabList className="nav nav-underline">
      <Tab className="nav-item">
        <span className={\`nav-link \${activeIndex === 0 && 'active'}\`}>One</span>
      </Tab>
      <Tab className="nav-item">
        <span className={\`nav-link \${activeIndex === 1 && 'active'}\`}>Two</span>
      </Tab>
      <Tab className="nav-item">
        <span className={\`nav-link \${activeIndex === 2 && 'active'}\`}>Three</span>
      </Tab>
    </TabList>
    <TabPanels className="mt-3">
      <TabPanel>
        <p>one!</p>
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
      <TabPanel>
        <p>three!</p>
      </TabPanel>
    </TabPanels>
  </Tabs>
)
          `,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Render is valid storybook function
    const [activeIndex, setActiveIndex] = useState(0)
    const handleOnChange = (i: number): void => {
      setActiveIndex(i)
    }
    return (
      <Tabs onChange={handleOnChange} variant="unstyled">
        <TabList className="nav nav-underline">
          <Tab className="nav-item">
            <span className={`nav-link ${activeIndex === 0 && 'active'}`}>One</span>
          </Tab>
          <Tab className="nav-item">
            <span className={`nav-link ${activeIndex === 1 && 'active'}`}>Two</span>
          </Tab>
          <Tab className="nav-item">
            <span className={`nav-link ${activeIndex === 2 && 'active'}`}>Three</span>
          </Tab>
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  },
}
