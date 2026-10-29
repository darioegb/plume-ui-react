import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Textarea, TextareaCount, TextareaField, TextareaStatus } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A multi-line text field for longer answers such as comments or a bio.
 * It renders a native `<textarea>`, so it works with forms and the keyboard out of the box,
 * and the `ref` points to it.
 *
 * With **showCount** it adds a character counter under the field. To change what it shows or the order, give it its
 * parts as children: `TextareaField` is the `<textarea>`, `TextareaCount` the counter and `TextareaStatus` the
 * invisible message a screen reader gets near the limit. The `Textarea` keeps the look (`variant`, `size`, `shape`,
 * `colorScheme`, `resize`), the state and the texts, and shares them with its parts. The `ref` of the `Textarea` always
 * points to the `<textarea>` (it stays empty if there is no `TextareaField`), and `className` and `style` go to its
 * outermost element, the wrapper when it has parts. The props of the field (`value`, `defaultValue`, `maxLength`,
 * `placeholder`, `rows`...) may go on the `Textarea` or on `TextareaField`, and so can the `register` of react-hook-form.
 */
export default {
  title: 'Components/Textarea',
  component: Textarea,
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
    },
    style: {
      control: false,
    },
    colorScheme: {
      control: 'select',
      options: colorSchemes,
    },
    variant: {
      control: 'radio',
      options: ['outline', 'filled', 'underline', 'unstyled'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'radio',
      options: ['rounded', 'pill'],
    },
    showCount: {
      control: 'boolean',
    },
    children: {
      control: false,
    },
    labels: {
      control: false,
    },
    resize: {
      control: 'radio',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    rows: {
      control: 'number',
    },
    cols: {
      control: 'number',
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    defaultValue: {
      control: 'text',
    },
    maxLength: {
      control: 'number',
    },
    minLength: {
      control: 'number',
    },
    name: {
      control: 'text',
    },
    wrap: {
      control: 'radio',
      options: ['soft', 'hard', 'off'],
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
    'aria-label': 'Comments',
    placeholder: 'Write something',
    disabled: false,
  },
} satisfies Meta<typeof Textarea>

type Story = StoryObj<typeof Textarea>

/**
 * This is the default Textarea.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the Textarea looks. `unstyled` leaves the native textarea so you can
 * style it yourself.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Outline" placeholder="Outline" variant="outline" />
      <Textarea aria-label="Filled" placeholder="Filled" variant="filled" />
      <Textarea aria-label="Underline" placeholder="Underline" variant="underline" />
      <Textarea
        aria-label="Unstyled"
        className="border border-gray-400 rounded-sm p-2"
        placeholder="Unstyled"
        variant="unstyled"
      />
    </div>
  ),
}

/**
 * Use the **size** prop to change the text size and the padding.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Small" placeholder="Small" size="sm" />
      <Textarea aria-label="Medium" placeholder="Medium" size="md" />
      <Textarea aria-label="Large" placeholder="Large" size="lg" />
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to change the color of the focus ring.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {colorSchemes.map((scheme) => (
        <Textarea
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          placeholder={`Focus me: ${scheme}`}
          rows={1}
        />
      ))}
    </div>
  ),
}

/**
 * **showCount** shows how many characters there are under the Textarea, and with a **maxLength** how many are
 * allowed. The count describes the field to a screen reader when it gets the focus, and near the limit a polite
 * message says how many characters are left. Use **labels** (`count` and `remaining`) to change the texts.
 */
export const CharacterCount: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Notes" placeholder="Without a limit" showCount />
      <Textarea
        aria-label="Bio"
        defaultValue="I write documentation."
        maxLength={120}
        placeholder="With a limit"
        showCount
      />
      <Textarea
        aria-label="Short bio"
        defaultValue="Almost there, only a few more characters can fit in this one"
        labels={{ count: (count, max) => `${(max ?? 0) - count} left` }}
        maxLength={64}
        showCount
      />
    </div>
  ),
}

/**
 * Use **rows** for the initial height and **resize** to control how the user can change it.
 */
export const RowsAndResize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Six rows" placeholder="Six rows" rows={6} />
      <Textarea aria-label="Not resizable" placeholder="Not resizable" resize="none" />
      <Textarea aria-label="Resizable both ways" placeholder="Resizable both ways" resize="both" />
    </div>
  ),
}

