import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { useForm } from 'react-hook-form'
import { Field } from '../../field'
import { Textarea, TextareaCount, TextareaField, TextareaStatus } from '..'

const count = (): HTMLElement =>
  document.querySelector('[data-plume-textarea-count]') as HTMLElement
const group = (): HTMLElement =>
  document.querySelector('[data-plume-textarea-group]') as HTMLElement

describe('Textarea parts', () => {
  it('renders its parts in the order they are given', () => {
    render(
      <Textarea>
        <TextareaCount />
        <TextareaField aria-label="Bio" />
      </Textarea>,
    )
    const children = Array.from(group().children)
    expect(children[0]).toBe(count())
    expect(children[1]).toBe(screen.getByRole('textbox'))
  })

  it('renders only the parts that are given', () => {
    render(
      <Textarea>
        <TextareaField aria-label="Bio" />
      </Textarea>,
    )
    expect(count()).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  it('renders the default composition with the same parts when showCount is on', () => {
    render(<Textarea aria-label="Bio" showCount />)
    expect(group().querySelector('[data-plume-textarea-field]')).toBe(screen.getByRole('textbox'))
    expect(group().querySelector('[data-plume-textarea-count]')).toBe(count())
    expect(group().querySelector('[data-plume-textarea-status]')).toBe(screen.getByRole('status'))
  })

  it('renders the bare textarea without parts or count', () => {
    render(<Textarea aria-label="Bio" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('data-plume-textarea-field')
    expect(document.querySelector('[data-plume-textarea-group]')).toBeNull()
  })

  it('counts what is typed in the field and describes it with the count', async () => {
    render(
      <Textarea maxLength={20}>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
        <TextareaStatus />
      </Textarea>,
    )
    expect(count()).toHaveTextContent('0 / 20')
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    expect(count()).toHaveTextContent('5 / 20')
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toContain(count().id)
  })

  it('starts from the default value and the limit given to the root', () => {
    render(
      <Textarea defaultValue="Hello" maxLength={8}>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
        <TextareaStatus />
      </Textarea>,
    )
    expect(count()).toHaveTextContent('5 / 8')
    expect(screen.getByRole('status')).toHaveTextContent('3 characters left')
  })

  it('counts with the value and the limit given to the field', () => {
    const { rerender } = render(
      <Textarea>
        <TextareaField aria-label="Bio" maxLength={10} value="abc" />
        <TextareaCount />
      </Textarea>,
    )
    expect(count()).toHaveTextContent('3 / 10')
    rerender(
      <Textarea>
        <TextareaField aria-label="Bio" maxLength={10} value="abcdef" />
        <TextareaCount />
      </Textarea>,
    )
    expect(count()).toHaveTextContent('6 / 10')
  })

  it('starts from the default value given to the field', () => {
    render(
      <Textarea>
        <TextareaField aria-label="Bio" defaultValue="Hi there" />
        <TextareaCount />
      </Textarea>,
    )
    expect(count()).toHaveTextContent('8')
  })

  it('does not reset the count when the field has a default value and was typed in', async () => {
    render(
      <Textarea>
        <TextareaField aria-label="Bio" defaultValue="Hi" />
        <TextareaCount />
      </Textarea>,
    )
    await userEvent.type(screen.getByRole('textbox'), '!!')
    expect(count()).toHaveTextContent('4')
  })

  it('lets the count show another content', () => {
    render(
      <Textarea>
        <TextareaField aria-label="Bio" />
        <TextareaCount>custom</TextareaCount>
      </Textarea>,
    )
    expect(count()).toHaveTextContent('custom')
  })

  it('marks the count when the limit is reached', () => {
    render(
      <Textarea defaultValue="abc" maxLength={3}>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
      </Textarea>,
    )
    expect(count()).toHaveAttribute('data-limit')
  })

  it('removes the link to the count when the count goes away', () => {
    const { rerender } = render(
      <Textarea>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby')
    rerender(
      <Textarea>
        <TextareaField aria-label="Bio" />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
  })

  it('takes the look and the state from the root', () => {
    render(
      <Textarea disabled resize="none" shape="pill" size="lg" variant="filled">
        <TextareaField aria-label="Bio" />
        <TextareaCount />
      </Textarea>,
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('base', 'filled', 'lg', 'pill', 'none', 'disabled')
    expect(textarea).toHaveAttribute('data-disabled')
    expect(count()).toHaveAttribute('data-disabled')
    expect(group()).toHaveAttribute('data-disabled')
  })

  it('lets the field take its own disabled over the root', () => {
    render(
      <Textarea>
        <TextareaField aria-label="Bio" disabled />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('marks the parts invalid and uses the error color', () => {
    render(
      <Textarea aria-invalid>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid')
    expect(screen.getByRole('textbox')).toHaveClass('invalid')
    expect(count()).toHaveAttribute('data-invalid')
    expect(group()).toHaveStyle('--textarea-color: var(--plume-color-error-text)')
  })

  it('marks a field that is invalid on its own', () => {
    render(
      <Textarea>
        <TextareaField aria-invalid aria-label="Bio" />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid')
  })

  it('puts className and style of the root on the wrapper', () => {
    render(
      <Textarea className="mine" style={{ margin: 4 }}>
        <TextareaField aria-label="Bio" />
      </Textarea>,
    )
    expect(group()).toHaveClass('mine')
    expect(group()).toHaveStyle({ margin: '4px' })
    expect(screen.getByRole('textbox')).not.toHaveClass('mine')
  })

  it('points the ref of the root at the textarea when it has parts', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(
      <Textarea ref={ref}>
        <TextareaField aria-label="Bio" />
        <TextareaCount />
      </Textarea>,
    )
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('sets the ref of the root and the ref of the field', () => {
    const rootRef = createRef<HTMLTextAreaElement>()
    const fieldRef = vi.fn()
    render(
      <Textarea ref={rootRef}>
        <TextareaField aria-label="Bio" ref={fieldRef} />
      </Textarea>,
    )
    expect(rootRef.current).toBe(screen.getByRole('textbox'))
    expect(fieldRef).toHaveBeenCalledWith(screen.getByRole('textbox'))
  })

  it('leaves the ref of the root empty when there is no field', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(
      <Textarea ref={ref}>
        <TextareaCount />
      </Textarea>,
    )
    expect(ref.current).toBeNull()
  })

  it('puts className, style and ref of each part on its element', () => {
    const fieldRef = createRef<HTMLTextAreaElement>()
    const countRef = createRef<HTMLSpanElement>()
    const statusRef = createRef<HTMLOutputElement>()
    render(
      <Textarea maxLength={5}>
        <TextareaField aria-label="Bio" className="f" ref={fieldRef} style={{ margin: 1 }} />
        <TextareaCount className="c" ref={countRef} style={{ margin: 2 }} />
        <TextareaStatus className="s" ref={statusRef} style={{ margin: 3 }} />
      </Textarea>,
    )
    expect(fieldRef.current).toBe(screen.getByRole('textbox'))
    expect(screen.getByRole('textbox')).toHaveClass('f', 'base')
    expect(screen.getByRole('textbox')).toHaveStyle({ margin: '1px' })
    expect(countRef.current).toBe(count())
    expect(count()).toHaveClass('c', 'count')
    expect(count()).toHaveStyle({ margin: '2px' })
    expect(statusRef.current).toBe(screen.getByRole('status'))
    expect(screen.getByRole('status')).toHaveClass('s')
    expect(screen.getByRole('status')).toHaveStyle({ margin: '3px', position: 'absolute' })
  })

  it('drops the Plume classes of every part when unstyled', () => {
    render(
      <Textarea variant="unstyled">
        <TextareaField aria-label="Bio" className="f" />
        <TextareaCount className="c" />
        <TextareaStatus />
      </Textarea>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('class', 'f')
    expect(count()).toHaveAttribute('class', 'c')
    expect(screen.getByRole('status')).not.toHaveAttribute('class')
  })

  it('throws outside the Textarea', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<TextareaField />)).toThrow(
      'TextareaField must be used within a <Textarea>',
    )
    expect(() => render(<TextareaCount />)).toThrow(
      'TextareaCount must be used within a <Textarea>',
    )
    expect(() => render(<TextareaStatus />)).toThrow(
      'TextareaStatus must be used within a <Textarea>',
    )
    error.mockRestore()
  })

  it('calls the onChange given to the root and the one given to the field', () => {
    const onRoot = vi.fn()
    const onField = vi.fn()
    const { rerender } = render(
      <Textarea onChange={onRoot}>
        <TextareaField aria-label="Bio" />
      </Textarea>,
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } })
    expect(onRoot).toHaveBeenCalledTimes(1)
    rerender(
      <Textarea onChange={onRoot}>
        <TextareaField aria-label="Bio" onChange={onField} />
      </Textarea>,
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ab' } })
    expect(onField).toHaveBeenCalledTimes(1)
    expect(onRoot).toHaveBeenCalledTimes(1)
  })

  it('composes with Field', () => {
    render(
      <Field errorText="Too short" helperText="Say something" label="Bio" required>
        <Textarea maxLength={50}>
          <TextareaField />
          <TextareaCount />
        </Textarea>
      </Field>,
    )
    const textarea = screen.getByRole('textbox', { name: /Bio/ })
    expect(textarea).toBeRequired()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    const described = textarea.getAttribute('aria-describedby') ?? ''
    expect(described.split(' ')).toContain(count().id)
    expect(textarea).toHaveAccessibleDescription(/Too short Say something/)
  })

  it.each(['root', 'field'])('works with react-hook-form registered on the %s', async (target) => {
    interface Values {
      bio: string
    }
    const onSubmit = vi.fn()
    function Form(): React.ReactNode {
      const { register, handleSubmit } = useForm<Values>()
      const registered = register('bio')
      return (
        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <Textarea {...(target === 'root' ? registered : {})}>
            <TextareaField aria-label="Bio" {...(target === 'field' ? registered : {})} />
            <TextareaCount />
          </Textarea>
          <button type="submit">Submit</button>
        </form>
      )
    }
    render(<Form />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'typed' } })
    expect(count()).toHaveTextContent('5')
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ bio: 'typed' }, expect.anything())
    })
  })
})
