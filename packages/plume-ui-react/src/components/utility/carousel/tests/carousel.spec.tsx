import { act, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import {
  Carousel,
  CarouselDot,
  CarouselDots,
  CarouselNext,
  CarouselPlayPause,
  CarouselPrev,
  CarouselSlide,
  CarouselSlides,
} from '..'
import type { CarouselProps } from '..'

const scrollTo = vi.fn()
let reducedMotion = false

beforeEach(() => {
  scrollTo.mockReset()
  reducedMotion = false
  Element.prototype.scrollTo = scrollTo
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: () => undefined,
    matches: query.includes('reduced-motion') ? reducedMotion : false,
    media: query,
    removeEventListener: () => undefined,
  }))
})

function Demo({ slides = 3, ...props }: Readonly<Partial<CarouselProps> & { slides?: number }>) {
  return (
    <Carousel aria-label="Photos" {...props}>
      <CarouselSlides>
        {Array.from({ length: slides }, (_, position) => (
          <CarouselSlide key={position}>Slide {position + 1}</CarouselSlide>
        ))}
      </CarouselSlides>
      <CarouselPrev />
      <CarouselNext />
      <CarouselPlayPause />
      <CarouselDots />
    </Carousel>
  )
}

const slide = (position: number): HTMLElement =>
  screen.getByText(`Slide ${position}`).closest('[data-plume-carousel-slide]') as HTMLElement
const next = (): HTMLElement => screen.getByRole('button', { name: 'Next slide' })
const prev = (): HTMLElement => screen.getByRole('button', { name: 'Previous slide' })
const tabs = (): HTMLElement[] => screen.getAllByRole('tab')
const scroller = (): HTMLElement =>
  document.querySelector('[data-plume-carousel-slides]') as HTMLElement

