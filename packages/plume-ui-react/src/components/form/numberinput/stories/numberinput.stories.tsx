import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { NumberInput, NumberInputDecrement, NumberInputField, NumberInputIncrement } from '..'

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
 *
 * On its own it renders the field between a decrease and an increase button. To change what it shows or the order,
 * give it its parts as children: `NumberInputField` is the `<input>`, and `NumberInputDecrement` and
 * `NumberInputIncrement` are the buttons. The `NumberInput` keeps the number and shares it with its parts, so a
 * part can go anywhere inside it, and be left out. With children the `steppers` prop has no effect, since you
 * choose the buttons yourself.
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
    className: { control: 'text' },
    style: { control: false },
    value: { control: false },
    defaultValue: { control: 'number' },
    onValueChange: { control: false },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    largeStep: { control: 'number' },
    precision: { control: 'number' },
    format: { control: false },
    parse: { control: false },
    steppers: { control: 'boolean' },
    labels: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    variant: { control: 'radio', options: ['outline', 'filled', 'underline', 'unstyled'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    name: { control: 'text' },
    required: { control: 'boolean' },
    id: { control: false },
    title: { control: 'text' },
    onBlur: { control: false },
    onFocus: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
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
        defaultValue={1}
        variant="unstyled"
      >
        <NumberInputDecrement className="w-8" />
        <NumberInputField />
        <NumberInputIncrement className="w-8" />
      </NumberInput>
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
 * Give the NumberInput its parts to put the buttons where you want, on the same side or only one of them. The field
 * and the buttons keep working together, whatever the order.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<NumberInput aria-label="Quantity" defaultValue={2} max={10} min={0}>
  <NumberInputField />
  <NumberInputDecrement />
  <NumberInputIncrement />
</NumberInput>

<NumberInput aria-label="Guests" defaultValue={1} min={1}>
  <NumberInputField />
  <NumberInputIncrement label="Add a guest">Add</NumberInputIncrement>
</NumberInput>`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: '14rem' }}>
      <NumberInput aria-label="Quantity" defaultValue={2} max={10} min={0}>
        <NumberInputField />
        <NumberInputDecrement />
        <NumberInputIncrement />
      </NumberInput>
      <NumberInput aria-label="Guests" defaultValue={1} min={1}>
        <NumberInputField />
        <NumberInputIncrement
          label="Add a guest"
          style={{ aspectRatio: 'auto', padding: '0 0.75rem' }}
        >
          Add
        </NumberInputIncrement>
      </NumberInput>
    </div>
  ),
}

/**
 * Some examples of NumberInput with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * row of the buttons and the input stays. `className` styles the control and each part takes its own `className`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<NumberInput
  aria-label="Quantity"
  className="w-40 overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
  defaultValue={2}
  max={10}
  min={0}
  variant="unstyled"
>
  <NumberInputDecrement className="w-9 text-muted hover:bg-surface-muted disabled:opacity-40" />
  <NumberInputField className="w-full bg-transparent py-2 text-center outline-none" />
  <NumberInputIncrement className="w-9 text-muted hover:bg-surface-muted disabled:opacity-40" />
</NumberInput>`,
      },
    },
  },
  render: () => (
    <NumberInput
      aria-label="Quantity"
      className="w-40 overflow-hidden rounded-lg border border-border bg-surface text-sm text-foreground focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-200"
      defaultValue={2}
      max={10}
      min={0}
      variant="unstyled"
    >
      <NumberInputDecrement className="w-9 text-[var(--plume-muted)] hover:bg-surface-muted disabled:opacity-40" />
      <NumberInputField className="w-full bg-transparent py-2 text-center outline-none" />
      <NumberInputIncrement className="w-9 text-[var(--plume-muted)] hover:bg-surface-muted disabled:opacity-40" />
    </NumberInput>
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
  defaultValue={2}
  max={10}
  min={0}
  style={{ width: "10rem" }}
  variant="unstyled"
>
  <NumberInputDecrement className="btn btn-outline-secondary" />
  <NumberInputField className="form-control text-center" />
  <NumberInputIncrement className="btn btn-outline-secondary" />
</NumberInput>`,
      },
    },
  },
  render: () => (
    <NumberInput
      aria-label="Quantity"
      className="input-group"
      defaultValue={2}
      max={10}
      min={0}
      style={{ width: '10rem' }}
      variant="unstyled"
    >
      <NumberInputDecrement className="btn btn-outline-secondary" />
      <NumberInputField className="form-control text-center" />
      <NumberInputIncrement className="btn btn-outline-secondary" />
    </NumberInput>
  ),
}
