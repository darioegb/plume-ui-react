import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Radio, RadioGroup, type RadioProps } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A radio to pick one option out of a few. It renders a native `<input type="radio">`, so it works with forms,
 * labels and the keyboard out of the box, and the `ref` points to the input. It has no text of its own: put it in a
 * `Field` with `orientation="inline"` to give it a label, and clicking that label selects the Radio.
 * Radios that share a **name** form a group, and the arrow keys move the selection between them.
 *
 * ### RadioGroup
 *
 * Wrap the radios in a `RadioGroup` to manage the group in one place. It owns the value, so you set it once with
 * **value** or **defaultValue** and listen to **onValueChange**, and it shares the name, size, color scheme, variant
 * and state with its radios. Inside a `Field`, the group is named by the Field's label.
 */
export default {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: ['Radio', 'RadioGroup'],
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
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'radio',
      options: ['solid', 'outline', 'unstyled'],
    },
    checked: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    name: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    id: {
      control: false,
    },
    'aria-label': {
      control: 'text',
    },
    'aria-labelledby': {
      control: false,
    },
    'aria-describedby': {
      control: false,
    },
    'aria-invalid': {
      control: 'boolean',
    },
    onChange: {
      control: false,
    },
    onBlur: {
      control: false,
    },
    onFocus: {
      control: false,
    },
  },
  args: {
    name: 'plan',
    value: 'free',
  },
  render: (args) => (
    <Field label="Free plan" orientation="inline">
      <Radio {...args} />
    </Field>
  ),
} satisfies Meta<typeof Radio>

type Story = StoryObj<typeof Radio>

function Option({ label, ...props }: Readonly<RadioProps & { label: string }>): React.ReactNode {
  return (
    <Field label={label} orientation="inline">
      <Radio {...props} />
    </Field>
  )
}

