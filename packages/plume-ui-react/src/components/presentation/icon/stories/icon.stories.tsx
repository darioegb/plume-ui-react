import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Icon } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const bell = (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
)

/**
 * Sizes an SVG and gives it a color and an accessible name. Plume doesn't ship an icon set: bring your own SVG
 * (from Heroicons, Lucide, Phosphor or your own files) as the child. The SVG fills the Icon, so its `viewBox`
 * is all it needs, and it takes the current text color when it uses `currentColor`.
 *
 * An Icon has no variants: it draws nothing of its own, so there is no look to choose. Use `className` and
 * `style` to change what it does have.
 *
 * An icon next to text is decoration, and the Icon hides it from screen readers. When the icon is the only
 * content, pass a **label**: it is added as text that only screen readers get, and the SVG stays hidden.
 */
export default {
  title: 'Components/Icon',
  component: Icon,
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
    children: {
      control: false,
    },
    className: {
      control: 'text',
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: [undefined, ...colorSchemes],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
    id: {
      control: false,
    },
    title: {
      control: 'text',
    },
  },
  args: {
    children: bell,
  },
} satisfies Meta<typeof Icon>

type Story = StoryObj<typeof Icon>

/**
 * This is the default Icon. Its **children** are the SVG.
 */
export const Default: Story = {}

/**
 * Use the **size** prop to change the size of the Icon.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Icon size="sm">{bell}</Icon>
      <Icon size="md">{bell}</Icon>
      <Icon size="lg">{bell}</Icon>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. Without it the Icon takes the color of the text
 * around it.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Icon>{bell}</Icon>
      {colorSchemes.map((scheme) => (
        <Icon colorScheme={scheme as keyof typeof defaultTheme.colors} key={scheme}>
          {bell}
        </Icon>
      ))}
    </div>
  ),
}

/**
 * An Icon with a **label** is read by assistive technology as that text. Use it when the icon is the only
 * content, as in a button with no text.
 */
export const WithLabel: Story = {
  args: {
    label: 'Notifications',
  },
}

/**
 * Next to text the icon is decoration, so the Icon hides it. It lines up with the text and takes its color.
 */
export const WithText: Story = {
  render: () => (
    <p className="flex items-center gap-2">
      <Icon size="sm">{bell}</Icon>
      Notifications are on
    </p>
  ),
}

/**
 * Some examples of Icon with Tailwind classes. The Icon takes its color from the text around it, so a text color on a parent colors the icon, and its `className` can add what Plume does not, like an animation.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap items-center gap-4">
  <span className="text-emerald-600 dark:text-emerald-400">
    <Icon size="lg">{bell}</Icon>
  </span>
  <span className="text-blue-600 dark:text-blue-400">
    <Icon className="animate-pulse" size="lg">
      {bell}
    </Icon>
  </span>
  <span className="inline-flex items-center gap-2 rounded-full bg-primary-solid px-3 py-1 text-sm text-primary-on-solid">
    <Icon size="sm">{bell}</Icon>
    Notifications
  </span>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-emerald-600 dark:text-emerald-400">
        <Icon size="lg">{bell}</Icon>
      </span>
      <span className="text-blue-600 dark:text-blue-400">
        <Icon className="animate-pulse" size="lg">
          {bell}
        </Icon>
      </span>
      <span className="inline-flex items-center gap-2 rounded-full bg-primary-solid px-3 py-1 text-sm text-primary-on-solid">
        <Icon size="sm">{bell}</Icon>
        Notifications
      </span>
    </div>
  ),
}

/**
 * Some examples of Icon with Bootstrap classes. The Icon takes its color from the text around it, so `text-*` utilities on a parent color it, and it fits inside badges and buttons.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-wrap align-items-center gap-3">
  <span className="text-primary">
    <Icon size="lg">{bell}</Icon>
  </span>
  <span className="text-success">
    <Icon size="lg">{bell}</Icon>
  </span>
  <span className="badge text-bg-primary d-inline-flex align-items-center gap-1">
    <Icon size="sm">{bell}</Icon>
    Notifications
  </span>
  <button className="btn btn-primary d-inline-flex align-items-center gap-2" type="button">
    <Icon size="sm">{bell}</Icon>
    Alerts
  </button>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-wrap align-items-center gap-3">
      <span className="text-primary">
        <Icon size="lg">{bell}</Icon>
      </span>
      <span className="text-success">
        <Icon size="lg">{bell}</Icon>
      </span>
      <span className="badge text-bg-primary d-inline-flex align-items-center gap-1">
        <Icon size="sm">{bell}</Icon>
        Notifications
      </span>
      <button
        className="btn btn-primary d-inline-flex align-items-center gap-2"
        type="button"
      >
        <Icon size="sm">{bell}</Icon>
        Alerts
      </button>
    </div>
  ),
}
