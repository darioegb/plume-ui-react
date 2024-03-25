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
      description: 'Content of the Button (text, HTML elements, etc.).',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: `Custom CSS class for the Button.`,
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      description: 'Array of additional CSS styles for the Button.',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Indicates whether the Button is disabled.',
      if: { arg: 'busy', truthy: false },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Function triggered when the Button is clicked.',
    },
    type: {
      control: 'radio',
      description: 'Type of the Button (e.g., "button" or "submit").',
      options: ['button', 'submit', 'reset'],
      table: {
        type: { summary: `"button" | "submit" | "reset"` },
      },
    },
    colorScheme: {
      control: 'select',
      description: 'Custom color scheme for the Button.',
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'dark', 'light'],
      table: {
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      description: 'Label for the Button. If set, it will override children.',
      table: {
        type: { summary: 'string' },
      },
    },
    iconLeft: {
      control: 'object',
      description: 'Icon to be displayed on the left side of the Button.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    iconRight: {
      control: 'object',
      description: 'Icon to be displayed on the right side of the Button.',
      if: { arg: 'children', truthy: false },
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    isBusy: {
      control: 'boolean',
      description: 'Whether the Button is in a busy/loading state.',
      if: { arg: 'disabled', truthy: false },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    busyText: {
      control: 'text',
      description: 'Text to display when the Button is in a busy/loading state.',
      table: {
        type: { summary: 'string' },
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Shape style of the Button.',
      options: ['pill', 'rounded'],
      table: {
        type: { summary: `"pill" | "rounded"` },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the Button.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    variant: {
      control: 'select',
      description: 'Visual style variant of the Button.',
      options: ['solid', 'outline', 'link', 'icon', 'ghost', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "link" | "icon" | "ghost" | "unstyled"` },
      },
    },
  },
  args: {
    disabled: false,
    isBusy: false,
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

/**
 * This is the default Button with only setting a **label** prop.
 */
export const Default: Story = {
  args: {
    label: 'Default Button',
  },
}

/**
 * This is a list o Button with different sizes.
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
 * This is a list o Button with different variants.
 * Just adding the **variant** prop in one of these values **solid**, **outline**, **link**, **icon** and **unstyled**. For works with icons also we can use other variants not only **icon**, this variant allows us to show the icon alone without borders or background. Icons can be added using props **iconLeft**, **iconRight** and also with **children**
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
<Button 
  label="Unstyled Button"
  variant="unstyled" 
/>
<Button 
  label="Ghost Button" 
  variant="ghost" 
/>
<Button 
  variant="icon"
>
  <svg
    fill="#000000"
    height="32"
    viewBox="0 0 256 256"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200h-61L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-32.34,36-52.63,45.37-59.85a16,16,0,0,1,19.6,0c9.34,7.22,32.47,27.51,45.37,59.85a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,47.64,134.49,29,128,24c-6.51,5-28.57,23.64-40.33,53.12C74.36,110.52,78.31,146.46,99.43,184Zm-15,5.85Q68.28,160.5,64.83,132.16L48,152.36,60.36,208l.18-.13ZM208,152.36l-16.83-20.2q-3.42,28.28-19.56,57.69l23.85,18,.18.13Z" />
  </svg>
</Button>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button colorScheme="primary" label="Solid Button" />
      <Button colorScheme="success" label="Outline Button" variant="outline" />
      <Button colorScheme="error" label="Link Button" variant="link" />
      <Button label="Unstyled Button" variant="unstyled" />
      <Button label="Ghost Button" variant="ghost" />
      <Button colorScheme="primary" variant="icon">
        <svg
          fill="currentColor"
          height="32"
          viewBox="0 0 256 256"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200h-61L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-32.34,36-52.63,45.37-59.85a16,16,0,0,1,19.6,0c9.34,7.22,32.47,27.51,45.37,59.85a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,47.64,134.49,29,128,24c-6.51,5-28.57,23.64-40.33,53.12C74.36,110.52,78.31,146.46,99.43,184Zm-15,5.85Q68.28,160.5,64.83,132.16L48,152.36,60.36,208l.18-.13ZM208,152.36l-16.83-20.2q-3.42,28.28-19.56,57.69l23.85,18,.18.13Z" />
        </svg>
      </Button>
    </div>
  ),
}

/**
 * This is a list o Button with different colors.
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
 * This is a Button with icon left & right.
 */
export const WithIcons: Story = {
  args: {
    colorScheme: 'primary',
    iconLeft: (
      <svg
        fill="currentColor"
        height="32"
        viewBox="0 0 256 256"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
      </svg>
    ),
    iconRight: (
      <svg
        fill="currentColor"
        height="32"
        viewBox="0 0 256 256"
        width="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
      </svg>
    ),
  },
}

/**
 * This is a Button with children.
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
 * This is a Button Pill. A pill is full rounded.
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
 * This is Button Block.
 * Full-width setting width on **style** prop.
 */
export const Block: Story = {
  args: {
    ...Default.args,
    label: 'Block Button',
    colorScheme: 'primary',
    style: { width: '100%' },
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
 * This is a Button with disabled state.
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
 * This is a Button with busy state.
 * Using **busy** and **busyText** props,
 * for customize the button during the busy stage.
 */
export const Busy: Story = {
  args: {
    isBusy: true,
    busyText: 'Loading...',
    label: 'Busy Button',
  },
  parameters: {
    docs: {
      source: {
        code: `<Button 
  isBusy 
  label="Busy Default Button" 
/>
<Button 
  busyText="Loading..." 
  isBusy 
  label="Busy Button" 
/>
        `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-2">
      <Button isBusy label="Busy Default Button" />
      <Button busyText="Loading..." isBusy label="Busy Button" />
    </div>
  ),
}

/**
 * This is a button with custom inline styles.
 * Using **style** prop setting different attributes.
 */
export const CustomStyle: Story = {
  args: {
    children: 'Custom Style Button',
    style: {
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
    variant="unstyled"
  />
<Button
  label="Soft Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-500 hover:text-white hover:bg-gray-500 border border-transparent font-semibold rounded text-sm"
  variant="unstyled"
/>
<Button
  label="Outline Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 hover:text-white hover:bg-blue-500 hover:border-blue-500 text-blue-500 border border-blue-200 font-semibold rounded text-sm"
  variant="unstyled"
/>
<Button
  label="Ghost Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 hover:bg-blue-100 text-blue-500 border border-transparent font-semibold rounded text-sm"
  variant="unstyled"
/>
<Button
  label="Pilled Button"
  className="py-3 px-4 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full text-sm"
  variant="unstyled"
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
  variant="unstyled"
/>
          `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white border border-transparent font-semibold rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        label="Primary Button"
        variant="unstyled"
      />
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 bg-gray-100 text-gray-500 hover:text-white hover:bg-gray-500 border border-transparent font-semibold rounded text-sm"
        label="Soft Button"
        variant="unstyled"
      />
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 hover:text-white hover:bg-blue-500 hover:border-blue-500 text-blue-500 border border-blue-200 font-semibold rounded text-sm"
        label="Outline Button"
        variant="unstyled"
      />
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 hover:bg-blue-100 text-blue-500 border border-transparent font-semibold rounded text-sm"
        label="Ghost Button"
        variant="unstyled"
      />
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full text-sm"
        label="Pilled Button"
        variant="unstyled"
      />
      <Button
        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-sm"
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
        variant="unstyled"
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
  variant="unstyled"
/>
<Button
  label="Soft Button"
  className="btn btn-light"
  variant="unstyled"
/>
<Button
  label="Outline Button"
  className="btn btn-outline-primary"
  variant="unstyled"
/>
<Button
  label="Link Button"
  className="btn btn-link"
  variant="unstyled"
/>
<Button
  label="Pill Button"
  className="btn btn-primary rounded-pill"
  variant="unstyled"
/>
<Button
  label="With icon right"
  className="btn btn-primary d-inline-flex justify-content-center align-items-center gap-2 bg-blue-600"
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
  variant="unstyled"
/>
        `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3 grid-rows-2">
      <Button className="btn btn-primary bg-blue-600" label="Primary Button" variant="unstyled" />
      <Button className="btn btn-light" label="Soft Button" variant="unstyled" />
      <Button className="btn btn-outline-primary" label="Outline Button" variant="unstyled" />
      <Button className="btn btn-link" label="Link Button" variant="unstyled" />
      <Button
        className="btn btn-primary rounded-pill bg-blue-600"
        label="Pill Button"
        variant="unstyled"
      />
      <Button
        className="btn btn-primary d-inline-flex justify-content-center align-items-center gap-2 bg-blue-600"
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
        variant="unstyled"
      />
    </div>
  ),
}
