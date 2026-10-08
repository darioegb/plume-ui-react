// Input.stories.tsx
import type { StoryObj, Meta } from '@storybook/react'
import { useState } from 'react'
import { Input } from '..'

export default {
  title: 'Components/Form/Input',
  component: Input,
  parameters: {
    docs: {
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      description: 'Color of the input.',
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'dark', 'light'],
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the Input is disabled.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Indicates whether the Input is readOnly.',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for the text Input.',
      table: {
        type: { summary: 'string' },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style of the Input.',
      options: ['pill', 'rounded'],
      if: { arg: 'variant', eq: 'outline' },
      table: {
        type: { summary: `"pill" | "rounded"` },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the Input.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the Input.',
      options: ['outline', 'underline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"outline" | "underline" | "filled" | "unstyled"` },
      },
    },
    type: {
      control: 'select',
      description: 'Type of Input (e.g., "text", "number")',
      options: [
        'text',
        'number',
        'password',
        'search',
        'date',
        'datetime-local',
        'email',
        'month',
        'tel',
        'time',
        'url',
        'week',
      ],
      table: {
        type: {
          summary: `"text" | "number" | "password" | "search" | "date" | "datetime-local" | "email" | "month" | "tel" | "time" | "url" | "week"`,
        },
      },
    },
    value: {
      control: 'text',
      description: 'Value of the text Input.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      description: 'Event triggered when the text Input value changes.',
      action: 'changed',
    },
  },
} as Meta<typeof Input>

type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    disabled: false,
    placeholder: 'Input Placeholder',
    readOnly: false,
    type: 'text',
    addonAfter: (
      <svg
        className='flex-shrink-0 size-4 text-gray-500'
        fill='none'
        height='24'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        viewBox='0 0 24 24'
        width='24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
      </svg>
    ),
    // elementBefore: <button>Click</button>
  },
}

/**
 * This is a list o Input with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input size="sm" placeholder="Small Input" />
  <Input size="md" placeholder="Medium Input" />
  <Input size="lg" placeholder="Large Input" />
            `,
      },
    },
  },
  render: () => (
    <div className='flex gap-4 items-center'>
      <Input placeholder='Small Input' size='sm' />
      <Input placeholder='Medium Input' size='md' />
      <Input placeholder='Large Input' size='lg' />
    </div>
  ),
}

/**
 * This is a list o Input with different variants.
 * Just adding the **variant** prop in one of these values **outline**, **underline**, **filled** and **unstyled**.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input placeholder='Outline Input' variant='outline' />
<Input placeholder='Underline Input' variant='underline' />
<Input placeholder='Filled Input' variant='filled' />
<Input placeholder='Unstyled Input' variant='unstyled' />
            `,
      },
    },
  },
  render: () => (
    <div className='grid gap-4 grid-cols-2 grid-rows-3'>
      <Input placeholder='Outline Input' variant='outline' />
      <Input placeholder='Underline Input' variant='underline' />
      <Input placeholder='Filled Input' variant='filled' />
      <Input placeholder='Unstyled Input' variant='unstyled' />
    </div>
  ),
}

/**
 * This is a list o button with different colors.
 * Just adding the **colorScheme** prop.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: ` <Input colorScheme="primary" placeholder="Primary Input" />
<Input colorScheme="secondary" placeholder="Secondary Input" />
<Input colorScheme="info" placeholder="Info Input" />
<Input colorScheme="warning" placeholder="Warning Input" />
<Input colorScheme="error" placeholder="Error Input" />
<Input colorScheme="success" placeholder="Success Input" />
          `,
      },
    },
  },
  render: () => (
    <div className='grid gap-4 grid-cols-3'>
      <Input colorScheme='primary' placeholder='Primary Input' />
      <Input colorScheme='secondary' placeholder='Secondary Input' />
      <Input colorScheme='info' placeholder='Info Input' />
      <Input colorScheme='warning' placeholder='Warning Input' />
      <Input colorScheme='error' placeholder='Error Input' />
      <Input colorScheme='success' placeholder='Success Input' />
    </div>
  ),
}

export const ControlledInput: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input
    placeholder="Controlled Input"
    value={value}
    onChange={(e) => setValue(e.target.value)}
/>`,
      },
    },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- ''
    const [value, setValue] = useState('')
    return (
      <Input
        onChange={(e) => {
          setValue(e.target.value)
        }}
        placeholder='Controlled Input'
        value={value}
      />
    )
  },
}
