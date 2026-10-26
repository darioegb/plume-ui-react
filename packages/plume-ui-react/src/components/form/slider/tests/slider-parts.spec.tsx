import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import {
  Slider,
  SliderBody,
  SliderMarkItem,
  SliderMarkLabel,
  SliderMarks,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from '..'

const part = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-plume-slider-${name}]`)

describe('Slider parts', () => {
  describe('default composition', () => {
    it('renders the body, the track with its range, the marks and the thumb', () => {
      render(<Slider aria-label="Volume" marks={[{ label: 'Half', value: 50 }]} />)
      expect(part('body')).toContainElement(part('track'))
      expect(part('track')).toContainElement(part('range'))
      expect(part('body')).toContainElement(part('marks'))
      expect(part('mark-item')).toContainElement(part('mark-label'))
      expect(screen.getByRole('slider')).toHaveAttribute('data-plume-slider-thumb')
    })

    it('renders a thumb for each value of a range', () => {
      render(<Slider defaultValue={[20, 80]} />)
      expect(screen.getAllByRole('slider')).toHaveLength(2)
    })

    it('renders no marks without the marks prop', () => {
      render(<Slider aria-label="Volume" />)
      expect(part('marks')).not.toBeInTheDocument()
    })
  })

  describe('composition', () => {
    it('renders the parts of the user and wraps them in the body', () => {
      render(
        <Slider aria-label="Volume">
          <SliderTrack className="t">
            <SliderRange className="r" />
          </SliderTrack>
          <SliderThumb className="th" />
        </Slider>,
      )
      expect(part('body')).toContainElement(part('track'))
      expect(part('track')).toHaveClass('t')
      expect(part('range')).toHaveClass('r')
      expect(screen.getByRole('slider')).toHaveClass('th')
    })

    it('renders the body of the user as it is', () => {
      render(
        <Slider aria-label="Volume">
          <SliderBody className="b">
            <SliderThumb />
          </SliderBody>
        </Slider>,
      )
      expect(document.querySelectorAll('[data-plume-slider-body]')).toHaveLength(1)
      expect(part('body')).toHaveClass('b')
    })

    it('puts a track and a range in the default track', () => {
      render(
        <Slider aria-label="Volume">
          <SliderTrack />
          <SliderThumb />
        </Slider>,
      )
      expect(part('track')).toContainElement(part('range'))
    })

    it('composes the thumbs of a range by index', () => {
      render(
        <Slider defaultValue={[20, 80]}>
          <SliderThumb index={0} aria-label="From" />
          <SliderThumb index={1} aria-label="To" />
        </Slider>,
      )
      expect(screen.getByRole('slider', { name: 'From' })).toHaveValue('20')
      expect(screen.getByRole('slider', { name: 'To' })).toHaveValue('80')
    })

    it('renders nothing for a thumb without a value', () => {
      render(
        <Slider aria-label="Volume">
          <SliderThumb />
          <SliderThumb index={1} />
        </Slider>,
      )
      expect(screen.getAllByRole('slider')).toHaveLength(1)
    })

    it('calls the function of the marks for each mark', () => {
      render(
        <Slider aria-label="Volume" marks={[10, 90]}>
          <SliderTrack />
          <SliderMarks className="m">
            {(mark, index) => (
              <SliderMarkItem className="mi" key={index} mark={mark}>
                <SliderMarkLabel className="ml">{`#${mark.value}`}</SliderMarkLabel>
              </SliderMarkItem>
            )}
          </SliderMarks>
          <SliderThumb />
        </Slider>,
      )
      expect(part('marks')).toHaveClass('m')
      expect(document.querySelectorAll('.mi')).toHaveLength(2)
      expect(screen.getByText('#90')).toHaveClass('ml')
    })

    it('renders the marks that the user writes', () => {
      render(
        <Slider aria-label="Volume">
          <SliderMarks>
            <SliderMarkItem className="mi" mark={{ value: 40 }} />
          </SliderMarks>
          <SliderThumb />
        </Slider>,
      )
      expect(document.querySelectorAll('.mi')).toHaveLength(1)
    })

    it('renders no marks container when there are no marks', () => {
      render(
        <Slider aria-label="Volume">
          <SliderMarks>{() => null}</SliderMarks>
          <SliderThumb />
        </Slider>,
      )
      expect(part('marks')).not.toBeInTheDocument()
    })

    it('marks the active marks of a range', () => {
      render(<Slider defaultValue={[20, 80]} marks={[10, 50, 90]} />)
      const items = document.querySelectorAll('[data-plume-slider-mark-item]')
      expect(items[0]).not.toHaveAttribute('data-active')
      expect(items[1]).toHaveAttribute('data-active')
      expect(items[2]).not.toHaveAttribute('data-active')
    })

    it('renders the parts of an unstyled slider with the classes of the user only', () => {
      render(
        <Slider aria-label="Volume" variant="unstyled">
          <SliderTrack className="t">
            <SliderRange className="r" />
          </SliderTrack>
          <SliderThumb className="th" />
        </Slider>,
      )
      expect(part('track')).toHaveAttribute('class', 't')
      expect(part('range')).toHaveAttribute('class', 'r')
      expect(screen.getByRole('slider')).toHaveAttribute('class', 'th')
    })

    it('puts the Plume classes on the parts of a styled slider', () => {
      render(<Slider aria-label="Volume" marks={[{ label: 'Half', value: 50 }]} />)
      expect(part('body')).toHaveClass('body')
      expect(part('track')).toHaveClass('track')
      expect(part('range')).toHaveClass('range')
      expect(part('marks')).toHaveClass('marks')
      expect(part('mark-item')).toHaveClass('mark')
      expect(part('mark-label')).toHaveClass('markLabel')
      expect(screen.getByRole('slider')).toHaveClass('thumb')
    })

    it('lets the style of a mark override its position', () => {
      render(
        <Slider aria-label="Volume">
          <SliderMarks>
            <SliderMarkItem mark={{ value: 40 }} style={{ color: 'red' }} />
          </SliderMarks>
          <SliderThumb />
        </Slider>,
      )
      expect(part('mark-item')?.style.color).toBe('red')
      expect(part('mark-item')?.style.getPropertyValue('--slider-mark')).toBe('0.4')
    })
  })

  describe('refs and attributes', () => {
    it('forwards the ref of each part', () => {
      const body = createRef<HTMLDivElement>()
      const track = createRef<HTMLSpanElement>()
      const range = createRef<HTMLSpanElement>()
      const marks = createRef<HTMLSpanElement>()
      const mark = createRef<HTMLSpanElement>()
      const label = createRef<HTMLSpanElement>()
      const thumb = createRef<HTMLInputElement>()
      render(
        <Slider aria-label="Volume" marks={[{ label: 'Half', value: 50 }]}>
          <SliderBody ref={body}>
            <SliderTrack ref={track}>
              <SliderRange ref={range} />
            </SliderTrack>
            <SliderMarks ref={marks}>
              <SliderMarkItem mark={{ value: 50 }} ref={mark}>
                <SliderMarkLabel ref={label}>Half</SliderMarkLabel>
              </SliderMarkItem>
            </SliderMarks>
            <SliderThumb ref={thumb} />
          </SliderBody>
        </Slider>,
      )
      expect(body.current).toBe(part('body'))
      expect(track.current).toBe(part('track'))
      expect(range.current).toBe(part('range'))
      expect(marks.current).toBe(part('marks'))
      expect(mark.current).toBe(part('mark-item'))
      expect(label.current).toBe(part('mark-label'))
      expect(thumb.current).toBe(screen.getByRole('slider'))
    })

    it('points the ref of the root to the first thumb along with the ref of the part', () => {
      const root = createRef<HTMLInputElement>()
      const thumb = createRef<HTMLInputElement>()
      render(
        <Slider aria-label="Volume" ref={root}>
          <SliderThumb ref={thumb} />
        </Slider>,
      )
      expect(root.current).toBe(screen.getByRole('slider'))
      expect(thumb.current).toBe(screen.getByRole('slider'))
    })

    it('lets a thumb take its own label and title', () => {
      render(
        <Slider defaultValue={[20, 80]}>
          <SliderThumb aria-label="From" index={0} title="Lowest" />
          <SliderThumb index={1} />
        </Slider>,
      )
      expect(screen.getByRole('slider', { name: 'From' })).toHaveAttribute('title', 'Lowest')
      expect(screen.getByRole('slider', { name: 'Maximum' })).toBeInTheDocument()
    })

    it('puts the className and the style of the root on the outermost element', () => {
      const { container } = render(
        <Slider aria-label="Volume" className="root" style={{ margin: 4 }} />,
      )
      expect(container.firstElementChild).toHaveClass('root')
      expect((container.firstElementChild as HTMLElement).style.margin).toBe('4px')
    })
  })

  describe('outside the root', () => {
    it.each([
      ['SliderBody', <SliderBody key="a" />],
      ['SliderMarkItem', <SliderMarkItem key="b" mark={{ value: 1 }} />],
      ['SliderMarkLabel', <SliderMarkLabel key="c" />],
      ['SliderMarks', <SliderMarks key="d" />],
      ['SliderRange', <SliderRange key="e" />],
      ['SliderThumb', <SliderThumb key="f" />],
      ['SliderTrack', <SliderTrack key="g" />],
    ])('throws for %s', (name, element) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`${name} must be used within a <Slider>`)
      error.mockRestore()
    })
  })
})
