import type { StoryObj, Meta } from '@storybook/react-vite'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../field'
import { Textarea } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

/**
 * A multi-line text field for longer answers such as comments or a bio.
 * It renders a native `<textarea>`, so it works with forms and the keyboard out of the box,
 * and the `ref` points to it.
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
      description:
        'Custom CSS class for the outermost element: the `<textarea>`, or the wrapper around it when `showCount` is on.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the Textarea. They are applied after the color variable, so they can override it (`--textarea-color`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    colorScheme: {
      control: 'select',
      description: 'Color scheme used for the focus ring and the border while focused.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'secondary' } },
    },
    variant: {
      control: 'radio',
      description: 'Visual variant. `unstyled` drops the Plume styles so you can bring your own.',
      options: ['outline', 'filled', 'underline', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "underline" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    size: {
      control: 'radio',
      description: 'Size of the Textarea.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'radio',
      description: 'Shape of the corners.',
      options: ['rounded', 'pill'],
      table: { type: { summary: `"rounded" | "pill"` }, defaultValue: { summary: 'rounded' } },
    },
    showCount: {
      control: 'boolean',
      description:
        'Shows how many characters there are under the Textarea, as `12` or, with `maxLength`, as `12 / 200`. The count describes the textarea (`aria-describedby`), and near the limit a polite message says how many characters are left. The count turns red at the limit.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts, in every variant: `input` (the `<textarea>`) and `count` (the character counter). With `variant="unstyled"` they are the only classes the parts have.',
      table: { type: { summary: 'Partial<Record<TextareaPart, string>>' } },
    },
    labels: {
      control: false,
      description:
        'The texts of the Textarea, for other languages. `count(count, max)` is the text of the count; the default says `12 / 200`, or `12` without a limit, and it can also show what is left: `188 left`. `remaining(remaining)` is the message a screen reader gets when there are few characters left, at ten or at a tenth of the `maxLength` if that is more; the default says `8 characters left`.',
      table: {
        category: 'Accessibility',
        type: { summary: 'Partial<TextareaLabels>' },
      },
    },
    resize: {
      control: 'radio',
      description: 'Which way the user can resize the Textarea.',
      options: ['none', 'vertical', 'horizontal', 'both'],
      table: {
        type: { summary: `"none" | "vertical" | "horizontal" | "both"` },
        defaultValue: { summary: 'vertical' },
      },
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '3' } },
    },
    cols: {
      control: 'number',
      description: 'Visible width in average character widths.',
      table: { category: 'HTML attributes', type: { summary: 'number' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint shown while the Textarea is empty.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Value, for a controlled Textarea. Pair it with `onChange`.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value, for an uncontrolled Textarea.',
      table: { type: { summary: 'string' } },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters.',
      table: { category: 'HTML attributes', type: { summary: 'number' } },
    },
    minLength: {
      control: 'number',
      description: 'Minimum number of characters for the value to be valid.',
      table: { category: 'HTML attributes', type: { summary: 'number' } },
    },
    name: {
      control: 'text',
      description: 'Name used when the form is submitted.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    wrap: {
      control: 'radio',
      description: 'How the text wraps when the form is submitted.',
      options: ['soft', 'hard', 'off'],
      table: { category: 'HTML attributes', type: { summary: `"soft" | "hard" | "off"` } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the Textarea.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Lets the user read and select the text but not change it.',
      table: { type: { summary: 'boolean' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the Textarea as required.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    id: {
      control: false,
      description: 'Id of the `<textarea>`. A Field sets it so its label points to the Textarea.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name when the Textarea has no visible label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the Textarea.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description:
        'Ids of the elements that describe the Textarea. A Field sets it for its helper and error text.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description:
        'Marks the Textarea as invalid, which also switches it to the error color scheme.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
    onChange: {
      control: false,
      description: 'Called when the user changes the text.',
      table: {
        category: 'Events',
        type: { summary: '(event: ChangeEvent<HTMLTextAreaElement>) => void' },
      },
    },
    onBlur: {
      control: false,
      description: 'Called when the Textarea loses focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
    },
    onFocus: {
      control: false,
      description: 'Called when the Textarea receives focus.',
      table: { category: 'Events', type: { summary: '(event: FocusEvent) => void' } },
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
        className="border border-gray-400 rounded p-2"
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
 * Some examples of Textarea with Tailwind classes. With `variant="unstyled"` the `className` is the only class of the `<textarea>`.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div className="flex w-72 max-w-full flex-col gap-4">
  <Textarea
    className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
    placeholder="Tell us more"
    variant="unstyled"
  />
  <Textarea
    className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
    placeholder="Rounded and fixed"
    rows={4}
    variant="unstyled"
  />
  <Textarea classNames={{ count: 'mt-1 block text-right text-xs text-gray-600 dark:text-gray-400 data-[limit]:font-semibold data-[limit]:text-red-600' }}
    className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
   
    aria-label="With a count"
    maxLength={80}
    placeholder="With a count"
    showCount
    variant="unstyled"
  />
</div>`,
      },
    },
  },
  render: () => (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Textarea
        className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Tell us more"
        variant="unstyled"
      />
      <Textarea
        className="block w-full resize-none rounded-2xl border-2 border-emerald-600 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
        placeholder="Rounded and fixed"
        rows={4}
        variant="unstyled"
      />
      <Textarea
        classNames={{
          count:
            'mt-1 block text-right text-xs text-gray-600 dark:text-gray-400 data-[limit]:font-semibold data-[limit]:text-red-600',
        }}
        className="block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"

        aria-label="With a count"
        maxLength={80}
        placeholder="With a count"
        showCount
        variant="unstyled"
      />
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
  <Textarea classNames={{ count: 'form-text text-end' }}
    className="form-control"
   
    aria-label="With a count"
    maxLength={80}
    placeholder="With a count"
    showCount
    variant="unstyled"
  />
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
      <Textarea
        classNames={{ count: 'form-text text-end' }}
        className="form-control"

        aria-label="With a count"
        maxLength={80}
        placeholder="With a count"
        showCount
        variant="unstyled"
      />
    </div>
  ),
}
