import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Rating } from '..'
import type { RatingProps } from '..'
import { snap } from '../use-rating'

const radios = (): HTMLInputElement[] => screen.getAllByRole<HTMLInputElement>('radio')
const checked = (): string | undefined => radios().find((radio) => radio.checked)?.value
const states = (): (string | null)[] =>
  Array.from(document.querySelectorAll('[data-plume-rating-item]')).map((item) =>
    item.getAttribute('data-state'),
  )

function Controlled(props: Readonly<RatingProps>) {
  const [value, setValue] = useState(2)
  return (
    <>
      <Rating {...props} onValueChange={setValue} value={value} />
      <output>{value}</output>
    </>
  )
}

describe('snap', () => {
  it('rounds to whole numbers', () => {
    expect(snap(3.4, 5, false)).toBe(3)
    expect(snap(3.6, 5, false)).toBe(4)
  })

  it('rounds to halves', () => {
    expect(snap(3.3, 5, true)).toBe(3.5)
    expect(snap(3.2, 5, true)).toBe(3)
  })

  it('keeps the value between 0 and the max', () => {
    expect(snap(9, 5, false)).toBe(5)
    expect(snap(-2, 5, false)).toBe(0)
  })

  it('turns anything that is not a number into zero', () => {
    expect(snap(Number.NaN, 5, false)).toBe(0)
  })
})

