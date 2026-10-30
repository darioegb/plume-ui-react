import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadError,
  FileUploadErrors,
  FileUploadIcon,
  FileUploadInput,
  FileUploadItem,
  FileUploadList,
  FileUploadName,
  FileUploadProgress,
  FileUploadPrompt,
  FileUploadRemove,
  FileUploadSize,
} from '..'
import { ProgressBarIndicator } from '../../progressbar'

const file = (name: string, type = 'text/plain', size = 10): File =>
  new File([new Uint8Array(size)], name, { type })

const input = (): HTMLInputElement =>
  document.querySelector('input[type="file"]') as HTMLInputElement

describe('FileUpload parts', () => {
  it('renders the default composition from the parts, with a data attribute each', () => {
    render(
      <FileUpload
        accept=".png"
        aria-label="Documents"
        defaultValue={[file('a.png')]}
        progress={() => 40}
      />,
    )
    fireEvent.change(input(), { target: { files: [file('b.txt')] } })
    for (const part of [
      'dropzone',
      'input',
      'prompt',
      'list',
      'item',
      'name',
      'size',
      'remove',
      'errors',
      'error',
    ]) {
      expect(document.querySelector(`[data-plume-fileupload-${part}]`)).not.toBeNull()
    }
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders the parts as written, in the order given', () => {
    const { container } = render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]}>
        <FileUploadList />
        <FileUploadDropzone>
          <FileUploadPrompt>Drop here</FileUploadPrompt>
          <FileUploadInput />
        </FileUploadDropzone>
      </FileUpload>,
    )
    const order = Array.from(container.firstElementChild?.children ?? []).map((element) =>
      element.getAttribute('data-plume-fileupload-list') === null ? 'dropzone' : 'list',
    )
    expect(order).toEqual(['list', 'dropzone'])
    expect(screen.getByText('Drop here')).toBeInTheDocument()
    expect(screen.getByText('a.txt')).toBeInTheDocument()
  })

  it('omits the parts that are not given', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]}>
        <FileUploadDropzone />
      </FileUpload>,
    )
    expect(document.querySelector('[data-plume-fileupload-list]')).toBeNull()
  })

  it('fills a dropzone without children with the input and the prompt', () => {
    render(
      <FileUpload aria-label="Documents">
        <FileUploadDropzone />
      </FileUpload>,
    )
    expect(input()).toBeInTheDocument()
    expect(screen.getByText('Drag files here, or press to choose them')).toBeInTheDocument()
  })

  it('describes the input with the prompt and the description of the user', () => {
    render(
      <FileUpload aria-describedby="hint" aria-label="Documents">
        <FileUploadDropzone>
          <FileUploadInput />
          <FileUploadPrompt>Text</FileUploadPrompt>
        </FileUploadDropzone>
      </FileUpload>,
    )
    const prompt = screen.getByText('Text')
    expect(input()).toHaveAttribute('aria-describedby', `${prompt.id} hint`)
  })

  it('lets the input take its own attributes and class', () => {
    render(
      <FileUpload aria-label="Documents">
        <FileUploadDropzone>
          <FileUploadInput aria-describedby="own" aria-label="Own" className="in" id="own-id" />
        </FileUploadDropzone>
      </FileUpload>,
    )
    expect(input()).toHaveClass('in')
    expect(input()).toHaveAttribute('aria-label', 'Own')
    expect(input()).toHaveAttribute('id', 'own-id')
    expect(input().getAttribute('aria-describedby')).toMatch(/ own$/)
  })

  it('sends the ref of the root and of the input to the input', () => {
    const rootRef = createRef<HTMLInputElement>()
    const inputRef = createRef<HTMLInputElement>()
    render(
      <FileUpload aria-label="Documents" ref={rootRef}>
        <FileUploadDropzone>
          <FileUploadInput ref={inputRef} />
        </FileUploadDropzone>
      </FileUpload>,
    )
    expect(rootRef.current).toBe(input())
    expect(inputRef.current).toBe(input())
  })

  it('shows an upload icon in the default dropzone, hidden from assistive technology', () => {
    render(<FileUpload aria-label="Documents" />)
    const icon = document.querySelector('[data-plume-fileupload-icon]')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon?.querySelector('svg')).not.toBeNull()
  })

  it('renders the children of FileUploadIcon, with its className, style and ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(
      <FileUpload aria-label="Documents">
        <FileUploadDropzone>
          <FileUploadInput />
          <FileUploadIcon className="ic" ref={ref} style={{ color: 'red' }}>
            ★
          </FileUploadIcon>
          <FileUploadPrompt />
        </FileUploadDropzone>
      </FileUpload>,
    )
    expect(ref.current).toHaveTextContent('★')
    expect(ref.current).toHaveClass('ic')
    expect(ref.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    expect(ref.current?.querySelector('svg')).toBeNull()
  })

  it('sends the className, the style and the ref of every part to its element', () => {
    const refs = {
      dropzone: createRef<HTMLDivElement>(),
      errors: createRef<HTMLUListElement>(),
      item: createRef<HTMLLIElement>(),
      list: createRef<HTMLUListElement>(),
      name: createRef<HTMLSpanElement>(),
      progress: createRef<HTMLDivElement>(),
      prompt: createRef<HTMLSpanElement>(),
      remove: createRef<HTMLButtonElement>(),
      size: createRef<HTMLSpanElement>(),
    }
    const a = file('a.txt')
    render(
      <FileUpload accept=".png" aria-label="Documents" defaultValue={[a]} progress={() => 30}>
        <FileUploadDropzone className="dz" ref={refs.dropzone} style={{ color: 'red' }}>
          <FileUploadInput />
          <FileUploadPrompt className="pr" ref={refs.prompt} style={{ color: 'red' }} />
        </FileUploadDropzone>
        <FileUploadList className="ls" ref={refs.list} style={{ color: 'red' }}>
          {(current) => (
            <FileUploadItem className="it" file={current} ref={refs.item} style={{ color: 'red' }}>
              <FileUploadName className="nm" ref={refs.name} style={{ color: 'red' }} />
              <FileUploadSize className="sz" ref={refs.size} style={{ color: 'red' }} />
              <FileUploadRemove className="rm" ref={refs.remove} style={{ color: 'red' }} />
              <FileUploadProgress className="pg" ref={refs.progress} style={{ color: 'red' }} />
            </FileUploadItem>
          )}
        </FileUploadList>
        <FileUploadErrors className="er" ref={refs.errors} style={{ color: 'red' }} />
      </FileUpload>,
    )
    fireEvent.change(input(), { target: { files: [file('b.txt')] } })
    for (const [name, ref] of Object.entries(refs)) {
      expect(ref.current, name).not.toBeNull()
    }
    for (const name of ['dropzone', 'errors', 'item', 'list', 'name', 'prompt', 'remove', 'size']) {
      expect(refs[name as keyof typeof refs].current, name).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    }
    expect(refs.progress.current).toHaveAttribute('role', 'progressbar')
    expect(refs.progress.current?.closest('[data-plume-progressbar-field]')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    })
    expect(refs.dropzone.current).toHaveClass('dz')
    expect(refs.prompt.current).toHaveClass('pr')
    expect(refs.list.current).toHaveClass('ls')
    expect(refs.item.current).toHaveClass('it')
    expect(refs.name.current).toHaveClass('nm')
    expect(refs.size.current).toHaveClass('sz')
    expect(refs.remove.current).toHaveClass('rm')
    expect(refs.progress.current?.closest('[data-plume-progressbar-field]')).toHaveClass('pg')
    expect(refs.errors.current).toHaveClass('er')
  })

  it('keeps the Plume classes of the parts, and drops them when it is unstyled', () => {
    const { rerender } = render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]} progress={() => 30} />,
    )
    expect(document.querySelector('[data-plume-fileupload-dropzone]')).toHaveClass('dropzone')
    expect(screen.getByRole('list')).toHaveClass('list')
    expect(screen.getByText('a.txt').closest('li')).toHaveClass('item')
    expect(document.querySelector('[data-plume-fileupload-size]')).toHaveClass('fileSize')
    expect(screen.getByRole('button')).toHaveClass('remove')
    rerender(
      <FileUpload
        aria-label="Documents"
        defaultValue={[file('a.txt')]}
        progress={() => 30}
        variant="unstyled"
      />,
    )
    for (const part of ['dropzone', 'list', 'item', 'size', 'remove']) {
      expect(document.querySelector(`[data-plume-fileupload-${part}]`)).not.toHaveAttribute('class')
    }
    expect(screen.getByRole('progressbar')).not.toHaveClass('progressbar')
  })

  it('exposes the state of the dropzone and of the input as data attributes', () => {
    render(<FileUpload aria-invalid disabled aria-label="Documents" />)
    const dropzone = document.querySelector('[data-plume-fileupload-dropzone]')
    expect(dropzone).toHaveAttribute('data-disabled')
    expect(dropzone).toHaveAttribute('data-invalid')
    expect(input()).toHaveAttribute('data-disabled')
    expect(input()).toHaveAttribute('data-invalid')
    fireEvent.dragEnter(dropzone as Element)
    expect(dropzone).not.toHaveAttribute('data-dragging')
  })

  it('marks the dropzone while files are dragged over it', () => {
    render(<FileUpload aria-label="Documents" />)
    const dropzone = document.querySelector('[data-plume-fileupload-dropzone]') as Element
    fireEvent.dragEnter(dropzone)
    expect(dropzone).toHaveAttribute('data-dragging')
  })

  it('renders the list with a function that gives each file', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt'), file('b.txt')]} multiple>
        <FileUploadDropzone />
        <FileUploadList>
          {(current, position) => (
            <FileUploadItem file={current}>
              <FileUploadName>
                {position + 1}. {current.name}
              </FileUploadName>
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      '1. a.txt',
      '2. b.txt',
    ])
  })

  it('renders the children of the list as written', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]}>
        <FileUploadList>
          <li>Custom</li>
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('renders nothing for the list while there are no files', () => {
    render(
      <FileUpload aria-label="Documents">
        <FileUploadList />
      </FileUpload>,
    )
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('gives the item its file, and replaces the name, the size and the remove icon', async () => {
    const onValueChange = vi.fn()
    render(
      <FileUpload
        aria-label="Documents"
        defaultValue={[file('a.txt', 'text/plain', 2048)]}
        onValueChange={onValueChange}
      >
        <FileUploadList>
          {(current) => (
            <FileUploadItem file={current}>
              <FileUploadName>Custom name</FileUploadName>
              <FileUploadSize>big</FileUploadSize>
              <FileUploadRemove label="Delete it">x</FileUploadRemove>
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.getByText('Custom name')).toBeInTheDocument()
    expect(screen.getByText('big')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Delete it' }))
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('takes the texts of the item from the labels', () => {
    render(
      <FileUpload
        aria-label="Documents"
        defaultValue={[file('a.txt', 'text/plain', 5)]}
        labels={{
          fileSize: (bytes) => `${bytes} bytes`,
          remove: (current) => `Delete ${current.name}`,
        }}
      >
        <FileUploadList>
          {(current) => (
            <FileUploadItem file={current}>
              <FileUploadSize />
              <FileUploadRemove />
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.getByText('5 bytes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete a.txt' })).toBeInTheDocument()
  })

  it('renders no remove button when it is read only, and no progress without a value', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]} readOnly>
        <FileUploadList>
          {(current) => (
            <FileUploadItem file={current}>
              <FileUploadRemove />
              <FileUploadProgress />
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('names the progress bar, and lets the part change the name', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]} progress={() => 100}>
        <FileUploadList>
          {(current) => (
            <FileUploadItem file={current}>
              <FileUploadProgress aria-label="Done" />
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    const bar = screen.getByRole('progressbar', { name: 'Done' })
    expect(bar).toHaveStyle('--progressbar-solid: var(--plume-color-success-solid)')
  })

  it('puts the children of the progress inside the bar', () => {
    render(
      <FileUpload aria-label="Documents" defaultValue={[file('a.txt')]} progress={() => 50}>
        <FileUploadList>
          {(current) => (
            <FileUploadItem file={current}>
              <FileUploadProgress>
                <ProgressBarIndicator className="ind" />
              </FileUploadProgress>
            </FileUploadItem>
          )}
        </FileUploadList>
      </FileUpload>,
    )
    expect(screen.getByRole('progressbar').firstElementChild).toHaveClass('ind')
  })

  it('renders the errors with a function, and replaces the text of an error', () => {
    render(
      <FileUpload accept=".png" aria-label="Documents">
        <FileUploadDropzone />
        <FileUploadErrors>
          {(rejection, position) => (
            <FileUploadError rejection={rejection}>
              {position + 1}: {rejection.reason}
            </FileUploadError>
          )}
        </FileUploadErrors>
      </FileUpload>,
    )
    fireEvent.change(input(), { target: { files: [file('b.txt')] } })
    expect(screen.getByRole('alert')).toHaveTextContent('1: type')
  })

  it('renders the children of the errors as written', () => {
    render(
      <FileUpload accept=".png" aria-label="Documents">
        <FileUploadDropzone />
        <FileUploadErrors>
          <li>Nope</li>
        </FileUploadErrors>
      </FileUpload>,
    )
    expect(screen.queryByRole('alert')).toBeNull()
    fireEvent.change(input(), { target: { files: [file('b.txt')] } })
    expect(screen.getByRole('alert')).toHaveTextContent('Nope')
  })

  it('uses the texts of the labels for the prompt and the errors', () => {
    render(
      <FileUpload
        accept=".png"
        aria-label="Documentos"
        labels={{ prompt: 'Arrastra', rejection: ({ file: rejected }) => `No: ${rejected.name}` }}
      >
        <FileUploadDropzone />
        <FileUploadErrors />
      </FileUpload>,
    )
    expect(screen.getByText('Arrastra')).toBeInTheDocument()
    fireEvent.change(input(), { target: { files: [file('b.txt')] } })
    expect(screen.getByRole('alert')).toHaveTextContent('No: b.txt')
  })

  it.each([
    ['FileUploadDropzone', <FileUploadDropzone key="a" />],
    ['FileUploadErrors', <FileUploadErrors key="b" />],
    ['FileUploadIcon', <FileUploadIcon key="f" />],
    ['FileUploadInput', <FileUploadInput key="c" />],
    ['FileUploadList', <FileUploadList key="d" />],
    ['FileUploadPrompt', <FileUploadPrompt key="e" />],
  ])('throws when %s is outside a FileUpload', (_name, part) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(part)).toThrow('must be rendered inside a <FileUpload>')
    error.mockRestore()
  })

  it.each([
    ['FileUploadName', <FileUploadName key="a" />],
    ['FileUploadSize', <FileUploadSize key="b" />],
    ['FileUploadRemove', <FileUploadRemove key="c" />],
    ['FileUploadProgress', <FileUploadProgress key="d" />],
  ])('throws when %s is outside a FileUploadItem', (_name, part) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <FileUpload aria-label="Documents">
          <FileUploadDropzone />
          {part}
        </FileUpload>,
      ),
    ).toThrow('must be rendered inside a <FileUploadItem>')
    error.mockRestore()
  })

  it('throws when an item is outside a FileUpload', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<FileUploadItem file={file('a.txt')} />)).toThrow(
      'must be rendered inside a <FileUpload>',
    )
    error.mockRestore()
  })

  it('throws when an error is outside a FileUpload', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(<FileUploadError rejection={{ file: file('a.txt'), reason: 'type' }} />),
    ).toThrow('must be rendered inside a <FileUpload>')
    error.mockRestore()
  })
})
