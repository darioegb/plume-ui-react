import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { __Name__ } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * Describe what the __Name__ is for and when to use it.
 */
export default {
  title: 'Components/__Name__',
  component: __Name__,
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
      control: 'text',
      description: 'Content of the __Name__.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the __Name__.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the __Name__. They are applied after the color variables, so they can override them (e.g. `--__slug__-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the __Name__.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` } },
    },
    variant: {
      control: 'radio',
      description: 'Visual variant. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['solid', 'unstyled'],
      table: { type: { summary: `"solid" | "unstyled"` } },
    },
  },
  args: {
    children: '__Name__',
  },
} satisfies Meta<typeof __Name__>

type Story = StoryObj<typeof __Name__>

/**
 * This is the default __Name__.
 */
export const Default: Story = {}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-4'>
      <__Name__ size='sm'>Small</__Name__>
      <__Name__ size='md'>Medium</__Name__>
      <__Name__ size='lg'>Large</__Name__>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-4'>
      {colorSchemes.map((scheme) => (
        <__Name__ colorScheme={scheme as keyof typeof defaultTheme.colors} key={scheme}>
          {scheme}
        </__Name__>
      ))}
    </div>
  ),
}

/**
 * The **unstyled** variant leaves the styling to you.
 */
export const Unstyled: Story = {
  args: {
    variant: 'unstyled',
    className: 'px-3 py-1 rounded bg-black text-white',
  },
}
