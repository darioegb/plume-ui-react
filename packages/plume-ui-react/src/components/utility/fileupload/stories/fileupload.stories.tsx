import type { StoryObj, Meta } from '@storybook/react-vite'
import { useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../../form/field'
import { FileUpload, type FileRejection } from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const frame = { maxWidth: '100%', width: '26rem' }

const stack = (gap: string): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  gap,
  ...frame,
})

/**
 * A drop area and a list of the chosen files. Use it to upload documents or images.
 *
 * It is a real `<input type="file">` that you can reach and operate with the keyboard, <kbd>Enter</kbd> or
 * <kbd>Space</kbd> opens the chooser, and the dropzone around it adds drag and drop for the pointer. The text of
 * the dropzone describes the input for screen readers. Name it with an `aria-label`, or with a `Field` label,
 * which also gives it its id, description, `required` and invalid state like any other control. The `ref` goes to
 * the input, so it works with `register` of react-hook-form.
 *
 * The chosen files are listed with their size and a button to remove each one. Files that are not accepted by
 * **accept**, are larger than **maxSize** (in bytes) or go over **maxFiles** are left out, and the component says
 * why in a list that screen readers announce. **onReject** also tells you, for example to show your own message in
 * a `Field`. The files are kept in the `value` / `defaultValue`, and the input holds the same files, so it also
 * works inside a plain `<form>`.
 *
 * It uploads nothing: take the files from **onValueChange** and send them where you need.
 */
export default {
  title: 'Components/FileUpload',
  component: FileUpload,
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
      description: 'The instructions in the dropzone.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '"Drag files here, or press to choose them"' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for the root.',
      table: { type: { summary: 'string' } },
    },
    classNames: {
      control: false,
      description:
        'Custom CSS classes for the parts: `dropzone`, `list`, `file`, `remove` and `error`.',
      table: { type: { summary: 'Partial<Record<FileUploadPart, string>>' } },
    },
    style: {
      control: false,
      description:
        'Inline styles for the root. They are applied after the color variables, so they can override them (e.g. `--fileupload-solid`).',
      table: { type: { summary: 'CSSProperties' } },
    },
    accept: {
      control: 'text',
      description:
        'The types of file that are accepted, as in the native attribute: extensions (`.pdf`), types (`image/png`) or wildcards (`image/*`), separated by commas.',
      table: { type: { summary: 'string' } },
    },
    maxSize: {
      control: 'number',
      description: 'The largest size of a file, in bytes.',
      table: { type: { summary: 'number' } },
    },
    maxFiles: {
      control: 'number',
      description: 'The most files the list can have. It only applies with `multiple`.',
      table: { type: { summary: 'number' } },
    },
    multiple: {
      control: 'boolean',
      description: 'Allows several files. Without it a new file replaces the previous one.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    value: {
      control: false,
      description:
        'The chosen files. Makes the FileUpload controlled: pass `onValueChange` to update it.',
      table: { type: { summary: 'File[]' } },
    },
    defaultValue: {
      control: false,
      description: 'The files that are there at first, when it is not controlled.',
      table: { type: { summary: 'File[]' } },
    },
    onValueChange: {
      control: false,
      description: 'Called with the whole list of files when files are added or removed.',
      table: { category: 'Events', type: { summary: '(files: File[]) => void' } },
    },
    onReject: {
      control: false,
      description: 'Called with the files that were left out and why: `type`, `size` or `count`.',
      table: { category: 'Events', type: { summary: '(rejections: FileRejection[]) => void' } },
    },
    formatRejection: {
      control: false,
      description: 'Returns the text of a rejection. Use it to translate the messages.',
      table: {
        type: { summary: '(rejection: FileRejection) => string' },
        defaultValue: { summary: '"name: file is too large"' },
      },
    },
    removeLabel: {
      control: false,
      description: 'Returns the accessible name of the button that removes a file.',
      table: {
        type: { summary: '(file: File) => string' },
        defaultValue: { summary: '"Remove name"' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input, the dropzone and the buttons to remove files.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: "Shows the files but doesn't let the user add or remove any.",
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the input as required.',
      table: {
        category: 'HTML attributes',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    colorScheme: {
      control: 'select',
      description:
        'Color scheme from the theme palette, including custom schemes added to it. It colors the dropzone when it is hovered, focused or has files over it.',
      options: colorSchemes,
      table: { type: { summary: 'ColorScheme' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      description: 'Size of the FileUpload.',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: `"sm" | "md" | "lg"` }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'radio',
      description:
        'Visual variant. `outline` draws a dashed border and `filled` a muted background. `unstyled` drops the Plume styles so you can bring your own; the dropzone and the list keep working.',
      options: ['outline', 'filled', 'unstyled'],
      table: {
        type: { summary: `"outline" | "filled" | "unstyled"` },
        defaultValue: { summary: 'outline' },
      },
    },
    id: {
      control: false,
      description: 'Id of the input.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    name: {
      control: 'text',
      description: 'Name of the input, for a native form.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'Native tooltip of the input.',
      table: { category: 'HTML attributes', type: { summary: 'string' } },
    },
    hidden: {
      control: false,
      description: 'Hides the input.',
      table: { category: 'HTML attributes', type: { summary: 'boolean' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible name of the input. It is not needed inside a `Field` with a label.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: false,
      description: 'Id of the element that names the input.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-describedby': {
      control: false,
      description: 'Id of the elements that describe the input, after the text of the dropzone.',
      table: { category: 'Accessibility', type: { summary: 'string' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the input as invalid, and the dropzone gets the error color.',
      table: { category: 'Accessibility', type: { summary: 'boolean' } },
    },
  },
  args: {
    'aria-label': 'Documents',
    style: frame,
  },
} satisfies Meta<typeof FileUpload>

type Story = StoryObj<typeof FileUpload>

/**
 * This is the default FileUpload: one file at a time, of any type.
 */
export const Default: Story = {}

/**
 * Use the **variant** prop to pick how the FileUpload looks. `unstyled` drops the Plume styles so you can style it
 * yourself.
 */
export const Variants: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['outline', 'filled'] as const).map((variant) => (
        <FileUpload aria-label={variant} key={variant} variant={variant}>
          {variant}
        </FileUpload>
      ))}
      <FileUpload
        aria-label="unstyled"
        classNames={{ dropzone: 'rounded-lg bg-slate-900 p-6 text-center text-slate-100' }}
        variant="unstyled"
      >
        unstyled, with Tailwind classes
      </FileUpload>
    </div>
  ),
}

/**
 * Use the **size** prop to change the size.
 */
export const Sizes: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FileUpload aria-label={`Size ${size}`} key={size} size={size}>
          Size {size}
        </FileUpload>
      ))}
    </div>
  ),
}

