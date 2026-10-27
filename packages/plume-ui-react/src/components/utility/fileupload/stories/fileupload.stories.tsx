import type { StoryObj, Meta } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { defaultTheme } from '../../../../theme'
import { Field } from '../../../form/field'
import { ProgressBarIndicator } from '../../progressbar'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadError,
  FileUploadErrors,
  FileUploadInput,
  FileUploadItem,
  FileUploadList,
  FileUploadName,
  FileUploadProgress,
  FileUploadPrompt,
  FileUploadRemove,
  FileUploadSize,
  type FileRejection,
} from '..'

const colorSchemes = Object.keys(defaultTheme.colors)

const frame = { maxWidth: '100%', width: '26rem' }

const sizes = [2048, 524288, 3145728]

const sampleFile = (name: string, size: number): File => new File([new Uint8Array(size)], name)

const fileKey = (file: File): string => `${file.name}-${file.size}`

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
 * It uploads nothing: take the files from **onValueChange** and send them where you need. While you do, pass
 * **progress** (a function that gives a percentage from 0 to 100 for each file) and every file shows a bar.
 *
 * Every element of the FileUpload is a part you can import. Given no parts, the `FileUpload` builds the usual layout:
 * the dropzone with the input and the prompt, the list of files and the list of errors. Give it any of the parts as
 * direct children and it renders them as written, so you can reorder, omit or replace each one, and give it its own
 * `className`. The list and the errors take a function as children, which gets each file or each rejection.
 */
export default {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      importNames: [
        'FileUpload',
        'FileUploadDropzone',
        'FileUploadError',
        'FileUploadErrors',
        'FileUploadInput',
        'FileUploadItem',
        'FileUploadList',
        'FileUploadName',
        'FileUploadProgress',
        'FileUploadPrompt',
        'FileUploadRemove',
        'FileUploadSize',
      ],
      toc: {
        title: 'On this page',
        disable: false,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text' },
    className: { control: 'text' },
    style: { control: false },
    accept: { control: 'text' },
    maxSize: { control: 'number' },
    maxFiles: { control: 'number' },
    multiple: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    onReject: { control: false },
    labels: { control: false },
    progress: { control: false },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    colorScheme: { control: 'select', options: colorSchemes },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'radio', options: ['outline', 'bordered', 'filled', 'unstyled'] },
    id: { control: false },
    name: { control: 'text' },
    title: { control: 'text' },
    hidden: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: false },
    'aria-describedby': { control: false },
    'aria-invalid': { control: 'boolean' },
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
      {(['outline', 'bordered', 'filled'] as const).map((variant) => (
        <FileUpload aria-label={variant} key={variant} variant={variant}>
          {variant}
        </FileUpload>
      ))}
      <FileUpload aria-label="unstyled" variant="unstyled">
        <FileUploadDropzone className="rounded-lg bg-slate-900 p-6 text-center text-slate-100">
          <FileUploadInput />
          <FileUploadPrompt>unstyled, with Tailwind classes</FileUploadPrompt>
        </FileUploadDropzone>
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [rejected, setRejected] = useState<FileRejection[]>([])
  return (
    <div className="flex flex-col gap-3">
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
      <p>Rejected at the last attempt: {rejected.length}</p>
    </div>
  )
}`,
      },
    },
  },
  render: () => <RestrictedUpload />,
}

/**
 * Use **labels** to translate the component.
 */
export const Translated: Story = {
  render: () => (
    <FileUpload
      accept=".pdf"
      aria-label="Documentos"
      defaultValue={[new File(['x'], 'contrato.pdf', { type: 'application/pdf' })]}
      labels={{
        progress: (file) => `Subiendo ${file.name}`,
        prompt: 'Arrastra archivos aquí, o pulsa para elegirlos',
        rejection: ({ file, reason }) =>
          `${file.name}: ${reason === 'type' ? 'solo se admiten PDF' : 'no se admite'}`,
        remove: (file) => `Quitar ${file.name}`,
      }}
      multiple
      style={frame}
    />
  ),
}

function UploadingFiles(): React.ReactNode {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        const next = { ...current }
        for (const file of files) {
          next[fileKey(file)] = Math.min(100, (next[fileKey(file)] ?? 0) + 6 + Math.random() * 14)
        }
        return next
      })
    }, 500)
    return () => clearInterval(timer)
  }, [files])
  return (
    <div style={frame}>
      <FileUpload
        aria-label="Attachments"
        multiple
        onValueChange={setFiles}
        progress={(file) => progress[fileKey(file)] ?? 0}
        value={files}
      />
    </div>
  )
}

/**
 * Give **progress** a function that returns the percentage of the upload of each file, from your own state, and the
 * list shows a bar under each name. It turns green at 100, and the remove button works as a cancel. Here the
 * progress is simulated: choose some files to see it move.
 */
export const Progress: Story = {
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState({})
  const keyOf = (file) => \`\${file.name}-\${file.size}\`
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((current) => {
        const next = { ...current }
        for (const file of files) {
          next[keyOf(file)] = Math.min(100, (next[keyOf(file)] ?? 0) + 6 + Math.random() * 14)
        }
        return next
      })
    }, 500)
    return () => clearInterval(timer)
  }, [files])
  return (
    <FileUpload
      aria-label="Attachments"
      multiple
      onValueChange={setFiles}
      progress={(file) => progress[keyOf(file)] ?? 0}
      value={files}
    />
  )
}`,
      },
    },
  },
  render: () => <UploadingFiles />,
}