/**
 * This is the default Radio. Its label comes from the **Field** around it.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how a selected radio looks: `solid` fills it with the color, `outline` only
 * colors the border and the dot, and `unstyled` leaves the native radio so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Option defaultChecked label="Solid" name="variant-solid" variant="solid" />
      <Option defaultChecked label="Outline" name="variant-outline" variant="outline" />
      <Option defaultChecked label="Unstyled" name="variant-unstyled" variant="unstyled" />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center items-center gap-6">
  <Field label="Solid" orientation="inline">
    <Radio defaultChecked name="variant-solid" variant="solid" />
  </Field>
  <Field label="Outline" orientation="inline">
    <Radio defaultChecked name="variant-outline" variant="outline" />
  </Field>
  <Field label="Unstyled" orientation="inline">
    <Radio defaultChecked name="variant-unstyled" variant="unstyled" />
  </Field>
</div>`,
      },
    },
  },
}

/**
 * Use the **size** prop to change the size of the circle.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      <Option defaultChecked label="Small" size="sm" />
      <Option defaultChecked label="Medium" size="md" />
      <Option defaultChecked label="Large" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center items-center gap-6">
  <Field label="Small" orientation="inline">
    <Radio defaultChecked size="sm" />
  </Field>
  <Field label="Medium" orientation="inline">
    <Radio defaultChecked size="md" />
  </Field>
  <Field label="Large" orientation="inline">
    <Radio defaultChecked size="lg" />
  </Field>
</div>`,
      },
    },
  },
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center items-center gap-6">
      {colorSchemes.map((scheme) => (
        <Option
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultChecked
          key={scheme}
          label={scheme}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-wrap justify-center items-center gap-6">
  <Field label="primary" orientation="inline">
    <Radio colorScheme="primary" defaultChecked />
  </Field>
  <Field label="success" orientation="inline">
    <Radio colorScheme="success" defaultChecked />
  </Field>
  <Field label="purple" orientation="inline">
    <Radio colorScheme="purple" defaultChecked />
  </Field>
</div>`,
      },
    },
  },
}

/**
 * A **disabled** Radio can't be changed or focused. A **readOnly** one can be focused but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Option disabled label="Disabled" name="disabled-demo" />
      <Option defaultChecked disabled label="Disabled and selected" name="disabled-demo" />
      <Option defaultChecked label="Read only and selected" name="readonly-demo" readOnly />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-2">
  <Field label="Disabled" orientation="inline">
    <Radio disabled name="disabled-demo" />
  </Field>
  <Field label="Disabled and selected" orientation="inline">
    <Radio defaultChecked disabled name="disabled-demo" />
  </Field>
  <Field label="Read only and selected" orientation="inline">
    <Radio defaultChecked name="readonly-demo" readOnly />
  </Field>
</div>`,
      },
    },
  },
}

/**
 * **aria-invalid** switches the Radio to the error color scheme.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
  },
}

/**
 * The **Field** adds the label, a helper and an error text, and wires the accessibility attributes. With
 * `orientation="inline"` the label sits beside the Radio and the texts go under it.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="Pick a plan to continue"
      helperText="You can change it later"
      label="Free plan"
      orientation="inline"
      required
    >
      <Radio name="plan-field" value="free" />
    </Field>
  ),
}

/**
 * This is the default RadioGroup. Use **defaultValue** to select a radio at first and **orientation** to lay the
 * radios out in a row.
 */
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup aria-label="Plan" defaultValue="pro">
        <Option label="Free" value="free" />
        <Option label="Pro" value="pro" />
        <Option label="Team" value="team" />
      </RadioGroup>
      <RadioGroup aria-label="Billing" defaultValue="monthly" orientation="horizontal">
        <Option label="Monthly" value="monthly" />
        <Option label="Yearly" value="yearly" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <RadioGroup aria-label="Plan" defaultValue="pro">
    <Field label="Free" orientation="inline">
      <Radio value="free" />
    </Field>
    <Field label="Pro" orientation="inline">
      <Radio value="pro" />
    </Field>
    <Field label="Team" orientation="inline">
      <Radio value="team" />
    </Field>
  </RadioGroup>
  <RadioGroup aria-label="Billing" defaultValue="monthly" orientation="horizontal">
    <Field label="Monthly" orientation="inline">
      <Radio value="monthly" />
    </Field>
    <Field label="Yearly" orientation="inline">
      <Radio value="yearly" />
    </Field>
  </RadioGroup>
</div>`,
      },
    },
  },
}

function ControlledPlan(): React.ReactNode {
  const [plan, setPlan] = useState('pro')
  return (
    <div className="flex flex-col gap-3">
      <RadioGroup aria-label="Plan" onValueChange={setPlan} value={plan}>
        <Option label="Free" value="free" />
        <Option label="Pro" value="pro" />
        <Option label="Team" value="team" />
      </RadioGroup>
      <p>Selected plan: {plan}</p>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the selection. **onValueChange** receives the new value.
 */
export const GroupControlled: Story = {
  render: () => <ControlledPlan />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [plan, setPlan] = useState('pro')
  return (
    <div className="flex flex-col gap-3">
      <RadioGroup aria-label="Plan" onValueChange={setPlan} value={plan}>
        <Field label="Free" orientation="inline">
          <Radio value="free" />
        </Field>
        <Field label="Pro" orientation="inline">
          <Radio value="pro" />
        </Field>
        <Field label="Team" orientation="inline">
          <Radio value="team" />
        </Field>
      </RadioGroup>
      <p>Selected plan: {plan}</p>
    </div>
  )
}`,
      },
    },
  },
}

/**
 * **size**, **colorScheme** and **variant** apply to every radio, and a radio can set its own.
 */
