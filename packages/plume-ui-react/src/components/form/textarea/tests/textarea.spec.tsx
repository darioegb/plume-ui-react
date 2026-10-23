import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Textarea } from '..'

describe('Textarea component', () => {
  it('renders a textbox with three rows by default', () => {
    render(<Textarea aria-label="Bio" />)
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('rows', '3')
  })

  it('applies the rows, placeholder and length attributes', () => {
    render(
      <Textarea aria-label="Bio" maxLength={200} minLength={10} placeholder="Tell us" rows={6} />,
    )
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '6')
    expect(textarea).toHaveAttribute('placeholder', 'Tell us')
    expect(textarea).toHaveAttribute('maxlength', '200')
    expect(textarea).toHaveAttribute('minlength', '10')
  })

  it('is uncontrolled with defaultValue', () => {
    render(<Textarea aria-label="Bio" defaultValue="Hello" />)
    expect(screen.getByRole('textbox')).toHaveValue('Hello')
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [value, setValue] = useState('')
      return (
        <Textarea
          aria-label="Bio"
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      )
    }
    render(<Controlled />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'typed' } })
    expect(screen.getByRole('textbox')).toHaveValue('typed')
  })

  it('calls onBlur and onFocus', () => {
    const onBlur = vi.fn()
    const onFocus = vi.fn()
    render(<Textarea aria-label="Bio" onBlur={onBlur} onFocus={onFocus} />)
    fireEvent.focus(screen.getByRole('textbox'))
    fireEvent.blur(screen.getByRole('textbox'))
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('disables the textarea and marks it', () => {
    render(<Textarea aria-label="Bio" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('textbox')).toHaveClass('disabled')
  })

  it('can be read only and required', () => {
    render(<Textarea aria-label="Bio" readOnly required />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  describe('appearance', () => {
    it('applies the base, variant, size, shape and resize classes', () => {
      render(<Textarea aria-label="Bio" resize="none" shape="pill" size="lg" variant="filled" />)
      expect(screen.getByRole('textbox')).toHaveClass('base', 'filled', 'lg', 'pill', 'none')
    })

    it('defaults to an outlined, rounded, medium textarea that resizes vertically', () => {
      render(<Textarea aria-label="Bio" />)
      expect(screen.getByRole('textbox')).toHaveClass(
        'base',
        'outline',
        'md',
        'rounded',
        'vertical',
      )
    })

    it('exposes the color scheme as a CSS variable', () => {
      render(<Textarea aria-label="Bio" colorScheme="success" />)
      expect(screen.getByRole('textbox')).toHaveStyle(
        '--textarea-color: var(--plume-color-success-text)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Textarea aria-invalid aria-label="Bio" />)
      expect(screen.getByRole('textbox')).toHaveClass('invalid')
      expect(screen.getByRole('textbox')).toHaveStyle(
        '--textarea-color: var(--plume-color-error-text)',
      )
    })

    it('keeps className and lets style override the variable', () => {
      render(
        <Textarea
          aria-label="Bio"
          className="custom"
          style={{ '--textarea-color': 'red' } as React.CSSProperties}
        />,
      )
      expect(screen.getByRole('textbox')).toHaveClass('custom')
      expect(screen.getByRole('textbox')).toHaveStyle('--textarea-color: red')
    })

    it('drops the Plume classes when unstyled', () => {
      render(<Textarea aria-invalid aria-label="Bio" className="custom" variant="unstyled" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea.className).toBe('custom')
    })
  })

  it('forwards the ref to the textarea', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea aria-label="Bio" ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('gets the id, description, invalid state and required from a Field', () => {
    render(
      <Field errorText="Too short" helperText="Say something" label="Bio" required>
        <Textarea />
      </Field>,
    )
    const textarea = screen.getByRole('textbox', { name: /Bio/ })
    expect(textarea).toBeRequired()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAccessibleDescription('Too short Say something')
  })
  describe('character count', () => {
    const count = (): HTMLElement =>
      document.querySelector('[data-plume-textarea-count]') as HTMLElement
    const status = (): HTMLElement => screen.getByRole('status')

    it('shows no count by default', () => {
      render(<Textarea aria-label="Bio" />)
      expect(count()).toBeNull()
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby')
    })

    it('shows the number of characters', async () => {
      render(<Textarea aria-label="Bio" showCount />)
      expect(count()).toHaveTextContent('0')
      await userEvent.type(screen.getByRole('textbox'), 'Hello')
      expect(count()).toHaveTextContent('5')
    })

    it('starts from the default value', () => {
      render(<Textarea aria-label="Bio" defaultValue="Hello" showCount />)
      expect(count()).toHaveTextContent('5')
    })

    it('follows the value when it is controlled', () => {
      const { rerender } = render(<Textarea aria-label="Bio" showCount value="Hi" />)
      expect(count()).toHaveTextContent('2')
      rerender(<Textarea aria-label="Bio" showCount value="Hello there" />)
      expect(count()).toHaveTextContent('11')
    })

    it('shows the limit next to the count', async () => {
      render(<Textarea aria-label="Bio" maxLength={20} showCount />)
      expect(count()).toHaveTextContent('0 / 20')
      await userEvent.type(screen.getByRole('textbox'), 'abc')
      expect(count()).toHaveTextContent('3 / 20')
    })

    it('calls the onChange of the user', async () => {
      const onChange = vi.fn()
      render(<Textarea aria-label="Bio" onChange={onChange} showCount />)
      await userEvent.type(screen.getByRole('textbox'), 'ab')
      expect(onChange).toHaveBeenCalledTimes(2)
    })

    it('describes the textarea with the count, next to what it already had', () => {
      render(<Textarea aria-describedby="hint" aria-label="Bio" showCount />)
      const described = screen.getByRole('textbox').getAttribute('aria-describedby') ?? ''
      expect(described.split(' ')).toContain('hint')
      expect(described.split(' ')).toContain(count().id)
    })

    it('marks the count when the limit is reached', async () => {
      render(<Textarea aria-label="Bio" maxLength={3} showCount />)
      expect(count()).not.toHaveAttribute('data-limit')
      await userEvent.type(screen.getByRole('textbox'), 'abc')
      expect(count()).toHaveAttribute('data-limit')
    })

    it('says nothing while there is room, and how many are left near the limit', () => {
      render(<Textarea aria-label="Bio" maxLength={100} showCount />)
      expect(status()).toBeEmptyDOMElement()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(85) } })
      expect(status()).toBeEmptyDOMElement()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(92) } })
      expect(status()).toHaveTextContent('8 characters left')
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a'.repeat(99) } })
      expect(status()).toHaveTextContent('1 character left')
    })

    it('says nothing without a limit', () => {
      render(<Textarea aria-label="Bio" defaultValue="Hello" showCount />)
      expect(status()).toBeEmptyDOMElement()
    })

    it('uses another text for the count and for what is left', () => {
      render(
        <Textarea
          aria-label="Bio"
          defaultValue={'a'.repeat(95)}
          labels={{
            count: (n, max) => `${n} de ${max}`,
            remaining: (left) => `Quedan ${left}`,
          }}
          maxLength={100}
          showCount
        />,
      )
      expect(count()).toHaveTextContent('95 de 100')
      expect(status()).toHaveTextContent('Quedan 5')
    })

    it('forwards the ref to the textarea', () => {
      const ref = createRef<HTMLTextAreaElement>()
      render(<Textarea aria-label="Bio" ref={ref} showCount />)
      expect(ref.current).toBe(screen.getByRole('textbox'))
    })

    it('keeps the classes of the textarea', () => {
      render(
        <Textarea aria-label="Bio" className="mine" classNames={{ input: 'inner' }} showCount />,
      )
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveClass('base', 'outline', 'inner')
      expect(textarea).not.toHaveClass('mine')
      expect(textarea.parentElement).toHaveClass('mine')
    })

    it('styles the count, and drops its class when it is unstyled', () => {
      const { rerender } = render(
        <Textarea classNames={{ count: 'my-count' }} aria-label="Bio" showCount />,
      )
      expect(count()).toHaveClass('count', 'my-count')
      rerender(
        <Textarea
          classNames={{ count: 'my-count' }}
          aria-label="Bio"
          showCount
          variant="unstyled"
        />,
      )
      expect(count()).toHaveAttribute('class', 'my-count')
      rerender(<Textarea aria-label="Bio" showCount variant="unstyled" />)
      expect(count()).not.toHaveAttribute('class')
    })

    it('composes with Field', () => {
      render(
        <Field helperText="Short is fine" label="Bio">
          <Textarea maxLength={50} showCount />
        </Field>,
      )
      const described = screen.getByLabelText('Bio').getAttribute('aria-describedby') ?? ''
      expect(described.split(' ')).toContain(count().id)
      expect(described).toContain('helper')
    })
  })
})
