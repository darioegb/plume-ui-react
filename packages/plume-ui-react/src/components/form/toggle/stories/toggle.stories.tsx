import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Toggle } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A switch to turn a single setting on or off, with an effect that is immediate.
 * It renders a single native checkbox with the `switch` role, so it works with forms and the keyboard out of the
 * box. It has no label of its own: give it an `aria-label`, or wrap it in a `Field` with `orientation="inline"`
 * to show a label, a helper and an error text. The `className`, the `style` and the `ref` go to the input.
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
    className: {
      control: 'text',
      description: 'Custom CSS class for the `<input>`, in every variant.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the `<input>`. They are applied after the color variables, so they can override them (e.g. `--toggle-solid`).',
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
        'Visual variant. `solid` fills the track when on, `outline` only colors its border and thumb, and `raised` floats a bigger thumb with a shadow over a thin track. `unstyled` leaves the native switch so you can bring your own styles.',
      options: ['solid', 'outline', 'raised', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "raised" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
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
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    name: {
      control: 'text',
      description: 'Name used when the form is submitted.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value submitted when the Toggle is on.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`. A Field sets it so its label points to the Toggle.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the Toggle is not inside a Field with a label.',
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
    'aria-label': 'Notifications',
  },
} satisfies Meta<typeof Toggle>

type Story = StoryObj<typeof Toggle>

/**
 * This is the default Toggle. It has no visible label, so it takes an **aria-label**.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how an on switch looks: `solid` fills the track with the color, `outline`
 * only colors the border and the thumb, `raised` floats a bigger thumb with a shadow over a thin track, and
 * `unstyled` leaves the native switch so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Field label="Solid" orientation="inline">
        <Toggle defaultChecked variant="solid" />
      </Field>
      <Field label="Outline" orientation="inline">
        <Toggle defaultChecked variant="outline" />
      </Field>
      <Field label="Raised" orientation="inline">
        <Toggle defaultChecked variant="raised" />
      </Field>
      <Field label="Unstyled" orientation="inline">
        <Toggle defaultChecked variant="unstyled" />
      </Field>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the switch.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Field label="Small" orientation="inline">
        <Toggle defaultChecked size="sm" />
      </Field>
      <Field label="Medium" orientation="inline">
        <Toggle defaultChecked size="md" />
      </Field>
      <Field label="Large" orientation="inline">
        <Toggle defaultChecked size="lg" />
      </Field>
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
        <Field key={scheme} label={scheme} orientation="inline">
          <Toggle colorScheme={scheme as keyof typeof defaultTheme.colors} defaultChecked />
        </Field>
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
      <Field label="Disabled" orientation="inline">
        <Toggle disabled />
      </Field>
      <Field label="Disabled and on" orientation="inline">
        <Toggle defaultChecked disabled />
      </Field>
      <Field label="Read only and on" orientation="inline">
        <Toggle defaultChecked readOnly />
      </Field>
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
 * Wrap it in a **Field** with `orientation="inline"` to show its label after the switch. Clicking the label
 * switches the Toggle, and the Field wires the accessibility attributes.
 */
export const WithLabel: Story = {
  render: () => (
    <Field label="Email notifications" orientation="inline">
      <Toggle />
    </Field>
  ),
}

/**
 * The **Field** also adds a helper and an error text, and marks the Toggle as required or invalid.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="Turn notifications on to continue"
      helperText="We only send what matters"
      label="Email notifications"
      orientation="inline"
      required
    >
      <Toggle />
    </Field>
  ),
}

/**
 * Some examples of Toggle with Tailwind classes. The input is a native checkbox with `role="switch"`: `appearance-none` and a `before:` pseudo-element draw the track and the thumb, and `checked:` styles the on state. The `className` goes to the input.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Field label="Email notifications" orientation="inline">
    <Toggle
      className="relative h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-500 transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:content-[''] checked:bg-emerald-600 checked:before:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      variant="unstyled"
    />
  </Field>
  <Field label="Dark mode" orientation="inline">
    <Toggle
      className="relative h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-500 transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:content-[''] checked:bg-blue-600 checked:before:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      defaultChecked
      variant="unstyled"
    />
  </Field>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Field label="Email notifications" orientation="inline">
        <Toggle
          className="relative h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-500 transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:content-[''] checked:bg-emerald-600 checked:before:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          variant="unstyled"
        />
      </Field>
      <Field label="Dark mode" orientation="inline">
        <Toggle
          className="relative h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-500 transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:content-[''] checked:bg-blue-600 checked:before:translate-x-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          defaultChecked
          variant="unstyled"
        />
      </Field>
    </div>
  ),
}

/**
 * Some examples of Toggle with Bootstrap classes: `form-check form-switch` on a wrapper, `form-check-input` on the input (Bootstrap draws the switch for `role="switch"`) and `form-check-label` on your own `<label>`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-2">
  <div className="form-check form-switch">
    <Toggle className="form-check-input" id="email" variant="unstyled" />
    <label className="form-check-label" htmlFor="email">Email notifications</label>
  </div>
  <div className="form-check form-switch">
    <Toggle className="form-check-input" defaultChecked id="dark" variant="unstyled" />
    <label className="form-check-label" htmlFor="dark">Dark mode</label>
  </div>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-2">
      <div className="form-check form-switch">
        <Toggle className="form-check-input" id="toggle-email" variant="unstyled" />
        <label className="form-check-label" htmlFor="toggle-email">
          Email notifications
        </label>
      </div>
      <div className="form-check form-switch">
        <Toggle className="form-check-input" defaultChecked id="toggle-dark" variant="unstyled" />
        <label className="form-check-label" htmlFor="toggle-dark">
          Dark mode
        </label>
      </div>
    </div>
  ),
}