/**
 * A **disabled** Textarea can't be changed or focused. A **readOnly** one can be focused and selected but not changed.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Disabled" disabled placeholder="Disabled" />
      <Textarea aria-label="Read only" defaultValue="Read only text" readOnly />
    </div>
  ),
}

/**
 * **aria-invalid** switches the Textarea to the error color scheme.
 */
export const Invalid: Story = {
  args: {
    'aria-invalid': true,
    defaultValue: 'Too short',
  },
}

/**
 * Wrap it in a **Field** to add a label, a helper and an error text. The Field wires the accessibility attributes.
 */
export const WithField: Story = {
  render: () => (
    <Field
      errorText="Write at least 10 characters"
      helperText="Tell us about yourself"
      label="Bio"
      required
    >
      <Textarea defaultValue="Too short" placeholder="Your bio" />
    </Field>
  ),
}

/**
 * Give the Textarea its parts to change what it shows or the order. Here the count goes above the field and says how
 * many characters are left. The props of the field (**maxLength**, **placeholder**) go on the Textarea, and the
 * `TextareaStatus` is the message a screen reader gets near the limit.
 */
export const Compound: Story = {
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Textarea maxLength={80}>
        <TextareaCount />
        <TextareaField aria-label="Bio" placeholder="Count above the field" />
        <TextareaStatus />
      </Textarea>
      <Textarea
        defaultValue="Short"
        labels={{ count: (count, max) => `${(max ?? 0) - count} left` }}
        maxLength={80}
      >
        <TextareaField aria-label="Notes" />
        <TextareaCount />
        <TextareaStatus />
      </Textarea>
    </div>
  ),
}

/**
 * Some examples of Textarea with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the `<textarea>`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Textarea
    className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
    placeholder="Tell us more"
    variant="unstyled"
  />
  <Textarea
    className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-200"
    placeholder="Rounded and fixed"
    rows={4}
    variant="unstyled"
  />
  <Textarea maxLength={80} variant="unstyled">
    <TextareaField
      aria-label="With a count"
      className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
      placeholder="With a count"
    />
    <TextareaCount className="mt-1 block text-right text-xs text-gray-600 dark:text-gray-400 data-[limit]:font-semibold data-[limit]:text-red-600" />
    <TextareaStatus />
  </Textarea>
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Textarea
        className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
        placeholder="Tell us more"
        variant="unstyled"
      />
      <Textarea
        className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-hidden focus:ring-3 focus:ring-emerald-200"
        placeholder="Rounded and fixed"
        rows={4}
        variant="unstyled"
      />
      <Textarea maxLength={80} variant="unstyled">
        <TextareaField
          aria-label="With a count"
          className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-200"
          placeholder="With a count"
        />
        <TextareaCount className="mt-1 block text-right text-xs text-gray-600 dark:text-gray-400 data-[limit]:font-semibold data-[limit]:text-red-600" />
        <TextareaStatus />
      </Textarea>
    </div>
  ),
}

/**
 * Some examples of Textarea with Bootstrap classes: `form-control`, with its size and validation states.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
  <Textarea className="form-control" placeholder="Default textarea" variant="unstyled" />
  <Textarea
    className="form-control form-control-sm"
    placeholder="Small textarea"
    variant="unstyled"
  />
  <Textarea
    className="form-control is-invalid"
    defaultValue="Invalid value"
    placeholder="Invalid textarea"
    style={{ backgroundImage: 'none' }}
    variant="unstyled"
  />
  <Textarea maxLength={80} variant="unstyled">
    <TextareaField aria-label="With a count" className="form-control" placeholder="With a count" />
    <TextareaCount className="form-text text-end" />
    <TextareaStatus />
  </Textarea>
</div>`,
      },
    },
  },
  render: () => (
    <div className="d-flex flex-column gap-3" style={{ width: '18rem', maxWidth: '100%' }}>
      <Textarea className="form-control" placeholder="Default textarea" variant="unstyled" />
      <Textarea
        className="form-control form-control-sm"
        placeholder="Small textarea"
        variant="unstyled"
      />
      <Textarea
        className="form-control is-invalid"
        defaultValue="Invalid value"
        placeholder="Invalid textarea"
        style={{ backgroundImage: 'none' }}
        variant="unstyled"
      />
      <Textarea maxLength={80} variant="unstyled">
        <TextareaField
          aria-label="With a count"
          className="form-control"
          placeholder="With a count"
        />
        <TextareaCount className="form-text text-end" />
        <TextareaStatus />
      </Textarea>
    </div>
  ),
}