/**
 * Use the **colorScheme** prop to pick a color from the theme. It colors the dropzone when it is hovered, focused
 * or has files over it.
 */
export const Colors: Story = {
  render: () => (
    <div style={stack('1rem')}>
      {colorSchemes.map((scheme) => (
        <FileUpload
          aria-label={scheme}
          colorScheme={scheme as keyof typeof defaultTheme.colors}
          key={scheme}
          size="sm"
        >
          Hover me: {scheme}
        </FileUpload>
      ))}
    </div>
  ),
}

/**
 * With **multiple** the user can add several files, one after another or together, and each one has its own
 * button to remove it.
 */
export const Multiple: Story = {
  args: { multiple: true },
}

function RestrictedUpload(): React.ReactNode {
  const [rejected, setRejected] = useState<FileRejection[]>([])
  return (
    <div style={stack('0.75rem')}>
      <FileUpload
        accept="image/*,.pdf"
        aria-label="Images and PDFs"
        maxFiles={3}
        maxSize={2 * 1024 * 1024}
        multiple
        onReject={setRejected}
      >
        Images or PDFs, up to 2 MB each and 3 files
      </FileUpload>
      <p className="text-sm">Rejected at the last attempt: {rejected.length}</p>
    </div>
  )
}

/**
 * **accept**, **maxSize** (in bytes) and **maxFiles** leave out the files that don't fit, and the FileUpload lists
 * why. **onReject** also gives you the rejected files and the reason, to show your own message.
 */
export const Restrictions: Story = {
  render: () => <RestrictedUpload />,
}

/**
 * Use **formatRejection**, **removeLabel** and the text of the dropzone to translate the component.
 */
export const Translated: Story = {
  render: () => (
    <FileUpload
      accept=".pdf"
      aria-label="Documentos"
      defaultValue={[new File(['x'], 'contrato.pdf', { type: 'application/pdf' })]}
      formatRejection={({ file, reason }) =>
        `${file.name}: ${reason === 'type' ? 'solo se admiten PDF' : 'no se admite'}`
      }
      multiple
      removeLabel={(file) => `Quitar ${file.name}`}
      style={frame}
    >
      Arrastra archivos aquí, o pulsa para elegirlos
    </FileUpload>
  ),
}

