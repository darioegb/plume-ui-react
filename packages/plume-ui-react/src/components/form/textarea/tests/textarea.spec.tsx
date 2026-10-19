import { fireEvent, render, screen } from '@testing-library/react'
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
})