export const GroupSizesAndColors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup
        aria-label="Large"
        colorScheme="success"
        defaultValue="a"
        orientation="horizontal"
        size="lg"
      >
        <Option label="Large" value="a" />
        <Option label="Success" value="b" />
      </RadioGroup>
      <RadioGroup
        aria-label="Small"
        colorScheme="purple"
        defaultValue="a"
        orientation="horizontal"
        size="sm"
        variant="outline"
      >
        <Option label="Small" value="a" />
        <Option colorScheme="warning" label="Its own size and color" size="md" value="b" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <RadioGroup
    aria-label="Large"
    colorScheme="success"
    defaultValue="a"
    orientation="horizontal"
    size="lg"
  >
    <Field label="Large" orientation="inline">
      <Radio value="a" />
    </Field>
    <Field label="Success" orientation="inline">
      <Radio value="b" />
    </Field>
  </RadioGroup>
  <RadioGroup
    aria-label="Small"
    colorScheme="purple"
    defaultValue="a"
    orientation="horizontal"
    size="sm"
    variant="outline"
  >
    <Field label="Small" orientation="inline">
      <Radio value="a" />
    </Field>
    <Field label="Its own size and color" orientation="inline">
      <Radio colorScheme="warning" size="md" value="b" />
    </Field>
  </RadioGroup>
</div>`,
      },
    },
  },
}

/**
 * **disabled** on the group disables every radio, and a single radio can be disabled on its own.
 * **readOnly** keeps the selection but doesn't let the user change it.
 */
export const GroupDisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup aria-label="Disabled group" defaultValue="free" disabled>
        <Option label="Free" value="free" />
        <Option label="Pro" value="pro" />
      </RadioGroup>
      <RadioGroup aria-label="One disabled option" defaultValue="free">
        <Option label="Free" value="free" />
        <Option disabled label="Pro (unavailable)" value="pro" />
      </RadioGroup>
      <RadioGroup aria-label="Read only group" defaultValue="pro" readOnly>
        <Option label="Free" value="free" />
        <Option label="Pro" value="pro" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div className="flex flex-col gap-6">
  <RadioGroup aria-label="Disabled group" defaultValue="free" disabled>
    <Field label="Free" orientation="inline">
      <Radio value="free" />
    </Field>
    <Field label="Pro" orientation="inline">
      <Radio value="pro" />
    </Field>
  </RadioGroup>
  <RadioGroup aria-label="One disabled option" defaultValue="free">
    <Field label="Free" orientation="inline">
      <Radio value="free" />
    </Field>
    <Field label="Pro (unavailable)" orientation="inline">
      <Radio disabled value="pro" />
    </Field>
  </RadioGroup>
  <RadioGroup aria-label="Read only group" defaultValue="pro" readOnly>
    <Field label="Free" orientation="inline">
      <Radio value="free" />
    </Field>
    <Field label="Pro" orientation="inline">
      <Radio value="pro" />
    </Field>
  </RadioGroup>
</div>`,
      },
    },
  },
}

/**
 * **aria-invalid** marks the group as invalid and shows its radios with the error color scheme.
 */
export const GroupInvalid: Story = {
  render: () => (
    <RadioGroup aria-invalid aria-label="Plan">
      <Option label="Free" value="free" />
      <Option label="Pro" value="pro" />
      <Option label="Team" value="team" />
    </RadioGroup>
  ),
  parameters: {
    docs: {
      source: {
        code: `<RadioGroup aria-invalid aria-label="Plan">
  <Field label="Free" orientation="inline">
    <Radio value="free" />
  </Field>
  <Field label="Pro" orientation="inline">
    <Radio value="pro" />
  </Field>
  <Field label="Team" orientation="inline">
    <Radio value="team" />
  </Field>
</RadioGroup>`,
      },
    },
  },
}

/**
 * Wrap the group in a **Field** to add a label, a helper and an error text. The group is named by the Field's
 * label and described by its texts, and it gets the required and disabled state from the Field. Each option has
 * its own inline Field for its label.
 */