function ControlledUpload(): React.ReactNode {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div style={stack('0.75rem')}>
      <FileUpload aria-label="Attachments" multiple onValueChange={setFiles} value={files} />
      <button
        className="self-start rounded border border-gray-400 px-2 py-1 text-sm"
        disabled={files.length === 0}
        onClick={() => setFiles([])}
        type="button"
      >
        Clear the list
      </button>
    </div>
  )
}

/**
 * Pass **value** and **onValueChange** to control the list, for example to clear it from outside.
 */
export const Controlled: Story = {
  render: () => <ControlledUpload />,
}

/**
 * A FileUpload can be disabled, or read only to show the files without letting the user change them.
 */
export const Disabled: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      <FileUpload aria-label="Disabled" disabled />
      <FileUpload
        aria-label="Read only"
        defaultValue={[new File(['x'], 'report.pdf', { type: 'application/pdf' })]}
        readOnly
      >
        Read only
      </FileUpload>
    </div>
  ),
}

/**
 * Use **aria-invalid** to show an error. The dropzone takes the error color.
 */
export const Invalid: Story = {
  args: { 'aria-invalid': true },
}

/**
 * Inside a `Field` the label, the helper text and the error message name and describe the input, which also gets
 * its id and its `required` and invalid state.
 */
export const WithField: Story = {
  render: () => (
    <div style={stack('1.5rem')}>
      <Field helperText="PDF, up to 2 MB" label="Resume" style={frame}>
        <FileUpload accept=".pdf" />
      </Field>
      <Field errorText="Attach your resume" label="Resume" required style={frame}>
        <FileUpload accept=".pdf" />
      </Field>
    </div>
  ),
}

/**
 * Some examples of FileUpload with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the input is still reachable, and the dropzone and the list keep working. Style the parts with
 * `classNames`, and use `data-[dragging]:` on the root.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<FileUpload
  aria-label="Documents"
  className="group w-96 max-w-full text-sm text-foreground"
  classNames={{
    dropzone: "rounded-lg border-2 border-dashed border-border p-6 text-center text-muted group-data-[dragging]:border-primary-solid",
    file: "mt-2 flex items-center gap-2 rounded bg-surface-muted px-3 py-2",
    list: "mt-2",
    remove: "rounded-full p-1 hover:bg-border",
  }}
  multiple
  variant="unstyled"
>
  Drop files here
</FileUpload>`,
      },
    },
  },
  render: () => (
    <FileUpload
      aria-label="Documents"
      className="group text-sm text-foreground"
      classNames={{
        dropzone:
          'rounded-lg border-2 border-dashed border-border p-6 text-center group-data-[dragging]:border-primary-solid',
        error: 'mt-2 text-error-text',
        file: 'mt-2 flex items-center gap-2 rounded bg-surface-muted px-3 py-2',
        list: 'mt-2',
        remove: 'rounded-full p-1 hover:bg-border',
      }}
      multiple
      style={frame}
      variant="unstyled"
    >
      Drop files here
    </FileUpload>
  ),
}

/**
 * Some examples of FileUpload with Bootstrap classes: `border`, `rounded` and `list-group`. Bootstrap's own file
 * input is a plain control, so the story composes its utilities around the dropzone and the list.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<FileUpload
  aria-label="Documents"
  classNames={{
    dropzone: "border border-2 border-secondary-subtle rounded p-4 text-center text-body-secondary",
    file: "list-group-item d-flex align-items-center gap-2",
    list: "list-group mt-2",
    remove: "btn btn-sm btn-outline-secondary border-0",
  }}
  multiple
  variant="unstyled"
>
  Drop files here
</FileUpload>`,
      },
    },
  },
  render: () => (
    <FileUpload
      aria-label="Documents"
      classNames={{
        dropzone:
          'border border-2 border-secondary-subtle rounded p-4 text-center text-body-secondary',
        error: 'mt-2 text-danger',
        file: 'list-group-item d-flex align-items-center gap-2',
        list: 'list-group mt-2',
        remove: 'btn btn-sm btn-outline-secondary border-0',
      }}
      multiple
      style={frame}
      variant="unstyled"
    >
      Drop files here
    </FileUpload>
  ),
}
