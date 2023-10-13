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
    borderColor: {
      control: 'color',
      description: 'The color of the spinner border.',
      table: {
        type: { summary: 'string' },
      },
    },
    borderTopColor: {
      control: 'color',
      description: 'The color of the spinner top border.',
      table: {
        type: { summary: 'string' },
      },
    },
    borderBottomColor: {
      control: 'color',
      description: 'The color of the spinner bottom border.',
      table: {
        type: { summary: 'string' },
      },
    },
    borderLeftColor: {
      control: 'color',
      description: 'The color of the spinner left border.',
      table: {
        type: { summary: 'string' },
      },
    },
    borderRightColor: {
      control: 'color',
      description: 'The color of the spinner right border.',
      table: {
        type: { summary: 'string' },
      },
    },
    customClasses: {
      control: 'text',
      description: `Custom CSS class for the spinner.`,
      table: {
        type: { summary: 'string' },
      },
    },
    customStyles: {
      description: 'Array of additional CSS styles for the spinner.',
      control: 'object',
      table: {
        type: { summary: 'CSSProperties' },
      },
    },
    size: {
      control: 'radio',
      description: 'The size of the spinner.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
      },
    },
    speed: {
      control: 'text',
      description: 'The animation speed of the spinner.',
      table: {
        type: { summary: 'string' },
      },
    },
    thickness: {
      control: 'number',
      description: 'The border thickness of the spinner.',
      table: {
        type: { summary: 'number' },
      },
    },
    variant: {
      control: 'select',
      description: 'The border variant of the spinner.',
      options: ['solid', 'dashed', 'dotted', 'double', 'unstyled'],
      table: {
        type: { summary: `"solid" | "dashed" | "dotted" | "double" | "unstyled"` },
      },
    },
  },
} satisfies Meta<typeof Spinner>

type Story = StoryObj<typeof Spinner>

/**
 * This is the default spinner.
 */
export const Default: Story = {}

/**
 * This is a list of spinner with different sizes.
 * Just adding the **size** prop with lg, md or sm.
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner size="sm" />
<Spinner />
<Spinner size="lg" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner customStyles={{marginRight: '.5rem'}} size="sm" />
      <Spinner customStyles={{marginRight: '.5rem'}} />
      <Spinner size="lg" />
    </>
  ),
}

/**
 * This is a list of spinners with different border variant.
 * Just adding **variant** prop with dashed, dotted, double or solid.
 */
export const DifferentVariant: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner variant='dashed' />
<Spinner variant='dotted' />
<Spinner variant='double' />
<Spinner />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner customStyles={{marginRight: '.5rem'}} variant="dashed" />
      <Spinner customStyles={{marginRight: '.5rem'}} variant="dotted" />
      <Spinner customStyles={{marginRight: '.5rem'}} variant="double" />
      <Spinner />
    </>
  ),
}

/**
 * This is a spinner with custom thickness.
 * Just adding **thickness** prop with number value.
 */
export const CustomThickness: Story = {
  args: {
    thickness: 5,
  },
}

/**
 * This is a spinner with custom color.
 * Just adding **borderColor** prop with color value.
 */
export const CustomColor: Story = {
  args: {
    borderColor: 'blue',
  },
}

/**
 * This is a spinner with individual border colors for each side.
 * Using **borderTopColor, borderRightColor, borderBottomColor and borderLeftColor** props with color value.
 */
export const IndividualBorderColors: Story = {
  args: {
    borderTopColor: 'red',
    borderRightColor: 'green',
    borderBottomColor: 'blue',
    borderLeftColor: 'purple',
  },
}

/**
 * This is a spinner with custom animation speed.
 * Just adding **speed** prop with string value in seconds,
 *  for example: **.2s**.
 */
export const CustomSpeed: Story = {
  args: {
    speed: '0.5s',
  },
}

/**
 * This is a spinner with custom inline styles.
 * Using **customStyles** prop setting different attributes.
 */
export const CustomStyles: Story = {
  args: {
    customStyles: {
      borderWidth: '5px',
      backgroundImage: 'linear-gradient(to right, #fff300, #00ff9b)',
      animationDuration: '2s',
      borderColor: 'gray',
      borderStyle: 'dotted',
    },
  },
}

/**
 * Some examples of spinner with custom classes from tailwind
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner customClasses="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white" variant="unstyled" />
<Spinner customClasses="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" variant="unstyled" />
<Spinner customClasses="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" variant="unstyled" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner customClasses="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white mr-2" variant="unstyled" />
      <Spinner customClasses="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full mr-2" variant="unstyled" />
      <Spinner customClasses="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" variant="unstyled" />
    </>
  ),
}

/**
 * Some examples of spinner with custom classes from bootstrap
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Spinner customClasses="spinner-border" variant="unstyled" />
<Spinner customClasses="spinner-border text-primary" variant="unstyled" />
<Spinner customClasses="spinner-grow" variant="unstyled" />
<Spinner customClasses="spinner-border spinner-border-sm" variant="unstyled" />
            `,
      },
    },
  },
  render: () => (
    <>
      <Spinner customClasses="spinner-border mr-2" variant="unstyled" />
      <Spinner customClasses="spinner-border text-primary mr-2" variant="unstyled" />
      <Spinner customClasses="spinner-grow mr-2" variant="unstyled" />
      <Spinner customClasses="spinner-border spinner-border-sm" variant="unstyled" />
    </>
  ),
}
