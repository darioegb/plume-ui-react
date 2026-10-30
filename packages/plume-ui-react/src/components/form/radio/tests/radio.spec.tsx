import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Radio } from '..'

function Group({ onChange }: { onChange?: (value: string) => void }): React.ReactNode {
  return (
    <>
      <Radio
        aria-label="Free"
        name="plan"
        onChange={(event) => onChange?.(event.target.value)}
        value="free"
      />
      <Radio
        aria-label="Pro"
        name="plan"
        onChange={(event) => onChange?.(event.target.value)}
        value="pro"
      />
    </>
  )
}

describe('Radio component', () => {
  it('renders a bare radio input named by its aria-label', () => {
    const { container } = render(<Radio aria-label="Free" value="free" />)
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
    expect(container.firstElementChild).toBe(screen.getByRole('radio'))
  })

  it('calls onChange without a value', () => {
    const onChange = vi.fn()
    render(<Radio aria-label="Any" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('starts selected with defaultChecked', () => {
    render(<Radio aria-label="Free" defaultChecked value="free" />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('keeps one radio of a group selected at a time', () => {
    const onChange = vi.fn()
    render(<Group onChange={onChange} />)

    fireEvent.click(screen.getByRole('radio', { name: 'Free' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Pro' }))

    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
    expect(onChange.mock.calls).toEqual([['free'], ['pro']])
  })

  it('moves the selection with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Group />)
    await user.click(screen.getByRole('radio', { name: 'Free' }))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [value, setValue] = useState('free')
      return (
        <>
          {['free', 'pro'].map((plan) => (
            <Radio
              aria-label={plan}
              checked={value === plan}
              key={plan}
              name="plan"
              onChange={() => setValue(plan)}
              value={plan}
            />
          ))}
        </>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('radio', { name: 'pro' }))
    expect(screen.getByRole('radio', { name: 'pro' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'free' })).not.toBeChecked()
  })

  it('forwards the name, value and required attributes', () => {
    render(<Radio aria-label="Pro" name="plan" required value="pro" />)
    expect(screen.getByRole('radio')).toHaveAttribute('name', 'plan')
    expect(screen.getByRole('radio')).toHaveAttribute('value', 'pro')
    expect(screen.getByRole('radio')).toBeRequired()
  })

  describe('disabled', () => {
    it('disables the input', () => {
      render(<Radio aria-label="Free" disabled value="free" />)
      expect(screen.getByRole('radio')).toBeDisabled()
    })
  })

  describe('read only', () => {
    it('does not select and does not call onChange', () => {
      const onChange = vi.fn()
      render(<Radio aria-label="Free" onChange={onChange} readOnly value="free" />)
      fireEvent.click(screen.getByRole('radio'))
      expect(screen.getByRole('radio')).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('works without an onChange handler', () => {
      render(<Radio aria-label="Free" readOnly value="free" />)
      fireEvent.click(screen.getByRole('radio'))
      expect(screen.getByRole('radio')).not.toBeChecked()
    })
  })

  describe('appearance', () => {
    it('applies the base, size and variant classes to the input', () => {
      render(<Radio aria-label="Free" size="lg" value="x" />)
      expect(screen.getByRole('radio')).toHaveClass('radio', 'lg', 'solid')
    })

    it('exposes the color scheme as CSS variables on the input', () => {
      render(<Radio aria-label="Free" colorScheme="success" value="x" />)
      expect(screen.getByRole('radio')).toHaveStyle(
        '--radio-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Radio aria-invalid aria-label="Free" value="x" />)
      expect(screen.getByRole('radio')).toHaveClass('invalid')
      expect(screen.getByRole('radio')).toHaveStyle('--radio-solid: var(--plume-color-error-solid)')
    })

    it('puts className and style on the input', () => {
      render(
        <Radio
          aria-label="Free"
          className="custom"
          style={{ '--radio-solid': 'red' } as React.CSSProperties}
          value="x"
        />,
      )
      const input = screen.getByRole('radio')
      expect(input).toHaveClass('radio', 'custom')
      expect(input).toHaveStyle('--radio-solid: red')
    })

    it('uses the solid variant by default and can switch to outline', () => {
      const { rerender } = render(<Radio aria-label="Free" value="x" />)
      expect(screen.getByRole('radio')).toHaveClass('radio', 'solid')

      rerender(<Radio aria-label="Free" value="x" variant="outline" />)
      expect(screen.getByRole('radio')).toHaveClass('radio', 'outline')
      expect(screen.getByRole('radio')).not.toHaveClass('solid')
    })

    it('drops the Plume classes when unstyled and keeps className', () => {
      render(<Radio aria-label="Free" className="custom" value="x" variant="unstyled" />)
      expect(screen.getByRole('radio')).toHaveAttribute('class', 'custom')
    })

    it('has no class attribute when unstyled and without className', () => {
      render(<Radio aria-label="Free" value="x" variant="unstyled" />)
      expect(screen.getByRole('radio')).not.toHaveAttribute('class')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Radio aria-label="Free" ref={ref} value="x" />)
    expect(ref.current).toBe(screen.getByRole('radio'))
  })

  describe('inside a Field', () => {
    it('is named by the label of its own Field and toggled by clicking that label', () => {
      render(
        <>
          <Field label="Free" orientation="inline">
            <Radio name="plan" value="free" />
          </Field>
          <Field label="Pro" orientation="inline">
            <Radio name="plan" value="pro" />
          </Field>
        </>,
      )
      expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
      fireEvent.click(screen.getByText('Pro'))
      expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
      fireEvent.click(screen.getByText('Free'))
      expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Pro' })).not.toBeChecked()
    })

    it('gets the description and invalid state from the Field', () => {
      render(
        <Field errorText="Pick one" helperText="Required" label="Plan" orientation="inline">
          <Radio value="x" />
        </Field>,
      )
      const radio = screen.getByRole('radio', { name: 'Plan' })
      expect(radio).toHaveAttribute('aria-invalid', 'true')
      expect(radio).toHaveAccessibleDescription('Pick one Required')
    })

    it('gets disabled from the Field', () => {
      render(
        <Field disabled label="Free" orientation="inline">
          <Radio value="free" />
        </Field>,
      )
      expect(screen.getByRole('radio', { name: 'Free' })).toBeDisabled()
      fireEvent.click(screen.getByText('Free'))
      expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
    })
  })

  it('carries data-plume-radio and its state', () => {
    const { rerender } = render(<Radio aria-label="Free" value="free" />)
    const input = screen.getByRole('radio')
    expect(input).toHaveAttribute('data-plume-radio')
    expect(input).not.toHaveAttribute('data-disabled')

    rerender(<Radio aria-invalid aria-label="Free" disabled readOnly value="free" />)
    expect(input).toHaveAttribute('data-disabled')
    expect(input).toHaveAttribute('data-invalid')
    expect(input).toHaveAttribute('data-readonly')
  })
})
