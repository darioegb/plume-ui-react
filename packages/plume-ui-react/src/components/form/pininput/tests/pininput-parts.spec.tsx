import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Field } from '../../field'
import { PinInput, PinInputCell, PinInputHidden } from '..'
import type { PinInputProps } from '..'

const cells = (): HTMLInputElement[] => screen.getAllByRole<HTMLInputElement>('textbox')
const text = (): string =>
  cells()
    .map((cell) => cell.value)
    .join('')
const paste = (cell: HTMLElement, data: string): void => {
  fireEvent.paste(cell, { clipboardData: { getData: () => data } })
}

function Grouped(props: Readonly<Omit<PinInputProps, 'children'>>) {
  return (
    <PinInput aria-label="Code" length={6} {...props}>
      <PinInputCell index={0} />
      <PinInputCell index={1} />
      <PinInputCell index={2} />
      <span data-testid="dash">-</span>
      <PinInputCell index={3} />
      <PinInputCell index={4} />
      <PinInputCell index={5} />
    </PinInput>
  )
}

describe('PinInput parts', () => {
  describe('composition', () => {
    it('renders the cells in the order of its children, with anything between them', () => {
      render(<Grouped />)
      const group = screen.getByRole('group', { name: 'Code' })
      expect(cells()).toHaveLength(6)
      expect(group.children[3]).toBe(screen.getByTestId('dash'))
      expect(cells()[3]).toHaveAttribute('aria-label', 'Digit 4 of 6')
    })

    it('renders only the cells it is given', () => {
      render(
        <PinInput aria-label="Code" length={4}>
          <PinInputCell index={0} />
          <PinInputCell index={1} />
        </PinInput>,
      )
      expect(cells()).toHaveLength(2)
    })

    it('puts the cells wrapped in other elements', () => {
      render(
        <PinInput aria-label="Code" length={2}>
          <div data-testid="wrap">
            <PinInputCell index={0} />
          </div>
          <section>
            <PinInputCell index={1} />
          </section>
        </PinInput>,
      )
      expect(screen.getByTestId('wrap')).toContainElement(cells()[0])
    })

    it('gives the id to the fieldset and lets a cell take its own', () => {
      render(
        <PinInput aria-label="Code" id="pin" length={2}>
          <PinInputCell id="own" index={1} />
          <PinInputCell index={0} />
        </PinInput>,
      )
      expect(screen.getByRole('group')).toHaveAttribute('id', 'pin')
      expect(cells()[0]).toHaveAttribute('id', 'own')
      expect(cells()[1]).not.toHaveAttribute('id')
    })

    it('throws when a part is outside a PinInput', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<PinInputCell index={0} />)).toThrow(
        '<PinInputCell> must be rendered inside a <PinInput>',
      )
      expect(() => render(<PinInputHidden name="a" />)).toThrow(
        '<PinInputHidden> must be rendered inside a <PinInput>',
      )
      error.mockRestore()
    })
  })

  describe('the cell', () => {
    it('takes className, style and a ref', () => {
      const ref = createRef<HTMLInputElement>()
      render(
        <PinInput aria-label="Code" length={1}>
          <PinInputCell className="mine" index={0} ref={ref} style={{ width: 70 }} />
        </PinInput>,
      )
      expect(cells()[0]).toHaveClass('cell', 'mine')
      expect(cells()[0]).toHaveStyle({ width: '70px' })
      expect(ref.current).toBe(cells()[0])
    })

    it('drops its Plume class when the root is unstyled and keeps its own', () => {
      render(
        <PinInput aria-label="Code" length={2} variant="unstyled">
          <PinInputCell className="mine" index={0} />
          <PinInputCell index={1} />
        </PinInput>,
      )
      expect(cells()[0]).toHaveAttribute('class', 'mine')
      expect(cells()[1]).not.toHaveAttribute('class')
    })

    it('takes its own name, placeholder, autoComplete and inputMode', () => {
      render(
        <PinInput aria-label="Code" length={1}>
          <PinInputCell
            aria-label="Only digit"
            autoComplete="off"
            index={0}
            inputMode="text"
            placeholder="0"
            title="hint"
          />
        </PinInput>,
      )
      expect(cells()[0]).toHaveAttribute('aria-label', 'Only digit')
      expect(cells()[0]).toHaveAttribute('autocomplete', 'off')
      expect(cells()[0]).toHaveAttribute('inputmode', 'text')
      expect(cells()[0]).toHaveAttribute('placeholder', '0')
      expect(cells()[0]).toHaveAttribute('title', 'hint')
    })

    it('reads the placeholder, type and mask of the root', () => {
      render(
        <PinInput aria-label="Code" length={1} mask placeholder="*" type="alphanumeric">
          <PinInputCell index={0} />
        </PinInput>,
      )
      const cell = document.querySelector<HTMLInputElement>('[data-plume-pininput-cell]')
      expect(cell).toHaveAttribute('type', 'password')
      expect(cell).toHaveAttribute('placeholder', '*')
      expect(cell).toHaveAttribute('inputmode', 'text')
    })

    it('uses the labels of the root', () => {
      render(
        <PinInput aria-label="Code" labels={{ input: (i, n) => `Cifra ${i} de ${n}` }} length={2}>
          <PinInputCell index={1} />
        </PinInput>,
      )
      expect(cells()[0]).toHaveAttribute('aria-label', 'Cifra 2 de 2')
    })

    it('says its state in data attributes', () => {
      const { rerender } = render(<Grouped defaultValue="1" length={6} />)
      expect(cells()[0]).toHaveAttribute('data-filled')
      expect(cells()[1]).not.toHaveAttribute('data-filled')
      expect(cells()[0]).toHaveAttribute('data-plume-pininput-cell')
      expect(cells()[0]).not.toHaveAttribute('data-disabled')
      expect(cells()[0]).not.toHaveAttribute('data-invalid')
      rerender(<Grouped aria-invalid disabled />)
      expect(cells()[0]).toHaveAttribute('data-disabled')
      expect(cells()[0]).toHaveAttribute('data-invalid')
      expect(cells()[0]).toBeDisabled()
    })
  })

  describe('the root', () => {
    it('says its state in data attributes', () => {
      render(<Grouped aria-invalid disabled />)
      const group = screen.getByRole('group')
      expect(group).toHaveAttribute('data-disabled')
      expect(group).toHaveAttribute('data-invalid')
    })

    it('has no state attributes by default', () => {
      render(<Grouped />)
      const group = screen.getByRole('group')
      expect(group).not.toHaveAttribute('data-disabled')
      expect(group).not.toHaveAttribute('data-invalid')
    })
  })

  describe('the hidden input', () => {
    it('is rendered by the default composition when it has a name', () => {
      const { container } = render(<PinInput aria-label="Code" defaultValue="12" name="otp" />)
      const hidden = container.querySelector<HTMLInputElement>('[data-plume-pininput-hidden]')
      expect(hidden).toHaveAttribute('name', 'otp')
      expect(hidden).toHaveValue('12')
    })

    it('is not rendered without a name', () => {
      const { container } = render(<PinInput aria-label="Code" />)
      expect(container.querySelector('[data-plume-pininput-hidden]')).toBeNull()
    })

    it('is a part of its own in a composition and takes the name of the root', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <PinInput aria-label="Code" defaultValue="9" length={1} name="otp">
          <PinInputCell index={0} />
          <PinInputHidden ref={ref} />
        </PinInput>,
      )
      const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]')
      expect(hidden).toHaveAttribute('name', 'otp')
      expect(hidden).toHaveValue('9')
      expect(ref.current).toBe(hidden)
    })

    it('takes its own name', () => {
      const { container } = render(
        <PinInput aria-label="Code" length={1} name="otp">
          <PinInputCell index={0} />
          <PinInputHidden name="other" />
        </PinInput>,
      )
      expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'other')
    })

    it('is not there in a composition that leaves it out', () => {
      const { container } = render(<Grouped name="otp" />)
      expect(container.querySelector('input[type="hidden"]')).toBeNull()
    })
  })

  describe('behavior across a composition', () => {
    it('moves to the next cell while typing, across the separator', async () => {
      const user = userEvent.setup()
      render(<Grouped />)
      await user.click(cells()[0])
      await user.keyboard('123456')
      expect(text()).toBe('123456')
      expect(cells()[5]).toHaveFocus()
    })

    it('goes back with Backspace and moves with the arrows, Home and End', async () => {
      const user = userEvent.setup()
      render(<Grouped defaultValue="1234" />)
      await user.click(cells()[4])
      await user.keyboard('{Backspace}')
      expect(text()).toBe('123')
      expect(cells()[3]).toHaveFocus()
      await user.keyboard('{ArrowRight}')
      expect(cells()[4]).toHaveFocus()
      await user.keyboard('{Home}')
      expect(cells()[0]).toHaveFocus()
      await user.keyboard('{End}')
      expect(cells()[5]).toHaveFocus()
    })

    it('spreads a paste over the cells', () => {
      render(<Grouped />)
      paste(cells()[0], '123456')
      expect(text()).toBe('123456')
    })

    it('keeps only the tabbable cell in the tab order', () => {
      render(<Grouped defaultValue="12" />)
      expect(cells().map((cell) => cell.tabIndex)).toEqual([-1, -1, 0, -1, -1, -1])
    })

    it('focuses the first cell on mount', () => {
      render(<Grouped focusOnMount />)
      expect(cells()[0]).toHaveFocus()
    })

    it('calls onComplete when it is full', async () => {
      const onComplete = vi.fn()
      const user = userEvent.setup()
      render(<Grouped onComplete={onComplete} />)
      await user.click(cells()[0])
      await user.keyboard('123456')
      expect(onComplete).toHaveBeenCalledWith('123456')
    })

    it('does not change when it is read only', async () => {
      const user = userEvent.setup()
      render(<Grouped defaultValue="12" readOnly />)
      await user.click(cells()[2])
      await user.keyboard('3')
      expect(text()).toBe('12')
    })
  })

  describe('with a Field', () => {
    it('is named by the label and takes its id on the fieldset', () => {
      render(
        <Field label="Code" helperText="Six digits">
          <PinInput length={2}>
            <PinInputCell index={0} />
            <PinInputCell index={1} />
          </PinInput>
        </Field>,
      )
      const group = screen.getByRole('group', { name: 'Code' })
      expect(group).toHaveAccessibleDescription('Six digits')
      expect(document.querySelector('label')?.getAttribute('for')).toBe(group.id)
    })

    it('focuses the box to fill when the label is clicked', async () => {
      render(
        <Field label="Code">
          <PinInput defaultValue="12" length={4}>
            <PinInputCell index={0} />
            <PinInputCell index={1} />
            <PinInputCell index={2} />
            <PinInputCell index={3} />
          </PinInput>
        </Field>,
      )
      await userEvent.click(screen.getByText('Code'))
      expect(cells()[2]).toHaveFocus()
    })

    it('shows the error state of the Field in its cells', () => {
      render(
        <Field errorText="Wrong code" label="Code">
          <PinInput length={1}>
            <PinInputCell index={0} />
          </PinInput>
        </Field>,
      )
      expect(cells()[0]).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByRole('group')).toHaveAttribute('data-invalid')
    })
  })

  describe('with react-hook-form', () => {
    interface Values {
      code: string
    }

    function Form({ onSubmit }: { onSubmit: (values: Values) => void }): React.ReactNode {
      const { control, handleSubmit } = useForm<Values>({ defaultValues: { code: '' } })
      return (
        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <PinInput
                aria-label="Code"
                length={4}
                onValueChange={field.onChange}
                value={field.value}
              >
                <PinInputCell index={0} />
                <PinInputCell index={1} />
                <span>-</span>
                <PinInputCell index={2} />
                <PinInputCell index={3} />
              </PinInput>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      )
    }

    it('submits the typed value', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()
      render(<Form onSubmit={onSubmit} />)
      await user.click(cells()[0])
      await user.keyboard('4821')
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ code: '4821' }, expect.anything())
      })
    })
  })
})
