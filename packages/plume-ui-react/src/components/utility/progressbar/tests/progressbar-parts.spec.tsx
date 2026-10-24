import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import type { CSSProperties } from 'react'
import { ProgressBar, ProgressBarIndicator, ProgressBarTrack, ProgressBarValue } from '..'

const root = (container: HTMLElement): HTMLElement => container.firstElementChild as HTMLElement

describe('ProgressBar parts', () => {
  it('renders the track with the indicator inside by default', () => {
    render(<ProgressBar aria-label="Upload" value={40} />)
    const track = screen.getByRole('progressbar')
    expect(track).toHaveAttribute('data-plume-progressbar-track')
    expect(track).toHaveAttribute('data-plume-progressbar')
    expect(track.firstElementChild).toHaveAttribute('data-plume-progressbar-indicator')
  })

  it('puts the className and style of the root on the outermost element', () => {
    const { container, rerender } = render(
      <ProgressBar aria-label="Upload" className="mine" style={{ opacity: 0.5 }} />,
    )
    expect(root(container)).toBe(screen.getByRole('progressbar'))
    expect(root(container)).toHaveClass('mine')
    rerender(
      <ProgressBar aria-label="Upload" className="mine" showValue style={{ opacity: 0.5 }} />,
    )
    expect(root(container)).toHaveAttribute('data-plume-progressbar-field')
    expect(root(container)).toHaveAttribute('data-plume-progressbar')
    expect(root(container)).toHaveClass('mine')
    expect(root(container)).toHaveStyle({ opacity: '0.5' })
    expect(screen.getByRole('progressbar')).not.toHaveClass('mine')
  })

  it('sends the ref and the accessible name to the track even with a value text', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ProgressBar aria-label="Upload" id="upload" ref={ref} showValue />)
    expect(ref.current).toBe(screen.getByRole('progressbar', { name: 'Upload' }))
    expect(ref.current).toHaveAttribute('id', 'upload')
  })

  it('renders a composed indicator inside the track', () => {
    render(
      <ProgressBar aria-label="Upload" value={25}>
        <ProgressBarIndicator className="mine" />
      </ProgressBar>,
    )
    const track = screen.getByRole('progressbar')
    expect(track.children).toHaveLength(1)
    expect(track.firstElementChild).toHaveClass('indicator', 'mine')
    expect(track.firstElementChild).toHaveStyle({ inlineSize: '25%' })
  })

  it('wraps a composed track and value in the field', () => {
    const { container } = render(
      <ProgressBar aria-label="Upload" className="mine" value={40}>
        <ProgressBarTrack className="track">
          <ProgressBarIndicator className="bar" />
        </ProgressBarTrack>
        <ProgressBarValue className="text" />
      </ProgressBar>,
    )
    expect(root(container)).toHaveAttribute('data-plume-progressbar-field')
    expect(root(container)).toHaveClass('mine')
    const track = screen.getByRole('progressbar', { name: 'Upload' })
    expect(track.parentElement).toBe(root(container))
    expect(track).toHaveClass('progressbar', 'track')
    expect(track.firstElementChild).toHaveClass('indicator', 'bar')
    expect(screen.getByText('40%')).toHaveClass('value', 'text')
  })

  it('lets the track fall back to the indicator', () => {
    render(
      <ProgressBar aria-label="Upload" value={40}>
        <ProgressBarTrack />
        <ProgressBarValue />
      </ProgressBar>,
    )
    expect(screen.getByRole('progressbar').firstElementChild).toHaveAttribute(
      'data-plume-progressbar-indicator',
    )
  })

  it('replaces the text of the value with its children', () => {
    render(
      <ProgressBar aria-label="Upload" value={40}>
        <ProgressBarTrack />
        <ProgressBarValue>4 of 10 files</ProgressBarValue>
      </ProgressBar>,
    )
    expect(screen.getByText('4 of 10 files')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders no text in the value when it is indeterminate', () => {
    const { container } = render(
      <ProgressBar aria-label="Upload" indeterminate>
        <ProgressBarTrack />
        <ProgressBarValue />
      </ProgressBar>,
    )
    expect(container.querySelector('[data-plume-progressbar-value]')).toBeNull()
  })

  it('lets the track take its own attributes over those of the root', () => {
    render(
      <ProgressBar aria-label="Upload" value={40}>
        <ProgressBarTrack aria-label="Disk" title="Disk" />
      </ProgressBar>,
    )
    expect(screen.getByRole('progressbar', { name: 'Disk' })).toHaveAttribute('title', 'Disk')
  })

  it('forwards the ref and the style of each part', () => {
    const track = createRef<HTMLDivElement>()
    const indicator = createRef<HTMLDivElement>()
    const text = createRef<HTMLSpanElement>()
    render(
      <ProgressBar aria-label="Upload" value={40}>
        <ProgressBarTrack ref={track} style={{ '--probe': 'red' } as CSSProperties}>
          <ProgressBarIndicator ref={indicator} style={{ '--probe': 'pink' } as CSSProperties} />
        </ProgressBarTrack>
        <ProgressBarValue ref={text} style={{ '--probe': 'blue' } as CSSProperties} />
      </ProgressBar>,
    )
    expect(track.current).toBe(screen.getByRole('progressbar'))
    expect(track.current).toHaveStyle('--probe: red')
    expect(indicator.current).toHaveStyle('--probe: pink')
    expect(indicator.current).toHaveStyle({ inlineSize: '40%' })
    expect(text.current).toHaveStyle('--probe: blue')
  })

  it('keeps the style of an indeterminate indicator', () => {
    render(
      <ProgressBar aria-label="Upload" indeterminate>
        <ProgressBarIndicator style={{ opacity: 0.5 }} />
      </ProgressBar>,
    )
    const indicator = document.querySelector<HTMLElement>('[data-plume-progressbar-indicator]')
    expect(indicator).toHaveStyle({ opacity: '0.5' })
    expect(indicator?.style.inlineSize).toBe('')
  })

  it('drops the Plume classes of every part when it is unstyled', () => {
    render(
      <ProgressBar aria-label="Upload" value={40} variant="unstyled">
        <ProgressBarTrack className="track">
          <ProgressBarIndicator className="bar" />
        </ProgressBarTrack>
        <ProgressBarValue className="text" />
      </ProgressBar>,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('class', 'track')
    expect(document.querySelector('[data-plume-progressbar-indicator]')).toHaveAttribute(
      'class',
      'bar',
    )
    expect(screen.getByText('40%')).toHaveAttribute('class', 'text')
  })

  it.each([
    ['ProgressBarTrack', <ProgressBarTrack key="a" />],
    ['ProgressBarIndicator', <ProgressBarIndicator key="b" />],
    ['ProgressBarValue', <ProgressBarValue key="c" />],
  ])('%s throws outside a ProgressBar', (name, element) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(element)).toThrow(`${name} must be used within a <ProgressBar>`)
    error.mockRestore()
  })
})
