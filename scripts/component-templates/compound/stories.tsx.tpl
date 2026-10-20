import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { __Name__, __Name__Content } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * Describe what the __Name__ is for and when to use it.
 * It is made of `__Name__` and `__Name__Content`, which must be rendered inside it.
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
      control: false,
      description: 'The `__Name__Content` parts of the __Name__.',
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
    children: <__Name__Content>__Name__</__Name__Content>,
  },
} satisfies Meta<typeof __Name__>

type Story = StoryObj<typeof __Name__>

/**
 * This is the default __Name__.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the __Name__ looks. `unstyled` drops the Plume styles so you can style it
 * yourself. Show every variant of the component here, once each.
 */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-4'>
      <__Name__ variant='solid'>
        <__Name__Content>Solid</__Name__Content>
      </__Name__>
      <__Name__ className='px-3 py-1 rounded bg-black text-white' variant='unstyled'>
        <__Name__Content className='p-2'>Unstyled</__Name__Content>
      </__Name__>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-4'>
      <__Name__ size='sm'>
        <__Name__Content>Small</__Name__Content>
      </__Name__>
      <__Name__ size='md'>
        <__Name__Content>Medium</__Name__Content>
      </__Name__>
      <__Name__ size='lg'>
        <__Name__Content>Large</__Name__Content>
      </__Name__>
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
          <__Name__Content>{scheme}</__Name__Content>
        </__Name__>
      ))}
    </div>
  ),
}
