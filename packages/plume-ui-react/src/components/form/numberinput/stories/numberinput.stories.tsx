import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { NumberInput } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const euros = (value: number): string =>
  new Intl.NumberFormat('en-US', { currency: 'EUR', style: 'currency' }).format(value)

const readEuros = (text: string): number | null => {
  const parsed = Number.parseFloat(text.replace(/[^\d.-]/g, ''))
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * A field for a number, with buttons to add or subtract and the keyboard shortcuts of a spin button. Use it
 * for quantities, ages, prices, anything where the user types or nudges a number.
 *
 * It is a text input with `role="spinbutton"`, not `type="number"`: the native one lets the mouse wheel change the
 * value by accident, accepts `e` and has a different decimal separator in every browser. The input is controlled
 * by the component, so the text can be a partial number while the user types (`-`, `1.`), and the value is
 * clamped to `min`/`max` and rounded to `precision` when the field loses focus or the user presses
 * <kbd>Enter</kbd>.
 *
 * <kbd>↑</kbd> and <kbd>↓</kbd> add or subtract `step`, <kbd>PageUp</kbd> and <kbd>PageDown</kbd> a `largeStep`
 * (ten steps by default), and <kbd>Home</kbd> and <kbd>End</kbd> go to `min` and `max`. The buttons are out of the
 * tab order, as the keyboard has its own shortcuts, and keep adding while they are held. The value is `null` when
 * the field is empty.
 *
 * The visible input shows the formatted number, so with a `name` the component submits the plain number in a hidden
 * input. It composes with `Field`.
 */
export default {
  title: 'Components/NumberInput',
  component: NumberInput,
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
      description:
        'Custom CSS class for the control, the box that holds the input and the buttons. `style` goes there too.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts, in every variant: `input`, `decrement` and `increment`. With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: `Partial<Record<NumberInputPart, string>>` } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the control. They are applied after the color variables, so they can override them (e.g. `--numberinput-color`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    value: {
      control: false,
      description:
        'The number, or `null` when it is empty. Makes the NumberInput controlled: pass `onValueChange` to update it.',
      table: { type: { summary: 'number | null' } },
    },
    defaultValue: {
      control: 'number',
      description: 'The number the field starts with, when it is not controlled.',
      table: { type: { summary: 'number | null' } },
    },
    onValueChange: {
      control: false,
      description:
        'Called with the new number, or `null` when the field is empty. It is called while the user types, with what was typed; the clamped and rounded number comes when the field is committed.',
      table: { category: 'Events', type: { summary: '(value: number | null) => void' } },
    },
    min: {
      control: 'number',
      description:
        'The lowest number. A value under it is raised to it on blur, and the decrease button is disabled at it.',
      table: { type: { summary: 'number' } },
    },
    max: {
      control: 'number',
      description:
        'The highest number. A value over it is lowered to it on blur, and the increase button is disabled at it.',
      table: { type: { summary: 'number' } },
    },
    step: {
      control: 'number',
      description: 'How much the arrows and the buttons add or subtract.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    largeStep: {
      control: 'number',
      description:
        'How much <kbd>PageUp</kbd> and <kbd>PageDown</kbd> add or subtract. Ten steps by default.',
      table: { type: { summary: 'number' } },
    },
    precision: {
      control: 'number',
      description:
        'Decimals to keep. A typed number is rounded to them on blur and the text is padded with zeros. Without it a typed number keeps its decimals, and a step keeps those of the step. `0` allows only whole numbers and asks for the numeric keyboard.',
      table: { type: { summary: 'number' } },
    },
    format: {
      control: false,
      description:
        'How a number is shown when the field is not being edited: a currency, a unit, thousands separators. It is exposed to screen readers as `aria-valuetext`.',
      table: { type: { summary: '(value: number) => string' } },
    },
    parse: {
      control: false,
      description:
        'Turns the text of the field into a number, or `null`. The default accepts a dot or a comma as the decimal separator. Use it with `format` so what `format` shows can be read back.',
      table: { type: { summary: '(text: string) => number | null' } },
    },
    steppers: {
      control: 'boolean',
      description:
        'Shows the buttons to subtract and add. The keyboard keeps working without them.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    incrementLabel: {
      control: 'text',
      description: 'Accessible name of the increase button.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Increase' },
      },
    },
    decrementLabel: {
      control: 'text',
      description: 'Accessible name of the decrease button.',
      table: {
        category: 'Accessibility',
        type: { summary: 'string' },
        defaultValue: { summary: 'Decrease' },
      },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme for the focus ring, from the theme palette (custom schemes included).',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'secondary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the NumberInput.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Corners of the NumberInput.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'rounded' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant, the same as the `Input`. `unstyled` drops the Plume styles so you can bring your own; the row of the input and the buttons stays.',
      options: ['outline', 'filled', 'underline', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "underline" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and its buttons.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description:
        'The number can be read and focused but not changed, by typing or by the buttons.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Text shown while the field is empty.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: 'text',
      description:
        'Name of the field in a form. The plain number goes in a hidden input, an empty string when the field is empty, and the visible input has no name.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    id: {
      control: false,
      description: 'Id of the `<input>`. Use it to point a `<label>` to the field.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the input.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    onBlur: {
      control: false,
      description: 'Called when the input loses focus, after the number is committed.',
      table: { category: 'Events', type: { summary: 'FocusEventHandler<HTMLInputElement>' } },
    },
    onFocus: {
      control: false,
      description: 'Called when the input gets focus.',
      table: { category: 'Events', type: { summary: 'FocusEventHandler<HTMLInputElement>' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the field, when there is no label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the field.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description: 'Id of the element that describes the field.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the field as invalid.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
  },
  args: {
    'aria-label': 'Quantity',
    defaultValue: 1,
    style: { width: '12rem' },
  },
} satisfies Meta<typeof NumberInput>

type Story = StoryObj<typeof NumberInput>

/**
 * This is the default NumberInput.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the field looks, the same ones as the `Input`. `unstyled` drops the Plume
 * styles so you can style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      <NumberInput aria-label="Outline" defaultValue={1} variant="outline" />
      <NumberInput aria-label="Filled" defaultValue={1} variant="filled" />
      <NumberInput aria-label="Underline" defaultValue={1} variant="underline" />
      <NumberInput
        aria-label="Unstyled"
        className="rounded border border-gray-400"
        classNames={{ decrement: 'w-8', increment: 'w-8' }}
        defaultValue={1}
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <NumberInput aria-label={size} defaultValue={1} key={size} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick the color of the focus ring from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      {colorSchemes.slice(0, 5).map((scheme) => (
        <NumberInput
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          defaultValue={1}
          key={scheme}
        />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop for rounded or pill corners.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      <NumberInput aria-label="Rounded" defaultValue={1} shape="rounded" />
      <NumberInput aria-label="Pill" defaultValue={1} shape="pill" />
    </div>
  ),
}

/**
 * **min** and **max** limit the number: a value out of range is clamped when the field loses focus, and the
 * button at the limit is disabled. <kbd>Home</kbd> and <kbd>End</kbd> jump to the limits.
 */
export const Limits: Story = {
  args: { 'aria-label': 'Guests', defaultValue: 2, max: 10, min: 1 },
}

/**
 * **step** is what the arrows and the buttons add, and **largeStep** what <kbd>PageUp</kbd> and
 * <kbd>PageDown</kbd> add. A decimal step doesn't pile up rounding errors: `0.1 + 0.2` is `0.3`.
 */
export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      <NumberInput aria-label="Step of 5" defaultValue={0} largeStep={25} step={5} />
      <NumberInput aria-label="Step of 0.1" defaultValue={0} max={1} min={0} step={0.1} />
    </div>
  ),
}

