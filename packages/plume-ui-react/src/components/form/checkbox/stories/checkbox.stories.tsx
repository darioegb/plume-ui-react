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
    className: { control: 'text' },
    style: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['solid', 'outline', 'unstyled'] },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    id: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
    onChange: { control: false },
    onBlur: { control: false },
    onFocus: { control: false },
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
 * Use the **variant** prop to pick how a checked box looks: `solid` fills it with the color, `outline` only
 * colors the border and the mark, and `unstyled` leaves the native checkbox so you can style it yourself.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Field label="solid" orientation="inline">
  <Checkbox defaultChecked variant="solid" />
</Field>
<Field label="outline" orientation="inline">
  <Checkbox defaultChecked variant="outline" />
</Field>
<Field label="unstyled" orientation="inline">
  <Checkbox defaultChecked variant="unstyled" />
</Field>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<Field label="sm" orientation="inline">
  <Checkbox defaultChecked size="sm" />
</Field>
<Field label="md" orientation="inline">
  <Checkbox defaultChecked size="md" />
</Field>
<Field label="lg" orientation="inline">
  <Checkbox defaultChecked size="lg" />
</Field>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<Field label="primary" orientation="inline">
  <Checkbox colorScheme="primary" defaultChecked />
</Field>
<Field label="success" orientation="inline">
  <Checkbox colorScheme="success" defaultChecked />
</Field>
<Field label="purple" orientation="inline">
  <Checkbox colorScheme="purple" defaultChecked />
</Field>`,
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
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
}`,
      },
    },
  },
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
    <Checkbox className="h-4 w-4 rounded-sm accent-blue-600" variant="unstyled" />
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
        <Checkbox className="h-4 w-4 rounded-sm accent-blue-600" variant="unstyled" />
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
