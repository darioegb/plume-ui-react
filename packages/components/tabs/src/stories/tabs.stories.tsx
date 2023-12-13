import type { StoryObj, Meta } from '@storybook/react'
import type { TabsProps } from '..'
import { Tabs } from '..'

const commonTabs: TabsProps = {
  tabList: [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }],
  panelList: [
    { content: <div>Panel 1 Content</div> },
    { content: <div>Panel 2 Content</div> },
    { content: <div>Panel 3 Content</div> },
  ],
}

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
    tabList: {
      control: 'array',
      description: 'An array of tab objects with labels and optional extra content.',
      table: {
        type: { summary: 'Tab[]' },
      },
    },
    panelList: {
      control: 'array',
      description: 'An array of tab panel objects with content for each tab.',
      table: {
        type: { summary: 'TabPanel[]' },
      },
    },
    activeTab: {
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
    onTabChange: {
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
  args: { ...commonTabs },
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
  panelList={panelList} 
  size="sm" 
  tabList={tabList} 
/>
<Tabs
  colorScheme="primary" 
  panelList={panelList} 
  size="md" 
  tabList={tabList} 
/>
<Tabs
  colorScheme="primary" 
  panelList={panelList} 
  size="lg" 
  tabList={tabList} 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <Tabs colorScheme="primary" size="sm" {...commonTabs} />
      <Tabs colorScheme="primary" size="md" {...commonTabs} />
      <Tabs colorScheme="primary" size="lg" {...commonTabs} />
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
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  alignment="center"
  colorScheme="primary" 
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  alignment="right"
  colorScheme="primary"
  panelList={panelList} 
  tabList={tabList} 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-rows-3">
      <Tabs alignment="left" colorScheme="primary" {...commonTabs} />
      <Tabs alignment="center" colorScheme="primary" {...commonTabs} />
      <Tabs alignment="right" colorScheme="primary" {...commonTabs} />
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
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs
  colorScheme="primary" 
  orientation="vertical" 
  panelList={panelList} 
  tabList={tabList} 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      <Tabs colorScheme="primary" orientation="horizontal" {...commonTabs} />
      <Tabs colorScheme="primary" orientation="vertical" {...commonTabs} />
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
  panelList={panelList} 
  tabList={tabList} 
  variant="underline" 
/>
<Tabs
  colorScheme="primary" 
  panelList={panelList} 
  tabList={tabList} 
  variant="rounded" 
/>
<Tabs
  colorScheme="primary" 
  panelList={panelList} 
  tabList={tabList} 
  variant="enclosed"
/>
<Tabs
  colorScheme="primary" 
  panelList={panelList} 
  tabList={tabList} 
  variant="segment"
/>
<Tabs
  panelList={panelList} 
  tabList={tabList} 
  variant="unstyled"
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Tabs colorScheme="primary" {...commonTabs} variant="underline" />
      <Tabs colorScheme="primary" {...commonTabs} variant="rounded" />
      <Tabs colorScheme="primary" {...commonTabs} variant="enclosed" />
      <Tabs colorScheme="primary" {...commonTabs} variant="segment" />
      <Tabs {...commonTabs} variant="unstyled" />
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
        code: `<Tabs panelList={panelList} tabList={tabList} />
<Tabs 
  colorScheme="primary"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="secondary"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="info"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="warning"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="error"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="success"
  panelList={panelList} 
  tabList={tabList} 
/>
<Tabs 
  colorScheme="dark"
  panelList={panelList} 
  tabList={tabList} 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Tabs {...commonTabs} />
      <Tabs colorScheme="primary" {...commonTabs} />
      <Tabs colorScheme="secondary" {...commonTabs} />
      <Tabs colorScheme="info" {...commonTabs} />
      <Tabs colorScheme="warning" {...commonTabs} />
      <Tabs colorScheme="error" {...commonTabs} />
      <Tabs colorScheme="success" {...commonTabs} />
      <Tabs colorScheme="dark" {...commonTabs} />
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
    ...commonTabs,
    colorScheme: 'primary',
    tabList: [
      { label: 'Tab 1', disabled: false },
      { label: 'Tab 2', disabled: true },
      { label: 'Tab 3', disabled: false },
    ],
  },
}

/**
 * This is a story for lazy-loaded tabs.
 * Just set the **isLazy** prop to true.
 */
export const LazyTabs: Story = {
  args: {
    ...commonTabs,
    colorScheme: 'primary',
    isLazy: true,
    panelList: commonTabs.panelList.map((panel) => ({
      ...panel,
      content: <>{panel.content}</>,
    })),
  },
}

/**
 * This is a tabs with extra content.
 * Just adding the **extraContent** prop in tab object.
 * Also we can add the flag **isExtraContentRight** to set alignment on right.
 */
export const ExtraContent: Story = {
  args: {
    ...commonTabs,
    colorScheme: 'primary',
    tabList: [
      {
        label: 'Tab 1',
        extraContent: (
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
        ),
      },
      {
        label: 'Tab 2',
        extraContent: (
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
        ),
      },
      {
        label: 'Tab 3',
        extraContent: (
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
        ),
        isExtraContentRight: true,
      },
    ],
  },
}

/**
 * Example of tabs with custom classes from tailwind
 */
export const Tailwind: Story = {
  args: {
    customClasses: 'underline-tabs',
    panelList: [
      { content: <div>Panel 1 Content</div> }, // Clases de Tailwind
      { content: <div>Panel 2 Content</div> }, // Clases de Tailwind
      { content: <div>Panel 3 Content</div> }, // Clases de Tailwind
    ],
    tabList: [
      { label: 'Tab 1', disabled: false },
      { label: 'Tab 2', disabled: false },
      { label: 'Tab 3', disabled: false },
    ],
    variant: 'unstyled',
  },
}
