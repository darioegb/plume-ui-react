import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Rating, RatingEmpty, RatingFilled, RatingItem, RatingRadio, RatingValueText } from '..'

describe('Rating parts', () => {
  it('renders the default composition from the same parts', () => {
    render(<Rating aria-label="Rating" max={2} />)
    const item = document.querySelector('[data-plume-rating-item]')
    expect(item?.children[0]).toHaveAttribute('data-plume-rating-empty')
    expect(item?.children[1]).toHaveAttribute('data-plume-rating-filled')
    expect(item?.children[2]).toHaveAttribute('data-plume-rating-radio')
  })

  it('renders the composition of the user when a direct child is a part', () => {
    render(
      <Rating aria-label="Rating" max={3}>
        <RatingItem className="only" position={2}>
          <RatingFilled className="on" />
          <RatingRadio className="pick" />
        </RatingItem>
      </Rating>,
    )
    expect(document.querySelectorAll('[data-plume-rating-item]')).toHaveLength(1)
    expect(document.querySelector('[data-plume-rating-item]')).toHaveClass('item', 'only')
    expect(document.querySelector('[data-plume-rating-filled]')).toHaveClass('filled', 'on')
    expect(document.querySelector('[data-plume-rating-empty]')).toBeNull()
    expect(screen.getByRole('radio')).toHaveAttribute('value', '2')
  })

  it('calls a function once per star', () => {
    render(
      <Rating aria-label="Rating" max={3}>
        {(position) => (
          <RatingItem className={`star-${position}`} position={position}>
            <RatingFilled>{position}</RatingFilled>
            <RatingRadio />
          </RatingItem>
        )}
      </Rating>,
    )
    expect(document.querySelector('.star-1')).not.toBeNull()
    expect(document.querySelector('.star-3')).not.toBeNull()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('selects with a composed radio', async () => {
    const onValueChange = vi.fn()
    render(
      <Rating aria-label="Rating" max={2} onValueChange={onValueChange}>
        {(position) => (
          <RatingItem position={position}>
            <RatingRadio />
          </RatingItem>
        )}
      </Rating>,
    )
    await userEvent.click(screen.getAllByRole('radio')[1])
    expect(onValueChange).toHaveBeenCalledWith(2)
  })

  it('lets a radio cover a half of the star', () => {
    render(
      <Rating allowHalf aria-label="Rating" max={1}>
        <RatingItem position={1}>
          <RatingRadio value={0.5} />
          <RatingRadio />
        </RatingItem>
      </Rating>,
    )
    const [first, second] = screen.getAllByRole('radio')
    expect(first).toHaveAttribute('data-half', 'start')
    expect(second).toHaveAttribute('data-half', 'end')
  })

  it('replaces the icons with the children of the parts', () => {
    render(
      <Rating aria-label="Rating" max={1}>
        <RatingItem position={1}>
          <RatingEmpty>o</RatingEmpty>
          <RatingFilled>x</RatingFilled>
        </RatingItem>
      </Rating>,
    )
    expect(screen.getByText('o')).toHaveAttribute('data-plume-rating-empty')
    expect(screen.getByText('x')).toHaveAttribute('data-plume-rating-filled')
  })

  it('takes the ref, the style and the className in every part', () => {
    const item = createRef<HTMLSpanElement>()
    const radio = createRef<HTMLInputElement>()
    render(
      <Rating aria-label="Rating" max={1}>
        <RatingItem className="a" position={1} ref={item} style={{ color: 'red' }}>
          <RatingEmpty className="b" style={{ color: 'blue' }} />
          <RatingFilled className="c" style={{ color: 'green' }} />
          <RatingRadio className="d" ref={radio} style={{ margin: 3 }} title="Pick" />
        </RatingItem>
      </Rating>,
    )
    expect(item.current?.style.color).toBe('red')
    expect(document.querySelector('[data-plume-rating-empty]')).toHaveClass('b')
    expect(document.querySelector<HTMLElement>('[data-plume-rating-filled]')?.style.color).toBe(
      'green',
    )
    expect(radio.current).toHaveClass('d')
    expect(radio.current).toHaveAttribute('title', 'Pick')
  })

  it('names the radio with the labels, or with its own label', () => {
    render(
      <Rating aria-label="Rating" max={2}>
        <RatingItem position={2}>
          <RatingRadio aria-label="Two" />
        </RatingItem>
        <RatingItem position={1}>
          <RatingRadio />
        </RatingItem>
      </Rating>,
    )
    expect(screen.getByRole('radio', { name: 'Two' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '1 star' })).toBeInTheDocument()
  })

  it('says the value as text when it is read only, and can change the text', () => {
    render(
      <Rating aria-label="Rating" defaultValue={3} readOnly>
        <RatingValueText className="note">Three</RatingValueText>
        <RatingItem position={1} />
      </Rating>,
    )
    expect(screen.getByText('Three')).toHaveClass('note')
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('does not render the text when it is not read only', () => {
    render(
      <Rating aria-label="Rating" max={1}>
        <RatingValueText>Hidden</RatingValueText>
        <RatingItem position={1} />
      </Rating>,
    )
    expect(screen.queryByText('Hidden')).toBeNull()
  })

  it('shows the default text of the read only value', () => {
    render(<Rating aria-label="Rating" defaultValue={3} readOnly />)
    expect(screen.getByText('3 out of 5')).toHaveAttribute('data-plume-rating-value-text')
  })

  it('marks the state of every item', () => {
    render(<Rating aria-label="Rating" defaultValue={1.5} allowHalf max={3} />)
    const states = Array.from(document.querySelectorAll('[data-plume-rating-item]')).map((item) =>
      item.getAttribute('data-state'),
    )
    expect(states).toEqual(['full', 'half', 'empty'])
  })

  it('throws when a part is used outside its root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<RatingItem position={1} />)).toThrow(
      'RatingItem must be used within a <Rating>',
    )
    expect(() => render(<RatingEmpty />)).toThrow('RatingEmpty must be used within a <Rating>')
    expect(() => render(<RatingFilled />)).toThrow('RatingFilled must be used within a <Rating>')
    expect(() => render(<RatingValueText />)).toThrow(
      'RatingValueText must be used within a <Rating>',
    )
    expect(() => render(<RatingRadio />)).toThrow('RatingRadio must be used within a <Rating>')
    vi.restoreAllMocks()
  })

  it('throws when a radio is used outside an item', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <Rating aria-label="Rating">
          <RatingItem position={1}>
            <RatingRadio />
          </RatingItem>
        </Rating>,
      ),
    ).not.toThrow()
    expect(() =>
      render(
        <Rating aria-label="Rating">
          <RatingValueText />
          <RatingRadio />
        </Rating>,
      ),
    ).toThrow('RatingRadio must be used within a <RatingItem>')
    vi.restoreAllMocks()
  })
})
