import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Toggle } from '..'

describe('Toggle component', () => {
  it('renders a switch named by its label', () => {
    render(<Toggle>Notifications</Toggle>)
    expect(screen.getByRole('switch', { name: 'Notifications' })).not.toBeChecked()
  })

  it('renders without a label', () => {
    render(<Toggle aria-label="Standalone" />)
    expect(screen.getByRole('switch', { name: 'Standalone' })).toBeInTheDocument()
  })

  it('is still a checkbox for forms', () => {
    render(<Toggle name="notify">Notifications</Toggle>)
    expect(screen.getByRole('switch')).toHaveAttribute('type', 'checkbox')
    expect(screen.getByRole('switch')).toHaveAttribute('name', 'notify')
  })

  it('toggles when its label is clicked', () => {
    render(<Toggle>Notifications</Toggle>)
    fireEvent.click(screen.getByText('Notifications'))
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Toggle>Notifications</Toggle>)
    await user.tab()
    expect(screen.getByRole('switch')).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('starts on with defaultChecked', () => {
    render(<Toggle defaultChecked>Notifications</Toggle>)
    expect(screen.getByRole('switch')).toBeChecked()
  })

  it('works as a controlled component', () => {
    function Controlled(): React.ReactNode {
      const [checked, setChecked] = useState(false)
      return (
        <Toggle checked={checked} onChange={(event) => setChecked(event.target.checked)}>
          Notifications
        </Toggle>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toBeChecked()
    fireEvent.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  describe('disabled', () => {
    it('disables the input, marks the label and does not toggle', () => {
      render(<Toggle disabled>Notifications</Toggle>)
      expect(screen.getByRole('switch')).toBeDisabled()
      expect(screen.getByRole('switch').closest('label')).toHaveClass('disabled')
      fireEvent.click(screen.getByText('Notifications'))
      expect(screen.getByRole('switch')).not.toBeChecked()
    })
  })

  describe('read only', () => {
    it('keeps the state, tells assistive technology and does not call onChange', () => {
      const onChange = vi.fn()
      render(
        <Toggle defaultChecked onChange={onChange} readOnly>
          Notifications
        </Toggle>,
      )
      fireEvent.click(screen.getByRole('switch'))
      expect(screen.getByRole('switch')).toBeChecked()
      expect(screen.getByRole('switch')).toHaveAttribute('aria-readonly', 'true')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('does not set aria-readonly otherwise', () => {
      render(<Toggle>Notifications</Toggle>)
      expect(screen.getByRole('switch')).not.toHaveAttribute('aria-readonly')
    })
  })

  describe('appearance', () => {
    it('applies the base, size and input classes', () => {
      render(<Toggle size="lg">Notifications</Toggle>)
      expect(screen.getByRole('switch').closest('label')).toHaveClass('root', 'lg')
      expect(screen.getByRole('switch')).toHaveClass('toggle')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Toggle colorScheme="success">Notifications</Toggle>)
      expect(screen.getByRole('switch').closest('label')).toHaveStyle(
        '--toggle-solid: var(--plume-color-success-solid)',
      )
    })

    it('switches to the error scheme when it is invalid', () => {
      render(<Toggle aria-invalid>Notifications</Toggle>)
      expect(screen.getByRole('switch')).toHaveClass('invalid')
      expect(screen.getByRole('switch').closest('label')).toHaveStyle(
        '--toggle-solid: var(--plume-color-error-solid)',
      )
    })

    it('puts className and style on the label', () => {
      render(
        <Toggle className="custom" style={{ '--toggle-solid': 'red' } as React.CSSProperties}>
          Notifications
        </Toggle>,
      )
      const label = screen.getByRole('switch').closest('label')
      expect(label).toHaveClass('root', 'custom')
      expect(label).toHaveStyle('--toggle-solid: red')
    })

    it('uses the solid variant by default and can switch to another one', () => {
      const { rerender } = render(<Toggle>Notifications</Toggle>)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'solid')
      expect(screen.getByRole('switch')).not.toHaveClass('outline')

      rerender(<Toggle variant="outline">Notifications</Toggle>)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'outline')
      expect(screen.getByRole('switch')).not.toHaveClass('solid')

      rerender(<Toggle variant="raised">Notifications</Toggle>)
      expect(screen.getByRole('switch')).toHaveClass('toggle', 'raised')
      expect(screen.getByRole('switch')).not.toHaveClass('outline')
    })

    it('drops the Plume classes when unstyled', () => {
      render(
        <Toggle className="custom" variant="unstyled">
          Notifications
        </Toggle>,
      )
      const label = screen.getByRole('switch').closest('label')
      expect(label).toHaveClass('custom')
      expect(label).not.toHaveClass('root')
      expect(screen.getByRole('switch')).not.toHaveClass('toggle')
    })
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Toggle ref={ref}>Notifications</Toggle>)
    expect(ref.current).toBe(screen.getByRole('switch'))
  })

  it('gets the description, invalid state and required from a Field', () => {
    render(
      <Field errorText="Needed" helperText="Turn it on" label="Alerts" required>
        <Toggle>Notifications</Toggle>
      </Field>,
    )
    const toggle = screen.getByRole('switch', { name: /Alerts/ })
    expect(toggle).toBeRequired()
    expect(toggle).toHaveAttribute('aria-invalid', 'true')
    expect(toggle).toHaveAccessibleDescription('Needed Turn it on')
  })

  describe('classes of the parts', () => {
    it('adds inputClassName to the input and labelClassName to the text', () => {
      render(
        <Toggle inputClassName="my-input" labelClassName="my-label">
          Label
        </Toggle>,
      )
      expect(screen.getByRole('switch')).toHaveClass('my-input')
      expect(screen.getByText('Label')).toHaveClass('my-label')
    })

    it('keeps them next to the Plume classes', () => {
      render(
        <Toggle inputClassName="my-input" labelClassName="my-label">
          Label
        </Toggle>,
      )
      expect(screen.getByRole('switch').className).toMatch(/toggle.+my-input/)
      expect(screen.getByText('Label').className).toMatch(/label.+my-label/)
    })

    it('is the only class of the input and the text when unstyled', () => {
      render(
        <Toggle inputClassName="my-input" labelClassName="my-label" variant="unstyled">
          Label
        </Toggle>,
      )
      expect(screen.getByRole('switch')).toHaveAttribute('class', 'my-input')
      expect(screen.getByText('Label')).toHaveAttribute('class', 'my-label')
    })

    it('leaves the input and the text without a class attribute when unstyled and empty', () => {
      render(<Toggle variant="unstyled">Label</Toggle>)
      expect(screen.getByRole('switch')).not.toHaveAttribute('class')
      expect(screen.getByText('Label')).not.toHaveAttribute('class')
    })
  })
})