describe('Carousel component', () => {
  describe('rendering', () => {
    it('renders a labelled carousel region', () => {
      render(<Demo />)
      const region = screen.getByRole('region', { name: 'Photos' })
      expect(region).toHaveAttribute('aria-roledescription', 'carousel')
    })

    it('translates the role descriptions of the carousel and of its slides', () => {
      render(<Demo labels={{ roleDescription: 'carrusel', slideRoleDescription: 'diapositiva' }} />)
      expect(screen.getByRole('region', { name: 'Photos' })).toHaveAttribute(
        'aria-roledescription',
        'carrusel',
      )
      expect(screen.getAllByRole('tabpanel')[0]).toHaveAttribute(
        'aria-roledescription',
        'diapositiva',
      )
    })

    it('renders every slide as a labelled tab panel', () => {
      render(<Demo />)
      const groups = screen.getAllByRole('tabpanel')
      expect(groups).toHaveLength(3)
      expect(groups[0]).toHaveAttribute('aria-roledescription', 'slide')
      expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual([
        '1 of 3',
        '2 of 3',
        '3 of 3',
      ])
    })

    it('uses another label for the slides, and lets a slide set its own', () => {
      render(
        <Carousel aria-label="Photos" labels={{ slide: (i, n) => `Foto ${i + 1}/${n}` }}>
          <CarouselSlides>
            <CarouselSlide>One</CarouselSlide>
            <CarouselSlide aria-label="Custom">Two</CarouselSlide>
          </CarouselSlides>
        </Carousel>,
      )
      expect(screen.getByRole('tabpanel', { name: 'Foto 1/2' })).toBeInTheDocument()
      expect(screen.getByRole('tabpanel', { name: 'Custom' })).toBeInTheDocument()
    })

    it('lets only the visible slide be focused, so the strip can be scrolled with the keyboard', () => {
      render(<Demo />)
      expect(slide(1)).toHaveAttribute('tabindex', '0')
      expect(slide(2)).not.toHaveAttribute('tabindex')
    })

    it('shows only the first slide to assistive technology and the keyboard', () => {
      render(<Demo />)
      expect(slide(1)).not.toHaveAttribute('inert')
      expect(slide(2)).toHaveAttribute('inert')
      expect(slide(3)).toHaveAttribute('inert')
      expect(slide(1)).toHaveAttribute('data-active')
    })

    it('forwards the refs', () => {
      const root = createRef<HTMLElement>()
      const slides = createRef<HTMLDivElement>()
      const one = createRef<HTMLDivElement>()
      const previous = createRef<HTMLButtonElement>()
      const following = createRef<HTMLButtonElement>()
      const dots = createRef<HTMLDivElement>()
      const toggle = createRef<HTMLButtonElement>()
      render(
        <Carousel aria-label="x" ref={root}>
          <CarouselSlides ref={slides}>
            <CarouselSlide ref={one}>A</CarouselSlide>
          </CarouselSlides>
          <CarouselPrev ref={previous} />
          <CarouselNext ref={following} />
          <CarouselDots ref={dots} />
          <CarouselPlayPause ref={toggle} />
        </Carousel>,
      )
      expect(root.current).toBe(screen.getByRole('region'))
      expect(slides.current).toBe(scroller())
      expect(one.current).toBe(screen.getByText('A'))
      expect(previous.current).toBe(prev())
      expect(following.current).toBe(next())
      expect(dots.current).toBe(screen.getByRole('tablist'))
      expect(toggle.current?.tagName).toBe('BUTTON')
    })

    it('links the controls to the slides', () => {
      render(<Demo id="gallery" />)
      expect(scroller()).toHaveAttribute('id', 'gallery-slides')
      expect(next()).toHaveAttribute('aria-controls', 'gallery-slides')
      expect(tabs()[1]).toHaveAttribute('aria-controls', 'gallery-slide-1')
      expect(slide(2)).toHaveAttribute('id', 'gallery-slide-1')
    })

    it('generates an id', () => {
      render(<Demo />)
      expect(screen.getByRole('region').id).not.toBe('')
    })

    it('lets the slides take their own id', () => {
      render(
        <Carousel aria-label="x">
          <CarouselSlides id="mine">
            <CarouselSlide>A</CarouselSlide>
          </CarouselSlides>
        </Carousel>,
      )
      expect(scroller()).toHaveAttribute('id', 'mine')
    })
  })

  describe('navigation', () => {
    it('goes to the next and the previous slide', async () => {
      const onIndexChange = vi.fn()
      render(<Demo onIndexChange={onIndexChange} />)
      await userEvent.click(next())
      expect(onIndexChange).toHaveBeenLastCalledWith(1)
      expect(slide(2)).not.toHaveAttribute('inert')
      expect(slide(1)).toHaveAttribute('inert')
      await userEvent.click(prev())
      expect(onIndexChange).toHaveBeenLastCalledWith(0)
      expect(slide(1)).not.toHaveAttribute('inert')
    })

    it('scrolls to the slide', async () => {
      render(<Demo />)
      await userEvent.click(next())
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }))
    })

    it('jumps without animation for a reduced motion preference', async () => {
      reducedMotion = true
      render(<Demo />)
      await userEvent.click(next())
      expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }))
    })

    it('starts on defaultIndex, without animation', () => {
      render(<Demo defaultIndex={2} />)
      expect(slide(3)).not.toHaveAttribute('inert')
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))
    })

    it('stops at the ends without loop', async () => {
      render(<Demo />)
      expect(prev()).toBeDisabled()
      expect(next()).toBeEnabled()
      await userEvent.click(next())
      await userEvent.click(next())
      expect(next()).toBeDisabled()
      expect(prev()).toBeEnabled()
    })

    it('wraps around with loop', async () => {
      render(<Demo loop />)
      expect(prev()).toBeEnabled()
      await userEvent.click(prev())
      expect(slide(3)).not.toHaveAttribute('inert')
      expect(next()).toBeEnabled()
      await userEvent.click(next())
      expect(slide(1)).not.toHaveAttribute('inert')
    })

    it('disables the arrows with a single slide', () => {
      render(<Demo loop slides={1} />)
      expect(next()).toBeDisabled()
      expect(prev()).toBeDisabled()
    })

    it('can be controlled', async () => {
      const onIndexChange = vi.fn()
      const { rerender } = render(<Demo index={0} onIndexChange={onIndexChange} />)
      await userEvent.click(next())
      expect(onIndexChange).toHaveBeenCalledWith(1)
      expect(slide(1)).not.toHaveAttribute('inert')
      rerender(<Demo index={2} onIndexChange={onIndexChange} />)
      expect(slide(3)).not.toHaveAttribute('inert')
    })
  })

  describe('dots', () => {
    it('renders a tab for each slide, selecting the current one', () => {
      render(<Demo />)
      expect(screen.getByRole('tablist', { name: 'Choose a slide' })).toBeInTheDocument()
      expect(tabs()).toHaveLength(3)
      expect(tabs()[0]).toHaveAttribute('aria-selected', 'true')
      expect(tabs()[0]).toHaveAccessibleName('Slide 1 of 3')
      expect(tabs()[0]).toHaveAttribute('tabindex', '0')
      expect(tabs()[1]).toHaveAttribute('tabindex', '-1')
    })

    it('goes to the slide of a dot', async () => {
      render(<Demo />)
      await userEvent.click(tabs()[2])
      expect(slide(3)).not.toHaveAttribute('inert')
      expect(tabs()[2]).toHaveAttribute('aria-selected', 'true')
      expect(tabs()[2]).toHaveAttribute('data-active')
    })

    it('moves between the dots with the arrow keys, wrapping at the ends', async () => {
      render(<Demo />)
      tabs()[0].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(tabs()[1]).toHaveFocus()
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(tabs()[2]).toHaveFocus()
      await userEvent.keyboard('{ArrowRight}')
      expect(tabs()[0]).toHaveFocus()
    })

    it('goes to the first and the last with Home and End', async () => {
      render(<Demo />)
      tabs()[1].focus()
      await userEvent.keyboard('{End}')
      expect(tabs()[2]).toHaveFocus()
      expect(slide(3)).not.toHaveAttribute('inert')
      await userEvent.keyboard('{Home}')
      expect(tabs()[0]).toHaveFocus()
    })

    it('ignores other keys', async () => {
      render(<Demo />)
      tabs()[0].focus()
      await userEvent.keyboard('a')
      expect(tabs()[0]).toHaveFocus()
    })

    it('uses another label for the group and for the dots', () => {
      render(
        <Carousel aria-label="x" labels={{ dot: (i) => `Ir a ${i + 1}`, dots: 'Elegir' }}>
          <CarouselSlides>
            <CarouselSlide>A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselDots />
        </Carousel>,
      )
      expect(screen.getByRole('tablist', { name: 'Elegir' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Ir a 2' })).toHaveClass('dot')
    })
  })

  describe('scrolling', () => {
    const mockPositions = (current: number): void => {
      const lefts = [0, 1, 2].map((position) => (position - current) * 300)
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: Element,
      ) {
        const isSlide = this.hasAttribute('data-plume-carousel-slide')
        const left = isSlide
          ? lefts[Array.from(this.parentElement?.children ?? []).indexOf(this)]
          : 0
        return { left } as DOMRect
      })
    }

    afterEach(() => vi.restoreAllMocks())

    it('follows the slide the user scrolls to', async () => {
      const onIndexChange = vi.fn()
      render(<Demo onIndexChange={onIndexChange} />)
      mockPositions(2)
      fireEvent.scroll(scroller())
      await vi.waitFor(() => expect(onIndexChange).toHaveBeenCalledWith(2))
      expect(slide(3)).not.toHaveAttribute('inert')
      expect(scrollTo).not.toHaveBeenCalled()
    })

    it('ignores the scroll it caused itself, until it ends', async () => {
      const onIndexChange = vi.fn()
      render(<Demo onIndexChange={onIndexChange} />)
      await userEvent.click(next())
      onIndexChange.mockClear()
      mockPositions(0)
      fireEvent.scroll(scroller())
      await new Promise((resolve) => requestAnimationFrame(resolve))
      expect(onIndexChange).not.toHaveBeenCalled()
      fireEvent(scroller(), new Event('scrollend'))
      mockPositions(2)
      fireEvent.scroll(scroller())
      await vi.waitFor(() => expect(onIndexChange).toHaveBeenCalledWith(2))
    })
  })

  describe('autoplay', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('advances on its own and wraps around', () => {
      render(<Demo autoplay={1000} />)
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(2)).not.toHaveAttribute('inert')
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(3)).not.toHaveAttribute('inert')
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
    })

    it('does not advance without autoplay', () => {
      render(<Demo />)
      act(() => {
        vi.advanceTimersByTime(10000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
    })

    it('pauses while the pointer is over it', () => {
      render(<Demo autoplay={1000} />)
      fireEvent.mouseEnter(screen.getByRole('region'))
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
      fireEvent.mouseLeave(screen.getByRole('region'))
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(2)).not.toHaveAttribute('inert')
    })

    it('pauses while something inside has the focus', () => {
      render(<Demo autoplay={1000} />)
      fireEvent.focus(next())
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
      fireEvent.blur(next())
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(2)).not.toHaveAttribute('inert')
    })

    it('has a button to pause and to start it again', () => {
      render(<Demo autoplay={1000} />)
      const toggle = screen.getByRole('button', { name: 'Pause the slideshow' })
      expect(toggle).toHaveAttribute('data-playing')
      fireEvent.click(toggle)
      act(() => {
        vi.advanceTimersByTime(3000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
      const start = screen.getByRole('button', { name: 'Start the slideshow' })
      expect(start).not.toHaveAttribute('data-playing')
      fireEvent.click(start)
      act(() => {
        vi.advanceTimersByTime(1000)
      })
      expect(slide(2)).not.toHaveAttribute('inert')
    })

    it('does not run for a reduced motion preference', () => {
      reducedMotion = true
      render(<Demo autoplay={1000} />)
      act(() => {
        vi.advanceTimersByTime(5000)
      })
      expect(slide(1)).not.toHaveAttribute('inert')
      expect(screen.getByRole('button', { name: 'Start the slideshow' })).toBeInTheDocument()
    })

    it('does not announce the slides while it runs, and does when it is not running', () => {
      const { rerender } = render(<Demo autoplay={1000} />)
      expect(scroller()).toHaveAttribute('aria-live', 'off')
      rerender(<Demo />)
      expect(scroller()).toHaveAttribute('aria-live', 'polite')
    })

    it('uses other labels and content for the button, and lets the click be prevented', () => {
      render(
        <Carousel aria-label="x" autoplay={1000} labels={{ pause: 'Parar', play: 'Seguir' }}>
          <CarouselSlides>
            <CarouselSlide>A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselPlayPause onClick={(event) => event.preventDefault()}>toggle</CarouselPlayPause>
        </Carousel>,
      )
      const button = screen.getByRole('button', { name: 'Parar' })
      expect(button).toHaveTextContent('toggle')
      fireEvent.click(button)
      expect(screen.getByRole('button', { name: 'Parar' })).toBeInTheDocument()
    })
  })

  describe('arrows', () => {
    it('takes the names of the arrows from the labels of the carousel', () => {
      render(
        <Carousel aria-label="x" labels={{ next: 'Siguiente', previous: 'Anterior' }}>
          <CarouselSlides>
            <CarouselSlide>A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselPrev />
          <CarouselNext />
        </Carousel>,
      )
      expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument()
    })

    it('uses other labels, icons or content, and lets the click be prevented', async () => {
      render(
        <Carousel aria-label="x">
          <CarouselSlides>
            <CarouselSlide>A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselPrev label="Atrás" />
          <CarouselNext
            icon={<i>icon</i>}
            label="Adelante"
            onClick={(event) => event.preventDefault()}
          />
        </Carousel>,
      )
      expect(screen.getByRole('button', { name: 'Atrás' })).toBeInTheDocument()
      const forward = screen.getByRole('button', { name: 'Adelante' })
      expect(forward).toHaveTextContent('icon')
      await userEvent.click(forward)
      expect(screen.getByText('A').closest('[data-plume-carousel-slide]')).not.toHaveAttribute(
        'inert',
      )
    })

    it('renders children in place of the icon and can be disabled', () => {
      render(
        <Carousel aria-label="x">
          <CarouselSlides>
            <CarouselSlide>A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselNext disabled>go</CarouselNext>
        </Carousel>,
      )
      expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Next slide' })).toHaveTextContent('go')
    })
  })

  describe('appearance', () => {
    it.each(['ghost', 'overlay', 'solid'] as const)('applies the %s variant', (variant) => {
      render(<Demo variant={variant} />)
      expect(document.querySelector('[data-plume-carousel]')).toHaveClass(variant)
    })

    it('applies the base, variant and size classes', () => {
      render(<Demo size="lg" variant="outline" />)
      expect(screen.getByRole('region')).toHaveClass('carousel', 'outline', 'lg')
      expect(next()).toHaveClass('arrow', 'next')
      expect(prev()).toHaveClass('arrow', 'prev')
      expect(scroller()).toHaveClass('slides')
      expect(slide(1)).toHaveClass('slide')
      expect(screen.getByRole('tablist')).toHaveClass('dots')
      expect(tabs()[0]).toHaveClass('dot')
    })

    it('defaults to a solid, medium carousel', () => {
      render(<Demo />)
      expect(screen.getByRole('region')).toHaveClass('carousel', 'solid', 'md')
    })

    it('exposes the color scheme as CSS variables', () => {
      render(<Demo colorScheme="success" />)
      expect(screen.getByRole('region')).toHaveStyle(
        '--carousel-solid: var(--plume-color-success-solid)',
      )
    })

    it('lets style override a variable', () => {
      render(<Demo style={{ '--carousel-solid': 'red' } as React.CSSProperties} />)
      expect(screen.getByRole('region')).toHaveStyle('--carousel-solid: red')
    })

    it('drops the Plume classes when it is unstyled and keeps the user classes', () => {
      render(
        <Carousel aria-label="x" className="root" variant="unstyled">
          <CarouselSlides className="slides-mine">
            <CarouselSlide className="slide-mine">A</CarouselSlide>
            <CarouselSlide>B</CarouselSlide>
          </CarouselSlides>
          <CarouselPrev className="prev-mine" />
          <CarouselPlayPause className="play-mine" />
          <CarouselDots className="dots-mine" />
        </Carousel>,
      )
      expect(screen.getByRole('region')).toHaveAttribute('class', 'root')
      expect(scroller()).toHaveAttribute('class', 'slides-mine')
      expect(screen.getByText('A')).toHaveAttribute('class', 'slide-mine')
      expect(prev()).toHaveAttribute('class', 'prev-mine')
      expect(screen.getByRole('button', { name: 'Start the slideshow' })).toHaveAttribute(
        'class',
        'play-mine',
      )
      expect(screen.getByRole('tablist')).toHaveAttribute('class', 'dots-mine')
    })
  })

  describe('orientation, indicators and controls', () => {
    afterEach(() => vi.restoreAllMocks())

    const build = (
      props: Partial<CarouselProps> = {},
      dots: React.ReactNode = <CarouselDots />,
    ): React.ReactElement => (
      <Carousel aria-label="Photos" {...props}>
        <CarouselSlides>
          {[1, 2, 3].map((position) => (
            <CarouselSlide key={position}>Slide {position}</CarouselSlide>
          ))}
        </CarouselSlides>
        <CarouselPrev />
        <CarouselNext />
        {dots}
      </Carousel>
    )

    it('is horizontal by default', () => {
      render(build())
      expect(screen.getByRole('region')).toHaveAttribute('data-orientation', 'horizontal')
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal')
      expect(screen.getByRole('region')).not.toHaveClass('vertical')
    })

    it('marks the parts as vertical', () => {
      render(build({ orientation: 'vertical' }))
      expect(screen.getByRole('region')).toHaveClass('vertical')
      expect(screen.getByRole('region')).toHaveAttribute('data-orientation', 'vertical')
      expect(scroller()).toHaveAttribute('data-orientation', 'vertical')
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
      expect(next()).toHaveAttribute('data-orientation', 'vertical')
    })

    it('moves between the dots with the vertical arrow keys when it is vertical', async () => {
      render(build({ orientation: 'vertical' }))
      tabs()[0].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(tabs()[0]).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(tabs()[1]).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(tabs()[2]).toHaveFocus()
    })

    it('scrolls to the slide along the vertical axis', async () => {
      render(build({ orientation: 'vertical' }))
      await userEvent.click(next())
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: expect.any(Number) }))
      expect(scrollTo).not.toHaveBeenCalledWith(expect.objectContaining({ left: expect.anything() }))
    })

    it('follows the slide the user scrolls to when it is vertical', async () => {
      const onIndexChange = vi.fn()
      render(build({ onIndexChange, orientation: 'vertical' }))
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: Element,
      ) {
        const siblings = Array.from(this.parentElement?.children ?? [])
        const top = this.hasAttribute('data-plume-carousel-slide')
          ? (siblings.indexOf(this) - 2) * 200
          : 0
        return { top } as DOMRect
      })
      fireEvent.scroll(scroller())
      await vi.waitFor(() => expect(onIndexChange).toHaveBeenCalledWith(2))
    })

    it('puts the dots in a row and keeps the dots appearance by default', () => {
      render(build())
      expect(screen.getByRole('tablist')).toHaveAttribute('data-appearance', 'dots')
      expect(screen.getByRole('tablist')).toHaveClass('dots')
      expect(tabs()[0]).toBeEmptyDOMElement()
    })

    it.each(['bars', 'numbers', 'thumbnails'] as const)('applies the %s appearance', (appearance) => {
      render(build({}, <CarouselDots appearance={appearance} />))
      expect(screen.getByRole('tablist')).toHaveAttribute('data-appearance', appearance)
      expect(screen.getByRole('tablist')).toHaveClass('dots', appearance)
    })

    it('numbers the dots with the numbers appearance', () => {
      render(build({}, <CarouselDots appearance="numbers" />))
      expect(tabs().map((tab) => tab.textContent)).toEqual(['1', '2', '3'])
    })

    it('fills each dot with what the function returns', () => {
      render(
        build(
          {},
          <CarouselDots appearance="thumbnails">
            {(position) => (
              <CarouselDot>
                <img alt="" data-testid="thumb" src={`/photo-${position}.jpg`} />
              </CarouselDot>
            )}
          </CarouselDots>,
        ),
      )
      expect(screen.getAllByTestId('thumb')).toHaveLength(3)
    })

    it('does not style the dots appearance when unstyled', () => {
      render(build({ variant: 'unstyled' }, <CarouselDots appearance="bars" />))
      expect(screen.getByRole('tablist')).not.toHaveClass('bars')
      expect(screen.getByRole('tablist')).toHaveAttribute('data-appearance', 'bars')
    })

    it('overlays the buttons by default and leaves them in place with inline controls', () => {
      const { rerender } = render(build())
      expect(screen.getByRole('region')).toHaveAttribute('data-controls', 'overlay')
      expect(screen.getByRole('region')).not.toHaveClass('inline')
      rerender(build({ controls: 'inline' }))
      expect(screen.getByRole('region')).toHaveAttribute('data-controls', 'inline')
      expect(screen.getByRole('region')).toHaveClass('inline')
    })
  })

  describe('outside a carousel', () => {
    it.each([
      ['CarouselSlides', <CarouselSlides key="slides" />],
      ['CarouselPrev', <CarouselPrev key="prev" />],
      ['CarouselNext', <CarouselNext key="next" />],
      ['CarouselDots', <CarouselDots key="dots" />],
      ['CarouselPlayPause', <CarouselPlayPause key="play" />],
      ['CarouselSlide', <CarouselSlide key="slide" />],
    ])('throws when %s has no Carousel', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <Carousel>`)
      error.mockRestore()
    })

    it('throws when a slide is not inside the slides', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() =>
        render(
          <Carousel aria-label="x">
            <CarouselSlide>A</CarouselSlide>
          </Carousel>,
        ),
      ).toThrow('CarouselSlide must be used within a <CarouselSlides>')
      error.mockRestore()
    })
  })
})
