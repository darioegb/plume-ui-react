import { render, screen } from '@testing-library/react'
import { createRef, type Ref } from 'react'
import { Step, StepDescription, StepIndicator, Stepper, StepSeparator, StepTitle } from '..'
import type { StepperProps } from '..'

function Demo({
  demoRef,
  ...props
}: Readonly<Partial<StepperProps> & { demoRef?: Ref<HTMLOListElement> }>) {
  return (
    <Stepper {...props} ref={demoRef}>
      {['Account', 'Profile', 'Review'].map((title) => (
        <Step key={title}>
          <StepIndicator />
          <StepTitle>{title}</StepTitle>
          <StepDescription>About {title}</StepDescription>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )
}

const step = (name: string): HTMLElement => screen.getByText(name).closest('li') as HTMLElement
const states = (): (string | null)[] =>
  screen.getAllByRole('listitem').map((item) => item.getAttribute('data-state'))

describe('Stepper component', () => {
  describe('rendering', () => {
    it('renders an ordered list with a step for each child', () => {
      render(<Demo />)
      expect(screen.getByRole('list').tagName).toBe('OL')
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
    })

    it('forwards the ref, the label and the id to the list', () => {
      const ref = createRef<HTMLOListElement>()
      render(<Demo aria-label="Checkout" demoRef={ref} id="steps" />)
      expect(ref.current).toBe(screen.getByRole('list', { name: 'Checkout' }))
      expect(ref.current).toHaveAttribute('id', 'steps')
    })

    it('numbers the steps', () => {
      render(<Demo />)
      const numbers = Array.from(document.querySelectorAll('[data-plume-step-indicator-content]'))
      expect(numbers.map((node) => node.textContent)).toEqual(['1', '2', '3'])
    })
  })

  describe('status', () => {
    it('marks the steps before the active one as completed, and the ones after as upcoming', () => {
      render(<Demo activeStep={1} />)
      expect(states()).toEqual(['completed', 'current', 'upcoming'])
    })

    it('starts at the first step', () => {
      render(<Demo />)
      expect(states()).toEqual(['current', 'upcoming', 'upcoming'])
    })

    it('completes every step when the active step is past the end', () => {
      render(<Demo activeStep={3} />)
      expect(states()).toEqual(['completed', 'completed', 'completed'])
      expect(screen.queryByRole('listitem', { current: 'step' })).toBeNull()
    })

    it('marks only the current step with aria-current', () => {
      render(<Demo activeStep={1} />)
      expect(step('Profile')).toHaveAttribute('aria-current', 'step')
      expect(step('Account')).not.toHaveAttribute('aria-current')
      expect(step('Review')).not.toHaveAttribute('aria-current')
    })

    it('says which steps are completed or not started, without repeating the current one', () => {
      render(<Demo activeStep={1} />)
      expect(step('Account')).toHaveTextContent('Completed')
      expect(step('Review')).toHaveTextContent('Not started')
      expect(step('Profile')).not.toHaveTextContent('Completed')
      expect(step('Profile')).not.toHaveTextContent('Not started')
    })

    it('uses other labels for the status', () => {
      render(
        <Demo
          activeStep={1}
          labels={{ completed: 'Hecho', current: 'Ahora', upcoming: 'Pendiente' }}
        />,
      )
      expect(step('Account')).toHaveTextContent('Hecho')
      expect(step('Profile')).toHaveTextContent('Ahora')
      expect(step('Review')).toHaveTextContent('Pendiente')
    })

    it('shows a check for the completed steps', () => {
      render(<Demo activeStep={2} />)
      const completed = step('Account').querySelector('[data-plume-step-indicator-content]')
      expect(completed?.querySelector('svg')).not.toBeNull()
      expect(completed).toHaveAttribute('aria-hidden', 'true')
    })

    it('shows what the indicator is given', () => {
      render(
        <Stepper>
          <Step>
            <StepIndicator>★</StepIndicator>
            <StepTitle>One</StepTitle>
          </Step>
        </Stepper>,
      )
      expect(step('One')).toHaveTextContent('★')
    })

    it('numbers the steps of a wrapped child', () => {
      function Wrapped({ title }: Readonly<{ title: string }>) {
        return (
          <Step>
            <StepIndicator />
            <StepTitle>{title}</StepTitle>
          </Step>
        )
      }
      render(
        <Stepper activeStep={1}>
          <Wrapped title="A" />
          <Wrapped title="B" />
        </Stepper>,
      )
      expect(states()).toEqual(['completed', 'current'])
    })
  })

  describe('structure and appearance', () => {
    it('exposes the orientation', () => {
      const { rerender } = render(<Demo />)
      expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'horizontal')
      rerender(<Demo orientation="vertical" />)
      expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'vertical')
    })

    it('hides the separators from assistive technology and gives the parts their state', () => {
      render(<Demo activeStep={1} />)
      const separators = document.querySelectorAll('[data-plume-step-separator]')
      expect(separators).toHaveLength(3)
      expect(separators[0]).toHaveAttribute('aria-hidden', 'true')
      expect(separators[0]).toHaveAttribute('data-state', 'completed')
      expect(step('Profile').querySelector('[data-plume-step-title]')).toHaveAttribute(
        'data-state',
        'current',
      )
    })

    it('applies the base, variant and size classes', () => {
      render(<Demo size="lg" variant="outline" />)
      expect(screen.getByRole('list')).toHaveClass('stepper', 'outline', 'lg')
      expect(step('Account')).toHaveClass('step')
    })

    it('defaults to a solid, medium stepper', () => {
      render(<Demo />)
      expect(screen.getByRole('list')).toHaveClass('stepper', 'solid', 'md')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Demo colorScheme="success" />)
      expect(screen.getByRole('list')).toHaveStyle(
        '--stepper-solid: var(--plume-color-success-solid)',
      )
    })

    it('lets style override a variable', () => {
      render(<Demo style={{ '--stepper-solid': 'red' } as React.CSSProperties} />)
      expect(screen.getByRole('list')).toHaveStyle('--stepper-solid: red')
    })

    it('drops the Plume classes when it is unstyled and keeps the user classes', () => {
      render(
        <Stepper className="root" variant="unstyled">
          <Step className="step">
            <StepIndicator className="indicator" />
            <StepTitle className="title">One</StepTitle>
            <StepDescription className="description">Desc</StepDescription>
            <StepSeparator className="separator" />
          </Step>
        </Stepper>,
      )
      expect(screen.getByRole('list')).toHaveAttribute('class', 'root')
      expect(screen.getByRole('listitem')).toHaveAttribute('class', 'step')
      expect(document.querySelector('[data-plume-step-indicator]')).toHaveAttribute(
        'class',
        'indicator',
      )
      expect(screen.getByText('One')).toHaveAttribute('class', 'title')
      expect(screen.getByText('Desc')).toHaveAttribute('class', 'description')
      expect(document.querySelector('[data-plume-step-separator]')).toHaveAttribute(
        'class',
        'separator',
      )
    })

    it('forwards the refs of the parts', () => {
      const step = createRef<HTMLLIElement>()
      const indicator = createRef<HTMLSpanElement>()
      const title = createRef<HTMLSpanElement>()
      const description = createRef<HTMLSpanElement>()
      const separator = createRef<HTMLSpanElement>()
      render(
        <Stepper>
          <Step ref={step}>
            <StepIndicator ref={indicator} />
            <StepTitle ref={title}>One</StepTitle>
            <StepDescription ref={description}>Desc</StepDescription>
            <StepSeparator ref={separator} />
          </Step>
        </Stepper>,
      )
      expect(step.current).toBe(screen.getByRole('listitem'))
      expect(indicator.current).toBe(document.querySelector('[data-plume-step-indicator]'))
      expect(title.current).toBe(screen.getByText('One'))
      expect(description.current).toBe(screen.getByText('Desc'))
      expect(separator.current).toBe(document.querySelector('[data-plume-step-separator]'))
    })
  })

  describe('outside a stepper', () => {
    it.each([
      ['Step', <Step key="step" />, 'Stepper'],
      ['StepIndicator', <StepIndicator key="indicator" />, 'Stepper'],
      ['StepTitle', <StepTitle key="title" />, 'Stepper'],
      ['StepDescription', <StepDescription key="description" />, 'Stepper'],
      ['StepSeparator', <StepSeparator key="separator" />, 'Stepper'],
    ])('throws when %s has no Stepper', (name, element, owner) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <${owner}>`)
      error.mockRestore()
    })

    it.each([
      ['StepIndicator', <StepIndicator key="indicator" />],
      ['StepTitle', <StepTitle key="title" />],
      ['StepDescription', <StepDescription key="description" />],
      ['StepSeparator', <StepSeparator key="separator" />],
    ])('throws when %s is inside a Stepper but outside a Step', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<Stepper>{element}</Stepper>)).toThrow(
        `${name} must be used within a <Step>`,
      )
      error.mockRestore()
    })

    it('throws when a Step is rendered inside the Stepper without being its child', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<Step />)).toThrow()
      error.mockRestore()
    })
  })
})
