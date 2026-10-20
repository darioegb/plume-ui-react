import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Checkbox } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A checkbox to pick any number of options, or to turn a single option on and off.
 * It renders a native `<input type="checkbox">`, so it works with forms, labels and the keyboard
 * out of the box. Children become its label, and the `ref` points to the input.
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
    children: {
      control: 'text',
      description: 'Label of the Checkbox. Clicking it toggles the Checkbox.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the label that wraps the input.',
      table: { type: { summary: 'string' } },
    },
    inputClassName: {
      control: 'text',
      description:
        'Custom CSS class for the `<input>`, in every variant. With `variant="unstyled"` it is the only class of the input, so it is how Tailwind or Bootstrap style the control itself.',
      table: { type: { summary: 'string' } },
    },
    labelClassName: {
      control: 'text',
      description: 'Custom CSS class for the text of the label, in every variant.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the wrapping label. They are applied after the color variables, so they can override them (e.g. `--checkbox-solid`).',
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
      description: 'Size of the Checkbox.',
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
      description: 'Accessible name when the Checkbox has no label.',
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
    children: 'Accept the terms',
  },
} satisfies Meta<typeof Checkbox>

type Story = StoryObj<typeof Checkbox>

/**
 * This is the default Checkbox. Its **children** are the label.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how a checked box looks: `solid` fills it with the color, `outline` only
 * colors the border and the mark, and `unstyled` leaves the native checkbox so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Checkbox defaultChecked variant="solid">
        Solid
      </Checkbox>
      <Checkbox defaultChecked variant="outline">
        Outline
      </Checkbox>
      <Checkbox defaultChecked variant="unstyled">
        Unstyled
      </Checkbox>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the box and of the label.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Checkbox defaultChecked size="sm">
        Small
      </Checkbox>
      <Checkbox defaultChecked size="md">
        Medium
      </Checkbox>
      <Checkbox defaultChecked size="lg">
        Large
      </Checkbox>
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
        <Checkbox
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultChecked
          key={scheme}
        >
          {scheme}
        </Checkbox>
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
      <Checkbox
        checked={all}
        indeterminate={!all && selected.length > 0}
        onChange={() => setSelected(all ? [] : options)}
      >
        All notifications
      </Checkbox>
      <div className="flex flex-col gap-2 ps-6">
        {options.map((option) => (
          <Checkbox
            checked={selected.includes(option)}
            key={option}
            onChange={() =>
              setSelected((current) =>
                current.includes(option)
                  ? current.filter((item) => item !== option)
                  : [...current, option],
              )
            }
          >
            {option}
          </Checkbox>
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
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox defaultChecked disabled>
        Disabled and checked
      </Checkbox>
      <Checkbox defaultChecked readOnly>
        Read only and checked
      </Checkbox>
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
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="You must accept the terms to continue"
      helperText="Read them before accepting"
      label="Terms"
      required
    >
      <Checkbox>I accept the terms and conditions</Checkbox>
    </Field>
  ),
}

/**
 * Some examples of Checkbox with Tailwind classes. With `variant="unstyled"` the Plume classes are gone: `className` styles the label that wraps the input, `inputClassName` the input and `labelClassName` the text. A native checkbox takes its color from `accent-*`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-3">
  <Checkbox
    className="inline-flex items-center gap-2 text-sm"
    inputClassName="h-4 w-4 rounded accent-blue-600"
    variant="unstyled"
  >
    Accept the terms
  </Checkbox>
  <Checkbox
    className="inline-flex items-center gap-2 text-sm"
    defaultChecked
    inputClassName="h-5 w-5 accent-emerald-600"
    labelClassName="font-semibold"
    variant="unstyled"
  >
    Subscribe to the newsletter
  </Checkbox>
  <Checkbox
    className="inline-flex cursor-not-allowed items-center gap-2 text-sm opacity-50"
    disabled
    inputClassName="h-4 w-4 accent-blue-600"
    variant="unstyled"
  >
    Disabled
  </Checkbox>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox
        className="inline-flex items-center gap-2 text-sm"
        inputClassName="h-4 w-4 rounded accent-blue-600"
        variant="unstyled"
      >
        Accept the terms
      </Checkbox>
      <Checkbox
        className="inline-flex items-center gap-2 text-sm"
        defaultChecked
        inputClassName="h-5 w-5 accent-emerald-600"
        labelClassName="font-semibold"
        variant="unstyled"
      >
        Subscribe to the newsletter
      </Checkbox>
      <Checkbox
        className="inline-flex cursor-not-allowed items-center gap-2 text-sm opacity-50"
        disabled
        inputClassName="h-4 w-4 accent-blue-600"
        variant="unstyled"
      >
        Disabled
      </Checkbox>
    </div>
  ),
}

/**
 * Some examples of Checkbox with Bootstrap classes. `className` goes to the label that wraps the input, so it takes `form-check`, while `inputClassName` takes `form-check-input` and `labelClassName` `form-check-label`.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-2">
  <Checkbox
    className="form-check"
    inputClassName="form-check-input"
    labelClassName="form-check-label"
    variant="unstyled"
  >
    Accept the terms
  </Checkbox>
  <Checkbox
    className="form-check"
    defaultChecked
    inputClassName="form-check-input"
    labelClassName="form-check-label"
    variant="unstyled"
  >
    Subscribe to the newsletter
  </Checkbox>
  <Checkbox
    className="form-check"
    disabled
    inputClassName="form-check-input"
    labelClassName="form-check-label"
    variant="unstyled"
  >
    Disabled
  </Checkbox>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-2">
      <Checkbox
        className="form-check"
        inputClassName="form-check-input"
        labelClassName="form-check-label"
        variant="unstyled"
      >
        Accept the terms
      </Checkbox>
      <Checkbox
        className="form-check"
        defaultChecked
        inputClassName="form-check-input"
        labelClassName="form-check-label"
        variant="unstyled"
      >
        Subscribe to the newsletter
      </Checkbox>
      <Checkbox
        className="form-check"
        disabled
        inputClassName="form-check-input"
        labelClassName="form-check-label"
        variant="unstyled"
      >
        Disabled
      </Checkbox>
    </div>
  ),
}