export const GroupWithField: Story = {
  render: () => (
    <Field
      errorText="Pick a plan to continue"
      helperText="You can change it later"
      label="Plan"
      required
    >
      <RadioGroup>
        <Option label="Free" value="free" />
        <Option label="Pro" value="pro" />
        <Option label="Team" value="team" />
      </RadioGroup>
    </Field>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Field
  errorText="Pick a plan to continue"
  helperText="You can change it later"
  label="Plan"
  required
>
  <RadioGroup>
    <Field label="Free" orientation="inline">
      <Radio value="free" />
    </Field>
    <Field label="Pro" orientation="inline">
      <Radio value="pro" />
    </Field>
    <Field label="Team" orientation="inline">
      <Radio value="team" />
    </Field>
  </RadioGroup>
</Field>`,
      },
    },
  },
}

/**
 * Some examples of Radio with Tailwind classes. Give `variant="unstyled"` to the `RadioGroup` and its radios follow. `className` styles the input, and a native `label` with `htmlFor` gives it a name.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RadioGroup aria-label="Plan" className="flex flex-col gap-2" defaultValue="team" variant="unstyled">
  <div className="inline-flex items-center gap-2 text-sm">
    <Radio className="h-4 w-4 accent-blue-600" id="tw-solo" value="solo" />
    <label htmlFor="tw-solo">Solo</label>
  </div>
  <div className="inline-flex items-center gap-2 text-sm">
    <Radio className="h-4 w-4 accent-blue-600" id="tw-team" value="team" />
    <label className="font-semibold" htmlFor="tw-team">Team</label>
  </div>
  <div className="inline-flex items-center gap-2 text-sm">
    <Radio className="h-4 w-4 accent-blue-600" id="tw-company" value="company" />
    <label htmlFor="tw-company">Company</label>
  </div>
</RadioGroup>`,
      },
    },
  },
  render: () => (
    <RadioGroup
      aria-label="Plan"
      className="flex flex-col gap-2"
      defaultValue="team"
      variant="unstyled"
    >
      <div className="inline-flex items-center gap-2 text-sm">
        <Radio className="h-4 w-4 accent-blue-600" id="tw-solo" value="solo" />
        <label htmlFor="tw-solo">Solo</label>
      </div>
      <div className="inline-flex items-center gap-2 text-sm">
        <Radio className="h-4 w-4 accent-blue-600" id="tw-team" value="team" />
        <label className="font-semibold" htmlFor="tw-team">
          Team
        </label>
      </div>
      <div className="inline-flex items-center gap-2 text-sm">
        <Radio className="h-4 w-4 accent-blue-600" id="tw-company" value="company" />
        <label htmlFor="tw-company">Company</label>
      </div>
    </RadioGroup>
  ),
}

/**
 * Some examples of Radio with Bootstrap classes: `form-check` on the wrapper, `form-check-input` on the Radio and `form-check-label` on its label.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<RadioGroup aria-label="Plan" defaultValue="team" variant="unstyled">
  <div className="form-check">
    <Radio className="form-check-input" id="plan-solo" value="solo" />
    <label className="form-check-label" htmlFor="plan-solo">Solo</label>
  </div>
  <div className="form-check">
    <Radio className="form-check-input" id="plan-team" value="team" />
    <label className="form-check-label" htmlFor="plan-team">Team</label>
  </div>
  <div className="form-check">
    <Radio className="form-check-input" id="plan-company" value="company" />
    <label className="form-check-label" htmlFor="plan-company">Company</label>
  </div>
</RadioGroup>`,
      },
    },
  },
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="team" variant="unstyled">
      <div className="form-check">
        <Radio className="form-check-input" id="plan-solo" value="solo" />
        <label className="form-check-label" htmlFor="plan-solo">
          Solo
        </label>
      </div>
      <div className="form-check">
        <Radio className="form-check-input" id="plan-team" value="team" />
        <label className="form-check-label" htmlFor="plan-team">
          Team
        </label>
      </div>
      <div className="form-check">
        <Radio className="form-check-input" id="plan-company" value="company" />
        <label className="form-check-label" htmlFor="plan-company">
          Company
        </label>
      </div>
    </RadioGroup>
  ),
}
