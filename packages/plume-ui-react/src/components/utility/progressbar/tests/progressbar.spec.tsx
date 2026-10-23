import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ProgressBar } from '..'

const indicator = (): HTMLElement =>
  document.querySelector<HTMLElement>('[data-plume-progressbar-indicator]') as HTMLElement

describe('ProgressBar component', () => {
  describe('rendering', () => {
    it('has the progressbar role', () => {
      render(<ProgressBar aria-label="Upload" value={30} />)
      expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument()
    })

    it('is a solid, medium, pill bar by default', () => {
      render(<ProgressBar aria-label="Upload" />)
      expect(screen.getByRole('progressbar')).toHaveClass('progressbar', 'md', 'pill')
      expect(indicator()).toHaveClass('indicator')
      expect(indicator()).not.toHaveClass('striped')
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<ProgressBar aria-label="Upload" size={size} />)
      expect(screen.getByRole('progressbar')).toHaveClass(size)
    })

    it('supports the rounded shape', () => {
      render(<ProgressBar aria-label="Upload" shape="rounded" />)
      expect(screen.getByRole('progressbar')).toHaveClass('rounded')
      expect(screen.getByRole('progressbar')).not.toHaveClass('pill')
    })

    it('supports the striped variant, animated or not', () => {
      const { rerender } = render(<ProgressBar aria-label="Upload" variant="striped" />)
      expect(indicator()).toHaveClass('striped')
      expect(indicator()).not.toHaveClass('animated')
      rerender(<ProgressBar animated aria-label="Upload" variant="striped" />)
      expect(indicator()).toHaveClass('striped', 'animated')
    })

    it('does not animate the stripes of the solid variant', () => {
      render(<ProgressBar animated aria-label="Upload" />)
      expect(indicator()).not.toHaveClass('animated')
    })

    it('takes its color from the color scheme', () => {
      render(<ProgressBar aria-label="Upload" colorScheme="success" />)
      expect(screen.getByRole('progressbar')).toHaveStyle({
        '--progressbar-solid': 'var(--plume-color-success-solid)',
      })
    })

    it('keeps the className and style', () => {
      render(<ProgressBar aria-label="Upload" className="mine" style={{ width: '200px' }} />)
      expect(screen.getByRole('progressbar')).toHaveClass('progressbar', 'mine')
      expect(screen.getByRole('progressbar')).toHaveStyle({ width: '200px' })
    })

    it('forwards the ref and the allowed attributes', () => {
      const ref = createRef<HTMLDivElement>()
      render(<ProgressBar aria-label="Upload" id="upload" ref={ref} title="Upload" />)
      expect(ref.current).toBe(screen.getByRole('progressbar'))
      expect(ref.current).toHaveAttribute('id', 'upload')
      expect(ref.current).toHaveAttribute('title', 'Upload')
    })
  })

  describe('value', () => {
    it('exposes the value and the range', () => {
      render(<ProgressBar aria-label="Upload" value={30} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuenow', '30')
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
    })

    it('fills the indicator to the percentage of the value', () => {
      render(<ProgressBar aria-label="Upload" value={30} />)
      expect(indicator()).toHaveStyle({ inlineSize: '30%' })
    })

    it('uses the max to compute the percentage', () => {
      render(<ProgressBar aria-label="Upload" max={8} value={2} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '8')
      expect(indicator()).toHaveStyle({ inlineSize: '25%' })
    })

    it('starts empty', () => {
      render(<ProgressBar aria-label="Upload" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
      expect(indicator()).toHaveStyle({ inlineSize: '0%' })
    })

    it('keeps the value between 0 and the max', () => {
      const { rerender } = render(<ProgressBar aria-label="Upload" value={250} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(indicator()).toHaveStyle({ inlineSize: '100%' })
      rerender(<ProgressBar aria-label="Upload" value={-5} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })

    it('falls back to 100 when the max is not positive', () => {
      render(<ProgressBar aria-label="Upload" max={0} value={50} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
      expect(indicator()).toHaveStyle({ inlineSize: '50%' })
    })

    it('exposes a text for the value', () => {
      render(<ProgressBar aria-label="Upload" value={3} valueText="3 of 10 files" />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 10 files')
    })
  })

  describe('value text', () => {
    const value = (): HTMLElement | null => document.querySelector('[data-plume-progressbar-value]')

    it('shows no text by default and keeps the bar as the root', () => {
      const { container } = render(<ProgressBar aria-label="Upload" value={40} />)
      expect(value()).not.toBeInTheDocument()
      expect(container.firstChild).toBe(screen.getByRole('progressbar'))
    })

    it('shows the percentage next to the bar with showValue', () => {
      render(<ProgressBar aria-label="Upload" showValue value={40} />)
      expect(value()).toHaveTextContent('40%')
      expect(value()).toHaveAttribute('aria-hidden', 'true')
      expect(screen.getByRole('progressbar').parentElement).toHaveAttribute(
        'data-plume-progressbar-field',
      )
    })

    it('rounds the percentage and uses the max', () => {
      render(<ProgressBar aria-label="Upload" max={3} showValue value={1} />)
      expect(value()).toHaveTextContent('33%')
    })

    it('keeps the percentage between 0 and 100', () => {
      render(<ProgressBar aria-label="Upload" showValue value={250} />)
      expect(value()).toHaveTextContent('100%')
    })

    it('formats the text with formatValue', () => {
      render(
        <ProgressBar
          aria-label="Upload"
          formatValue={(current, max) => `${current} / ${max}`}
          max={10}
          showValue
          value={3}
        />,
      )
      expect(value()).toHaveTextContent('3 / 10')
    })

    it('shows no text when it is indeterminate', () => {
      render(<ProgressBar aria-label="Upload" indeterminate showValue />)
      expect(value()).not.toBeInTheDocument()
    })

    it('adds the Plume class and the class of the user to the text', () => {
      render(<ProgressBar classNames={{ value: 'mine' }} aria-label="Upload" showValue value={40} />)
      expect(value()).toHaveClass('value', 'mine')
    })

    it('drops the Plume class of the text when it is unstyled', () => {
      render(
        <ProgressBar classNames={{ value: 'mine' }}
          aria-label="Upload"
          showValue
          value={40}
         
          variant="unstyled"
        />,
      )
      expect(value()).toHaveAttribute('class', 'mine')
    })
  })

  describe('indeterminate', () => {
    it('drops the value and the width', () => {
      render(<ProgressBar aria-label="Upload" indeterminate value={30} valueText="30%" />)
      const bar = screen.getByRole('progressbar')
      expect(bar).not.toHaveAttribute('aria-valuenow')
      expect(bar).not.toHaveAttribute('aria-valuetext')
      expect(bar).toHaveAttribute('data-indeterminate')
      expect(indicator().style.inlineSize).toBe('')
    })

    it('is not marked when it is determinate', () => {
      render(<ProgressBar aria-label="Upload" value={30} />)
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-indeterminate')
    })
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user ones', () => {
      render(
        <ProgressBar classNames={{ indicator: 'bar' }}
          aria-label="Upload"
          className="track"
         
          value={40}
          variant="unstyled"
        />,
      )
      expect(screen.getByRole('progressbar')).toHaveAttribute('class', 'track')
      expect(indicator()).toHaveAttribute('class', 'bar')
    })

    it('has no class without any, and keeps the width', () => {
      render(<ProgressBar aria-label="Upload" value={40} variant="unstyled" />)
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('class')
      expect(indicator()).not.toHaveAttribute('class')
      expect(indicator()).toHaveStyle({ inlineSize: '40%' })
    })
  })

  it('adds the class of the indicator in every variant', () => {
    render(<ProgressBar classNames={{ indicator: 'bar' }} aria-label="Upload" />)
    expect(indicator()).toHaveClass('indicator', 'bar')
  })
})