/**
 * The bar of each file has its own name for screen readers, from **labels.progress**. A file that **progress** gives
 * `undefined` has no bar.
 */
export const ProgressStates: Story = {
  args: {
    defaultValue: [
      sampleFile('queued.pdf', sizes[0] ?? 0),
      sampleFile('uploading.zip', sizes[1] ?? 0),
      sampleFile('done.png', sizes[2] ?? 0),
    ],
    multiple: true,
    progress: (file) => ({ 'done.png': 100, 'uploading.zip': 45 })[file.name],
    style: frame,
  },
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
  parameters: {
    docs: {
      source: {
        code: `function Example() {
  const [files, setFiles] = useState<File[]>([])
  return (
    <div className="flex flex-col gap-3">
      <FileUpload aria-label="Attachments" multiple onValueChange={setFiles} value={files} />
      <button disabled={files.length === 0} onClick={() => setFiles([])} type="button">
        Clear the list
      </button>
    </div>
  )
}`,
      },
    },
  },
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
 * Every element is a part. Here the list goes above the dropzone, each file gets its own layout with the size under
 * the name, the prompt has its own class and the errors are written by hand with a function. Omit a part and it is
 * not there.
 */
export const Compound: Story = {
  parameters: {
    docs: {
      source: {
        code: `<FileUpload accept=".pdf" aria-label="Documents" multiple progress={(file) => progress[file.name]}>
  <FileUploadList className="mb-2">
    {(file) => (
      <FileUploadItem file={file}>
        <FileUploadName className="font-medium" />
        <FileUploadRemove aria-label={\`Discard \${file.name}\`}>Discard</FileUploadRemove>
        <FileUploadSize className="basis-full text-xs" />
        <FileUploadProgress />
      </FileUploadItem>
    )}
  </FileUploadList>
  <FileUploadDropzone>
    <FileUploadInput />
    <FileUploadPrompt className="font-semibold">Drop your PDFs here</FileUploadPrompt>
  </FileUploadDropzone>
  <FileUploadErrors>
    {(rejection) => (
      <FileUploadError rejection={rejection}>
        {rejection.file.name} is not a PDF
      </FileUploadError>
    )}
  </FileUploadErrors>
</FileUpload>`,
      },
    },
  },
  render: (args) => (
    <FileUpload
      {...args}
      accept=".pdf"
      defaultValue={[sampleFile('report.pdf', sizes[1] ?? 0)]}
      multiple
      progress={() => 45}
    >
      <FileUploadList style={{ marginBottom: '0.5rem' }}>
        {(file) => (
          <FileUploadItem file={file}>
            <FileUploadName style={{ fontWeight: 600 }} />
            <FileUploadRemove aria-label={`Discard ${file.name}`}>Discard</FileUploadRemove>
            <FileUploadSize style={{ flexBasis: '100%', fontSize: '0.75rem' }} />
            <FileUploadProgress />
          </FileUploadItem>
        )}
      </FileUploadList>
      <FileUploadDropzone>
        <FileUploadInput />
        <FileUploadPrompt style={{ fontWeight: 600 }}>Drop your PDFs here</FileUploadPrompt>
      </FileUploadDropzone>
      <FileUploadErrors>
        {(rejection) => (
          <FileUploadError rejection={rejection}>
            {rejection.file.name} is not a PDF
          </FileUploadError>
        )}
      </FileUploadErrors>
    </FileUpload>
  ),
}

/**
 * Some examples of FileUpload with Tailwind classes. With `variant="unstyled"` the Plume classes are gone and the
 * structure stays: the input is still reachable, and the dropzone and the list keep working. Give each part its
 * `className`, and use `data-[dragging]:` on the root. The bar of a file is a `ProgressBar`: pass its
 * `ProgressBarIndicator` as the child of the `FileUploadProgress` to give the indicator its own class.
 */
export const Tailwind: Story = {
  parameters: {
    docs: {
      source: {
        code: `<FileUpload
  aria-label="Documents"
  className="group text-sm text-foreground"
  multiple
  progress={(file) => progress[file.name]}
  variant="unstyled"
>
  <FileUploadDropzone className="rounded-lg border-2 border-dashed border-border p-6 text-center group-data-[dragging]:border-primary-solid" />
  <FileUploadList className="mt-2">
    {(file) => (
      <FileUploadItem className="mt-2 flex items-center gap-2 rounded bg-surface-muted px-3 py-2" file={file}>
        <FileUploadName />
        <FileUploadSize />
        <FileUploadRemove className="rounded-full p-1 hover:bg-border" />
        <FileUploadProgress className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <ProgressBarIndicator className="h-full bg-primary-solid" />
        </FileUploadProgress>
      </FileUploadItem>
    )}
  </FileUploadList>
  <FileUploadErrors className="mt-2 text-error-text" />
</FileUpload>`,
      },
    },
  },
  render: () => (
    <FileUpload
      aria-label="Documents"
      className="group text-sm text-foreground"
      defaultValue={[sampleFile('report.pdf', sizes[1] ?? 0)]}
      multiple
      progress={() => 60}
      style={frame}
      variant="unstyled"
    >
      <FileUploadDropzone className="rounded-lg border-2 border-dashed border-border p-6 text-center group-data-[dragging]:border-primary-solid" />
      <FileUploadList className="mt-2">
        {(file) => (
          <FileUploadItem
            className="mt-2 flex flex-wrap items-center gap-2 rounded bg-surface-muted px-3 py-2"
            file={file}
          >
            <FileUploadName className="flex-1" />
            <FileUploadSize />
            <FileUploadRemove className="rounded-full p-1 hover:bg-border" />
            <FileUploadProgress className="h-1.5 w-full overflow-hidden rounded-full bg-border">
              <ProgressBarIndicator className="h-full bg-primary-solid" />
            </FileUploadProgress>
          </FileUploadItem>
        )}
      </FileUploadList>
      <FileUploadErrors className="mt-2 text-error-text" />
    </FileUpload>
  ),
}

/**
 * Some examples of FileUpload with Bootstrap classes: `border`, `rounded` and `list-group`. Bootstrap's own file
 * input is a plain control, so the story composes its utilities around the dropzone and the list. The bar of a file
 * is a `ProgressBar`, so Bootstrap's `progress` classes don't apply to it: leave `progress` out, or keep the Plume
 * bar.
 */
export const Bootstrap: Story = {
  parameters: {
    docs: {
      source: {
        code: `<FileUpload aria-label="Documents" multiple variant="unstyled">
  <FileUploadDropzone className="border border-2 border-secondary-subtle rounded p-4 text-center text-body-secondary" />
  <FileUploadList className="list-group mt-2">
    {(file) => (
      <FileUploadItem className="list-group-item d-flex flex-wrap align-items-center gap-2" file={file}>
        <FileUploadName />
        <FileUploadSize />
        <FileUploadRemove className="btn btn-sm btn-outline-secondary border-0" />
      </FileUploadItem>
    )}
  </FileUploadList>
  <FileUploadErrors className="mt-2 text-danger" />
</FileUpload>`,
      },
    },
  },
  render: () => (
    <FileUpload
      aria-label="Documents"
      defaultValue={[sampleFile('report.pdf', sizes[1] ?? 0)]}
      multiple
      style={frame}
      variant="unstyled"
    >
      <FileUploadDropzone className="border border-2 border-secondary-subtle rounded p-4 text-center text-body-secondary" />
      <FileUploadList className="list-group mt-2">
        {(file) => (
          <FileUploadItem
            className="list-group-item d-flex flex-wrap align-items-center gap-2"
            file={file}
          >
            <FileUploadName className="flex-fill" />
            <FileUploadSize />
            <FileUploadRemove className="btn btn-sm btn-outline-secondary border-0" />
          </FileUploadItem>
        )}
      </FileUploadList>
      <FileUploadErrors className="mt-2 text-danger" />
    </FileUpload>
  ),
}
