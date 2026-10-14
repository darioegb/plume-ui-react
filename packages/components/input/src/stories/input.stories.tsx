// Input.stories.tsx
import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { Input } from '..'

/**
 * Collect text from users with the Input component.
 * It supports multiple variants, sizes, shapes and color schemes, optional addons
 * and inline elements, validation states, and an input mask for formatted values
 * such as dates, phone numbers or card numbers.
 */
export default {
  title: 'Components/Input',
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
    mask: {
      control: 'text',
      description:
        'Optional input mask. `#` matches any single character; every other character is a literal that is auto-inserted as the user types (e.g. `##/##/####`, `(###) ###-####`, `#### #### #### ####`).',
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

/**
 * The **mask** prop formats the value as the user types. It is fully generic:
 * `#` matches any single character and every other character is a literal that
 * is auto-inserted. Type only the digits and the separators appear on their own.
 */
export const Masked: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input mask='##/##/####' placeholder='dd/mm/yyyy' />
<Input mask='(###) ###-####' placeholder='(###) ###-####' />
<Input mask='#### #### #### ####' placeholder='Card number' />
<Input mask='##:##' placeholder='hh:mm' />`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4'>
      <Input mask='##/##/####' placeholder='dd/mm/yyyy' />
      <Input mask='(###) ###-####' placeholder='(###) ###-####' />
      <Input mask='#### #### #### ####' placeholder='Card number' />
      <Input mask='##:##' placeholder='hh:mm' />
    </div>
  ),
}

/**
 * Some examples of Input with custom classes from tailwind.
 * Set **variant="unstyled"** so Plume styles don't override your utility classes.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input
  variant="unstyled"
  placeholder="Default Input"
  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Pill Input"
  className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Filled Input"
  className="block w-full rounded-lg border border-transparent bg-gray-100 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white"
/>
<Input
  variant="unstyled"
  placeholder="Error Input"
  defaultValue="Invalid value"
  className="block w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm text-red-700 focus:border-red-500 focus:ring focus:ring-red-200 dark:text-red-400"
/>`,
      },
    },
  },
  render: () => (
    <div className='flex flex-col gap-4 w-72'>
      <Input
        className='block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
        placeholder='Default Input'
        variant='unstyled'
      />
      <Input
        className='block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
        placeholder='Pill Input'
        variant='unstyled'
      />
      <Input
        className='block w-full rounded-lg border border-transparent bg-gray-100 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white'
        placeholder='Filled Input'
        variant='unstyled'
      />
      <Input
        className='block w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm text-red-700 focus:border-red-500 focus:ring focus:ring-red-200 dark:text-red-400'
        defaultValue='Invalid value'
        placeholder='Error Input'
        variant='unstyled'
      />
    </div>
  ),
}

/**
 * Some examples of Input with custom classes from bootstrap.
 * Set **variant="unstyled"** so Plume styles don't override the bootstrap classes.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input variant="unstyled" className="form-control" placeholder="Default Input" />
<Input variant="unstyled" className="form-control form-control-lg" placeholder="Large Input" />
<Input variant="unstyled" className="form-control form-control-sm" placeholder="Small Input" />
<Input variant="unstyled" className="form-control is-valid" placeholder="Valid Input" defaultValue="Valid value" style={{ backgroundImage: 'none' }} />
<Input variant="unstyled" className="form-control is-invalid" placeholder="Invalid Input" defaultValue="Invalid value" style={{ backgroundImage: 'none' }} />`,
      },
    },
  },
  render: () => (
    <div className='d-flex flex-column gap-3' style={{ width: '18rem' }}>
      <Input className='form-control' placeholder='Default Input' variant='unstyled' />
      <Input className='form-control form-control-lg' placeholder='Large Input' variant='unstyled' />
      <Input className='form-control form-control-sm' placeholder='Small Input' variant='unstyled' />
      <Input
        className='form-control is-valid'
        defaultValue='Valid value'
        placeholder='Valid Input'
        style={{ backgroundImage: 'none' }}
        variant='unstyled'
      />
      <Input
        className='form-control is-invalid'
        defaultValue='Invalid value'
        placeholder='Invalid Input'
        style={{ backgroundImage: 'none' }}
        variant='unstyled'
      />
    </div>
  ),
}
