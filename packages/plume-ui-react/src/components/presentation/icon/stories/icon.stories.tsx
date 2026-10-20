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
 * content, pass a **label**.
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
      description: 'The SVG to show.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the Icon.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Icon. They are applied after the color variable, so they can override it (e.g. `--icon-color`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette. Without it the Icon takes the current text color.',
      options: [undefined, ...colorSchemes],
      table: { type: { summary: 'ColorScheme' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Icon.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description:
        'Accessible name. With it the Icon is an image (`role="img"`); without it the Icon is hidden from assistive technology.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: 'Id of the `<span>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the Icon.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
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
 * An Icon with a **label** is an image for assistive technology. Use it when the icon is the only content,
 * as in a button with no text.
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