describe('Rating component', () => {
  describe('rendering', () => {
    it('is a radio group with five stars by default', () => {
      render(<Rating aria-label="Rating" />)
      expect(screen.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument()
      expect(radios()).toHaveLength(5)
    })

    it('names every star', () => {
      render(<Rating aria-label="Rating" max={3} />)
      expect(radios().map((radio) => radio.getAttribute('aria-label'))).toEqual([
        '1 star',
        '2 stars',
        '3 stars',
      ])
    })

    it('uses another name for the stars', () => {
      render(
        <Rating aria-label="Rating" labels={{ item: (value, max) => `${value}/${max}` }} max={2} />,
      )
      expect(radios()[1]).toHaveAttribute('aria-label', '2/2')
    })

    it('renders as many stars as the max', () => {
      render(<Rating aria-label="Rating" max={10} />)
      expect(radios()).toHaveLength(10)
    })

    it('is a solid, medium rating by default', () => {
      render(<Rating aria-label="Rating" />)
      expect(screen.getByRole('radiogroup')).toHaveClass('rating', 'md', 'interactive')
    })

    it('draws the chosen stars as an outline with the outline variant', () => {
      render(<Rating aria-label="Rating" defaultValue={1} max={2} variant="outline" />)
      expect(screen.getByRole('radiogroup')).toHaveClass('rating', 'outline')
      const filled = document.querySelector('[data-plume-rating-filled] svg')
      const empty = document.querySelector('[data-plume-rating-empty] svg')
      expect(filled).toHaveAttribute('fill', 'none')
      expect(filled).toHaveAttribute('stroke-width', '2')
      expect(empty).toHaveAttribute('stroke-width', '1.5')
    })

    it('keeps a custom icon with the outline variant', () => {
      render(<Rating aria-label="Rating" icon={<b>♥</b>} max={1} variant="outline" />)
      expect(screen.getAllByText('♥')).toHaveLength(2)
    })

    it('fills the chosen stars with the solid variant', () => {
      render(<Rating aria-label="Rating" defaultValue={1} max={1} />)
      expect(screen.getByRole('radiogroup')).not.toHaveClass('outline')
      expect(document.querySelector('[data-plume-rating-filled] svg')).toHaveAttribute(
        'fill',
        'currentColor',
      )
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<Rating aria-label="Rating" size={size} />)
      expect(screen.getByRole('radiogroup')).toHaveClass(size)
    })

    it('takes its color from the color scheme', () => {
      render(<Rating aria-label="Rating" colorScheme="success" />)
      expect(screen.getByRole('radiogroup')).toHaveStyle({
        '--rating-solid': 'var(--plume-color-success-solid)',
      })
    })

    it('keeps the className and style', () => {
      render(<Rating aria-label="Rating" className="mine" style={{ margin: '4px' }} />)
      expect(screen.getByRole('radiogroup')).toHaveClass('rating', 'mine')
      expect(screen.getByRole('radiogroup')).toHaveStyle({ margin: '4px' })
    })

    it('forwards the ref and the attributes', () => {
      const ref = createRef<HTMLFieldSetElement>()
      render(
        <Rating aria-describedby="hint" aria-label="Rating" id="stars" ref={ref} title="Stars" />,
      )
      expect(ref.current).toBe(screen.getByRole('radiogroup'))
      expect(ref.current).toHaveAttribute('id', 'stars')
      expect(ref.current).toHaveAttribute('aria-describedby', 'hint')
      expect(ref.current).toHaveAttribute('title', 'Stars')
    })

    it('uses the same name for all the radios, or the one given', () => {
      const { rerender } = render(<Rating aria-label="Rating" />)
      expect(new Set(radios().map((radio) => radio.name)).size).toBe(1)
      rerender(<Rating aria-label="Rating" name="score" />)
      expect(radios()[0]).toHaveAttribute('name', 'score')
    })

    it('shows a custom icon, and the same one for the empty stars by default', () => {
      render(<Rating aria-label="Rating" icon={<b>♥</b>} max={2} />)
      expect(screen.getAllByText('♥')).toHaveLength(4)
    })

    it('shows a custom empty icon', () => {
      render(<Rating aria-label="Rating" emptyIcon={<i>♡</i>} icon={<b>♥</b>} max={2} />)
      expect(screen.getAllByText('♡')).toHaveLength(2)
      expect(screen.getAllByText('♥')).toHaveLength(2)
    })

    it('hides the icons from screen readers', () => {
      render(<Rating aria-label="Rating" max={1} />)
      const layers = document.querySelectorAll('[data-plume-rating-item] > span')
      layers.forEach((layer) => expect(layer).toHaveAttribute('aria-hidden', 'true'))
    })
  })

  describe('value', () => {
    it('starts empty', () => {
      render(<Rating aria-label="Rating" />)
      expect(checked()).toBeUndefined()
      expect(states()).toEqual(['empty', 'empty', 'empty', 'empty', 'empty'])
    })

    it('shows the default value', () => {
      render(<Rating aria-label="Rating" defaultValue={3} />)
      expect(checked()).toBe('3')
      expect(states()).toEqual(['full', 'full', 'full', 'empty', 'empty'])
    })

    it('rounds a value that is not a whole number', () => {
      render(<Rating aria-label="Rating" defaultValue={3.4} />)
      expect(checked()).toBe('3')
    })

    it('selects a star with a click', async () => {
      const onValueChange = vi.fn()
      render(<Rating aria-label="Rating" onValueChange={onValueChange} />)
      await userEvent.click(radios()[3])
      expect(checked()).toBe('4')
      expect(onValueChange).toHaveBeenCalledWith(4)
    })

    it('changes with the arrows', async () => {
      render(<Rating aria-label="Rating" defaultValue={2} />)
      radios()[1].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(checked()).toBe('3')
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(checked()).toBe('1')
    })

    it('has a single tab stop', async () => {
      render(
        <>
          <button type="button">before</button>
          <Rating aria-label="Rating" defaultValue={2} />
          <button type="button">after</button>
        </>,
      )
      await userEvent.tab()
      await userEvent.tab()
      expect(radios()[1]).toHaveFocus()
      await userEvent.tab()
      expect(screen.getByText('after')).toHaveFocus()
    })

    it('follows the value when it is controlled', async () => {
      render(<Controlled aria-label="Rating" />)
      expect(checked()).toBe('2')
      await userEvent.click(radios()[4])
      expect(checked()).toBe('5')
      expect(screen.getByRole('status')).toHaveTextContent('5')
    })

    it('does not change by itself when it is controlled', async () => {
      const onValueChange = vi.fn()
      render(<Rating aria-label="Rating" onValueChange={onValueChange} value={2} />)
      await userEvent.click(radios()[3])
      expect(onValueChange).toHaveBeenCalledWith(4)
      expect(checked()).toBe('2')
    })
  })

  describe('half stars', () => {
    it('has two radios for every star', () => {
      render(<Rating allowHalf aria-label="Rating" max={3} />)
      expect(radios()).toHaveLength(6)
      expect(radios().map((radio) => radio.value)).toEqual(['0.5', '1', '1.5', '2', '2.5', '3'])
    })

    it('names the halves', () => {
      render(<Rating allowHalf aria-label="Rating" max={2} />)
      expect(radios()[0]).toHaveAttribute('aria-label', '0.5 stars')
      expect(radios()[1]).toHaveAttribute('aria-label', '1 star')
    })

    it('marks which half each radio covers', () => {
      render(<Rating allowHalf aria-label="Rating" max={1} />)
      expect(radios()[0]).toHaveAttribute('data-half', 'start')
      expect(radios()[1]).toHaveAttribute('data-half', 'end')
    })

    it('selects a half star', async () => {
      const onValueChange = vi.fn()
      render(<Rating allowHalf aria-label="Rating" onValueChange={onValueChange} />)
      await userEvent.click(radios()[6])
      expect(onValueChange).toHaveBeenCalledWith(3.5)
      expect(states()).toEqual(['full', 'full', 'full', 'half', 'empty'])
    })

    it('rounds to halves', () => {
      render(<Rating allowHalf aria-label="Rating" defaultValue={2.3} />)
      expect(checked()).toBe('2.5')
    })

    it('moves by half a star with the arrows', async () => {
      render(<Rating allowHalf aria-label="Rating" defaultValue={2} />)
      radios()[3].focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(checked()).toBe('2.5')
    })
  })

  describe('hover', () => {
    it('previews the star under the pointer', () => {
      render(<Rating aria-label="Rating" defaultValue={1} />)
      fireEvent.pointerEnter(radios()[3])
      expect(states()).toEqual(['full', 'full', 'full', 'full', 'empty'])
    })

    it('goes back to the value when the pointer leaves', () => {
      render(<Rating aria-label="Rating" defaultValue={1} />)
      fireEvent.pointerEnter(radios()[3])
      fireEvent.pointerLeave(screen.getByRole('radiogroup'))
      expect(states()).toEqual(['full', 'empty', 'empty', 'empty', 'empty'])
    })

    it('previews a half star', () => {
      render(<Rating allowHalf aria-label="Rating" />)
      fireEvent.pointerEnter(radios()[2])
      expect(states()).toEqual(['full', 'half', 'empty', 'empty', 'empty'])
    })
  })

  describe('clearable', () => {
    it('does not clear by default', async () => {
      render(<Rating aria-label="Rating" defaultValue={3} />)
      await userEvent.click(radios()[2])
      expect(checked()).toBe('3')
    })

    it('clears when the chosen star is clicked again', async () => {
      const onValueChange = vi.fn()
      render(
        <Rating aria-label="Rating" clearable defaultValue={3} onValueChange={onValueChange} />,
      )
      await userEvent.click(radios()[2])
      expect(checked()).toBeUndefined()
      expect(onValueChange).toHaveBeenCalledWith(0)
    })

    it('does not clear when another star is clicked', async () => {
      render(<Rating aria-label="Rating" clearable defaultValue={3} />)
      await userEvent.click(radios()[1])
      expect(checked()).toBe('2')
    })

    it('clears with Backspace and Delete', async () => {
      render(<Rating aria-label="Rating" clearable defaultValue={3} />)
      radios()[2].focus()
      await userEvent.keyboard('{Backspace}')
      expect(checked()).toBeUndefined()
    })

    it('ignores Backspace when it is not clearable', async () => {
      render(<Rating aria-label="Rating" defaultValue={3} />)
      radios()[2].focus()
      await userEvent.keyboard('{Backspace}{Delete}')
      expect(checked()).toBe('3')
    })

    it('ignores the other keys', async () => {
      render(<Rating aria-label="Rating" clearable defaultValue={3} />)
      radios()[2].focus()
      await userEvent.keyboard('a')
      expect(checked()).toBe('3')
    })
  })

  describe('read only', () => {
    it('has no radios and says the value as text', () => {
      render(<Rating aria-label="Rating" defaultValue={3} readOnly />)
      expect(screen.queryByRole('radio')).not.toBeInTheDocument()
      expect(screen.getByText('3 out of 5')).toBeInTheDocument()
    })

    it('uses another text', () => {
      render(
        <Rating
          aria-label="Rating"
          readOnly
          labels={{ readOnly: (value, max) => `${value} de ${max}` }}
          value={4}
        />,
      )
      expect(screen.getByText('4 de 5')).toBeInTheDocument()
    })

    it('shows the stars filled', () => {
      render(<Rating aria-label="Rating" readOnly value={2.5} allowHalf />)
      expect(states()).toEqual(['full', 'full', 'half', 'empty', 'empty'])
    })

    it('is not interactive', () => {
      render(<Rating aria-label="Rating" readOnly value={2} />)
      expect(document.querySelector('[data-plume-rating]')).not.toHaveClass('interactive')
    })

    it('keeps the className, the ref and the id', () => {
      const ref = createRef<HTMLFieldSetElement>()
      render(<Rating className="mine" id="stars" readOnly ref={ref} value={2} />)
      expect(ref.current).toHaveClass('rating', 'mine')
      expect(ref.current).toHaveAttribute('id', 'stars')
    })

    it('is the same fieldset as the interactive one, as a named group', () => {
      const ref = createRef<HTMLFieldSetElement>()
      render(
        <Rating
          aria-describedby="hint"
          aria-invalid
          aria-label="Average"
          readOnly
          ref={ref}
          required
          value={2}
        />,
      )
      const group = screen.getByRole('group', { name: 'Average' })
      expect(ref.current).toBe(group)
      expect(group.tagName).toBe('FIELDSET')
      expect(group).toHaveAttribute('aria-describedby', 'hint')
      expect(group).toHaveAttribute('aria-invalid', 'true')
      expect(group).toHaveAttribute('data-readonly')
      expect(group).toHaveAttribute('data-invalid')
      expect(group).not.toHaveAttribute('aria-required')
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    })

    it('is named by a Field', () => {
      render(
        <Field helperText="From 128 reviews" label="Average rating" readOnly>
          <Rating value={4} />
        </Field>,
      )
      const group = screen.getByRole('group', { name: 'Average rating' })
      expect(group).toHaveAccessibleDescription('From 128 reviews')
      expect(group).toHaveTextContent('4 out of 5')
    })

    it('does not clear the hover when the pointer leaves', () => {
      render(<Rating aria-label="Rating" readOnly value={2} />)
      fireEvent.pointerLeave(screen.getByRole('group'))
      expect(states()).toEqual(['full', 'full', 'empty', 'empty', 'empty'])
    })
  })

  describe('disabled', () => {
    it('disables the group and the radios', () => {
      render(<Rating aria-label="Rating" disabled />)
      expect(screen.getByRole('radiogroup')).toBeDisabled()
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-disabled')
      radios().forEach((radio) => expect(radio).toBeDisabled())
      expect(screen.getByRole('radiogroup')).toHaveClass('disabled')
      expect(screen.getByRole('radiogroup')).not.toHaveClass('interactive')
    })
  })

  describe('forms', () => {
    it('marks the group as required and invalid', () => {
      render(<Rating aria-invalid aria-label="Rating" required />)
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true')
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
    })

    it('composes with Field', () => {
      render(
        <Field errorText="Pick one" invalid label="Your rating" required>
          <Rating />
        </Field>,
      )
      const group = screen.getByRole('radiogroup', { name: /Your rating/ })
      expect(group.getAttribute('aria-describedby')).toContain('error')
      expect(group).toHaveAttribute('aria-invalid', 'true')
      expect(group).toHaveAttribute('aria-required', 'true')
    })

    it('does not use the label of a Field of another control', () => {
      render(
        <Field label="Other">
          <input />
        </Field>,
      )
      render(<Rating aria-label="Rating" />)
      expect(screen.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument()
    })
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user ones', () => {
      render(<Rating aria-label="Rating" className="root" max={2} variant="unstyled" />)
      expect(screen.getByRole('radiogroup')).toHaveAttribute('class', 'root')
      document
        .querySelectorAll('[data-plume-rating-item], [data-plume-rating-empty]')
        .forEach((part) => expect(part).not.toHaveAttribute('class'))
      expect(document.querySelector('[data-plume-rating-filled]')).not.toHaveAttribute('class')
      expect(radios()[0]).not.toHaveAttribute('class')
    })

    it('has no class at all without any', () => {
      render(<Rating aria-label="Rating" max={1} variant="unstyled" />)
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('class')
    })
  })
})

describe('Rating contrast', () => {
  it('outlines the filled star with the edge color of the scheme', () => {
    render(<Rating aria-label="Score" colorScheme="primary" defaultValue={2} />)

    const filled = document.querySelector<SVGElement>('[data-plume-rating-filled] svg')
    const empty = document.querySelector<SVGElement>('[data-plume-rating-empty] svg')
    expect(filled?.style.stroke).toBe('var(--rating-edge, currentColor)')
    expect(empty?.style.stroke).toBe('')
    expect(
      document
        .querySelector<HTMLElement>('[data-plume-rating]')
        ?.style.getPropertyValue('--rating-edge'),
    ).toBe('var(--plume-color-primary-text)')
  })
})
