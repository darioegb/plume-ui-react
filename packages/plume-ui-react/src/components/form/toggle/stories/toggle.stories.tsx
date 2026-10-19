import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Toggle } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A switch to turn a single setting on or off, with an effect that is immediate.
 * It renders a native checkbox with the `switch` role, so it works with forms, labels and the keyboard
 * out of the box. Children become its label, and the `ref` points to the input.
 */
export default {
  title: 'Components/Toggle',
  component: Toggle,
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
      description: 'Label of the Toggle. Clicking it switches the Toggle.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the label that wraps the input.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the wrapping label. They are applied after the color variables, so they can override them (e.g. `--toggle-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the Toggle.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `unstyled` leaves the native switch so you can bring your own styles.',
      options: ['solid', 'unstyled'],
      table: { type: { summary: `"solid" | "unstyled"` }, defaultValue: { summary: 'solid' } },
    },
    checked: {
      control: 'boolean',
      description: 'On state, for a controlled Toggle. Pair it with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial on state, for an uncontrolled Toggle.',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the Toggle.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description:
        'Shows the state without letting the user change it. It also silences `onChange`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the Toggle as required.',
      table: { category: 'Form', type: { summary: 'boolean' } },
    },
    name: {
      control: 'text',
      description: 'Name used when the form is submitted.',
      table: { category: 'Form', type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value submitted when the Toggle is on.',
      table: { category: 'Form', type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`. A Field sets it so its label points to the Toggle.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the Toggle has no label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Toggle.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description:
        'Ids of the elements that describe the Toggle. A Field sets it for its helper and error text.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the Toggle as invalid, which also switches it to the error color scheme.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
    onChange: {
      control: false,
      description: 'Called when the user turns the Toggle on or off.',
      table: {
        category: 'Events',
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    onBlur: {
      control: false,
      description: 'Called when the Toggle loses focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
    },
    onFocus: {
      control: false,
      description: 'Called when the Toggle receives focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
    },
  },
  args: {
    children: 'Notifications',
  },
} satisfies Meta<typeof Toggle>

type Story = StoryObj<typeof Toggle>

/**
 * This is the default Toggle. Its **children** are the label.
 */
export const Default: Story = {}

/**
 * Use the **size** prop to change the size of the box and of the label.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Toggle defaultChecked size="sm">
        Small
      </Toggle>
      <Toggle defaultChecked size="md">
        Medium
      </Toggle>
      <Toggle defaultChecked size="lg">
        Large
      </Toggle>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      {colorSchemes.map((scheme) => (
        <Toggle
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultChecked
          key={scheme}
        >
          {scheme}
        </Toggle>
      ))}
    </div>
  ),
}

/**
 * A **disabled** Toggle can't be changed or focused. A **readOnly** one can be focused but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Toggle disabled>Disabled</Toggle>
      <Toggle defaultChecked disabled>
        Disabled and on
      </Toggle>
      <Toggle defaultChecked readOnly>
        Read only and on
      </Toggle>
    </div>
  ),
}

/**
 * **aria-invalid** switches the Toggle to the error color scheme.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
}

/**
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="Turn notifications on to continue"
      helperText="We only send what matters"
      label="Alerts"
      required
    >
      <Toggle>Email notifications</Toggle>
    </Field>
  ),
}

/**
 * The **unstyled** variant leaves the native switch.
 */
export const Unstyled: Story = {
  args: {
    variant: 'unstyled',
  },
}
