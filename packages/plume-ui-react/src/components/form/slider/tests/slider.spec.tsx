import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { Slider } from '..'
import type { SliderProps, SliderValue } from '..'

const inputs = (): HTMLInputElement[] =>
  Array.from(document.querySelectorAll<HTMLInputElement>('input[type="range"]'))

const change = (input: HTMLElement, value: number): void => {
  fireEvent.change(input, { target: { value: String(value) } })
}

function Controlled(props: Readonly<Partial<SliderProps>>) {
  const [value, setValue] = useState<SliderValue>(30)
  return <Slider aria-label="Volume" onValueChange={setValue} value={value} {...props} />
}

describe('Slider component', () => {
  describe('rendering', () => {
    it('is a native range input', () => {
      render(<Slider aria-label="Volume" />)
      const slider = screen.getByRole('slider', { name: 'Volume' })
      expect(slider).toHaveAttribute('type', 'range')
      expect(inputs()).toHaveLength(1)
    })

    it('goes from 0 to 100 by 1 and starts at the minimum', () => {
      render(<Slider aria-label="Volume" />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '0')
      expect(slider).toHaveAttribute('max', '100')
      expect(slider).toHaveAttribute('step', '1')
      expect(slider).toHaveValue('0')
    })

    it('takes min, max and step', () => {
      render(<Slider aria-label="Rating" defaultValue={5} max={10} min={-10} step={0.5} />)
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('min', '-10')
      expect(slider).toHaveAttribute('max', '10')
      expect(slider).toHaveAttribute('step', '0.5')
      expect(slider).toHaveValue('5')
    })

    it('starts at the minimum when it has no value', () => {
      render(<Slider aria-label="Price" min={20} />)
      expect(screen.getByRole('slider')).toHaveValue('20')
    })

    it('keeps the value between the limits', () => {
      const { rerender } = render(<Slider aria-label="Volume" value={500} />)
      expect(screen.getByRole('slider')).toHaveValue('100')
      rerender(<Slider aria-label="Volume" value={-5} />)
      expect(screen.getByRole('slider')).toHaveValue('0')
    })

    it('forwards the ref to the input', () => {
      const ref = createRef<HTMLInputElement>()
      render(<Slider aria-label="Volume" ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('slider'))
    })

    it('forwards the id, the name, the title and the description', () => {
      render(
        <>
          <p id="hint">Keep it low</p>
          <Slider
            aria-describedby="hint"
            aria-label="Volume"
            id="volume"
            name="volume"
            title="Volume"
          />
        </>,
      )
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('id', 'volume')
      expect(slider).toHaveAttribute('name', 'volume')
      expect(slider).toHaveAccessibleDescription('Keep it low')
      expect(slider.closest('[data-plume-slider]')).toHaveAttribute('title', 'Volume')
    })

    it('can be named by another element', () => {
      render(
        <>
          <span id="label">Brightness</span>
          <Slider aria-labelledby="label" />
        </>,
      )
      expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument()
    })

    it('says the value in words with formatValue', () => {
      render(<Slider aria-label="Price" defaultValue={40} formatValue={(value) => `$${value}`} />)
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '$40')
    })

    it('exposes the fraction of the range to CSS', () => {
      render(<Slider aria-label="Volume" defaultValue={25} />)
      const root = document.querySelector<HTMLElement>('[data-plume-slider]') as HTMLElement
      expect(root.style.getPropertyValue('--slider-end')).toBe('0.25')
      expect(root.style.getPropertyValue('--slider-start')).toBe('0')
    })
  })

  describe('changing the value', () => {
    it('updates by itself and reports the new value', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Volume" onValueChange={onValueChange} />)
      change(screen.getByRole('slider'), 40)
      expect(screen.getByRole('slider')).toHaveValue('40')
      expect(onValueChange).toHaveBeenCalledWith(40)
    })

    it('snaps the value to the step', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Volume" onValueChange={onValueChange} step={10} />)
      change(screen.getByRole('slider'), 47)
      expect(onValueChange).toHaveBeenCalledWith(50)
    })

    it('does not report the same value twice', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Volume" defaultValue={40} onValueChange={onValueChange} />)
      change(screen.getByRole('slider'), 40)
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('follows value when it is controlled', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Volume" onValueChange={onValueChange} value={20} />)
      change(screen.getByRole('slider'), 60)
      expect(onValueChange).toHaveBeenCalledWith(60)
      expect(screen.getByRole('slider')).toHaveValue('20')
    })

    it('updates when the parent changes the value', () => {
      render(<Controlled />)
      change(screen.getByRole('slider'), 75)
      expect(screen.getByRole('slider')).toHaveValue('75')
    })

    it('reports the final value when the user lets go', () => {
      const onValueCommit = vi.fn()
      render(<Slider aria-label="Volume" defaultValue={10} onValueCommit={onValueCommit} />)
      change(screen.getByRole('slider'), 35)
      fireEvent.pointerUp(screen.getByRole('slider'))
      expect(onValueCommit).toHaveBeenCalledWith(35)
    })

    it('reports the final value after a key', () => {
      const onValueCommit = vi.fn()
      render(<Slider aria-label="Volume" defaultValue={10} onValueCommit={onValueCommit} />)
      change(screen.getByRole('slider'), 11)
      fireEvent.keyUp(screen.getByRole('slider'), { key: 'ArrowRight' })
      expect(onValueCommit).toHaveBeenCalledWith(11)
    })

    it('does not fail on a pointer or a key without onValueCommit', () => {
      render(<Slider aria-label="Volume" />)
      fireEvent.pointerUp(screen.getByRole('slider'))
      fireEvent.keyUp(screen.getByRole('slider'), { key: 'ArrowRight' })
      expect(screen.getByRole('slider')).toHaveValue('0')
    })

    it('can be reached with the keyboard', async () => {
      render(<Slider aria-label="Volume" />)
      await userEvent.tab()
      expect(screen.getByRole('slider')).toHaveFocus()
    })
  })

  describe('range', () => {
    it('has two thumbs, named Minimum and Maximum, inside a group', () => {
      render(<Slider aria-label="Price" defaultValue={[20, 80]} />)
      expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument()
      expect(screen.getByRole('slider', { name: 'Minimum' })).toHaveValue('20')
      expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveValue('80')
    })

    it('translates the names of the thumbs', () => {
      render(
        <Slider
          aria-label="Precio"
          defaultValue={[20, 80]}
          getThumbLabel={(index) => (index === 0 ? 'Mínimo' : 'Máximo')}
        />,
      )
      expect(screen.getByRole('slider', { name: 'Mínimo' })).toBeInTheDocument()
      expect(screen.getByRole('slider', { name: 'Máximo' })).toBeInTheDocument()
    })

    it('reports both values as a pair', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      change(screen.getByRole('slider', { name: 'Minimum' }), 30)
      expect(onValueChange).toHaveBeenLastCalledWith([30, 80])
      change(screen.getByRole('slider', { name: 'Maximum' }), 90)
      expect(onValueChange).toHaveBeenLastCalledWith([30, 90])
    })

    it('does not let the thumbs cross', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      change(screen.getByRole('slider', { name: 'Minimum' }), 95)
      expect(onValueChange).toHaveBeenLastCalledWith([80, 80])
      change(screen.getByRole('slider', { name: 'Maximum' }), 10)
      expect(onValueChange).toHaveBeenLastCalledWith([80, 80])
    })

    it('gives both thumbs the name and the first one the id', () => {
      render(<Slider aria-label="Price" defaultValue={[20, 80]} id="price" name="price" />)
      const [first, second] = inputs()
      expect(first).toHaveAttribute('id', 'price')
      expect(second).toHaveAttribute('id', 'price-1')
      expect(first).toHaveAttribute('name', 'price')
      expect(second).toHaveAttribute('name', 'price')
    })

    it('sends both values in a form', () => {
      render(
        <form data-testid="form">
          <Slider aria-label="Price" defaultValue={[20, 80]} name="price" />
        </form>,
      )
      const data = new FormData(screen.getByTestId<HTMLFormElement>('form'))
      expect(data.getAll('price')).toEqual(['20', '80'])
    })

    it('exposes the start and the end of the filled part to CSS', () => {
      render(<Slider aria-label="Price" defaultValue={[20, 80]} />)
      const root = document.querySelector<HTMLElement>('[data-plume-slider]') as HTMLElement
      expect(root.style.getPropertyValue('--slider-start')).toBe('0.2')
      expect(root.style.getPropertyValue('--slider-end')).toBe('0.8')
      expect(root).toHaveAttribute('data-range')
    })

    it('puts the first thumb in front when both are near the maximum', () => {
      render(<Slider aria-label="Price" defaultValue={[90, 90]} />)
      expect(inputs()[0]).toHaveAttribute('data-front')
      expect(inputs()[1]).not.toHaveAttribute('data-front')
    })

    it('reports both values on commit', () => {
      const onValueCommit = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueCommit={onValueCommit} />)
      change(inputs()[0], 30)
      fireEvent.pointerUp(inputs()[0])
      expect(onValueCommit).toHaveBeenCalledWith([30, 80])
    })

    const track = (): HTMLElement =>
      document.querySelector('[data-plume-slider-track]') as HTMLElement

    const sizeRoot = (box: Partial<DOMRect>): void => {
      const root = document.querySelector('[data-plume-slider]') as HTMLElement
      root.getBoundingClientRect = () => box as DOMRect
    }

    it('jumps the nearest thumb to a press on the track', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      expect(onValueChange).toHaveBeenLastCalledWith([20, 60])
      fireEvent.pointerDown(track(), { clientX: 20 })
      expect(onValueChange).toHaveBeenLastCalledWith([10, 60])
    })

    it('does nothing when the press falls on a thumb value', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 160 })
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('focuses the thumb it moved when the press ends', () => {
      render(<Slider aria-label="Price" defaultValue={[20, 80]} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      fireEvent.pointerUp(track())
      expect(screen.getByRole('slider', { name: 'Maximum' })).toHaveFocus()
    })

    it('keeps moving the same thumb while the pointer drags after a press', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      fireEvent.pointerMove(track(), { clientX: 150 })
      expect(onValueChange).toHaveBeenLastCalledWith([20, 75])
      fireEvent.pointerMove(track(), { clientX: 10 })
      expect(onValueChange).toHaveBeenLastCalledWith([20, 20])
    })

    it('stops moving when the press ends or is cancelled', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      fireEvent.pointerUp(track())
      onValueChange.mockClear()
      fireEvent.pointerMove(track(), { clientX: 150 })
      expect(onValueChange).not.toHaveBeenCalled()
      fireEvent.pointerDown(track(), { clientX: 130 })
      fireEvent.pointerCancel(track())
      fireEvent.pointerMove(track(), { clientX: 160 })
      expect(onValueChange).toHaveBeenCalledTimes(1)
    })

    it('does not move on a pointer move without a press', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      fireEvent.pointerMove(track(), { clientX: 100 })
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('reports the final value when a press on the track ends', () => {
      const onValueCommit = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueCommit={onValueCommit} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      fireEvent.pointerUp(track())
      expect(onValueCommit).toHaveBeenCalledWith([20, 60])
    })

    it('keeps the thumbs in order when the press is past the other one', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 40]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 190 })
      expect(onValueChange).toHaveBeenLastCalledWith([20, 95])
    })

    it('jumps along the height when it is vertical', () => {
      const onValueChange = vi.fn()
      render(
        <Slider
          aria-label="Price"
          defaultValue={[20, 80]}
          onValueChange={onValueChange}
          orientation="vertical"
        />,
      )
      sizeRoot({ bottom: 200, height: 200, left: 0, right: 20, top: 0, width: 20 })
      fireEvent.pointerDown(track(), { clientY: 80 })
      expect(onValueChange).toHaveBeenLastCalledWith([20, 60])
    })

    it('ignores presses on a thumb', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />)
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(inputs()[0], { clientX: 100 })
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('ignores presses on a single slider', () => {
      const onValueChange = vi.fn()
      render(<Slider aria-label="Price" defaultValue={30} onValueChange={onValueChange} />)
      fireEvent.pointerDown(track(), { clientX: 100 })
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('ignores presses when it cannot change', () => {
      const onValueChange = vi.fn()
      render(
        <Slider
          aria-label="Price"
          defaultValue={[20, 80]}
          onValueChange={onValueChange}
          readOnly
        />,
      )
      sizeRoot({ bottom: 10, height: 10, left: 0, right: 200, top: 0, width: 200 })
      fireEvent.pointerDown(track(), { clientX: 120 })
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('states', () => {
    it('disables the input', () => {
      render(<Slider aria-label="Volume" disabled />)
      expect(screen.getByRole('slider')).toBeDisabled()
      expect(document.querySelector('[data-plume-slider]')).toHaveAttribute('data-disabled')
    })

    it('disables the whole group of a range', () => {
      render(<Slider aria-label="Price" defaultValue={[20, 80]} disabled />)
      inputs().forEach((input) => expect(input).toBeDisabled())
      expect(screen.getByRole('group')).toBeDisabled()
    })

    it('does not change when it is read only, and says so', () => {
      const onValueChange = vi.fn()
      render(
        <Slider aria-label="Volume" defaultValue={30} onValueChange={onValueChange} readOnly />,
      )
      const slider = screen.getByRole('slider')
      expect(slider).toHaveAttribute('aria-readonly', 'true')
      change(slider, 70)
      expect(onValueChange).not.toHaveBeenCalled()
      expect(slider).toHaveValue('30')
    })

    it('marks it as invalid', () => {
      render(<Slider aria-invalid aria-label="Volume" />)
      expect(screen.getByRole('slider')).toBeInvalid()
      expect(document.querySelector('[data-plume-slider]')).toHaveClass('invalid')
    })

    it('can be invalid with the invalid prop', () => {
      render(<Slider aria-label="Volume" invalid />)
      expect(screen.getByRole('slider')).toBeInvalid()
    })
  })

  describe('marks', () => {
    const marks = () => document.querySelectorAll('[data-plume-slider-mark]')

    it('shows no marks by default', () => {
      render(<Slider aria-label="Volume" />)
      expect(marks()).toHaveLength(0)
    })

    it('shows a mark on every step with true', () => {
      render(<Slider aria-label="Volume" marks max={50} step={10} />)
      expect(marks()).toHaveLength(6)
    })

    it('shows the marks of a list of numbers', () => {
      render(<Slider aria-label="Volume" marks={[0, 25, 100]} />)
      expect(marks()).toHaveLength(3)
    })

    it('shows the labels of the marks', () => {
      render(
        <Slider
          aria-label="Volume"
          marks={[{ label: 'Low', value: 0 }, { label: 'High', value: 100 }, { value: 50 }]}
        />,
      )
      expect(screen.getByText('Low')).toBeInTheDocument()
      expect(screen.getByText('High')).toBeInTheDocument()
      expect(document.querySelectorAll('.markLabel')).toHaveLength(2)
    })

    it('hides the marks from assistive technology', () => {
      render(<Slider aria-label="Volume" marks />)
      expect(document.querySelector('[data-plume-slider-marks]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('marks the ones inside the filled part', () => {
      render(<Slider aria-label="Volume" defaultValue={50} marks={[0, 25, 50, 100]} />)
      const active = Array.from(marks()).map((mark) => mark.hasAttribute('data-active'))
      expect(active).toEqual([false, true, false, false])
    })

    it('marks the ones between the thumbs of a range', () => {
      render(<Slider aria-label="Volume" defaultValue={[25, 75]} marks={[0, 50, 100]} />)
      const active = Array.from(marks()).map((mark) => mark.hasAttribute('data-active'))
      expect(active).toEqual([false, true, false])
    })

    it('shows no marks without a step', () => {
      render(<Slider aria-label="Volume" marks step={0} />)
      expect(marks()).toHaveLength(1)
    })
  })

  describe('with a Field', () => {
    it('is named by the label of the Field', () => {
      render(
        <Field label="Volume">
          <Slider />
        </Field>,
      )
      expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument()
    })

    it('takes the description, the invalid state and the disabled state', () => {
      render(
        <Field disabled errorText="Too loud" label="Volume">
          <Slider />
        </Field>,
      )
      const slider = screen.getByRole('slider')
      expect(slider).toBeDisabled()
      expect(slider).toBeInvalid()
      expect(slider).toHaveAccessibleDescription('Too loud')
    })

    it('names the group of a range with the label of the Field', () => {
      render(
        <Field label="Price">
          <Slider defaultValue={[20, 80]} />
        </Field>,
      )
      expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument()
    })
  })

  describe('appearance', () => {
    it('is solid, medium and horizontal by default', () => {
      render(<Slider aria-label="Volume" />)
      expect(document.querySelector('[data-plume-slider]')).toHaveClass(
        'slider',
        'solid',
        'md',
        'horizontal',
      )
      expect(screen.getByRole('slider')).toHaveClass('thumb')
      expect(document.querySelector('[data-plume-slider-track]')).toHaveClass('track')
      expect(document.querySelector('[data-plume-slider-range]')).toHaveClass('range')
    })

    it.each(['outline', 'solid'] as const)('applies the %s variant', (variant) => {
      render(<Slider aria-label="Volume" variant={variant} />)
      expect(document.querySelector('[data-plume-slider]')).toHaveClass(variant)
    })

    it('applies the size and the orientation', () => {
      render(<Slider aria-label="Volume" orientation="vertical" size="lg" />)
      const root = document.querySelector('[data-plume-slider]')
      expect(root).toHaveClass('lg', 'vertical')
      expect(root).toHaveAttribute('data-orientation', 'vertical')
    })

    it('exposes the color scheme as CSS variables and lets style override them', () => {
      render(
        <Slider
          aria-label="Volume"
          colorScheme="success"
          style={{ '--slider-tint': 'red' } as React.CSSProperties}
        />,
      )
      const root = document.querySelector<HTMLElement>('[data-plume-slider]') as HTMLElement
      expect(root.style.getPropertyValue('--slider-solid')).toBe('var(--plume-color-success-solid)')
      expect(root.style.getPropertyValue('--slider-tint')).toBe('red')
    })

    it('adds the classes of the user to every part', () => {
      render(
        <Slider
          aria-label="Volume"
          className="root"
          classNames={{
            mark: 'm',
            markLabel: 'ml',
            range: 'r',
            thumb: 't',
            track: 'tr',
          }}
          marks={[{ label: 'Half', value: 50 }]}
        />,
      )
      expect(document.querySelector('[data-plume-slider]')).toHaveClass('root')
      expect(screen.getByRole('slider')).toHaveClass('thumb', 't')
      expect(document.querySelector('[data-plume-slider-track]')).toHaveClass('tr')
      expect(document.querySelector('[data-plume-slider-range]')).toHaveClass('r')
      expect(document.querySelector('[data-plume-slider-mark]')).toHaveClass('m')
      expect(screen.getByText('Half')).toHaveClass('ml')
    })

    it('renders only the native inputs when it is unstyled', () => {
      render(
        <Slider
          aria-label="Volume"
          className="root"
          classNames={{ thumb: 't' }}
          marks
          variant="unstyled"
        />,
      )
      expect(document.querySelector('[data-plume-slider]')).toHaveAttribute('class', 'root')
      expect(screen.getByRole('slider')).toHaveAttribute('class', 't')
      expect(document.querySelector('[data-plume-slider-track]')).not.toBeInTheDocument()
      expect(document.querySelector('[data-plume-slider-marks]')).not.toBeInTheDocument()
    })
  })
})
