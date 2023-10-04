import type { StoryObj, Meta } from '@storybook/react'
import { Button } from '..'

/**
 * Enhance user interactions with the Button component,
 * featuring customizable styles for triggering actions within forms, dialogs, and other contexts.
 * With support for various sizes and states,
 * it facilitates actions such as form submissions, dialog interactions, and deletion or cancellation operations.
 */
export default {
  title: 'Components/Interaction/Button',
  component: Button,
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
      control: 'object',
      description: 'Content of the button (text, HTML elements, etc.).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    customClasses: {
      control: 'text',
      description: `Custom CSS class for the button. 
        Take into account if these custom classes are applied, 
        the classes of the button within the library are not applied. 
        So attributes like colorScheme, shape, size, variant have no effect.`,
      if: { arg: 'variant', truthy: false },
      table: {
        type: { summary: 'string' },
      },
    },
    customStyles: {
      description: 'Array of additional CSS styles for the button.',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the button is disabled.',
      if: { arg: 'busy', truthy: false },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function triggered when the button is clicked.',
    },
    type: {
      control: 'radio',
      description: 'Type of the button (e.g., "button" or "submit").',
      options: ['button', 'submit', 'reset'],
      table: {
        type: { summary: `"button" | "submit" | "reset"` },
      },
    },
    colorScheme: {
      control: 'select',
      description: 'Custom color scheme for the button.',
      if: { arg: 'customClasses', truthy: false },
      options: [
        'primary',
        'secondary',
        'info',
        'warning',
        'error',
        'success',
        'dark',
        'light',
      ],
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Label for the button. If set, it will override children.',
      table: {
        type: { summary: 'string' },
      },
    },
    iconLeft: {
      control: 'object',
      description: 'Icon to be displayed on the left side of the button.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    iconRight: {
      control: 'object',
      description: 'Icon to be displayed on the right side of the button.',
      if: { arg: 'children', truthy: false },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    busy: {
      control: 'boolean',
      description: 'Whether the button is in a busy/loading state.',
      if: { arg: 'disabled', truthy: false },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    busyText: {
      control: 'text',
      description:
        'Text to display when the button is in a busy/loading state.',
      table: {
        type: { summary: 'string' },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style of the button.',
      if: { arg: 'customClasses', truthy: false },
      options: ['pill', 'rounded'],
      table: {
        type: { summary: `"pill" | "rounded"` },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the button.',
      if: { arg: 'customClasses', truthy: false },
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the button.',
      if: { arg: 'customClasses', truthy: false },
      options: ['solid', 'outline', 'link', 'icon'],
      table: {
        type: { summary: `"solid" | "outline" | "link" | "icon"` },
      },
    },
  },
  args: {
    disabled: false,
    busy: false,
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

/**
 * This is the default button with only setting a **label** prop.
 */
export const Default: Story = {
  args: {
    label: 'Default Button',
  },
}

/**
 * This is a list o button with different sizes.
 * Just adding the **size** prop.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Button 
  colorScheme="primary" 
  label="Small Button" 
  size="sm" 
/>
<Button 
  colorScheme="primary" 
  label="Medium Button" 
  size="md" 
/>
<Button 
  colorScheme="primary" 
  label="Large Button" 
  size="lg" 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-center">
      <Button colorScheme="primary" label="Small Button" size="sm" />
      <Button colorScheme="primary" label="Medium Button" size="md" />
      <Button colorScheme="primary" label="Large Button" size="lg" />
    </div>
  ),
}

/**
 * This is a list o button with different variants.
 * Just adding the **variant** in one of these values **solid**, **outline**, **link**, **icon**. For works with icons also we can use other variants not only **icon**, this variant allows us to show the icon alone without borders or background. Icons can be added using props **iconLeft**, **iconRight** and also with **children**
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Button 
  colorScheme="primary" 
  label="Solid Button" 
/>
<Button 
  colorScheme="success" 
  label="Outline Button"
  variant="outline" 
/>
<Button 
  colorScheme="error"
  label="Link Button" 
  variant="link"
/>
<Button variant="icon">🚀</Button>
<Button
  colorScheme="info"
  iconLeft={<span>👈</span>}
  iconRight={<span>👉</span>}
/>
<Button variant="outline">💡</Button>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button colorScheme="primary" label="Solid Button" />
      <Button colorScheme="success" label="Outline Button" variant="outline" />
      <Button colorScheme="error" label="Link Button" variant="link" />
      <Button variant="icon">🚀</Button>
      <Button
        colorScheme="info"
        iconLeft={<span>👈</span>}
        iconRight={<span>👉</span>}
      />
      <Button variant="outline">💡</Button>
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
        code: `<Button label="Default Button" />
<Button 
  colorScheme="primary"
  label="Primary Button" 
/>
<Button 
  colorScheme="secondary"
  label="Secondary Button"
/>
<Button 
  colorScheme="info"
  label="Info Button"
/>
<Button 
  colorScheme="warning"
  label="Warning Button"
/>
<Button 
  colorScheme="error"
  label="Error Button"
/>
<Button 
  colorScheme="success"
  label="Success Button"
/>
<Button 
  colorScheme="dark"
  label="Dark Button"
/>
<Button 
  colorScheme="light"
  label="Light Button"
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Button label="Default Button" />
      <Button colorScheme="primary" label="Primary Button" />
      <Button colorScheme="secondary" label="Secondary Button" />
      <Button colorScheme="info" label="Info Button" />
      <Button colorScheme="warning" label="Warning Button" />
      <Button colorScheme="error" label="Error Button" />
      <Button colorScheme="success" label="Success Button" />
      <Button colorScheme="dark" label="Dark Button" />
      <Button colorScheme="light" label="Light Button" />
    </div>
  ),
}

/**
 * This is a button with children.
 * for customize the button body.
 */
export const WithChildren: Story = {
  args: {
    colorScheme: 'primary',
    children: (
      <>
        <strong>With</strong>
        <small style={{ marginLeft: '.25rem' }}>children</small>
      </>
    ),
  },
}

/**
 * This is a pill button. A pill is full rounded.
 * Using **shape** prop in **pill** by default is rounded.
 */
export const Pill: Story = {
  args: {
    colorScheme: 'primary',
    label: 'Pill Button',
    shape: 'pill',
  },
}

/**
 * This is a block button.
 * Full-width setting width on **style** prop.
 */
export const Block: Story = {
  args: {
    ...Default.args,
    label: 'Block Button',
    colorScheme: 'primary',
    customStyles: { width: '100%' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '20em' }}>
        <Story />
      </div>
    ),
  ],
}

/**
 * This is a disabled button.
 * Just adding the **disabled** prop in true.
 * The disabled state add **.disabled** class,
 * that contain **opacity: .5** and **cursor: not-allowed**.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    label: 'Disabled Button',
    disabled: true,
  },
}

/**
 * This is a busy button.
 * Using **busy** and **busyText** props,
 * for customize the button during the busy stage.
 */
export const Busy: Story = {
  args: {
    busy: true,
    busyText: 'Loading...',
    label: 'Busy Button',
  },
  parameters: {
    docs: {
      source: {
        code: `<Button 
    busy 
    label="Busy Default Button" 
  />
<Button 
  busy 
  busyText="Loading..." 
  label="Busy Button" 
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      <Button busy label="Busy Default Button" />
      <Button busy busyText="Loading..." label="Busy Button" />
    </div>
  ),
}

/**
 * This is a button with custom inline styles.
 * Using **customStyles** prop setting different attributes.
 */
export const CustomStyle: Story = {
  args: {
    children: 'Custom Style Button',
    customStyles: {
      backgroundColor: '#800080',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
    },
  },
}

/**
 * Some examples of button with custom classes from tailwind.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Button
    label="Primary Button"
    className="py-3 px-4 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white border border-transparent font-semibold rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
  />
<Button
  label="Soft Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-500 hover:text-white hover:bg-gray-500 border border-transparent font-semibold rounded text-sm"
/>
<Button
  label="Outline Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 hover:text-white hover:bg-blue-500 hover:border-blue-500 text-blue-500 border border-blue-200 font-semibold rounded text-sm"
/>
<Button
  label="Ghost Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 hover:bg-blue-100 text-blue-500 border border-transparent font-semibold rounded text-sm"
/>
<Button
  label="Pilled Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full text-sm"
/>
<Button
  label="With icon right"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm"
  iconRight={
    <svg
      className="w-2.5 h-auto"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
        fill="currentColor"
      />
    </svg>
  }
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white border border-transparent font-semibold rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        label="Primary Button"
      />
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-500 hover:text-white hover:bg-gray-500 border border-transparent font-semibold rounded text-sm"
        label="Soft Button"
      />
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 hover:text-white hover:bg-blue-500 hover:border-blue-500 text-blue-500 border border-blue-200 font-semibold rounded text-sm"
        label="Outline Button"
      />
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 hover:bg-blue-100 text-blue-500 border border-transparent font-semibold rounded text-sm"
        label="Ghost Button"
      />
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full text-sm"
        label="Pilled Button"
      />
      <Button
        customClasses="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm"
        iconRight={
          <svg
            className="w-2.5 h-auto"
            fill="none"
            height="16"
            viewBox="0 0 17 16"
            width="17"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        }
        label="With icon right"
      />
    </div>
  ),
}

/**
 * Some examples of button with custom classes from bootstrap.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Button
  label="Primary Button"
  className="btn btn-primary"
/>
<Button
  label="Soft Button"
  className="btn btn-light"
/>
<Button
  label="Outline Button"
  className="btn btn-outline-primary"
/>
<Button
  label="Link Button"
  className="btn btn-link"
/>
<Button
  label="Pill Button"
  className="btn btn-primary rounded-pill"
/>
<Button
  label="With icon right"
  className="btn btn-primary d-inline-flex justify-content-center align-items-center"
  iconRight={
    <svg
      className="w-25 h-auto"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
        fill="currentColor"
      />
    </svg>
  }
/>
        `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button
        customClasses="btn btn-primary bg-blue-600"
        label="Primary Button"
      />
      <Button customClasses="btn btn-light" label="Soft Button" />
      <Button customClasses="btn btn-outline-primary" label="Outline Button" />
      <Button customClasses="btn btn-link" label="Link Button" />
      <Button
        customClasses="btn btn-primary rounded-pill bg-blue-600"
        label="Pill Button"
      />
      <Button
        // colorScheme=
        customClasses="btn btn-primary d-inline-flex justify-content-center align-items-center bg-blue-600"
        iconRight={
          <svg
            className="w-3 h-auto"
            fill="none"
            height="16"
            viewBox="0 0 17 16"
            width="17"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        }
        label="With icon right"
      />
    </div>
  ),
}
