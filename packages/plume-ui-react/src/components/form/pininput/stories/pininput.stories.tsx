import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { PinInput, PinInputCell, PinInputHidden } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A row of one-character boxes for a code the user types or pastes: a one-time password, a verification code, a
 * PIN. Use it when the length is fixed and short.
 *
 * Typing a character moves to the next box, <kbd>Backspace</kbd> removes it and goes back, and <kbd>←</kbd>,
 * <kbd>→</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> move between the boxes. Pasting a code fills the boxes from the
 * one that has the focus, and the whole code that arrives in one box (the autofill of a one-time code on a phone)
 * is spread over them. Only the characters of the `type` are accepted: digits, letters and digits, or anything
 * but spaces.
 *
 * It is a `<fieldset>` with one input for each character. Every box has its own name (`Digit 1 of 6`), the group
 * takes the name you give it, and there is a single tab stop, on the next box to fill, so a screen reader or a
 * keyboard user does not walk through six empty boxes. `onComplete` runs when the last box is filled. With a
 * `name` the code is submitted in a hidden input. It composes with `Field`, which names the group and gives the
 * focus to the first box when its label is clicked.
 *
 * On its own it renders the boxes for you. To change what it shows (a separator in the middle of the code, a
 * different class on each box) give it its parts as children: `PinInputCell` is one box and `PinInputHidden` the
 * hidden input of a `name`. The `PinInput` keeps the code and the focus and shares them with its parts, so the
 * boxes can be in any order and wrapped in other elements. The look (`variant`, `size`, `shape`), the type, the
 * mask and the labels always go on the `PinInput`.
 */
export default {
  title: 'Components/PinInput',
  component: PinInput,
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
    children: { control: false },
    style: { control: false },
    length: { control: { type: 'number', min: 1, max: 10 } },
    type: { control: 'radio', options: ['numeric', 'alphanumeric', 'text'] },
    mask: { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: false },
    defaultValue: { control: 'text' },
    onValueChange: { control: false },
    onComplete: { control: false },
    labels: { control: false },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'radio', options: ['rounded', 'pill'] },
    variant: { control: 'radio', options: ['outline', 'filled', 'underline', 'unstyled'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    focusOnMount: { control: 'boolean' },
    autoComplete: { control: 'text' },
    name: { control: 'text' },
    required: { control: 'boolean' },
    id: { control: false },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
  },
  args: {
    'aria-label': 'Verification code',
  },
} satisfies Meta<typeof PinInput>

type Story = StoryObj<typeof PinInput>

/**
 * This is the default PinInput: six digits. Type, or paste a code.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the boxes look, the same ones as the `Input`. `unstyled` drops the Plume
 * styles so you can style them yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Outline" length={4} variant="outline" />
      <PinInput aria-label="Filled" length={4} variant="filled" />
      <PinInput aria-label="Underline" length={4} variant="underline" />
      <PinInput aria-label="Unstyled" className="flex gap-2" length={4} variant="unstyled">
        {[0, 1, 2, 3].map((index) => (
          <PinInputCell
            className="h-10 w-10 rounded border border-gray-400 text-center"
            index={index}
            key={index}
          />
        ))}
      </PinInput>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size of the boxes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <PinInput aria-label={size} key={size} length={4} size={size} />
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick the color of the focus ring from the theme.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.slice(0, 5).map((scheme) => (
        <PinInput
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          length={4}
        />
      ))}
    </div>
  ),
}

/**
 * Use the **shape** prop for rounded or pill boxes.
 */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Rounded" length={4} shape="rounded" />
      <PinInput aria-label="Pill" length={4} shape="pill" />
    </div>
  ),
}

/**
 * **length** is the number of boxes, and **type** what they accept: `numeric` (the default), `alphanumeric` or
 * `text`. A character that doesn't fit is not typed, and a pasted code drops what doesn't fit.
 */
export const LengthAndType: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Four digits" length={4} />
      <PinInput aria-label="Licence code" length={5} type="alphanumeric" />
    </div>
  ),
}

/**
 * **mask** hides what is typed, for a PIN. Pair it with `autoComplete="off"` so the browser doesn't offer to save
 * it, and with a **placeholder** if you want to show the empty boxes.
 */
export const Masked: Story = {
  args: { 'aria-label': 'PIN', autoComplete: 'off', length: 4, mask: true, placeholder: '○' },
}

function OtpExample(): React.ReactNode {
  const [value, setValue] = useState('')
  const [done, setDone] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <PinInput
        aria-label="One-time code"
        focusOnMount
        onComplete={setDone}
        onValueChange={(next) => {
          setValue(next)
          setDone(null)
        }}
        value={value}
      />
      <p className="text-sm">
        {done ? `Code entered: ${done}` : `Typed: ${value || 'nothing yet'}`}
      </p>
      <button
        className="rounded border border-gray-400 px-2 py-1 text-sm"
        onClick={() => setValue('')}
        type="button"
      >
        Clear
      </button>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the code, and **onComplete** to react when the last box is
 * filled, for example to verify it. The component has `focusOnMount` here, so the first box is ready to type.
 */
export const Controlled: Story = {
  render: () => <OtpExample />,
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [value, setValue] = useState('')
  const [done, setDone] = useState<string | null>(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <PinInput
        aria-label="One-time code"
        focusOnMount
        onComplete={setDone}
        onValueChange={(next) => {
          setValue(next)
          setDone(null)
        }}
        value={value}
      />
      <p className="text-sm">
        {done ? \`Code entered: \${done}\` : \`Typed: \${value || 'nothing yet'}\`}
      </p>
      <button onClick={() => setValue('')} type="button">
        Clear
      </button>
    </div>
  )
}`,
      },
    },
  },
}

