import { render, screen } from '@testing-library/react'
import { createRef, type CSSProperties } from 'react'
import { Step, StepIndicator, StepIndicatorContent, StepIndicatorLabel, Stepper } from '..'

const indicator = (): HTMLElement =>
  document.querySelector('[data-plume-step-indicator]') as HTMLElement

describe('StepIndicator parts', () => {
  it('builds the default from the content and the label', () => {
    render(
      <Stepper activeStep={1}>
        <Step>
          <StepIndicator />
        </Step>
        <Step>
          <StepIndicator />
        </Step>
      </Stepper>,
    )
    const first = document.querySelectorAll('[data-plume-step-indicator]')[0]
    expect(first.querySelector('[data-plume-step-indicator-content] svg')).not.toBeNull()
    expect(first.querySelector('[data-plume-step-indicator-label]')).toHaveTextContent('Completed')
    const second = document.querySelectorAll('[data-plume-step-indicator]')[1]
    expect(second.querySelector('[data-plume-step-indicator-content]')).toHaveTextContent('2')
    expect(second.querySelector('[data-plume-step-indicator-label]')).toBeNull()
  })

  it('keeps children as the content of the default composition', () => {
    render(
      <Stepper>
        <Step>
          <StepIndicator>★</StepIndicator>
        </Step>
      </Stepper>,
    )
    expect(document.querySelector('[data-plume-step-indicator-content]')).toHaveTextContent('★')
  })

  it('renders the parts as written, and only those', () => {
    render(
      <Stepper activeStep={0}>
        <Step>
          <StepIndicator>
            <StepIndicatorLabel>Step one</StepIndicatorLabel>
            <StepIndicatorContent className="mine">A</StepIndicatorContent>
          </StepIndicator>
        </Step>
      </Stepper>,
    )
    const names = Array.from(indicator().children).map((child) =>
      child.hasAttribute('data-plume-step-indicator-label') ? 'label' : 'content',
    )
    expect(names).toEqual(['label', 'content'])
    expect(screen.getByText('A')).toHaveClass('mine')
    expect(screen.getByText('A')).toHaveAttribute('aria-hidden', 'true')
  })

  it('omits the label when it is not composed', () => {
    render(
      <Stepper activeStep={1}>
        <Step>
          <StepIndicator>
            <StepIndicatorContent />
          </StepIndicator>
        </Step>
        <Step>
          <StepIndicator />
        </Step>
      </Stepper>,
    )
    expect(indicator().querySelector('[data-plume-step-indicator-label]')).toBeNull()
  })

  it('takes the text of the label from the stepper labels, or from its children', () => {
    render(
      <Stepper activeStep={1} labels={{ completed: 'Hecho' }}>
        <Step>
          <StepIndicator>
            <StepIndicatorLabel />
          </StepIndicator>
        </Step>
        <Step>
          <StepIndicator>
            <StepIndicatorLabel>Ahora</StepIndicatorLabel>
          </StepIndicator>
        </Step>
      </Stepper>,
    )
    expect(screen.getByText('Hecho')).toBeInTheDocument()
    expect(screen.getByText('Ahora')).toBeInTheDocument()
  })

  it('renders nothing for a label without text', () => {
    render(
      <Stepper activeStep={0}>
        <Step>
          <StepIndicator>
            <StepIndicatorContent />
            <StepIndicatorLabel />
          </StepIndicator>
        </Step>
      </Stepper>,
    )
    expect(document.querySelector('[data-plume-step-indicator-label]')).toBeNull()
  })

  it('forwards the ref, the style and the state to every part', () => {
    const content = createRef<HTMLSpanElement>()
    const label = createRef<HTMLSpanElement>()
    render(
      <Stepper activeStep={0}>
        <Step>
          <StepIndicator>
            <StepIndicatorContent ref={content} style={{ '--probe': 'a' } as CSSProperties} />
            <StepIndicatorLabel ref={label} style={{ '--probe': 'b' } as CSSProperties}>
              Now
            </StepIndicatorLabel>
          </StepIndicator>
        </Step>
      </Stepper>,
    )
    expect(content.current).toHaveStyle('--probe: a')
    expect(content.current).toHaveAttribute('data-state', 'current')
    expect(label.current).toHaveStyle('--probe: b')
    expect(label.current).toHaveStyle({ position: 'absolute' })
  })

  it.each([
    ['StepIndicatorContent', <StepIndicatorContent key="a" />],
    ['StepIndicatorLabel', <StepIndicatorLabel key="b" />],
  ])('throws when %s is rendered outside a Step', (name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<Stepper>{element}</Stepper>)).toThrow(
      `${name} must be used within a <Step>`,
    )
    error.mockRestore()
  })
})
