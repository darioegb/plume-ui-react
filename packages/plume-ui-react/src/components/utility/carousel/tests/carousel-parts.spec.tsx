import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, type CSSProperties } from 'react'
import {
  Carousel,
  CarouselDot,
  CarouselDots,
  CarouselNext,
  CarouselPrev,
  CarouselSlide,
  CarouselSlides,
} from '..'

beforeEach(() => {
  Element.prototype.scrollTo = vi.fn()
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: () => undefined,
    matches: false,
    media: query,
    removeEventListener: () => undefined,
  }))
})

const slides = (count = 3): React.ReactNode => (
  <CarouselSlides>
    {Array.from({ length: count }, (_, position) => (
      <CarouselSlide key={position}>Slide {position + 1}</CarouselSlide>
    ))}
  </CarouselSlides>
)

const tabs = (): HTMLElement[] => screen.getAllByRole('tab')

describe('CarouselDot', () => {
  it('builds one dot per slide when the dots have no children', () => {
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots />
      </Carousel>,
    )
    expect(tabs()).toHaveLength(3)
    expect(tabs()[0]).toHaveAttribute('data-plume-carousel-dot')
    expect(tabs()[0]).toHaveAttribute('aria-label', 'Slide 1 of 3')
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs()[0]).toHaveAttribute('data-active')
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'false')
    expect(tabs()[1]).not.toHaveAttribute('data-active')
  })

  it('takes the class, the style and the ref', () => {
    const ref = createRef<HTMLButtonElement>()
    const style: CSSProperties = { opacity: 0.5 }
    render(
      <Carousel aria-label="x">
        {slides(2)}
        <CarouselDots>
          <CarouselDot className="mine" ref={ref} style={style} />
          <CarouselDot />
        </CarouselDots>
      </Carousel>,
    )
    expect(tabs()[0]).toHaveClass('dot', 'mine')
    expect(tabs()[0]).toHaveStyle({ opacity: '0.5' })
    expect(ref.current).toBe(tabs()[0])
  })

  it('renders a dot for each slide from a function', () => {
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots>
          {(position) => <CarouselDot className={`dot-${position}`}>{position + 1}</CarouselDot>}
        </CarouselDots>
      </Carousel>,
    )
    expect(tabs().map((tab) => tab.textContent)).toEqual(['1', '2', '3'])
    expect(tabs()[2]).toHaveClass('dot-2')
  })

  it('finds its position when it is wrapped in a component of its own', async () => {
    function Mine(): React.ReactNode {
      return <CarouselDot className="wrapped" />
    }
    render(
      <Carousel aria-label="x">
        {slides(2)}
        <CarouselDots>
          <Mine />
          <Mine />
        </CarouselDots>
      </Carousel>,
    )
    await userEvent.click(tabs()[1])
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs()[1]).toHaveClass('wrapped')
  })

  it('goes to its slide, after the onClick of the user', async () => {
    const onClick = vi.fn()
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots>
          {(position) => <CarouselDot onClick={position === 1 ? onClick : undefined} />}
        </CarouselDots>
      </Carousel>,
    )
    await userEvent.click(tabs()[1])
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('stays on the slide when onClick prevents the default', async () => {
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots>
          {() => <CarouselDot onClick={(event) => event.preventDefault()} />}
        </CarouselDots>
      </Carousel>,
    )
    await userEvent.click(tabs()[1])
    expect(tabs()[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('moves with the arrow keys, after the onKeyDown of the user', async () => {
    const onKeyDown = vi.fn()
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots>{() => <CarouselDot onKeyDown={onKeyDown} />}</CarouselDots>
      </Carousel>,
    )
    tabs()[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onKeyDown).toHaveBeenCalled()
    expect(tabs()[1]).toHaveFocus()
    expect(tabs()[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('leaves the keys alone when onKeyDown prevents the default', async () => {
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselDots>
          {() => <CarouselDot onKeyDown={(event) => event.preventDefault()} />}
        </CarouselDots>
      </Carousel>,
    )
    tabs()[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(tabs()[0]).toHaveFocus()
  })

  it('carries the structure of the dot without the Plume classes when unstyled', () => {
    render(
      <Carousel aria-label="x" variant="unstyled">
        {slides(2)}
        <CarouselDots>
          <CarouselDot className="mine" />
          <CarouselDot />
        </CarouselDots>
      </Carousel>,
    )
    expect(tabs()[0].className).toBe('mine')
    expect(screen.getByRole('tablist').className).toBe('')
  })

  it('throws outside the dots and outside the carousel', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <Carousel aria-label="x">
          <CarouselDot />
        </Carousel>,
      ),
    ).toThrow('CarouselDot must be used within a <CarouselDots>')
    expect(() => render(<CarouselDot />)).toThrow('CarouselDot must be used within a <Carousel>')
    error.mockRestore()
  })
})

describe('CarouselPrev and CarouselNext', () => {
  it('carry their own data attribute', () => {
    render(
      <Carousel aria-label="x">
        {slides()}
        <CarouselPrev />
        <CarouselNext />
      </Carousel>,
    )
    const [prev, next] = screen.getAllByRole('button')
    expect(prev).toHaveAttribute('data-plume-carousel-prev')
    expect(prev).not.toHaveAttribute('data-plume-carousel-next')
    expect(next).toHaveAttribute('data-plume-carousel-next')
    expect(next).not.toHaveAttribute('data-plume-carousel-prev')
  })
})
