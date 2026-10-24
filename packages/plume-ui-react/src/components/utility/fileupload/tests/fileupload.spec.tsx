import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type Ref, useState } from 'react'
import { Field } from '../../../form/field'
import { FileUpload } from '..'
import type { FileUploadProps } from '..'

const file = (name: string, type = 'text/plain', size = 10): File =>
  new File([new Uint8Array(size)], name, { type })

const input = (): HTMLInputElement =>
  document.querySelector('input[type="file"]') as HTMLInputElement
const dropzone = (): HTMLElement =>
  document.querySelector('[data-plume-fileupload-dropzone]') as HTMLElement
const names = (): string[] =>
  Array.from(document.querySelectorAll('[data-plume-fileupload-name]')).map(
    (node) => node.textContent ?? '',
  )

const leave = (relatedTarget: EventTarget): void => {
  const event = createEvent.dragLeave(dropzone())
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget })
  fireEvent(dropzone(), event)
}

const choose = (files: File[]): void => {
  fireEvent.change(input(), { target: { files } })
}

function Demo({
  demoRef,
  ...props
}: Readonly<Partial<FileUploadProps> & { demoRef?: Ref<HTMLInputElement> }>) {
  return <FileUpload aria-label="Documents" {...props} ref={demoRef} />
}

describe('FileUpload component', () => {
  describe('rendering', () => {
    it('renders a file input with the instructions as its description', () => {
      render(<Demo />)
      expect(input()).toHaveAttribute('type', 'file')
      expect(input()).toHaveAccessibleName('Documents')
      expect(input()).toHaveAccessibleDescription('Drag files here, or press to choose them')
    })

    it('shows other instructions', () => {
      render(<Demo>Drop your CV</Demo>)
      expect(input()).toHaveAccessibleDescription('Drop your CV')
    })

    it('passes the input attributes', () => {
      render(<Demo accept=".pdf" multiple name="docs" required />)
      expect(input()).toHaveAttribute('accept', '.pdf')
      expect(input()).toHaveAttribute('multiple')
      expect(input()).toHaveAttribute('name', 'docs')
      expect(input()).toBeRequired()
    })

    it('forwards the ref to the input', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Demo demoRef={ref} />)
      expect(ref.current).toBe(input())
    })

    it('keeps the input reachable with the keyboard', () => {
      render(<Demo />)
      expect(input()).not.toHaveAttribute('tabindex', '-1')
      expect(input()).not.toHaveAttribute('hidden')
    })

    it('gets the id, description, invalid state and required from a Field', () => {
      render(
        <Field errorText="Too big" helperText="PDF only" label="Resume" required>
          <FileUpload />
        </Field>,
      )
      const control = screen.getByLabelText(/Resume/)
      expect(control).toBeRequired()
      expect(control).toHaveAttribute('aria-invalid', 'true')
      expect(control).toHaveAccessibleDescription(/Drag files here/)
      expect(control).toHaveAccessibleDescription(/Too big/)
    })

    it('puts the input inside the dropzone, so pressing the dropzone opens the chooser', () => {
      render(<Demo />)
      expect(dropzone().contains(input())).toBe(true)
    })

    it('opens the chooser, but not when it is read only', () => {
      const { rerender } = render(<Demo />)
      expect(fireEvent.click(input())).toBe(true)
      rerender(<Demo readOnly />)
      expect(fireEvent.click(input())).toBe(false)
    })
  })

  describe('choosing files', () => {
    it('lists the chosen file with its size', async () => {
      render(<Demo />)
      await userEvent.upload(input(), file('cv.pdf', 'application/pdf', 2048))
      expect(names()).toEqual(['cv.pdf'])
      expect(screen.getByText('2 KB')).toBeInTheDocument()
    })

    it('calls onValueChange with all the files', async () => {
      const onValueChange = vi.fn()
      render(<Demo multiple onValueChange={onValueChange} />)
      await userEvent.upload(input(), [file('a.txt'), file('b.txt')])
      expect(onValueChange).toHaveBeenCalledWith([
        expect.objectContaining({ name: 'a.txt' }),
        expect.objectContaining({ name: 'b.txt' }),
      ])
    })

    it('replaces the file when it is not multiple', async () => {
      render(<Demo />)
      await userEvent.upload(input(), file('a.txt'))
      await userEvent.upload(input(), file('b.txt'))
      expect(names()).toEqual(['b.txt'])
    })

    it('adds to the list when it is multiple', async () => {
      render(<Demo multiple />)
      await userEvent.upload(input(), file('a.txt'))
      await userEvent.upload(input(), file('b.txt'))
      expect(names()).toEqual(['a.txt', 'b.txt'])
    })

    it('ignores an empty selection', () => {
      const onValueChange = vi.fn()
      render(<Demo onValueChange={onValueChange} />)
      choose([])
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('starts with defaultValue', () => {
      render(<Demo defaultValue={[file('start.txt')]} />)
      expect(names()).toEqual(['start.txt'])
    })

    it('can be controlled', async () => {
      function Controlled() {
        const [files, setFiles] = useState<File[]>([file('one.txt')])
        return <Demo onValueChange={setFiles} value={files} />
      }
      render(<Controlled />)
      expect(names()).toEqual(['one.txt'])
      await userEvent.upload(input(), file('two.txt'))
      expect(names()).toEqual(['two.txt'])
    })

    it('keeps the files of the input in sync with the list', async () => {
      const added: File[] = []
      class FakeTransfer {
        items = { add: (item: File) => added.push(item) }
        files = added
      }
      vi.stubGlobal('DataTransfer', FakeTransfer)
      const assigned = vi.fn()
      Object.defineProperty(HTMLInputElement.prototype, 'files', {
        configurable: true,
        get: () => null,
        set: assigned,
      })
      render(<Demo multiple />)
      await userEvent.upload(input(), file('a.txt'))
      expect(assigned).toHaveBeenCalled()
      vi.unstubAllGlobals()
      Reflect.deleteProperty(HTMLInputElement.prototype, 'files')
    })
  })

  describe('rejections', () => {
    it('rejects files of another type, and says so', () => {
      const onReject = vi.fn()
      render(<Demo accept="image/*" onReject={onReject} />)
      choose([file('notes.txt', 'text/plain')])
      expect(names()).toEqual([])
      expect(screen.getByRole('alert')).toHaveTextContent('notes.txt: file type is not accepted')
      expect(onReject).toHaveBeenCalledWith([
        { file: expect.objectContaining({ name: 'notes.txt' }), reason: 'type' },
      ])
    })

    it('rejects files that are too large', () => {
      render(<Demo maxSize={5} />)
      choose([file('big.txt', 'text/plain', 50)])
      expect(screen.getByRole('alert')).toHaveTextContent('big.txt: file is too large')
    })

    it('rejects the files over the limit', () => {
      render(<Demo maxFiles={1} multiple />)
      choose([file('a.txt'), file('b.txt')])
      expect(names()).toEqual(['a.txt'])
      expect(screen.getByRole('alert')).toHaveTextContent('b.txt: too many files')
    })

    it('keeps the accepted files next to the rejected ones', () => {
      render(<Demo accept="image/*" multiple />)
      choose([file('a.png', 'image/png'), file('b.txt', 'text/plain')])
      expect(names()).toEqual(['a.png'])
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('uses another text for the rejections', () => {
      render(<Demo accept=".pdf" labels={{ rejection: ({ file: item }) => `No: ${item.name}` }} />)
      choose([file('a.txt')])
      expect(screen.getByRole('alert')).toHaveTextContent('No: a.txt')
    })

    it('clears the messages with the next choice', () => {
      render(<Demo accept="image/*" />)
      choose([file('a.txt')])
      expect(screen.getByRole('alert')).toBeInTheDocument()
      choose([file('b.png', 'image/png')])
      expect(screen.queryByRole('alert')).toBeNull()
    })

    it('keeps the current file when the new one is rejected', () => {
      render(<Demo accept="image/*" />)
      choose([file('a.png', 'image/png')])
      choose([file('b.txt', 'text/plain')])
      expect(names()).toEqual(['a.png'])
    })
  })

  describe('removing files', () => {
    it('removes a file with its button and gives the focus back to the input', async () => {
      const onValueChange = vi.fn()
      render(
        <Demo
          defaultValue={[file('a.txt'), file('b.txt')]}
          multiple
          onValueChange={onValueChange}
        />,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Remove a.txt' }))
      expect(names()).toEqual(['b.txt'])
      expect(onValueChange).toHaveBeenCalledWith([expect.objectContaining({ name: 'b.txt' })])
      expect(input()).toHaveFocus()
    })

    it('uses another text for the prompt and for the size of the files', () => {
      render(
        <Demo
          defaultValue={[file('a.txt')]}
          labels={{ fileSize: (bytes) => `${bytes} octetos`, prompt: 'Suelta aquí' }}
        />,
      )
      expect(input()).toHaveAccessibleDescription('Suelta aquí')
      expect(document.querySelector('[data-plume-fileupload-size]')).toHaveTextContent('octetos')
    })

    it('uses another label for the buttons', () => {
      render(<Demo defaultValue={[file('a.txt')]} labels={{ remove: (item) => `Quitar ${item.name}` }} />)
      expect(screen.getByRole('button', { name: 'Quitar a.txt' })).toBeInTheDocument()
    })

    it('has no buttons when it is disabled or read only', () => {
      const { rerender } = render(<Demo defaultValue={[file('a.txt')]} disabled />)
      expect(screen.queryByRole('button')).toBeNull()
      rerender(<Demo defaultValue={[file('a.txt')]} readOnly />)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  describe('dragging', () => {
    it('marks the dropzone while files are over it', () => {
      const { container } = render(<Demo />)
      fireEvent.dragEnter(dropzone())
      expect(container.firstChild).toHaveAttribute('data-dragging')
      leave(document.body)
      expect(container.firstChild).not.toHaveAttribute('data-dragging')
    })

    it('stays marked while the pointer moves inside it', () => {
      const { container } = render(<Demo />)
      fireEvent.dragOver(dropzone())
      leave(input())
      expect(container.firstChild).toHaveAttribute('data-dragging')
    })

    it('takes the dropped files', () => {
      const { container } = render(<Demo multiple />)
      fireEvent.dragOver(dropzone())
      fireEvent.drop(dropzone(), { dataTransfer: { files: [file('dropped.txt')] } })
      expect(names()).toEqual(['dropped.txt'])
      expect(container.firstChild).not.toHaveAttribute('data-dragging')
    })

    it('ignores drops when it is disabled', () => {
      const { container } = render(<Demo disabled />)
      fireEvent.dragOver(dropzone())
      expect(container.firstChild).not.toHaveAttribute('data-dragging')
      fireEvent.drop(dropzone(), { dataTransfer: { files: [file('dropped.txt')] } })
      expect(names()).toEqual([])
    })
  })

  describe('appearance', () => {
    it('applies the base, variant and size classes', () => {
      const { container } = render(<Demo size="lg" variant="filled" />)
      expect(container.firstChild).toHaveClass('fileupload', 'filled', 'lg')
      expect(dropzone()).toHaveClass('dropzone')
    })

    it('applies the bordered variant', () => {
      const { container } = render(<Demo variant="bordered" />)
      expect(container.firstChild).toHaveClass('bordered')
    })

    it('defaults to an outlined, medium upload', () => {
      const { container } = render(<Demo />)
      expect(container.firstChild).toHaveClass('fileupload', 'outline', 'md')
    })

    it('marks it as invalid', () => {
      const { container } = render(<Demo aria-invalid />)
      expect(container.firstChild).toHaveClass('invalid')
      expect(input()).toHaveAttribute('aria-invalid', 'true')
    })

    it('marks it as disabled', () => {
      const { container } = render(<Demo disabled />)
      expect(container.firstChild).toHaveAttribute('data-disabled')
    })

    it('exposes the color scheme as CSS variables', () => {
      const { container } = render(<Demo colorScheme="success" />)
      expect(container.firstChild).toHaveStyle(
        '--fileupload-solid: var(--plume-color-success-solid)',
      )
    })

    it('lets style override a variable', () => {
      const { container } = render(
        <Demo style={{ '--fileupload-solid': 'red' } as React.CSSProperties} />,
      )
      expect(container.firstChild).toHaveStyle('--fileupload-solid: red')
    })

    it('drops the Plume classes when it is unstyled and keeps the class of the user', () => {
      const { container } = render(
        <Demo className="root" defaultValue={[file('a.txt')]} variant="unstyled" />,
      )
      expect(container.firstChild).toHaveAttribute('class', 'root')
      expect(dropzone()).not.toHaveAttribute('class')
      expect(screen.getByRole('list')).not.toHaveAttribute('class')
      expect(screen.getByText('a.txt').closest('li')).not.toHaveAttribute('class')
    })
  })

  describe('progress', () => {
    const uploading = file('big.zip')

    it('shows no progress bar without the progress prop', () => {
      render(<Demo defaultValue={[uploading]} />)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('shows a progress bar for the files that have a value', () => {
      render(
        <Demo
          defaultValue={[uploading, file('done.txt')]}
          progress={(current) => (current === uploading ? 40 : undefined)}
        />,
      )
      const bars = screen.getAllByRole('progressbar')
      expect(bars).toHaveLength(1)
      expect(bars[0]).toHaveAttribute('aria-valuenow', '40')
      expect(bars[0]).toHaveAttribute('aria-valuemax', '100')
    })

    it('names the bar after the file and lets labels.progress translate it', () => {
      const { rerender } = render(<Demo defaultValue={[uploading]} progress={() => 10} />)
      expect(screen.getByRole('progressbar', { name: 'Uploading big.zip' })).toBeInTheDocument()
      rerender(
        <Demo
          defaultValue={[uploading]}
          progress={() => 10}
          labels={{ progress: (current) => `Subiendo ${current.name}` }}
        />,
      )
      expect(screen.getByRole('progressbar', { name: 'Subiendo big.zip' })).toBeInTheDocument()
    })

    it('writes the percentage next to the bar', () => {
      render(<Demo defaultValue={[uploading]} progress={() => 40} />)
      expect(document.querySelector('[data-plume-progressbar-value]')).toHaveTextContent('40%')
    })

    it('keeps the value between 0 and 100', () => {
      const { rerender } = render(<Demo defaultValue={[uploading]} progress={() => 150} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      rerender(<Demo defaultValue={[uploading]} progress={() => -20} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })

    it('colors the bar with the color scheme and turns it to success at 100', () => {
      const { rerender } = render(
        <Demo colorScheme="warning" defaultValue={[uploading]} progress={() => 99} />,
      )
      expect(screen.getByRole('progressbar')).toHaveStyle(
        '--progressbar-solid: var(--plume-color-warning-solid)',
      )
      rerender(<Demo colorScheme="warning" defaultValue={[uploading]} progress={() => 100} />)
      expect(screen.getByRole('progressbar')).toHaveStyle(
        '--progressbar-solid: var(--plume-color-success-solid)',
      )
    })

    it('has no Plume class when it is unstyled', () => {
      render(<Demo defaultValue={[uploading]} progress={() => 50} variant="unstyled" />)
      expect(screen.getByRole('progressbar')).not.toHaveClass('progressbar')
    })
  })
})
