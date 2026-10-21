// Input.stories.tsx
import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Input } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

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
    className: {
      control: 'text',
      description: 'Custom CSS class for the Input.',
      table: {
        type: { summary: 'string' },
      },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme for the focus border and ring, from the theme palette (custom schemes included).',
      options: colorSchemes,
      table: {
        defaultValue: { summary: 'secondary' },
        type: { summary: 'ColorScheme' },
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
    addonBefore: {
      control: false,
      description: 'Content attached before the Input, outside its border (e.g. a URL prefix).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    addonAfter: {
      control: false,
      description: 'Content attached after the Input, outside its border (e.g. a domain suffix).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    elementBefore: {
      control: false,
      description: 'Element rendered inside the Input, before the text (e.g. an icon).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    elementAfter: {
      control: false,
      description: 'Element rendered inside the Input, after the text (e.g. an icon).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style of the Input. `pill` only applies to the `outline` variant.',
      options: ['pill', 'rounded'],
      table: {
        defaultValue: { summary: 'rounded' },
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
    revealable: {
      control: 'boolean',
      description:
        'With `type="password"`, adds a button that shows or hides the password. It is a toggle button (`aria-pressed`) inside the Input, in the place of `elementAfter`; an `elementAfter` goes to its left. It has no effect with another type.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    revealLabel: {
      control: 'text',
      description:
        'Accessible name of the reveal button. It stays the same while the password is shown, `aria-pressed` tells the state, so use a label that makes sense for both: `Show password`.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Show password' },
      },
    },
    revealClassName: {
      control: 'text',
      description:
        'Custom CSS class for the reveal button, in every variant. With `variant="unstyled"` it is the only class the button has, and the Input and the button sit in a row.',
      table: { type: { summary: 'string' } },
    },
    autoComplete: {
      control: 'text',
      description:
        'Native `autocomplete`. Use `current-password` or `new-password` on a password, `email`, `one-time-code`...',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    mask: {
      control: 'text',
      description:
        'Optional input mask. `#` accepts a digit, `A` a letter and `*` a letter or digit; characters that do not fit are rejected. Any other character is a literal auto-inserted as the user types, and `\\` escapes the next character (e.g. `##/##/####`, `(###) ###-####`, `AA-####`).',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      control: false,
      description: 'Initial value for an uncontrolled Input.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles. They are applied after the color variables, so they can override `--input-color`.',
      table: { type: { summary: 'CSSProperties' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`, to link it with a `<label htmlFor>`.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: false,
      description: 'Name submitted with the form.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the Input as required for form validation.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    inputMode: {
      control: 'select',
      options: ['text', 'numeric', 'decimal', 'tel', 'email', 'url', 'search', 'none'],
      description: 'Virtual keyboard to show on touch devices.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    pattern: {
      control: 'text',
      description: 'Regular expression the value must match for form validation.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    minLength: {
      control: 'number',
      description: 'Minimum number of characters.',
      table: { category: 'HTML attributes', type: { summary: 'number' } },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters.',
      table: { category: 'HTML attributes', type: { summary: 'number' } },
    },
    min: {
      control: false,
      description: 'Minimum value for `number`, `date` and other range types.',
      table: { category: 'HTML attributes', type: { summary: 'number | string' } },
    },
    max: {
      control: false,
      description: 'Maximum value for `number`, `date` and other range types.',
      table: { category: 'HTML attributes', type: { summary: 'number | string' } },
    },
    onChange: {
      description:
        'Called when the value changes. With a `mask`, `event.target.value` is already formatted.',
      action: 'changed',
      table: { category: 'Events', type: { summary: '(event: ChangeEvent) => void' } },
    },
    onBlur: {
      control: false,
      description: 'Called when the Input loses focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
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
  },
}

/**
 * This is a list of Input with different variants.
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
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      <Input placeholder="Outline Input" variant="outline" />
      <Input placeholder="Underline Input" variant="underline" />
      <Input placeholder="Filled Input" variant="filled" />
      <Input placeholder="Unstyled Input" variant="unstyled" />
    </div>
  ),
}

/**
 * This is a list of Input with different sizes.
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
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Input placeholder="Small Input" size="sm" />
      <Input placeholder="Medium Input" size="md" />
      <Input placeholder="Large Input" size="lg" />
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
    <div className="grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
      <Input colorScheme="primary" placeholder="Primary Input" />
      <Input colorScheme="secondary" placeholder="Secondary Input" />
      <Input colorScheme="info" placeholder="Info Input" />
      <Input colorScheme="warning" placeholder="Warning Input" />
      <Input colorScheme="error" placeholder="Error Input" />
      <Input colorScheme="success" placeholder="Success Input" />
    </div>
  ),
}

const userIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const searchIcon = (
  <svg
    aria-hidden="true"
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

/**
 * **addonBefore** and **addonAfter** attach content outside the Input border, such as a URL
 * prefix or a domain suffix. **elementBefore** and **elementAfter** place content inside the
 * Input, usually an icon.
 */
export const AddonsAndElements: Story = {
  name: 'Addons & elements',
  parameters: {
    docs: {
      source: {
        code: `<Input addonBefore="https://" addonAfter=".com" placeholder="your-site" />
<Input elementBefore={<UserIcon />} placeholder="Username" />
<Input elementAfter={<SearchIcon />} placeholder="Search" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input addonAfter=".com" addonBefore="https://" placeholder="your-site" />
      <Input elementBefore={userIcon} placeholder="Username" />
      <Input elementAfter={searchIcon} placeholder="Search" />
    </div>
  ),
}

/**
 * **type** is passed to the `<input>`, so `email`, `search`, `tel` and `url` work as they do natively, with the
 * right keyboard on mobile. With `type="password"`, **revealable** adds a button to show or hide the text.
 */
export const Types: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input autoComplete="email" placeholder="Email" type="email" />
<Input placeholder="Search" type="search" />
<Input autoComplete="tel" placeholder="Phone" type="tel" />
<Input placeholder="Website" type="url" />
<Input autoComplete="current-password" placeholder="Password" revealable type="password" />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input autoComplete="email" placeholder="Email" type="email" />
      <Input placeholder="Search" type="search" />
      <Input autoComplete="tel" placeholder="Phone" type="tel" />
      <Input placeholder="Website" type="url" />
      <Input autoComplete="current-password" placeholder="Password" revealable type="password" />
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
        placeholder="Controlled Input"
        value={value}
      />
    )
  },
}

/**
 * The **mask** prop formats the value as the user types and rejects characters that don't fit.
 * `#` accepts a digit, `A` a letter and `*` a letter or digit; every other character is a
 * literal that is auto-inserted (use `\` to escape a slot character).
 */
export const Masked: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Input mask='##/##/####' placeholder='dd/mm/yyyy' />
<Input mask='(###) ###-####' placeholder='(###) ###-####' />
<Input mask='#### #### #### ####' placeholder='Card number' />
<Input mask='##:##' placeholder='hh:mm' />
<Input mask='AA-####' placeholder='Letters, then digits' />
<Input mask='***-***' placeholder='Letters or digits' />`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input mask="##/##/####" placeholder="dd/mm/yyyy" />
      <Input mask="(###) ###-####" placeholder="(###) ###-####" />
      <Input mask="#### #### #### ####" placeholder="Card number" />
      <Input mask="##:##" placeholder="hh:mm" />
      <Input mask="AA-####" placeholder="Letters, then digits" />
      <Input mask="***-***" placeholder="Letters or digits" />
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
/>
<Input
  variant="unstyled"
  type="password"
  placeholder="Password"
  revealable
  className="block w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
  revealClassName="-ml-9 flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:text-gray-900 dark:hover:text-white"
/>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-72 max-w-full">
      <Input
        className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Default Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Pill Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-lg border border-transparent bg-gray-100 px-4 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white"
        placeholder="Filled Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm text-red-700 focus:border-red-500 focus:ring focus:ring-red-200 dark:text-red-400"
        defaultValue="Invalid value"
        placeholder="Error Input"
        variant="unstyled"
      />
      <Input
        className="block w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Password"
        revealClassName="-ml-9 flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:text-gray-900 dark:hover:text-white"
        revealable
        type="password"
        variant="unstyled"
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
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <Input className="form-control" placeholder="Default Input" variant="unstyled" />
      <Input
        className="form-control form-control-lg"
        placeholder="Large Input"
        variant="unstyled"
      />
      <Input
        className="form-control form-control-sm"
        placeholder="Small Input"
        variant="unstyled"
      />
      <Input
        className="form-control is-valid"
        defaultValue="Valid value"
        placeholder="Valid Input"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
      <Input
        className="form-control is-invalid"
        defaultValue="Invalid value"
        placeholder="Invalid Input"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
    </div>
  ),
}
