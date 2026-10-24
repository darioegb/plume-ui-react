import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Checkbox } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A checkbox to pick any number of options, or to turn a single option on and off.
 * It renders a native `<input type="checkbox">`, so it works with forms and the keyboard out of the box, and
 * the `ref` points to the input. It has no text of its own: give it a visible label by wrapping it in a
 * `Field` with `orientation="inline"`, or an accessible name with `aria-label`.
 */
export default {
  title: 'Components/Checkbox',
  component: Checkbox,
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
      description: 'Custom CSS class for the `<input>`.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the `<input>`. They are applied after the color variables, so they can override them (e.g. `--checkbox-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme from the theme palette, including custom schemes added to it.',
      options: colorSchemes,
      table: {
        type: { summary: 'ColorScheme' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the box.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: `"sm" | "md" | "lg"` },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `solid` fills the box when checked and `outline` only colors its border and mark. `unstyled` leaves the native checkbox so you can bring your own styles.',
      options: ['solid', 'outline', 'unstyled'],
      table: {
        type: { summary: `"solid" | "outline" | "unstyled"` },
        defaultValue: { summary: 'solid' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Checked state, for a controlled Checkbox. Pair it with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state, for an uncontrolled Checkbox.',
      table: { type: { summary: 'boolean' } },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows a mixed state, for a parent that selects some of its children.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the Checkbox.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description:
        'Shows the state without letting the user change it. It also silences `onChange`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the Checkbox as required.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    name: {
      control: 'text',
      description: 'Name used when the form is submitted.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value submitted when the Checkbox is checked.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`. A Field sets it so its label points to the Checkbox.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the Checkbox is not inside a Field with a label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Checkbox.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description:
        'Ids of the elements that describe the Checkbox. A Field sets it for its helper and error text.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description:
        'Marks the Checkbox as invalid, which also switches it to the error color scheme.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
    onChange: {
      control: false,
      description: 'Called when the user checks or unchecks the Checkbox.',
      table: {
        category: 'Events',
        type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' },
      },
    },
    onBlur: {
      control: false,
      description: 'Called when the Checkbox loses focus.',
      table: {
        category: 'Events',
        type: { summary: '(event: FocusEvent) => void' },
      },
    },
    onFocus: {
      control: false,
      description: 'Called when the Checkbox receives focus.',
      table: {
        category: 'Events',
        type: { summary: '(event: FocusEvent) => void' },
      },
    },
  },
  args: {
    'aria-label': 'Accept the terms',
  },
} satisfies Meta<typeof Checkbox>

type Story = StoryObj<typeof Checkbox>

/**
 * This is the default Checkbox: just the box, named with **aria-label**. To show a label next to it, wrap it in a
 * `Field` (see **WithLabel**).
 */
export const Default: Story = {}

/**
 * Wrap the Checkbox in a **Field** with `orientation="inline"` to show a label after the box. Clicking the label
 * toggles the Checkbox, and the Field wires `id`, `aria-describedby`, `aria-invalid` and `required`.
 */
export const WithLabel: Story = {
  render: () => (
    <Field label="Accept the terms" orientation="inline">
      <Checkbox />
    </Field>
  ),
}

/**
 * Use the **variant** prop to pick how a checked box looks: `solid` fills it with the color, `outline` only
 * colors the border and the mark, and `unstyled` leaves the native checkbox so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      {(['solid', 'outline', 'unstyled'] as const).map((variant) => (
        <Field key={variant} label={variant} orientation="inline">
          <Checkbox defaultChecked variant={variant} />
        </Field>
      ))}
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the box.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} label={size} orientation="inline">
          <Checkbox defaultChecked size={size} />
        </Field>
      ))}
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
          <Checkbox colorScheme={scheme as keyof typeof defaultTheme.colors} defaultChecked />
        </Field>
      ))}
    </div>
  ),
}

/**
 * Set **indeterminate** on a parent whose children are only partly selected, and update it from them.
 */
function SelectAll(): React.ReactNode {
  const options = ['Email', 'SMS', 'Push']
  const [selected, setSelected] = useState<string[]>(['Email'])
  const all = selected.length === options.length
  return (
    <div className="flex flex-col gap-2">
      <Field label="All notifications" orientation="inline">
        <Checkbox
          checked={all}
          indeterminate={!all && selected.length > 0}
          onChange={() => setSelected(all ? [] : options)}
        />
      </Field>
      <div className="flex flex-col gap-2 ps-6">
        {options.map((option) => (
          <Field key={option} label={option} orientation="inline">
            <Checkbox
              checked={selected.includes(option)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(option)
                    ? current.filter((item) => item !== option)
                    : [...current, option],
                )
              }
            />
          </Field>
        ))}
      </div>
    </div>
  )
}

export const Indeterminate: Story = {
  render: () => <SelectAll />,
}

/**
 * A **disabled** Checkbox can't be changed or focused. A **readOnly** one can be focused but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Field label="Disabled" orientation="inline">
        <Checkbox disabled />
      </Field>
      <Field label="Disabled and checked" orientation="inline">
        <Checkbox defaultChecked disabled />
      </Field>
      <Field label="Read only and checked" orientation="inline">
        <Checkbox defaultChecked readOnly />
      </Field>
    </div>
  ),
}

/**
 * **aria-invalid** switches the Checkbox to the error color scheme.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
}

/**
 * A **Field** also adds a helper and an error text, and marks the Checkbox as required.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="You must accept the terms to continue"
      helperText="Read them before accepting"
      label="I accept the terms and conditions"
      orientation="inline"
      required
    >
      <Checkbox />
    </Field>
  ),
}

/**
 * Some examples of Checkbox with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and
 * `className` styles the `<input>`. A native checkbox takes its color from `accent-*`. The label comes from the
 * `Field`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Field label="Accept the terms" orientation="inline">
    <Checkbox className="h-4 w-4 rounded accent-blue-600" variant="unstyled" />
  </Field>
  <Field label="Subscribe to the newsletter" orientation="inline">
    <Checkbox className="h-5 w-5 accent-emerald-600" defaultChecked variant="unstyled" />
  </Field>
  <Field label="Disabled" orientation="inline">
    <Checkbox className="h-4 w-4 accent-blue-600" disabled variant="unstyled" />
  </Field>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Field label="Accept the terms" orientation="inline">
        <Checkbox className="h-4 w-4 rounded accent-blue-600" variant="unstyled" />
      </Field>
      <Field label="Subscribe to the newsletter" orientation="inline">
        <Checkbox className="h-5 w-5 accent-emerald-600" defaultChecked variant="unstyled" />
      </Field>
      <Field label="Disabled" orientation="inline">
        <Checkbox className="h-4 w-4 accent-blue-600" disabled variant="unstyled" />
      </Field>
    </div>
  ),
}

/**
 * Some examples of Checkbox with Bootstrap classes. `className` goes to the `<input>`, so it takes
 * `form-check-input`. The label comes from the `Field`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-2">
  <Field label="Accept the terms" orientation="inline">
    <Checkbox className="form-check-input" variant="unstyled" />
  </Field>
  <Field label="Subscribe to the newsletter" orientation="inline">
    <Checkbox className="form-check-input" defaultChecked variant="unstyled" />
  </Field>
  <Field label="Disabled" orientation="inline">
    <Checkbox className="form-check-input" disabled variant="unstyled" />
  </Field>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-2">
      <Field label="Accept the terms" orientation="inline">
        <Checkbox className="form-check-input" variant="unstyled" />
      </Field>
      <Field label="Subscribe to the newsletter" orientation="inline">
        <Checkbox className="form-check-input" defaultChecked variant="unstyled" />
      </Field>
      <Field label="Disabled" orientation="inline">
        <Checkbox className="form-check-input" disabled variant="unstyled" />
      </Field>
    </div>
  ),
}