/**
 * A pin can be disabled, read only or invalid. A read only code stays readable and focusable, but it can't be
 * typed, pasted or deleted.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PinInput aria-label="Disabled" defaultValue="123456" disabled />
      <PinInput aria-label="Read only" defaultValue="123456" readOnly />
      <PinInput aria-invalid aria-label="Invalid" defaultValue="123456" />
    </div>
  ),
}

/**
 * With a **name** the code takes part in a form: it is submitted in a hidden input, as one string.
 */
export const InAForm: Story = {
  render: () => (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const code = new FormData(event.currentTarget).get('code')
        window.alert(`code = "${typeof code === 'string' ? code : ''}"`)
      }}
    >
      <PinInput aria-label="Verification code" length={4} name="code" />
      <button className="rounded border border-gray-400 px-3 py-1 text-sm" type="submit">
        Verify
      </button>
    </form>
  ),
}

/**
 * Wrap the PinInput in a `Field` to give it a label, a helper text and an error message. The Field names the
 * group, links its texts and sets `disabled`, `readOnly`, `required` and `aria-invalid`; clicking the label gives
 * the focus to the first box.
 */
export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field helperText="We sent it by SMS." label="Verification code">
        <PinInput length={4} />
      </Field>
      <Field errorText="That code is not right." invalid label="Verification code" required>
        <PinInput defaultValue="1234" length={4} />
      </Field>
    </div>
  ),
}

/**
 * Give the `PinInput` its parts to compose the boxes yourself: here a dash splits a code of six in two groups of
 * three. Every `PinInputCell` takes its position with **index**, and they can be wrapped in other elements. Add a
 * `PinInputHidden` when the code has to be submitted with a **name**.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput aria-label="Code" length={6} name="code">
  <PinInputCell index={0} />
  <PinInputCell index={1} />
  <PinInputCell index={2} />
  <span aria-hidden="true">-</span>
  <PinInputCell index={3} />
  <PinInputCell index={4} />
  <PinInputCell index={5} />
  <PinInputHidden />
</PinInput>`,
      },
    },
  },
  render: () => (
    <PinInput aria-label="Code" className="items-center" length={6} name="code">
      <PinInputCell index={0} />
      <PinInputCell index={1} />
      <PinInputCell index={2} />
      <span aria-hidden="true">-</span>
      <PinInputCell index={3} />
      <PinInputCell index={4} />
      <PinInputCell index={5} />
      <PinInputHidden />
    </PinInput>
  ),
}

/**
 * Some examples of PinInput with Tailwind classes. With `variant="unstyled"` the boxes have none of the Plume
 * classes: `className` styles the group, the `className` of each `PinInputCell` its box, and a filled one has
 * `data-filled`, so `data-[filled]:` styles it.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput aria-label="Verification code" className="flex gap-2" length={6} variant="unstyled">
  {[0, 1, 2, 3, 4, 5].map((index) => (
    <PinInputCell
      className="h-12 w-10 rounded-lg border border-border bg-surface text-center text-lg text-foreground focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 data-[filled]:border-blue-500"
      index={index}
      key={index}
    />
  ))}
</PinInput>`,
      },
    },
  },
  render: () => (
    <PinInput aria-label="Verification code" className="flex gap-2" length={6} variant="unstyled">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <PinInputCell
          className="h-12 w-10 rounded-lg border border-border bg-surface text-center text-lg text-foreground focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 data-[filled]:border-blue-500"
          index={index}
          key={index}
        />
      ))}
    </PinInput>
  ),
}

/**
 * Some examples of PinInput with Bootstrap classes: `d-flex gap-2` for the group and `form-control text-center`
 * for the boxes. Bootstrap makes a `form-control` as wide as its container, so the group has a width and the six boxes share it.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<PinInput
  aria-label="Verification code"
  className="d-flex gap-2"
  length={6}
  style={{ maxWidth: '100%', width: '20rem' }}
  variant="unstyled"
>
  {[0, 1, 2, 3, 4, 5].map((index) => (
    <PinInputCell className="form-control form-control-lg text-center px-0" index={index} key={index} />
  ))}
</PinInput>`,
      },
    },
  },
  render: () => (
    <PinInput
      aria-label="Verification code"
      className="d-flex gap-2"
      length={6}
      style={{ maxWidth: '100%', width: '20rem' }}
      variant="unstyled"
    >
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <PinInputCell
          className="form-control form-control-lg text-center px-0"
          index={index}
          key={index}
        />
      ))}
    </PinInput>
  ),
}
