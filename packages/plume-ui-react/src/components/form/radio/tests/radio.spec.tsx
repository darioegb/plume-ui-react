import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Radio } from '..'

function Group({ onChange }: { onChange?: (value: string) => void }): React.ReactNode {
  return (
    <>
      <Radio name="plan" onChange={(event) => onChange?.(event.target.value)} value="free">
        Free
      </Radio>
      <Radio name="plan" onChange={(event) => onChange?.(event.target.value)} value="pro">
        Pro
      </Radio>
    </>
  )
}

describe('Radio component', () => {
  it('renders a radio named by its label', () => {
    render(<Radio value="free">Free</Radio>)
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
  })

  it('renders without a label', () => {
    render(<Radio aria-label="Standalone" value="x" />)
    expect(screen.getByRole('radio', { name: 'Standalone' })).toBeInTheDocument()
  })

  it('selects when its label is clicked', () => {
    render(<Radio value="free">Free</Radio>)
    fireEvent.click(screen.getByText('Free'))
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('starts selected with defaultChecked', () => {
    render(
      <Radio defaultChecked value="free">
        Free
      </Radio>,
    )
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
              checked={value === plan}
              key={plan}
              name="plan"
              onChange={() => setValue(plan)}
              value={plan}
            >
              {plan}
            </Radio>
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
    render(
      <Radio name="plan" required value="pro">
        Pro
      </Radio>,
    )
    expect(screen.getByRole('radio')).toHaveAttribute('name', 'plan')
    expect(screen.getByRole('radio')).toHaveAttribute('value', 'pro')
    expect(screen.getByRole('radio')).toBeRequired()
  })

  describe('disabled', () => {
    it('disables the input, marks the label and does not select', () => {
      render(
        <Radio disabled value="free">
          Free
        </Radio>,
      )
      expect(screen.getByRole('radio')).toBeDisabled()
      expect(screen.getByRole('radio').closest('label')).toHaveClass('disabled')
      fireEvent.click(screen.getByText('Free'))
      expect(screen.getByRole('radio')).not.toBeChecked()
    })
  })

  describe('read only', () => {
    it('does not select and does not call onChange', () => {
      const onChange = vi.fn()
      render(
        <Radio onChange={onChange} readOnly value="free">
          Free
        </Radio>,
      )
      fireEvent.click(screen.getByRole('radio'))
      expect(screen.getByRole('radio')).not.toBeChecked()
      expect(onChange).not.toHaveBeenCalled()
    })

    it('works without an onChange handler', () => {
      render(
        <Radio readOnly value="free">
          Free
        </Radio>,
      )
      fireEvent.click(screen.getByRole('radio'))
      expect(screen.getByRole('radio')).not.toBeChecked()
    })
  })

  describe('appearance', () => {
    it('applies the base, size and input classes', () => {
      render(
        <Radio size="lg" value="x">
          Free
        </Radio>,
      )
      expect(screen.getByRole('radio').closest('label')).toHaveClass('root', 'lg')
      expect(screen.getByRole('radio')).toHaveClass('radio')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(
        <Radio colorScheme="success" value="x">
          Free
        </Radio>,
      )
      expect(screen.getByRole('radio').closest('label')).toHaveStyle(
        '--radio-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(
        <Radio aria-invalid value="x">
          Free
        </Radio>,
      )
      expect(screen.getByRole('radio')).toHaveClass('invalid')
      expect(screen.getByRole('radio').closest('label')).toHaveStyle(
        '--radio-solid: var(--plume-color-error-solid)',
      )
    })

    it('puts className and style on the label', () => {
      render(
        <Radio
          className="custom"
          style={{ '--radio-solid': 'red' } as React.CSSProperties}
          value="x"
        >
          Free
        </Radio>,
      )
      const label = screen.getByRole('radio').closest('label')
      expect(label).toHaveClass('root', 'custom')
      expect(label).toHaveStyle('--radio-solid: red')
    })

    it('uses the solid variant by default and can switch to outline', () => {
      const { rerender } = render(<Radio value="x">Free</Radio>)
      expect(screen.getByRole('radio')).toHaveClass('radio', 'solid')

      rerender(
        <Radio value="x" variant="outline">
          Free
        </Radio>,
      )
      expect(screen.getByRole('radio')).toHaveClass('radio', 'outline')
      expect(screen.getByRole('radio')).not.toHaveClass('solid')
    })

    it('drops the Plume classes when unstyled', () => {
      render(
        <Radio className="custom" value="x" variant="unstyled">
          Free
        </Radio>,
      )
      const label = screen.getByRole('radio').closest('label')
      expect(label).toHaveClass('custom')
      expect(label).not.toHaveClass('root')
      expect(screen.getByRole('radio')).not.toHaveClass('radio')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(
      <Radio ref={ref} value="x">
        Free
      </Radio>,
    )
    expect(ref.current).toBe(screen.getByRole('radio'))
  })

  it('gets the description and invalid state from a Field', () => {
    render(
      <Field errorText="Pick one" helperText="Required" label="Plan">
        <Radio value="x">Free</Radio>
      </Field>,
    )
    const radio = screen.getByRole('radio', { name: /Plan/ })
    expect(radio).toHaveAttribute('aria-invalid', 'true')
    expect(radio).toHaveAccessibleDescription('Pick one Required')
  })
})
