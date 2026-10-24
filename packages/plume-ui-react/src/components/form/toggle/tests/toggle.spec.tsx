import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Toggle } from '..'

describe('Toggle component', () => {
  it('renders a switch named by its aria-label', () => {
    render(<Toggle aria-label="Notifications" />)
    expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked()
  })

  it('renders a bare input, without a label or a wrapper', () => {
    const { container } = render(<Toggle aria-label="Notifications" />)
    expect(container.firstElementChild).toBe(screen.getByRole('switch'))
    expect(container.querySelector('label')).toBeNull()
  })

  it('is still a checkbox for forms', () => {
    render(<Toggle aria-label="Notifications" name="notify" />)
    expect(screen.getByRole('switch')).toHaveAttribute('type', 'checkbox')
    expect(screen.getByRole('switch')).toHaveAttribute('name', 'notify')
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Toggle aria-label="Notifications" />)
    await user.tab()
    expect(screen.getByRole('switch')).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('starts on with defaultChecked', () => {
    render(<Toggle aria-label="Notifications" defaultChecked />)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [checked, setChecked] = useState(false)
      return (
        <Toggle
          aria-label="Notifications"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toBeChecked()
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  describe('disabled', () => {
    it('disables the input and does not toggle', async () => {
      render(<Toggle aria-label="Notifications" disabled />)
      expect(screen.getByRole('switch')).toBeDisabled()
      await userEvent.click(screen.getByRole('switch'))
      expect(screen.getByRole('switch')).not.toBeChecked()
    })
  })

  describe('read only', () => {
    it('keeps the state, tells assistive technology and does not call onChange', () => {
      const onChange = vi.fn()
      render(<Toggle aria-label="Notifications" defaultChecked onChange={onChange} readOnly />)
      fireEvent.click(screen.getByRole('switch'))
      expect(screen.getByRole('switch')).toBeChecked()
      expect(screen.getByRole('switch')).toHaveAttribute('aria-readonly', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not set aria-readonly otherwise', () => {
      render(<Toggle aria-label="Notifications" />)
      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-readonly')
    })

    it('calls onChange when it is not read only', () => {
      const onChange = vi.fn()
      render(<Toggle aria-label="Notifications" onChange={onChange} />)
      fireEvent.click(screen.getByRole('switch'))
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('appearance', () => {
    it('applies the base and size classes to the input', () => {
      render(<Toggle aria-label="Notifications" size="lg" />)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'lg')
    })

    it('uses the md size by default', () => {
      render(<Toggle aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toHaveClass('md')
    })

    it('exposes the color scheme as CSS variables on the input', () => {
      render(<Toggle aria-label="Notifications" colorScheme="success" />)
      expect(screen.getByRole('switch')).toHaveStyle(
        '--toggle-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Toggle aria-invalid aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toHaveClass('invalid')
      expect(screen.getByRole('switch')).toHaveStyle(
        '--toggle-solid: var(--plume-color-error-solid)',
      )
    })

    it('puts className and style on the input', () => {
      render(
        <Toggle
          aria-label="Notifications"
          className="custom"
          style={{ '--toggle-solid': 'red' } as React.CSSProperties}
        />,
      )
      const input = screen.getByRole('switch')
      expect(input).toHaveClass('toggle', 'custom')
      expect(input).toHaveStyle('--toggle-solid: red')
    })

    it('uses the solid variant by default and can switch to another one', () => {
      const { rerender } = render(<Toggle aria-label="Notifications" />)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'solid')
      expect(screen.getByRole('switch')).not.toHaveClass('outline')

      rerender(<Toggle aria-label="Notifications" variant="outline" />)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'outline')
      expect(screen.getByRole('switch')).not.toHaveClass('solid')

      rerender(<Toggle aria-label="Notifications" variant="raised" />)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'raised')
      expect(screen.getByRole('switch')).not.toHaveClass('outline')
    })

    it('drops the Plume classes when unstyled and keeps only className', () => {
      render(<Toggle aria-label="Notifications" className="custom" variant="unstyled" />)
      expect(screen.getByRole('switch')).toHaveAttribute('class', 'custom')
    })

    it('has no class attribute when unstyled and without className', () => {
      render(<Toggle aria-label="Notifications" variant="unstyled" />)
      expect(screen.getByRole('switch')).not.toHaveAttribute('class')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Toggle aria-label="Notifications" ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('switch'))
  })

  describe('inside a Field', () => {
    it('is named by the label and toggled by clicking its text', () => {
      render(
        <Field label="Notifications" orientation="inline">
          <Toggle />
        </Field>,
      )
      expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked()
      fireEvent.click(screen.getByText('Notifications'))
      expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked()
    })

    it('gets the description, invalid state and required from the Field', () => {
      render(
        <Field
          errorText="Needed"
          helperText="Turn it on"
          label="Alerts"
          orientation="inline"
          required
        >
          <Toggle />
        </Field>,
      )
      const toggle = screen.getByRole('switch', { name: /Alerts/ })
      expect(toggle).toBeRequired()
      expect(toggle).toHaveAttribute('aria-invalid', 'true')
      expect(toggle).toHaveAccessibleDescription('Needed Turn it on')
    })

    it('is disabled by the Field and does not toggle from its label', async () => {
      render(
        <Field disabled label="Notifications" orientation="inline">
          <Toggle />
        </Field>,
      )
      expect(screen.getByRole('switch')).toBeDisabled()
      await userEvent.click(screen.getByText('Notifications'))
      expect(screen.getByRole('switch')).not.toBeChecked()
    })
  })
})
