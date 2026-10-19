import { fireEvent, render, screen } from '@testing-library/react'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Checkbox } from '..'

describe('Checkbox component', () => {
  it('renders a checkbox named by its label', () => {
    render(<Checkbox>Accept the terms</Checkbox>)
    expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).not.toBeChecked()
  })

  it('renders without a label', () => {
    render(<Checkbox aria-label="Standalone" />)
    expect(screen.getByRole('checkbox', { name: 'Standalone' })).toBeInTheDocument()
  })

  it('toggles when its label is clicked', () => {
    render(<Checkbox>Accept</Checkbox>)
    fireEvent.click(screen.getByText('Accept'))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('starts checked with defaultChecked', () => {
    render(<Checkbox defaultChecked>Accept</Checkbox>)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
          Accept
        </Checkbox>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls onChange with the event', () => {
    const onChange = vi.fn()
    render(<Checkbox onChange={onChange}>Accept</Checkbox>)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0] as [{ target: HTMLInputElement }])[0].target.checked).toBe(true)
  })

  it('forwards the name, value and required attributes', () => {
    render(
      <Checkbox name="plan" required value="pro">
        Pro
      </Checkbox>,
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'plan')
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'pro')
    expect(screen.getByRole('checkbox')).toBeRequired()
  })

  describe('indeterminate', () => {
    it('shows the mixed state and keeps it in sync with the prop', () => {
      const { rerender } = render(<Checkbox indeterminate>All</Checkbox>)
      expect(screen.getByRole('checkbox')).toBePartiallyChecked()

      rerender(<Checkbox indeterminate={false}>All</Checkbox>)
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked()
    })
  })

  describe('disabled', () => {
    it('disables the input and marks the label', () => {
      render(<Checkbox disabled>Accept</Checkbox>)
      expect(screen.getByRole('checkbox')).toBeDisabled()
      expect(screen.getByRole('checkbox').closest('label')).toHaveClass('disabled')
    })

    it('does not toggle', () => {
      render(<Checkbox disabled>Accept</Checkbox>)
      fireEvent.click(screen.getByText('Accept'))
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('read only', () => {
    it('keeps the state and tells assistive technology', () => {
      const onChange = vi.fn()
      render(
        <Checkbox defaultChecked onChange={onChange} readOnly>
          Accept
        </Checkbox>,
      )
      fireEvent.click(screen.getByRole('checkbox'))
      expect(screen.getByRole('checkbox')).toBeChecked()
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-readonly', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not set aria-readonly otherwise', () => {
      render(<Checkbox>Accept</Checkbox>)
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-readonly')
    })
  })

  describe('appearance', () => {
    it('applies the base, size and input classes', () => {
      render(<Checkbox size="lg">Accept</Checkbox>)
      expect(screen.getByRole('checkbox').closest('label')).toHaveClass('root', 'lg')
      expect(screen.getByRole('checkbox')).toHaveClass('checkbox')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Checkbox colorScheme="success">Accept</Checkbox>)
      expect(screen.getByRole('checkbox').closest('label')).toHaveStyle(
        '--checkbox-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Checkbox aria-invalid>Accept</Checkbox>)
      expect(screen.getByRole('checkbox')).toHaveClass('invalid')
      expect(screen.getByRole('checkbox').closest('label')).toHaveStyle(
        '--checkbox-solid: var(--plume-color-error-solid)',
      )
    })

    it('puts className and style on the label and lets style override the variables', () => {
      render(
        <Checkbox className="custom" style={{ '--checkbox-solid': 'red' } as React.CSSProperties}>
          Accept
        </Checkbox>,
      )
      const label = screen.getByRole('checkbox').closest('label')
      expect(label).toHaveClass('root', 'custom')
      expect(label).toHaveStyle('--checkbox-solid: red')
    })

    it('drops the Plume classes when unstyled', () => {
      render(
        <Checkbox className="custom" variant="unstyled">
          Accept
        </Checkbox>,
      )
      const label = screen.getByRole('checkbox').closest('label')
      expect(label).toHaveClass('custom')
      expect(label).not.toHaveClass('root')
      expect(screen.getByRole('checkbox')).not.toHaveClass('checkbox')
      expect(screen.getByText('Accept')).not.toHaveClass('label')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox ref={ref}>Accept</Checkbox>)
    expect(ref.current).toBe(screen.getByRole('checkbox'))
  })

  describe('inside a Field', () => {
    it('gets the id, description, invalid state and required from the Field', () => {
      render(
        <Field errorText="You must accept" helperText="Required to continue" label="Terms" required>
          <Checkbox>Accept</Checkbox>
        </Field>,
      )
      const checkbox = screen.getByRole('checkbox', { name: /Terms/ })
      expect(checkbox).toBeRequired()
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAccessibleDescription('You must accept Required to continue')
    })

    it('passes the disabled and read only state down', () => {
      render(
        <Field disabled label="Terms" readOnly>
          <Checkbox>Accept</Checkbox>
        </Field>,
      )
      expect(screen.getByRole('checkbox', { name: /Terms/ })).toBeDisabled()
    })
  })
})
