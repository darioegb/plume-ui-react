import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Checkbox } from '..'

describe('Checkbox component', () => {
  it('renders a bare checkbox input', () => {
    const { container } = render(<Checkbox aria-label="Accept the terms" />)
    expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).not.toBeChecked()
    expect(container.firstElementChild).toBe(screen.getByRole('checkbox'))
  })

  it('starts checked with defaultChecked', () => {
    render(<Checkbox aria-label="Accept" defaultChecked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [checked, setChecked] = useState(false)
      return (
        <Checkbox
          aria-label="Accept"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
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
    render(<Checkbox aria-label="Accept" onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0] as [{ target: HTMLInputElement }])[0].target.checked).toBe(true)
  })

  it('forwards the name, value and required attributes', () => {
    render(<Checkbox aria-label="Pro" name="plan" required value="pro" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'plan')
    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'pro')
    expect(screen.getByRole('checkbox')).toBeRequired()
  })

  describe('indeterminate', () => {
    it('shows the mixed state and keeps it in sync with the prop', () => {
      const { rerender } = render(<Checkbox aria-label="All" indeterminate />)
      expect(screen.getByRole('checkbox')).toBePartiallyChecked()

      rerender(<Checkbox aria-label="All" indeterminate={false} />)
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked()
    })
  })

  describe('disabled', () => {
    it('disables the input', () => {
      render(<Checkbox aria-label="Accept" disabled />)
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })

    it('does not toggle', async () => {
      render(<Checkbox aria-label="Accept" disabled />)
      await userEvent.click(screen.getByRole('checkbox'))
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })
  })

  describe('read only', () => {
    it('keeps the state and tells assistive technology', () => {
      const onChange = vi.fn()
      render(<Checkbox aria-label="Accept" defaultChecked onChange={onChange} readOnly />)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(screen.getByRole('checkbox')).toBeChecked()
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-readonly', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not set aria-readonly otherwise', () => {
      render(<Checkbox aria-label="Accept" />)
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-readonly')
    })
  })

  describe('appearance', () => {
    it('applies the base and size classes to the input', () => {
      render(<Checkbox aria-label="Accept" size="lg" />)
      expect(screen.getByRole('checkbox')).toHaveClass('checkbox', 'lg')
    })

    it('exposes the color scheme as CSS variables on the input', () => {
      render(<Checkbox aria-label="Accept" colorScheme="success" />)
      expect(screen.getByRole('checkbox')).toHaveStyle(
        '--checkbox-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Checkbox aria-invalid aria-label="Accept" />)
      expect(screen.getByRole('checkbox')).toHaveClass('invalid')
      expect(screen.getByRole('checkbox')).toHaveStyle(
        '--checkbox-solid: var(--plume-color-error-solid)',
      )
    })

    it('puts className and style on the input and lets style override the variables', () => {
      render(
        <Checkbox
          aria-label="Accept"
          className="custom"
          style={{ '--checkbox-solid': 'red' } as React.CSSProperties}
        />,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('checkbox', 'custom')
      expect(checkbox).toHaveStyle('--checkbox-solid: red')
    })

    it('uses the solid variant by default and can switch to outline', () => {
      const { rerender } = render(<Checkbox aria-label="Accept" />)
      expect(screen.getByRole('checkbox')).toHaveClass('checkbox', 'solid')
      expect(screen.getByRole('checkbox')).not.toHaveClass('outline')

      rerender(<Checkbox aria-label="Accept" variant="outline" />)
      expect(screen.getByRole('checkbox')).toHaveClass('checkbox', 'outline')
      expect(screen.getByRole('checkbox')).not.toHaveClass('solid')
    })

    it('drops the Plume classes when unstyled and keeps className', () => {
      render(<Checkbox aria-label="Accept" className="custom" variant="unstyled" />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('class', 'custom')
    })

    it('has no class attribute when unstyled without className', () => {
      render(<Checkbox aria-label="Accept" variant="unstyled" />)
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('class')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Checkbox aria-label="Accept" ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('checkbox'))
  })

  describe('inside a Field', () => {
    it('is named by the label and toggled by clicking its text', () => {
      render(
        <Field label="Accept the terms" orientation="inline">
          <Checkbox />
        </Field>,
      )
      expect(screen.getByRole('checkbox', { name: 'Accept the terms' })).not.toBeChecked()
      fireEvent.click(screen.getByText('Accept the terms'))
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('gets the id, description, invalid state and required from the Field', () => {
      render(
        <Field
          errorText="You must accept"
          helperText="Required to continue"
          label="Terms"
          orientation="inline"
          required
        >
          <Checkbox />
        </Field>,
      )
      const checkbox = screen.getByRole('checkbox', { name: /Terms/ })
      expect(checkbox).toBeRequired()
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      expect(checkbox).toHaveAccessibleDescription('You must accept Required to continue')
    })

    it('passes the disabled and read only state down', () => {
      render(
        <Field disabled label="Terms" orientation="inline" readOnly>
          <Checkbox />
        </Field>,
      )
      expect(screen.getByRole('checkbox', { name: /Terms/ })).toBeDisabled()
    })
  })
})