/**
 * **precision** is the number of decimals: what the user types is rounded to it and padded with zeros when the
 * field loses focus. `precision={0}` allows only whole numbers, and asks the phone for the numeric keyboard.
 */
export const Precision: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      <NumberInput aria-label="Two decimals" defaultValue={9.5} precision={2} step={0.25} />
      <NumberInput aria-label="Whole numbers" defaultValue={3} precision={0} />
    </div>
  ),
}

/**
 * **format** decides how the number looks when the field is not being edited, and **parse** reads it back. Use
 * them for a currency, a unit or the separators of a locale. The formatted text is exposed to screen readers as
 * `aria-valuetext`; the value is still the plain number.
 */
export const FormatAndParse: Story = {
  args: {
    'aria-label': 'Price',
    defaultValue: 1234.5,
    format: euros,
    min: 0,
    parse: readEuros,
    step: 0.5,
    style: { width: '14rem' },
  },
}

function ControlledNumberInput(): React.ReactNode {
  const [value, setValue] = useState<number | null>(3)
  return (
    <div className="flex flex-col items-start gap-3" style={{ width: '12rem' }}>
      <NumberInput aria-label="Quantity" max={10} min={0} onValueChange={setValue} value={value} />
      <p className="text-sm">Value: {value === null ? 'empty' : value}</p>
      <div className="flex gap-2">
        <button
          className="rounded border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setValue(0)}
          type="button"
        >
          Reset
        </button>
        <button
          className="rounded border border-gray-400 px-2 py-1 text-sm"
          onClick={() => setValue(null)}
          type="button"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the NumberInput. The value is a number, or `null` when the field
 * is empty.
 */
export const Controlled: Story = {
  render: () => <ControlledNumberInput />,
}

/**
 * A field can be disabled, read only or invalid. A read only field keeps its number readable and focusable but
 * can't be changed, and its buttons are disabled.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '12rem' }}>
      <NumberInput aria-label="Disabled" defaultValue={4} disabled />
      <NumberInput aria-label="Read only" defaultValue={4} readOnly />
      <NumberInput aria-invalid aria-label="Invalid" defaultValue={400} max={10} />
    </div>
  ),
}

/**
 * With a **name** the NumberInput takes part in a form: the plain number is submitted in a hidden input, not the
 * formatted text, and an empty field submits an empty string.
 */
export const InAForm: Story = {
  render: () => (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const price = data.get('price')
        window.alert(`price = "${typeof price === 'string' ? price : ''}"`)
      }}
    >
      <NumberInput
        aria-label="Price"
        defaultValue={19.9}
        format={euros}
        name="price"
        parse={readEuros}
        style={{ width: '12rem' }}
      />
      <button className="rounded border border-gray-400 px-3 py-1 text-sm" type="submit">
        Send
      </button>
    </form>
  ),
}

