import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Radio } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A radio to pick one option out of a few. Radios that share a **name** form a group, and the arrow keys move
 * the selection between them. It renders a native `<input type="radio">`, so it works with forms, labels and
 * the keyboard out of the box. Children become its label, and the `ref` points to the input.
 */
export default {
  title: 'Components/Radio',
  component: Radio,
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
      description: 'Label of the Radio. Clicking it selects the Radio.',
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
        'Inline styles for the wrapping label. They are applied after the color variables, so they can override them (e.g. `--radio-solid`).',
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
      description: 'Size of the Radio.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description: 'Visual variant. `unstyled` leaves the native radio so you can bring your own styles.',
      options: ['solid', 'unstyled'],
      table: { type: { summary: `"solid" | "unstyled"` }, defaultValue: { summary: 'solid' } },
    },
    checked: {
      control: 'boolean',
      description: 'Selected state, for a controlled Radio. Pair it with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial selected state, for an uncontrolled Radio.',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the Radio.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Keeps the state without letting the user change it. It also silences `onChange`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the Radio as required.',
      table: { category: 'Form', type: { summary: 'boolean' } },
    },
    name: {
      control: 'text',
      description: 'Name that groups the radios. Only one radio of a group can be selected.',
      table: { category: 'Form', type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value submitted when the Radio is selected.',
      table: { category: 'Form', type: { summary: 'string' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`. A Field sets it so its label points to the Radio.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the Radio has no label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Radio.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description: 'Ids of the elements that describe the Radio. A Field sets it for its helper and error text.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the Radio as invalid, which also switches it to the error color scheme.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
    onChange: {
      control: false,
      description: 'Called when the user selects the Radio.',
      table: { category: 'Events', type: { summary: '(event: ChangeEvent<HTMLInputElement>) => void' } },
    },
    onBlur: {
      control: false,
      description: 'Called when the Radio loses focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
    },
    onFocus: {
      control: false,
      description: 'Called when the Radio receives focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
    },
  },
  args: {
    children: 'Free plan',
  },
} satisfies Meta<typeof Radio>

type Story = StoryObj<typeof Radio>

/**
 * This is the default Radio. Its **children** are the label.
 */
export const Default: Story = {}

/**
 * Use the **size** prop to change the size of the box and of the label.
 */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-6'>
      <Radio defaultChecked size='sm'>Small</Radio>
      <Radio defaultChecked size='md'>Medium</Radio>
      <Radio defaultChecked size='lg'>Large</Radio>
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className='flex flex-wrap justify-center items-center gap-6'>
      {colorSchemes.map((scheme) => (
        <Radio colorScheme={scheme as keyof typeof defaultTheme.colors} defaultChecked key={scheme}>
          {scheme}
        </Radio>
      ))}
    </div>
  ),
}

/**
 * Radios with the same **name** are a group. Control it by comparing a value with each Radio's **checked**.
 */
function PlanGroup(): React.ReactNode {
  const plans = ['Free', 'Pro', 'Team']
  const [plan, setPlan] = useState('Pro')
  return (
    <div aria-label='Plan' className='flex flex-col gap-2' role='radiogroup'>
      {plans.map((option) => (
        <Radio checked={plan === option} key={option} name='plan' onChange={() => setPlan(option)} value={option}>
          {option}
        </Radio>
      ))}
    </div>
  )
}

export const Group: Story = {
  render: () => <PlanGroup />,
}

/**
 * A **disabled** Radio can't be changed or focused. A **readOnly** one can be focused but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Radio disabled name='disabled-demo'>Disabled</Radio>
      <Radio defaultChecked disabled name='disabled-demo'>Disabled and selected</Radio>
      <Radio defaultChecked name='readonly-demo' readOnly>Read only and selected</Radio>
    </div>
  ),
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
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes.
 */
export const WithField: Story = {
  render: () => (
    <Field errorText='Pick a plan to continue' helperText='You can change it later' label='Plan' required>
      <Radio name='plan-field' value='free'>Free plan</Radio>
    </Field>
  ),
}

/**
 * The **unstyled** variant leaves the native radio.
 */
export const Unstyled: Story = {
  args: {
    variant: 'unstyled',
  },
}
