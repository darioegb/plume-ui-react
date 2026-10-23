import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Field } from '../../field'
import { PinInput } from '..'
import type { PinInputProps } from '..'

const cells = (): HTMLInputElement[] => screen.getAllByRole<HTMLInputElement>('textbox')
const text = (): string =>
  cells()
    .map((cell) => cell.value)
    .join('')
const paste = (cell: HTMLElement, data: string): void => {
  fireEvent.paste(cell, { clipboardData: { getData: () => data } })
}

function Controlled(props: Readonly<PinInputProps>) {
  const [value, setValue] = useState('12')
  return (
    <>
      <PinInput {...props} onValueChange={setValue} value={value} />
      <output>{value}</output>
    </>
  )
}

describe('PinInput component', () => {
  describe('rendering', () => {
    it('renders six cells by default', () => {
      render(<PinInput aria-label="Code" />)
      expect(cells()).toHaveLength(6)
    })

    it('renders as many cells as the length', () => {
      render(<PinInput aria-label="Code" length={4} />)
      expect(cells()).toHaveLength(4)
    })

    it('is a group named by the fieldset', () => {
      render(<PinInput aria-label="Code" />)
      expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument()
    })

    it('names every cell with its position', () => {
      render(<PinInput aria-label="Code" length={3} />)
      expect(cells().map((cell) => cell.getAttribute('aria-label'))).toEqual([
        'Digit 1 of 3',
        'Digit 2 of 3',
        'Digit 3 of 3',
      ])
    })

    it('says character for the types that are not numeric', () => {
      render(<PinInput aria-label="Code" length={2} type="alphanumeric" />)
      expect(cells()[0]).toHaveAttribute('aria-label', 'Character 1 of 2')
    })

    it('uses another name for the cells', () => {
      render(
        <PinInput aria-label="Code" getInputLabel={(i, n) => `Cifra ${i} de ${n}`} length={2} />,
      )
      expect(cells()[1]).toHaveAttribute('aria-label', 'Cifra 2 de 2')
    })

    it('is an outline, medium, rounded pin by default', () => {
      render(<PinInput aria-label="Code" />)
      expect(screen.getByRole('group')).toHaveClass('pin', 'outline', 'md', 'rounded')
      expect(cells()[0]).toHaveClass('cell')
    })

    it.each(['outline', 'filled', 'underline'] as const)('supports the %s variant', (variant) => {
      render(<PinInput aria-label="Code" variant={variant} />)
      expect(screen.getByRole('group')).toHaveClass(variant)
    })

    it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
      render(<PinInput aria-label="Code" size={size} />)
      expect(screen.getByRole('group')).toHaveClass(size)
    })

    it('supports the pill shape', () => {
      render(<PinInput aria-label="Code" shape="pill" />)
      expect(screen.getByRole('group')).toHaveClass('pill')
    })

    it('takes its color from the color scheme, or the error one when invalid', () => {
      const { rerender } = render(<PinInput aria-label="Code" colorScheme="success" />)
      expect(screen.getByRole('group')).toHaveStyle({
        '--pininput-color': 'var(--plume-color-success-text)',
      })
      rerender(<PinInput aria-invalid aria-label="Code" colorScheme="success" />)
      expect(screen.getByRole('group')).toHaveStyle({
        '--pininput-color': 'var(--plume-color-error-text)',
      })
      expect(screen.getByRole('group')).toHaveClass('invalid')
    })

    it('keeps the className and style on the fieldset', () => {
      render(<PinInput aria-label="Code" className="mine" style={{ gap: '10px' }} />)
      expect(screen.getByRole('group')).toHaveClass('pin', 'mine')
      expect(screen.getByRole('group')).toHaveStyle({ gap: '10px' })
    })

    it('forwards the ref and the attributes to the fieldset', () => {
      const ref = createRef<HTMLFieldSetElement>()
      render(<PinInput aria-describedby="hint" aria-label="Code" ref={ref} title="Code" />)
      expect(ref.current).toBe(screen.getByRole('group'))
      expect(ref.current).toHaveAttribute('aria-describedby', 'hint')
      expect(ref.current).toHaveAttribute('title', 'Code')
    })

    it('puts the id on the first cell', () => {
      render(<PinInput aria-label="Code" id="otp" />)
      expect(cells()[0]).toHaveAttribute('id', 'otp')
      expect(cells()[1]).not.toHaveAttribute('id')
    })

    it('asks for the numeric keyboard and the one time code', () => {
      render(<PinInput aria-label="Code" />)
      expect(cells()[0]).toHaveAttribute('inputmode', 'numeric')
      expect(cells()[0]).toHaveAttribute('autocomplete', 'one-time-code')
    })

    it('uses the text keyboard for the other types', () => {
      render(<PinInput aria-label="Code" type="alphanumeric" />)
      expect(cells()[0]).toHaveAttribute('inputmode', 'text')
    })

    it('uses another autocomplete', () => {
      render(<PinInput aria-label="Code" autoComplete="off" />)
      expect(cells()[0]).toHaveAttribute('autocomplete', 'off')
    })

    it('masks the cells', () => {
      render(<PinInput aria-label="Pin" length={4} mask />)
      expect(document.querySelectorAll('input[type="password"]')).toHaveLength(4)
    })

    it('shows a placeholder in every cell', () => {
      render(<PinInput aria-label="Code" length={2} placeholder="○" />)
      expect(cells()[0]).toHaveAttribute('placeholder', '○')
    })

    it('focuses the first cell when it mounts', () => {
      render(<PinInput aria-label="Code" focusOnMount />)
      expect(cells()[0]).toHaveFocus()
    })

    it('shows the default value', () => {
      render(<PinInput aria-label="Code" defaultValue="123" length={4} />)
      expect(cells().map((cell) => cell.value)).toEqual(['1', '2', '3', ''])
    })

    it('cuts a default value that is too long', () => {
      render(<PinInput aria-label="Code" defaultValue="123456789" length={4} />)
      expect(text()).toBe('1234')
    })

    it('marks the cells that have a value', () => {
      render(<PinInput aria-label="Code" defaultValue="12" length={3} />)
      expect(cells()[0]).toHaveAttribute('data-filled')
      expect(cells()[2]).not.toHaveAttribute('data-filled')
    })
  })

  describe('typing', () => {
    it('moves to the next cell while the user types', async () => {
      render(<PinInput aria-label="Code" length={4} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('12')
      expect(text()).toBe('12')
      expect(cells()[2]).toHaveFocus()
    })

    it('stays on the last cell', async () => {
      render(<PinInput aria-label="Code" length={3} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('123')
      expect(text()).toBe('123')
      expect(cells()[2]).toHaveFocus()
    })

    it('calls onValueChange with the value', async () => {
      const onValueChange = vi.fn()
      render(<PinInput aria-label="Code" length={4} onValueChange={onValueChange} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('12')
      expect(onValueChange).toHaveBeenNthCalledWith(1, '1')
      expect(onValueChange).toHaveBeenNthCalledWith(2, '12')
    })

    it('calls onComplete when the last cell is filled', async () => {
      const onComplete = vi.fn()
      render(<PinInput aria-label="Code" length={3} onComplete={onComplete} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('12')
      expect(onComplete).not.toHaveBeenCalled()
      await userEvent.keyboard('3')
      expect(onComplete).toHaveBeenCalledWith('123')
    })

    it('rejects characters that do not fit the type', async () => {
      render(<PinInput aria-label="Code" length={3} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('a1-')
      expect(text()).toBe('1')
    })

    it('accepts letters when it is alphanumeric', async () => {
      render(<PinInput aria-label="Code" length={3} type="alphanumeric" />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('a1-')
      expect(text()).toBe('a1')
    })

    it('replaces the character of a cell', async () => {
      render(<PinInput aria-label="Code" defaultValue="123" length={4} />)
      await userEvent.click(cells()[1])
      await userEvent.keyboard('9')
      expect(text()).toBe('193')
    })

    it('types into the first empty cell when another one is clicked', async () => {
      render(<PinInput aria-label="Code" length={4} />)
      await userEvent.click(cells()[3])
      await userEvent.keyboard('7')
      expect(text()).toBe('7')
      expect(cells()[0]).toHaveValue('7')
    })

    it('takes the characters of an autofill that arrives in one cell', () => {
      const onComplete = vi.fn()
      render(<PinInput aria-label="Code" length={4} onComplete={onComplete} />)
      fireEvent.change(cells()[0], { target: { value: '1234' } })
      expect(text()).toBe('1234')
      expect(onComplete).toHaveBeenCalledWith('1234')
    })

    it('does not change when it is read only', async () => {
      const onValueChange = vi.fn()
      render(
        <PinInput
          aria-label="Code"
          defaultValue="12"
          length={4}
          onValueChange={onValueChange}
          readOnly
        />,
      )
      await userEvent.click(cells()[2])
      await userEvent.keyboard('3{Backspace}{Delete}')
      paste(cells()[0], '9999')
      expect(text()).toBe('12')
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('cannot be typed into when it is disabled', () => {
      render(<PinInput aria-label="Code" disabled length={3} />)
      expect(cells()[0]).toBeDisabled()
      expect(screen.getByRole('group')).toBeDisabled()
    })
  })

  describe('deleting', () => {
    it('removes the character of the cell and keeps the focus', async () => {
      render(<PinInput aria-label="Code" defaultValue="1234" length={4} />)
      await userEvent.click(cells()[1])
      await userEvent.keyboard('{Backspace}')
      expect(text()).toBe('134')
      expect(cells()[1]).toHaveFocus()
    })

    it('goes back and removes the previous character from an empty cell', async () => {
      render(<PinInput aria-label="Code" defaultValue="12" length={4} />)
      await userEvent.click(cells()[2])
      await userEvent.keyboard('{Backspace}')
      expect(text()).toBe('1')
      expect(cells()[1]).toHaveFocus()
    })

    it('does nothing when it is empty and on the first cell', async () => {
      const onValueChange = vi.fn()
      render(<PinInput aria-label="Code" length={3} onValueChange={onValueChange} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('{Backspace}')
      expect(cells()[0]).toHaveFocus()
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('removes the character with Delete without moving', async () => {
      render(<PinInput aria-label="Code" defaultValue="123" length={4} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('{Delete}')
      expect(text()).toBe('23')
      expect(cells()[0]).toHaveFocus()
    })
  })

  describe('pasting', () => {
    it('fills the cells with the pasted text', () => {
      const onComplete = vi.fn()
      render(<PinInput aria-label="Code" length={6} onComplete={onComplete} />)
      paste(cells()[0], '123456')
      expect(text()).toBe('123456')
      expect(onComplete).toHaveBeenCalledWith('123456')
      expect(cells()[5]).toHaveFocus()
    })

    it('ignores what does not fit the type and cuts the rest', () => {
      render(<PinInput aria-label="Code" length={4} />)
      paste(cells()[0], ' 12-34 56 ')
      expect(text()).toBe('1234')
    })

    it('replaces what comes after the cell', () => {
      render(<PinInput aria-label="Code" defaultValue="1234" length={5} />)
      paste(cells()[1], '98')
      expect(text()).toBe('198')
    })

    it('ignores a paste that has nothing valid', () => {
      render(<PinInput aria-label="Code" defaultValue="12" length={4} />)
      paste(cells()[2], 'abc')
      expect(text()).toBe('12')
    })

    it('moves the focus after the pasted text', () => {
      render(<PinInput aria-label="Code" length={6} />)
      paste(cells()[0], '123')
      expect(cells()[3]).toHaveFocus()
    })
  })

  describe('keyboard', () => {
    it('moves between the cells with the arrows', async () => {
      render(<PinInput aria-label="Code" defaultValue="123" length={4} />)
      await userEvent.click(cells()[1])
      await userEvent.keyboard('{ArrowRight}')
      expect(cells()[2]).toHaveFocus()
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(cells()[0]).toHaveFocus()
    })

    it('stops at the ends', async () => {
      render(<PinInput aria-label="Code" length={3} />)
      await userEvent.click(cells()[0])
      await userEvent.keyboard('{ArrowLeft}')
      expect(cells()[0]).toHaveFocus()
      await userEvent.click(cells()[2])
      await userEvent.keyboard('{ArrowRight}')
      expect(cells()[2]).toHaveFocus()
    })

    it('goes to the first and the last cell with Home and End', async () => {
      render(<PinInput aria-label="Code" defaultValue="12" length={5} />)
      await userEvent.click(cells()[1])
      await userEvent.keyboard('{End}')
      expect(cells()[4]).toHaveFocus()
      await userEvent.keyboard('{Home}')
      expect(cells()[0]).toHaveFocus()
    })

    it('selects the content of a cell when it gets the focus', async () => {
      render(<PinInput aria-label="Code" defaultValue="12" length={3} />)
      await userEvent.click(cells()[0])
      expect(cells()[0].selectionStart).toBe(0)
      expect(cells()[0].selectionEnd).toBe(1)
    })

    it('has a single tab stop, on the next cell to fill', () => {
      const { rerender } = render(<PinInput aria-label="Code" defaultValue="12" length={4} />)
      expect(cells().map((cell) => cell.tabIndex)).toEqual([-1, -1, 0, -1])
      rerender(<PinInput aria-label="Code" length={4} value="1234" />)
      expect(cells().map((cell) => cell.tabIndex)).toEqual([-1, -1, -1, 0])
    })
  })

  describe('value', () => {
    it('follows the value when it is controlled', async () => {
      render(<Controlled aria-label="Code" length={4} />)
      expect(text()).toBe('12')
      await userEvent.click(cells()[2])
      await userEvent.keyboard('3')
      expect(text()).toBe('123')
      expect(screen.getByRole('status')).toHaveTextContent('123')
    })

    it('does not change by itself when it is controlled', async () => {
      const onValueChange = vi.fn()
      render(<PinInput aria-label="Code" length={4} onValueChange={onValueChange} value="12" />)
      await userEvent.click(cells()[2])
      await userEvent.keyboard('3')
      expect(onValueChange).toHaveBeenCalledWith('123')
      expect(text()).toBe('12')
    })

    it('can be cleared from outside', () => {
      const { rerender } = render(<PinInput aria-label="Code" length={4} value="1234" />)
      rerender(<PinInput aria-label="Code" length={4} value="" />)
      expect(text()).toBe('')
    })
  })

  describe('forms', () => {
    it('submits the value with a hidden input', () => {
      const { container } = render(
        <PinInput aria-label="Code" defaultValue="123" length={4} name="otp" />,
      )
      const hidden = container.querySelector('input[type="hidden"]')
      expect(hidden).toHaveAttribute('name', 'otp')
      expect(hidden).toHaveValue('123')
      expect(cells()[0]).not.toHaveAttribute('name')
    })

    it('has no hidden input without a name', () => {
      const { container } = render(<PinInput aria-label="Code" />)
      expect(container.querySelector('input[type="hidden"]')).toBeNull()
    })

    it('composes with Field', async () => {
      render(
        <Field errorText="Wrong code" helperText="Six digits" invalid label="Code" required>
          <PinInput />
        </Field>,
      )
      const group = screen.getByRole('group', { name: /Code/ })
      expect(group.getAttribute('aria-describedby')).toContain('error')
      expect(cells()[0]).toHaveAttribute('aria-invalid', 'true')
      expect(cells()[0]).toHaveAttribute('aria-required', 'true')
      await userEvent.click(screen.getByText('Code'))
      expect(cells()[0]).toHaveFocus()
    })

    it('does not use the label of a Field of another control', () => {
      render(
        <Field label="Other">
          <input />
        </Field>,
      )
      render(<PinInput aria-label="Code" />)
      expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument()
    })
  })

  describe('unstyled', () => {
    it('drops every Plume class and keeps the user ones', () => {
      render(
        <PinInput classNames={{ input: 'cell' }}
          aria-label="Code"
          className="root"
         
          length={2}
          variant="unstyled"
        />,
      )
      expect(screen.getByRole('group')).toHaveAttribute('class', 'root')
      cells().forEach((cell) => expect(cell).toHaveAttribute('class', 'cell'))
    })

    it('has no class at all without any', () => {
      render(<PinInput aria-label="Code" length={2} variant="unstyled" />)
      expect(screen.getByRole('group')).not.toHaveAttribute('class')
      expect(cells()[0]).not.toHaveAttribute('class')
    })

    it('adds the class of the cells in every variant', () => {
      render(<PinInput classNames={{ input: 'mine' }} aria-label="Code" length={2} />)
      expect(cells()[0]).toHaveClass('cell', 'mine')
    })
  })
})