/**
 * Wrap the NumberInput in a `Field` to give it a label, a helper text and an error message. The Field points its
 * label to the input and sets `disabled`, `readOnly`, `required` and `aria-invalid`.
 */
export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ width: '14rem' }}>
      <Field helperText="Between 1 and 10." label="Guests">
        <NumberInput defaultValue={2} max={10} min={1} />
      </Field>
      <Field errorText="Enter at least one guest." invalid label="Guests" required>
        <NumberInput max={10} min={1} />
      </Field>
    </div>
  ),
}

/**
 * Some examples of NumberInput with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * row of the buttons and the input stays. `className` styles the control and `classNames` the `input`, `decrement`
 * and `increment` parts.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<NumberInput
  aria-label="Quantity"
  className="w-40 overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
  classNames={{
    decrement: "w-9 text-muted hover:bg-surface-muted disabled:opacity-40",
    increment: "w-9 text-muted hover:bg-surface-muted disabled:opacity-40",
    input: "w-full bg-transparent py-2 text-center outline-none",
  }}
  defaultValue={2}
  max={10}
  min={0}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <NumberInput
      aria-label="Quantity"
      className="w-40 overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
      classNames={{
        decrement: 'w-9 text-[var(--plume-muted)] hover:bg-surface-muted disabled:opacity-40',
        increment: 'w-9 text-[var(--plume-muted)] hover:bg-surface-muted disabled:opacity-40',
        input: 'w-full bg-transparent py-2 text-center outline-none',
      }}
      defaultValue={2}
      max={10}
      min={0}
      variant="unstyled"
    />
  ),
}

/**
 * Some examples of NumberInput with Bootstrap classes: `input-group` for the row, `btn btn-outline-secondary` for
 * the buttons and `form-control text-center` for the input.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<NumberInput
  aria-label="Quantity"
  className="input-group"
  classNames={{
    decrement: "btn btn-outline-secondary",
    increment: "btn btn-outline-secondary",
    input: "form-control text-center",
  }}
  defaultValue={2}
  max={10}
  min={0}
  style={{ width: "10rem" }}
  variant="unstyled"
/>`,
      },
    },
  },
  render: () => (
    <NumberInput
      aria-label="Quantity"
      className="input-group"
      classNames={{
        decrement: 'btn btn-outline-secondary',
        increment: 'btn btn-outline-secondary',
        input: 'form-control text-center',
      }}
      defaultValue={2}
      max={10}
      min={0}
      style={{ width: '10rem' }}
      variant="unstyled"
    />
  ),
}
