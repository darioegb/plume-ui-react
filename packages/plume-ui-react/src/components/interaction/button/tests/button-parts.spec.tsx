import { render } from '@testing-library/react'
import { createRef } from 'react'
import { Button, ButtonIcon, ButtonLabel, ButtonSpinner } from '..'

describe('Button parts', () => {
  it('renders the default composition from its parts', () => {
    const { container } = render(<Button iconLeft="<" iconRight=">" label="Next" />)

    expect(container.querySelectorAll('[data-plume-button-icon]')).toHaveLength(2)
    expect(container.querySelector('[data-plume-button-label]')).toHaveTextContent('Next')
    expect(container.querySelector('[data-plume-button-spinner]')).toBeNull()
  })

  it('renders its parts instead of the default composition', () => {
    const { container, getByRole } = render(
      <Button busy busyText="Saving" iconLeft="x" label="Ignored">
        <ButtonSpinner />
        <ButtonLabel>Save</ButtonLabel>
      </Button>,
    )

    expect(getByRole('button')).toHaveTextContent('Saving')
    expect(getByRole('button')).not.toHaveTextContent('Ignored')
    expect(container.querySelector('[data-plume-button-icon]')).toBeNull()
    expect(getByRole('button').firstElementChild).toHaveAttribute('data-plume-button-spinner')
  })

  it('marks the root busy and disabled', () => {
    const { getByRole, rerender } = render(<Button busy label="Save" />)
    expect(getByRole('button')).toHaveAttribute('data-busy')
    expect(getByRole('button')).toHaveAttribute('data-disabled')

    rerender(<Button disabled label="Save" />)
    expect(getByRole('button')).not.toHaveAttribute('data-busy')
    expect(getByRole('button')).toHaveAttribute('data-disabled')

    rerender(<Button label="Save" />)
    expect(getByRole('button')).not.toHaveAttribute('data-disabled')
  })

  it('drops every Plume class of the parts when unstyled', () => {
    const { container } = render(
      <Button busy busyText="Saving" iconLeft="<" label="Save" variant="unstyled" />,
    )

    expect(container.querySelector('[data-plume-button-icon]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-button-label]')).not.toHaveAttribute('class')
    expect(container.querySelector('[data-plume-button-spinner]')?.className).toBe('')
  })

  it('keeps the classes of the parts in the styled variants', () => {
    const { container } = render(<Button busy busyText="Saving" iconLeft="<" label="Save" />)

    expect(container.querySelector('[data-plume-button-icon]')).toHaveClass('iconMargin')
    expect(container.querySelector('[data-plume-button-label]')).toHaveClass('iconMargin')
    expect(container.querySelector('[data-plume-button-spinner]')).toHaveClass('spinnerMargin')
  })

  it('hides the label while busy without busy text, also when unstyled', () => {
    const { container } = render(<Button busy label="Save" variant="unstyled" />)
    const label = container.querySelector('[data-plume-button-label]')

    expect(label).toHaveAttribute('data-hidden')
    expect(label).not.toHaveAttribute('class')
  })

  it('forwards className, style and ref to the parts', () => {
    const iconRef = createRef<HTMLSpanElement>()
    const labelRef = createRef<HTMLSpanElement>()
    const spinnerRef = createRef<HTMLOutputElement>()
    const { getByLabelText } = render(
      <Button busy busyText="Saving">
        <ButtonIcon className="icon" ref={iconRef} style={{ color: 'red' }}>
          *
        </ButtonIcon>
        <ButtonLabel className="label" ref={labelRef}>
          Save
        </ButtonLabel>
        <ButtonSpinner className="spin" label="Wait" ref={spinnerRef} />
      </Button>,
    )

    expect(iconRef.current).toHaveClass('icon')
    expect(iconRef.current).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    expect(labelRef.current).toHaveClass('label')
    expect(spinnerRef.current).toHaveClass('spin')
    expect(getByLabelText('Wait')).toBe(spinnerRef.current)
  })

  it('throws when a part is rendered outside a Button', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ButtonIcon />)).toThrow('<ButtonIcon> must be rendered inside a <Button>')
    expect(() => render(<ButtonLabel />)).toThrow('<ButtonLabel> must be rendered inside a <Button>')
    expect(() => render(<ButtonSpinner />)).toThrow(
      '<ButtonSpinner> must be rendered inside a <Button>',
    )
    vi.restoreAllMocks()
  })

})
