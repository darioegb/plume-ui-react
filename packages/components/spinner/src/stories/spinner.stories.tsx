import type { StoryObj, Meta } from '@storybook/react'
import { Spinner } from '..'

/**
 * The Spinner component is a visual representation of loading that is commonly used to indicate that an action is being processed
 * or content is being loaded in an application.
 * This component offers flexibility in customizing its appearance and behavior through various properties.
 */
export default {
  title: 'Components/Utility/Spinner',
  component: Spinner,
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
    colorScheme: {
      control: 'select',
      description: 'Custom color scheme for the Spinner.',
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'dark', 'light'],
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: `Custom CSS class for the Spinner.`,
      table: {
        type: { summary: 'string' },
      },
    },
    style: {
      description: 'Array of additional CSS styles for the Spinner.',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    size: {
      control: 'radio',
      description: 'The size of the Spinner.',
      options: ['sm', 'md', 'lg'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    speed: {
      control: 'text',
      description: 'The animation speed of the Spinner.',
      table: {
        defaultValue: { summary: '1s' },
        type: { summary: 'string' },
      },
    },
    thickness: {
      control: 'number',
      description: 'The border thickness of the Spinner.',
      table: {
        defaultValue: { summary: 3 },
        type: { summary: 'number' },
      },
    },
    variant: {
      control: 'select',
      description: 'The border variant of the Spinner.',
      options: ['solid', 'dashed', 'dotted', 'double', 'unstyled'],
      table: {
        defaultValue: { summary: 'solid' },
        type: { summary: `"solid" | "dashed" | "dotted" | "double" | "unstyled"` },
      },
    },
  },
} satisfies Meta<typeof Spinner>

type Story = StoryObj<typeof Spinner>

/**
 * This is the default Spinner.
 */
export const Default: Story = {}

/**
 * This is a list of Spinner with different sizes.
 * Just adding the **size** prop with lg, md or sm.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner 
  colorScheme="primary"
  size="sm" 
/>
<Spinner colorScheme="primary" />
<Spinner 
  colorScheme="primary" 
  size="lg" 
/>
        `,
      },
    },
  },
  render: () => (
    <>
      <Spinner colorScheme="primary" style={{ marginRight: '.5rem' }} size="sm" />
      <Spinner colorScheme="primary" style={{ marginRight: '.5rem' }} />
      <Spinner colorScheme="primary" size="lg" />
    </>
  ),
}

/**
 * This is a list of spinners with different border variant.
 * Just adding **variant** prop with dashed, dotted, double or solid.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner 
  colorScheme="primary" 
  variant='dashed' 
/>
<Spinner 
  colorScheme="primary" 
  variant='dotted' 
/>
<Spinner 
  colorScheme="primary" 
  variant='double' 
/>
<Spinner colorScheme="primary" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner colorScheme="primary" style={{ marginRight: '.5rem' }} variant="dashed" />
      <Spinner colorScheme="primary" style={{ marginRight: '.5rem' }} variant="dotted" />
      <Spinner colorScheme="primary" style={{ marginRight: '.5rem' }} variant="double" />
      <Spinner colorScheme="primary" />
    </>
  ),
}

/**
 * This is a list o Spinner with different colors.
 * Just adding the **colorScheme** prop.
 */
export const Colors: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner />
<Spinner colorScheme="primary" />
<Spinner colorScheme="secondary" />
<Spinner colorScheme="info" />
<Spinner colorScheme="warning" />
<Spinner colorScheme="error" />
<Spinner colorScheme="success" />
<Spinner colorScheme="dark" />
<Spinner colorScheme="light" />
        `,
      },
    },
  },
  render: () => (
    <div className="grid gap-4 grid-cols-3">
      <Spinner />
      <Spinner colorScheme="primary" />
      <Spinner colorScheme="secondary" />
      <Spinner colorScheme="info" />
      <Spinner colorScheme="warning" />
      <Spinner colorScheme="error" />
      <Spinner colorScheme="success" />
      <Spinner colorScheme="dark" />
      <Spinner colorScheme="light" />
    </div>
  ),
}

/**
 * This is a Spinner with custom thickness.
 * Just adding **thickness** prop with number value.
 */
export const CustomThickness: Story = {
  args: {
    colorScheme: 'primary',
    thickness: 5,
  },
}

/**
 * This is a Spinner with custom animation speed.
 * Just adding **speed** prop with string value in seconds,
 *  for example: **.2s**.
 */
export const CustomSpeed: Story = {
  args: {
    colorScheme: 'primary',
    speed: '0.5s',
  },
}

/**
 * This is a Spinner with custom inline styles.
 * Using **style** prop setting different attributes.
 */
export const style: Story = {
  args: {
    style: {
      borderWidth: '5px',
      backgroundImage: 'linear-gradient(to right, #fff300, #00ff9b)',
      animationDuration: '2s',
      borderColor: 'gray',
      borderStyle: 'dotted',
    },
  },
}

/**
 * This is a empty area Spinner with custom inline styles.
 * Using **style** prop setting **borderColor** & **borderTopColor**.
 */
export const EmptyArea: Story = {
  args: {
    style: {
      borderColor: '#f6eeee',
      borderTopColor: 'red',
    },
  },
}

/**
 * Some examples of Spinner with custom classes from tailwind
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" variant="unstyled" />
<Spinner className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" variant="unstyled" />
<Spinner className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" variant="unstyled" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white mr-2"
        variant="unstyled"
      />
      <Spinner
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full mr-2"
        variant="unstyled"
      />
      <Spinner
        className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        variant="unstyled"
      />
    </>
  ),
}

/**
 * Some examples of Spinner with custom classes from bootstrap
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner className="spinner-border" variant="unstyled" />
<Spinner className="spinner-border text-primary" variant="unstyled" />
<Spinner className="spinner-grow" variant="unstyled" />
<Spinner className="spinner-border spinner-border-sm" variant="unstyled" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner className="spinner-border mr-2" variant="unstyled" />
      <Spinner className="spinner-border text-primary mr-2" variant="unstyled" />
      <Spinner className="spinner-grow mr-2" variant="unstyled" />
      <Spinner className="spinner-border spinner-border-sm" variant="unstyled" />
    </>
  ),
}
