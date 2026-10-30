import { act, fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { createRef, memo, useState } from 'react'
import { Field } from '../../field'
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputField,
  NumberInputHidden,
  NumberInputIncrement,
} from '..'
import { useNumberInputContext } from '../numberinput-context'
import type { NumberInputProps } from '..'

const spin = (): HTMLInputElement => screen.getByRole('spinbutton')
const up = (): HTMLElement => screen.getByRole('button', { name: 'Increase' })
const down = (): HTMLElement => screen.getByRole('button', { name: 'Decrease' })

function Controlled(props: Readonly<NumberInputProps>) {
  const [value, setValue] = useState<number | null>(5)
  return (
    <>
      <NumberInput {...props} onValueChange={setValue} value={value} />
      <output>{value === null ? 'empty' : value}</output>
    </>
  )
}

describe('NumberInput component', () => {
  describe('rendering', () => {
    it('is a spinbutton', () => {
      render(<NumberInput aria-label="Quantity" />)
      expect(spin()).toHaveAttribute('type', 'text')
      expect(spin()).toHaveAttribute('inputmode', 'decimal')
      expect(spin()).toHaveAttribute('autocomplete', 'off')
    })

    it('is empty by default and has no aria-valuenow', () => {
      render(<NumberInput aria-label="Quantity" />)
      expect(spin()).toHaveValue('')
      expect(spin()).not.toHaveAttribute('aria-valuenow')
    })

    it('shows the default value', () => {
      render(<NumberInput aria-label="Quantity" defaultValue={4} />)
      expect(spin()).toHaveValue('4')
      expect(spin()).toHaveAttribute('aria-valuenow', '4')
    })

    it('exposes the range', () => {
      render(<NumberInput aria-label="Quantity" max={10} min={1} />)
      expect(spin()).toHaveAttribute('aria-valuemin', '1')
      expect(spin()).toHaveAttribute('aria-valuemax', '10')
    })

    it('is an outline, medium, rounded control by default', () => {
      const { container } = render(<NumberInput aria-label="Quantity" />)
      expect(container.firstChild).toHaveClass('control', 'outline', 'md', 'rounded')
    })

    it.each(['outline', 'filled', 'underline'] as const)('supports the %s variant', (variant) => {
      const { container } = render(<NumberInput aria-label="Quantity" variant={variant} />)
      expect(container.firstChild).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      const { container } = render(<NumberInput aria-label="Quantity" size={size} />)
      expect(container.firstChild).toHaveClass(size)
    })

    it('supports the pill shape', () => {
      const { container } = render(<NumberInput aria-label="Quantity" shape="pill" />)
      expect(container.firstChild).toHaveClass('pill')
    })

    it('takes its color from the color scheme', () => {
      const { container } = render(<NumberInput aria-label="Quantity" colorScheme="success" />)
      expect(container.firstChild).toHaveStyle({
        '--numberinput-color': 'var(--plume-color-success-text)',
      })
    })

    it('keeps the className and style on the control', () => {
      const { container } = render(
        <NumberInput aria-label="Quantity" className="mine" style={{ width: '200px' }} />,
      )
      expect(container.firstChild).toHaveClass('control', 'mine')
      expect(container.firstChild).toHaveStyle({ width: '200px' })
    })

    it('marks the control as invalid and disabled', () => {
      const { container, rerender } = render(<NumberInput aria-invalid aria-label="Quantity" />)
      expect(container.firstChild).toHaveClass('invalid')
      rerender(<NumberInput aria-label="Quantity" disabled />)
      expect(container.firstChild).toHaveClass('disabled')
      expect(spin()).toBeDisabled()
    })

    it('forwards the ref to the input and the attributes', () => {
      const ref = createRef<HTMLInputElement>()
      render(<NumberInput aria-label="Quantity" id="qty" placeholder="0" ref={ref} title="Qty" />)
      expect(ref.current).toBe(spin())
      expect(spin()).toHaveAttribute('id', 'qty')
      expect(spin()).toHaveAttribute('placeholder', '0')
      expect(spin()).toHaveAttribute('title', 'Qty')
    })

    it('uses the numeric keyboard without decimals', () => {
      render(<NumberInput aria-label="Quantity" precision={0} />)
      expect(spin()).toHaveAttribute('inputmode', 'numeric')
    })
  })

  describe('typing', () => {
    it('calls onValueChange with the number', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" onValueChange={onValueChange} />)
      await userEvent.type(spin(), '42')
      expect(onValueChange).toHaveBeenLastCalledWith(42)
      expect(spin()).toHaveValue('42')
    })

    it('keeps a partial number while the user types', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" onValueChange={onValueChange} />)
      await userEvent.type(spin(), '1.')
      expect(spin()).toHaveValue('1.')
      expect(onValueChange).toHaveBeenLastCalledWith(1)
      await userEvent.type(spin(), '5')
      expect(spin()).toHaveValue('1.5')
      expect(onValueChange).toHaveBeenLastCalledWith(1.5)
    })

    it('accepts a comma as the decimal separator', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" onValueChange={onValueChange} />)
      await userEvent.type(spin(), '2,5')
      expect(onValueChange).toHaveBeenLastCalledWith(2.5)
    })

    it('accepts a minus sign and reports an empty value for it', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" onValueChange={onValueChange} />)
      await userEvent.type(spin(), '-')
      expect(spin()).toHaveValue('-')
      expect(onValueChange).not.toHaveBeenCalled()
      await userEvent.type(spin(), '3')
      expect(onValueChange).toHaveBeenLastCalledWith(-3)
    })

    it('rejects the characters that are not part of a number', async () => {
      render(<NumberInput aria-label="Quantity" />)
      await userEvent.type(spin(), '1a2b')
      expect(spin()).toHaveValue('12')
    })

    it('rejects a decimal separator when the precision is zero', async () => {
      render(<NumberInput aria-label="Quantity" precision={0} />)
      await userEvent.type(spin(), '1.5')
      expect(spin()).toHaveValue('15')
    })

    it('reports null when the text is cleared', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" defaultValue={3} onValueChange={onValueChange} />)
      await userEvent.clear(spin())
      expect(onValueChange).toHaveBeenLastCalledWith(null)
    })

    it('does not change when it is read only', async () => {
      const onValueChange = vi.fn()
      render(
        <NumberInput
          aria-label="Quantity"
          defaultValue={3}
          onValueChange={onValueChange}
          readOnly
        />,
      )
      await userEvent.type(spin(), '9')
      expect(spin()).toHaveValue('3')
      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe('commit', () => {
    it('clamps the value on blur', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" max={10} min={1} onValueChange={onValueChange} />)
      await userEvent.type(spin(), '25')
      await userEvent.tab()
      expect(spin()).toHaveValue('10')
      expect(onValueChange).toHaveBeenLastCalledWith(10)
    })

    it('raises a value under the minimum on blur', async () => {
      render(<NumberInput aria-label="Quantity" max={10} min={5} />)
      await userEvent.type(spin(), '2')
      await userEvent.tab()
      expect(spin()).toHaveValue('5')
    })

    it('rounds to the precision on blur', async () => {
      render(<NumberInput aria-label="Quantity" precision={2} />)
      await userEvent.type(spin(), '1.2345')
      await userEvent.tab()
      expect(spin()).toHaveValue('1.23')
    })

    it('pads the value to the precision', async () => {
      render(<NumberInput aria-label="Quantity" precision={2} />)
      await userEvent.type(spin(), '7')
      await userEvent.tab()
      expect(spin()).toHaveValue('7.00')
    })

    it('clears a text that is not a number on blur', async () => {
      render(<NumberInput aria-label="Quantity" />)
      await userEvent.type(spin(), '-')
      await userEvent.tab()
      expect(spin()).toHaveValue('')
    })

    it('commits with Enter', async () => {
      render(<NumberInput aria-label="Quantity" max={10} />)
      await userEvent.type(spin(), '25{Enter}')
      expect(spin()).toHaveValue('10')
    })

    it('calls the onBlur of the user', async () => {
      const onBlur = vi.fn()
      render(<NumberInput aria-label="Quantity" onBlur={onBlur} />)
      await userEvent.click(spin())
      await userEvent.tab()
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('keyboard', () => {
    it('steps with the arrows', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(spin()).toHaveValue('6')
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
      expect(spin()).toHaveValue('4')
    })

    it('steps by the step', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={0} step={5} />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(spin()).toHaveValue('5')
    })

    it('does not accumulate floating point noise', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={0} step={0.1} />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
      expect(spin()).toHaveValue('0.3')
    })

    it('takes a large step with PageUp and PageDown', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={50} />)
      spin().focus()
      await userEvent.keyboard('{PageUp}')
      expect(spin()).toHaveValue('60')
      await userEvent.keyboard('{PageDown}{PageDown}')
      expect(spin()).toHaveValue('40')
    })

    it('uses the large step of the props', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={0} largeStep={25} />)
      spin().focus()
      await userEvent.keyboard('{PageUp}')
      expect(spin()).toHaveValue('25')
    })

    it('goes to the limits with Home and End', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} max={10} min={1} />)
      spin().focus()
      await userEvent.keyboard('{End}')
      expect(spin()).toHaveValue('10')
      await userEvent.keyboard('{Home}')
      expect(spin()).toHaveValue('1')
    })

    it('ignores Home and End without limits', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      spin().focus()
      await userEvent.keyboard('{End}{Home}')
      expect(spin()).toHaveValue('5')
    })

    it('starts from zero when it is empty', async () => {
      render(<NumberInput aria-label="Quantity" />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(spin()).toHaveValue('1')
    })

    it('starts from the minimum when it is empty', async () => {
      render(<NumberInput aria-label="Quantity" min={5} />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(spin()).toHaveValue('5')
    })

    it('stops at the limits', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={9} max={10} min={0} />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(spin()).toHaveValue('10')
      await userEvent.keyboard('{PageDown}{PageDown}')
      expect(spin()).toHaveValue('0')
    })

    it('does not step when it is read only', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} readOnly />)
      spin().focus()
      await userEvent.keyboard('{ArrowUp}{Home}')
      expect(spin()).toHaveValue('5')
    })

    it('tells a screen reader that it is read only', () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} readOnly />)
      expect(spin()).toHaveAttribute('aria-readonly', 'true')
    })

    it('ignores the other keys', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      spin().focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(spin()).toHaveValue('5')
    })
  })

  describe('steppers', () => {
    it('has an increase and a decrease button out of the tab order', () => {
      render(<NumberInput aria-label="Quantity" />)
      expect(up()).toHaveAttribute('tabindex', '-1')
      expect(down()).toHaveAttribute('tabindex', '-1')
    })

    it('steps with a click', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      await userEvent.click(up())
      expect(spin()).toHaveValue('6')
      await userEvent.click(down())
      await userEvent.click(down())
      expect(spin()).toHaveValue('4')
    })

    it('gives the focus to the input', async () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      await userEvent.click(up())
      expect(spin()).toHaveFocus()
    })

    it('steps with the keyboard when a button has the focus', () => {
      render(<NumberInput aria-label="Quantity" defaultValue={5} />)
      fireEvent.click(up(), { detail: 0 })
      expect(spin()).toHaveValue('6')
    })

    it('disables a button at its limit', () => {
      const { rerender } = render(<NumberInput aria-label="Quantity" defaultValue={10} max={10} />)
      expect(up()).toBeDisabled()
      expect(down()).toBeEnabled()
      rerender(<NumberInput aria-label="Quantity" defaultValue={10} min={10} />)
      expect(down()).toBeDisabled()
      expect(up()).toBeEnabled()
    })

    it('disables both when the input is disabled or read only', () => {
      const { rerender } = render(<NumberInput aria-label="Quantity" disabled />)
      expect(up()).toBeDisabled()
      expect(down()).toBeDisabled()
      rerender(<NumberInput aria-label="Quantity" readOnly />)
      expect(up()).toBeDisabled()
    })

    it('can be removed', () => {
      render(<NumberInput aria-label="Quantity" steppers={false} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('uses other labels', () => {
      render(
        <NumberInput aria-label="Quantity" labels={{ decrement: 'Menos', increment: 'Más' }} />,
      )
      expect(screen.getByRole('button', { name: 'Más' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Menos' })).toBeInTheDocument()
    })

    describe('holding a button', () => {
      beforeEach(() => vi.useFakeTimers())
      afterEach(() => vi.useRealTimers())

      it('repeats while the pointer is down', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(up(), { button: 0 })
        expect(spin()).toHaveValue('1')
        act(() => {
          vi.advanceTimersByTime(400)
        })
        for (let tick = 0; tick < 3; tick += 1) {
          act(() => {
            vi.advanceTimersByTime(60)
          })
        }
        expect(spin()).toHaveValue('4')
        fireEvent.pointerUp(up())
        act(() => {
          vi.advanceTimersByTime(500)
        })
        expect(spin()).toHaveValue('4')
      })

      it('stops when the pointer leaves the button', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(down(), { button: 0 })
        fireEvent.pointerLeave(down())
        act(() => {
          vi.advanceTimersByTime(1000)
        })
        expect(spin()).toHaveValue('-1')
      })

      it('stops when the pointer is released anywhere', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(up(), { button: 0 })
        fireEvent.pointerUp(window)
        act(() => {
          vi.advanceTimersByTime(1000)
        })
        expect(spin()).toHaveValue('1')
      })

      it('stops when the pointer is cancelled', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(up(), { button: 0 })
        fireEvent.pointerCancel(up())
        act(() => {
          vi.advanceTimersByTime(1000)
        })
        expect(spin()).toHaveValue('1')
      })

      it('stops at the limit', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={8} max={10} />)
        fireEvent.pointerDown(up(), { button: 0 })
        act(() => {
          vi.advanceTimersByTime(2000)
        })
        expect(spin()).toHaveValue('10')
        expect(up()).toBeDisabled()
      })

      it('ignores a secondary button', () => {
        render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(up(), { button: 2 })
        expect(spin()).toHaveValue('0')
      })

      it('stops when it unmounts', () => {
        const { unmount } = render(<NumberInput aria-label="Quantity" defaultValue={0} />)
        fireEvent.pointerDown(up(), { button: 0 })
        unmount()
        act(() => {
          vi.advanceTimersByTime(1000)
        })
        expect(vi.getTimerCount()).toBe(0)
      })
    })
  })

  describe('value', () => {
    it('follows the value when it is controlled', async () => {
      render(<Controlled aria-label="Quantity" />)
      expect(spin()).toHaveValue('5')
      await userEvent.click(up())
      expect(spin()).toHaveValue('6')
      expect(screen.getByRole('status')).toHaveTextContent('6')
    })

    it('shows empty when the controlled value is null', async () => {
      render(<Controlled aria-label="Quantity" />)
      await userEvent.clear(spin())
      expect(screen.getByRole('status')).toHaveTextContent('empty')
      expect(spin()).toHaveValue('')
    })

    it('does not change by itself when it is controlled', async () => {
      const onValueChange = vi.fn()
      render(<NumberInput aria-label="Quantity" onValueChange={onValueChange} value={5} />)
      await userEvent.click(up())
      expect(onValueChange).toHaveBeenCalledWith(6)
      expect(spin()).toHaveValue('5')
    })

    it('shows a new controlled value over what is being typed', () => {
      const { rerender } = render(<NumberInput aria-label="Quantity" value={5} />)
      fireEvent.change(spin(), { target: { value: '7' } })
      rerender(<NumberInput aria-label="Quantity" value={9} />)
      expect(spin()).toHaveValue('9')
    })
  })

  describe('format and parse', () => {
    const money = (value: number): string => `$${value.toFixed(2)}`
    const read = (text: string): number | null => {
      const parsed = Number(text.replace('$', ''))
      return Number.isNaN(parsed) || text.trim() === '' ? null : parsed
    }

    it('shows the formatted value and exposes it as the value text', () => {
      render(<NumberInput aria-label="Price" defaultValue={5} format={money} />)
      expect(spin()).toHaveValue('$5.00')
      expect(spin()).toHaveAttribute('aria-valuetext', '$5.00')
      expect(spin()).toHaveAttribute('aria-valuenow', '5')
    })

    it('parses what the user types with the parse function', async () => {
      const onValueChange = vi.fn()
      render(
        <NumberInput
          aria-label="Price"
          format={money}
          onValueChange={onValueChange}
          parse={read}
        />,
      )
      await userEvent.type(spin(), '$12')
      expect(onValueChange).toHaveBeenLastCalledWith(12)
      await userEvent.tab()
      expect(spin()).toHaveValue('$12.00')
    })

    it('has no value text without a format', () => {
      render(<NumberInput aria-label="Price" defaultValue={5} />)
      expect(spin()).not.toHaveAttribute('aria-valuetext')
    })
  })

  describe('forms', () => {
    it('submits the number with a hidden input, not the formatted text', () => {
      const { container } = render(
        <NumberInput aria-label="Price" defaultValue={5} format={(n) => `$${n}`} name="price" />,
      )
      const hidden = container.querySelector('input[type="hidden"]')
      expect(hidden).toHaveAttribute('name', 'price')
      expect(hidden).toHaveValue('5')
      expect(spin()).not.toHaveAttribute('name')
    })

    it('submits an empty value when it is empty', () => {
      const { container } = render(<NumberInput aria-label="Price" name="price" />)
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('')
    })

    it('renders the hidden input from a part, once', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <form id="order">
          <NumberInput aria-label="Price" defaultValue={2} name="price">
            <NumberInputField />
            <NumberInputHidden form="order" name="amount" ref={ref} />
          </NumberInput>
        </form>,
      )
      const hidden = container.querySelectorAll('input[type="hidden"]')
      expect(hidden).toHaveLength(1)
      expect(ref.current).toBe(hidden[0])
      expect(ref.current).toHaveAttribute('data-plume-numberinput-hidden')
      expect(ref.current).toHaveAttribute('name', 'amount')
      expect(ref.current).toHaveAttribute('form', 'order')
      expect(ref.current).toHaveValue('2')
    })

    it('adds the hidden input to a composition with a name', () => {
      const { container } = render(
        <NumberInput aria-label="Price" defaultValue={3} name="price">
          <NumberInputField />
        </NumberInput>,
      )
      expect(container.querySelector('[data-plume-numberinput-hidden]')).toHaveAttribute(
        'name',
        'price',
      )
    })

    it('throws when the hidden input is outside a NumberInput', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<NumberInputHidden />)).toThrow(
        'NumberInputHidden must be used within a <NumberInput>',
      )
      spy.mockRestore()
    })

    it('keeps the context value while the props do not change', () => {
      const renders = vi.fn()
      const Probe = memo(function Probe() {
        useNumberInputContext('Probe')
        renders()
        return null
      })
      const ui = (label: string): ReactElement => (
        <NumberInput aria-label={label} defaultValue={1}>
          <NumberInputField />
          <Probe />
        </NumberInput>
      )
      const { rerender } = render(ui('Price'))
      rerender(ui('Price'))
      expect(renders).toHaveBeenCalledTimes(1)
      rerender(ui('Cost'))
      expect(renders).toHaveBeenCalledTimes(2)
    })

    it('has no hidden input without a name', () => {
      const { container } = render(<NumberInput aria-label="Price" />)
      expect(container.querySelector('input[type="hidden"]')).toBeNull()
    })

    it('composes with Field', () => {
      render(
        <Field helperText="Between 1 and 10" invalid errorText="Too many" label="Quantity" required>
          <NumberInput />
        </Field>,
      )
      const field = screen.getByLabelText(/Quantity/)
      expect(field).toBe(spin())
      expect(field).toBeRequired()
      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(field.getAttribute('aria-describedby')).toContain('error')
    })
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user ones', () => {
      const { container } = render(
        <NumberInput aria-label="Quantity" className="root" variant="unstyled">
          <NumberInputDecrement className="minus" />
          <NumberInputField className="field" />
          <NumberInputIncrement className="plus" />
        </NumberInput>,
      )
      expect(container.firstChild).toHaveAttribute('class', 'root')
      expect(spin()).toHaveAttribute('class', 'field')
      expect(up()).toHaveAttribute('class', 'plus')
      expect(down()).toHaveAttribute('class', 'minus')
    })

    it('has no class at all without any', () => {
      const { container } = render(<NumberInput aria-label="Quantity" variant="unstyled" />)
      expect(container.firstChild).not.toHaveAttribute('class')
      expect(spin()).not.toHaveAttribute('class')
      expect(up()).not.toHaveAttribute('class')
    })

    it('adds the classes of the parts next to the Plume ones in every variant', () => {
      render(
        <NumberInput aria-label="Quantity">
          <NumberInputDecrement className="minus" />
          <NumberInputField className="field" />
          <NumberInputIncrement className="plus" />
        </NumberInput>,
      )
      expect(spin()).toHaveClass('input', 'field')
      expect(up()).toHaveClass('stepper', 'plus')
      expect(down()).toHaveClass('stepper', 'minus')
    })
  })

  describe('parts', () => {
    const control = (container: HTMLElement): HTMLElement =>
      container.querySelector<HTMLElement>('[data-plume-numberinput-control]') as HTMLElement

    it('composes the parts in the order they are given', () => {
      const { container } = render(
        <NumberInput aria-label="Quantity" defaultValue={2}>
          <NumberInputField />
          <NumberInputDecrement />
          <NumberInputIncrement />
        </NumberInput>,
      )
      const names = Array.from(control(container).children).map(
        (child) => child.getAttribute('role') ?? child.getAttribute('aria-label'),
      )
      expect(names).toEqual(['spinbutton', 'Decrease', 'Increase'])
    })

    it('can leave out the buttons or one of them', () => {
      const { rerender } = render(
        <NumberInput aria-label="Quantity">
          <NumberInputField />
        </NumberInput>,
      )
      expect(screen.queryByRole('button')).toBeNull()
      rerender(
        <NumberInput aria-label="Quantity">
          <NumberInputField />
          <NumberInputIncrement />
        </NumberInput>,
      )
      expect(up()).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Decrease' })).toBeNull()
    })

    it('steps and clamps with standalone buttons', async () => {
      render(
        <NumberInput aria-label="Quantity" defaultValue={1} max={2} min={0} step={1}>
          <NumberInputField />
          <NumberInputIncrement />
          <NumberInputDecrement />
        </NumberInput>,
      )
      await userEvent.click(up())
      expect(spin()).toHaveValue('2')
      expect(up()).toBeDisabled()
      await userEvent.click(down())
      expect(spin()).toHaveValue('1')
    })

    it('repeats while a standalone button is held', () => {
      vi.useFakeTimers()
      render(
        <NumberInput aria-label="Quantity" defaultValue={0}>
          <NumberInputField />
          <NumberInputIncrement />
        </NumberInput>,
      )
      fireEvent.pointerDown(up(), { button: 0 })
      act(() => {
        vi.advanceTimersByTime(400)
      })
      for (let tick = 0; tick < 2; tick += 1) {
        act(() => {
          vi.advanceTimersByTime(60)
        })
      }
      expect(spin()).toHaveValue('3')
      fireEvent.pointerUp(up())
      vi.useRealTimers()
    })

    it('gives the focus to the field when a standalone button is used', async () => {
      render(
        <NumberInput aria-label="Quantity">
          <NumberInputField />
          <NumberInputIncrement />
        </NumberInput>,
      )
      await userEvent.click(up())
      expect(spin()).toHaveFocus()
    })

    it('takes the labels of the root and lets a part override its own', () => {
      render(
        <NumberInput aria-label="Quantity" labels={{ decrement: 'Menos', increment: 'Más' }}>
          <NumberInputDecrement />
          <NumberInputField />
          <NumberInputIncrement label="Sumar" />
        </NumberInput>,
      )
      expect(screen.getByRole('button', { name: 'Menos' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sumar' })).toBeInTheDocument()
    })

    it('replaces the icon of a button with its children', () => {
      render(
        <NumberInput aria-label="Quantity">
          <NumberInputField />
          <NumberInputIncrement>+1</NumberInputIncrement>
        </NumberInput>,
      )
      expect(up()).toHaveTextContent('+1')
    })

    it('takes className, style, ref and attributes on every part', () => {
      const field = createRef<HTMLInputElement>()
      const plus = createRef<HTMLButtonElement>()
      const minus = createRef<HTMLButtonElement>()
      render(
        <NumberInput aria-label="Quantity">
          <NumberInputDecrement id="minus" ref={minus} style={{ color: 'red' }} title="Less" />
          <NumberInputField id="own" placeholder="0" ref={field} style={{ color: 'blue' }} />
          <NumberInputIncrement id="plus" ref={plus} style={{ color: 'green' }} title="More" />
        </NumberInput>,
      )
      expect(field.current).toBe(spin())
      expect(plus.current).toBe(up())
      expect(minus.current).toBe(down())
      expect(spin()).toHaveAttribute('id', 'own')
      expect(spin()).toHaveAttribute('placeholder', '0')
      expect(spin()).toHaveStyle({ color: 'rgb(0, 0, 255)' })
      expect(up()).toHaveAttribute('title', 'More')
      expect(down()).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('sends the ref of the root to the field', () => {
      const ref = createRef<HTMLInputElement>()
      render(
        <NumberInput aria-label="Quantity" ref={ref}>
          <NumberInputField />
        </NumberInput>,
      )
      expect(ref.current).toBe(spin())
    })

    it('sends the attributes of the root to the field and lets the part override them', () => {
      render(
        <NumberInput aria-label="Quantity" id="root" placeholder="from root" title="Qty">
          <NumberInputField placeholder="from field" />
        </NumberInput>,
      )
      expect(spin()).toHaveAttribute('id', 'root')
      expect(spin()).toHaveAttribute('title', 'Qty')
      expect(spin()).toHaveAttribute('placeholder', 'from field')
    })

    it('calls the onBlur of the part before the one of the root', async () => {
      const onBlur = vi.fn()
      const onFieldBlur = vi.fn()
      render(
        <NumberInput aria-label="Quantity" max={5} onBlur={onBlur}>
          <NumberInputField onBlur={onFieldBlur} />
        </NumberInput>,
      )
      await userEvent.type(spin(), '9')
      await userEvent.tab()
      expect(spin()).toHaveValue('5')
      expect(onFieldBlur).toHaveBeenCalledTimes(1)
      expect(onBlur).not.toHaveBeenCalled()
    })

    it('exposes the parts and the state as attributes', () => {
      const { container, rerender } = render(<NumberInput aria-label="Quantity" />)
      expect(control(container)).toHaveAttribute('data-plume-numberinput-control')
      expect(spin()).toHaveAttribute('data-plume-numberinput-field')
      expect(up()).toHaveAttribute('data-plume-numberinput-stepper', 'increment')
      expect(down()).toHaveAttribute('data-plume-numberinput-stepper', 'decrement')
      expect(spin()).not.toHaveAttribute('data-disabled')
      expect(spin()).not.toHaveAttribute('data-invalid')
      rerender(<NumberInput aria-invalid aria-label="Quantity" disabled />)
      for (const element of [control(container), spin(), up(), down()]) {
        expect(element).toHaveAttribute('data-disabled')
      }
      expect(control(container)).toHaveAttribute('data-invalid')
      expect(spin()).toHaveAttribute('data-invalid')
    })

    it('keeps the hidden input with the name in compound mode', () => {
      const { container } = render(
        <NumberInput aria-label="Quantity" defaultValue={7} name="qty">
          <NumberInputField />
        </NumberInput>,
      )
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('7')
    })

    it('ignores steppers when it has children', () => {
      render(
        <NumberInput aria-label="Quantity" steppers={false}>
          <NumberInputField />
          <NumberInputIncrement />
        </NumberInput>,
      )
      expect(up()).toBeInTheDocument()
    })

    it('composes with Field', () => {
      render(
        <Field errorText="Too many" invalid label="Quantity" required>
          <NumberInput>
            <NumberInputDecrement />
            <NumberInputField />
            <NumberInputIncrement />
          </NumberInput>
        </Field>,
      )
      const field = screen.getByLabelText(/Quantity/)
      expect(field).toBe(spin())
      expect(field).toBeRequired()
      expect(field).toHaveAttribute('aria-invalid', 'true')
      expect(field.getAttribute('aria-describedby')).toContain('error')
    })

    it.each([
      ['NumberInputField', <NumberInputField key="f" />],
      ['NumberInputDecrement', <NumberInputDecrement key="d" />],
      ['NumberInputIncrement', <NumberInputIncrement key="i" />],
    ])('%s throws outside a NumberInput', (name, part) => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(part)).toThrow(`${name} must be used within a <NumberInput>`)
      error.mockRestore()
    })
  })
})
