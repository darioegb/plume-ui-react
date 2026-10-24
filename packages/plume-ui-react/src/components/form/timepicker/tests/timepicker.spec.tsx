import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TimePicker, TimePickerInput, TimePickerPanel } from '..'
import { Modal, ModalBody, ModalContent } from '../../../overlay/modal'

const openPicker = (name = 'Open time picker'): void => {
  fireEvent.click(screen.getByRole('button', { name }))
}

const option = (list: string, name: string): HTMLElement =>
  within(screen.getByRole('listbox', { name: list })).getByRole('option', { name })

const pick = (list: string, name: string): void => {
  fireEvent.click(option(list, name))
}

describe('TimePicker', () => {
  it('shows the value in the input', () => {
    render(<TimePicker defaultValue="14:30" />)
    expect(screen.getByRole('textbox')).toHaveValue('14:30')
  })

  it('shows an empty input and the placeholder without value', () => {
    render(<TimePicker />)
    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(screen.getByPlaceholderText('hh:mm')).toBeInTheDocument()
  })

  it('uses its own placeholder', () => {
    render(<TimePicker placeholder="Start" />)
    expect(screen.getByPlaceholderText('Start')).toBeInTheDocument()
  })

  it('emits the value once the typed time is complete and valid', () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '0930' } })
    expect(input).toHaveValue('09:30')
    expect(onChange).toHaveBeenCalledWith('09:30')
  })

  it('does not emit an incomplete or invalid time', () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '0' } })
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2599' } })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('restores the value when the typed text is invalid on blur', () => {
    const onBlur = vi.fn()
    render(<TimePicker defaultValue="10:00" onBlur={onBlur} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '99:99' } })
    fireEvent.blur(input)
    expect(input).toHaveValue('10:00')
    expect(onBlur).toHaveBeenCalledWith('10:00')
  })

  it('clears the value when the input is emptied', () => {
    const onChange = vi.fn()
    render(<TimePicker defaultValue="10:00" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith('')
    expect(input).toHaveValue('')
  })

  it('opens a dialog with hours and minutes and focuses the selected hour', () => {
    render(<TimePicker defaultValue="14:30" />)
    openPicker()
    expect(screen.getByRole('dialog', { name: 'Time picker' })).toBeInTheDocument()
    expect(option('Hours', '14')).toHaveFocus()
    expect(option('Hours', '14')).toHaveAttribute('aria-selected', 'true')
    expect(option('Minutes', '30')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Open time picker' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('closes with the button too', () => {
    render(<TimePicker />)
    openPicker()
    openPicker()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('picks the hour keeping the popup open and the minute closing it', () => {
    const onChange = vi.fn()
    render(<TimePicker defaultValue="09:15" onChange={onChange} />)
    openPicker()
    pick('Hours', '18')
    expect(onChange).toHaveBeenLastCalledWith('18:15')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    pick('Minutes', '45')
    expect(onChange).toHaveBeenLastCalledWith('18:45')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveFocus()
    expect(screen.getByRole('textbox')).toHaveValue('18:45')
  })

  it('starts from midnight when picking with no value', () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)
    openPicker()
    expect(screen.getAllByRole('option').filter((option) => option.tabIndex === 0)).toHaveLength(2)
    pick('Hours', '07')
    expect(onChange).toHaveBeenCalledWith('07:00')
  })

  it('steps the minutes', () => {
    render(<TimePicker minuteStep={15} />)
    openPicker()
    const minutes = within(screen.getByRole('listbox', { name: 'Minutes' })).getAllByRole('option')
    expect(minutes.map((option) => option.textContent)).toEqual(['00', '15', '30', '45'])
  })

  it('moves between options with the arrow, Home and End keys', () => {
    render(<TimePicker defaultValue="05:00" />)
    openPicker()
    const hour = option('Hours', '05')
    fireEvent.keyDown(hour, { key: 'ArrowDown' })
    expect(option('Hours', '06')).toHaveFocus()
    fireEvent.keyDown(option('Hours', '06'), { key: 'ArrowUp' })
    expect(hour).toHaveFocus()
    fireEvent.keyDown(hour, { key: 'End' })
    expect(option('Hours', '23')).toHaveFocus()
    fireEvent.keyDown(option('Hours', '23'), { key: 'ArrowDown' })
    expect(option('Hours', '23')).toHaveFocus()
    fireEvent.keyDown(option('Hours', '23'), { key: 'Home' })
    expect(option('Hours', '00')).toHaveFocus()
    fireEvent.keyDown(option('Hours', '00'), { key: 'a' })
    expect(option('Hours', '00')).toHaveFocus()
  })

  it('closes with Escape returning the focus to the input', () => {
    render(<TimePicker />)
    openPicker()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('closes with a press outside', () => {
    render(<TimePicker />)
    openPicker()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when the focus leaves it', () => {
    render(
      <>
        <TimePicker />
        <button type="button">Other</button>
      </>,
    )
    openPicker()
    fireEvent.blur(screen.getByRole('button', { name: 'Open time picker' }), {
      relatedTarget: screen.getByRole('button', { name: 'Other' }),
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('stays open when the focus moves inside it', () => {
    render(<TimePicker defaultValue="10:00" />)
    openPicker()
    fireEvent.blur(screen.getByRole('textbox'), {
      relatedTarget: option('Hours', '10'),
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('blocks the button when disabled or read-only', () => {
    const { rerender } = render(<TimePicker disabled />)
    expect(screen.getByRole('button', { name: 'Open time picker' })).toBeDisabled()
    rerender(<TimePicker readOnly />)
    expect(screen.getByRole('button', { name: 'Open time picker' })).toBeDisabled()
  })

  it('follows a controlled value', () => {
    function Controlled(): React.ReactNode {
      const [value, setValue] = useState('08:00')
      return (
        <>
          <TimePicker onChange={setValue} value={value} />
          <button
            onClick={() => {
              setValue('21:45')
            }}
            type="button"
          >
            Evening
          </button>
        </>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByRole('button', { name: 'Evening' }))
    expect(screen.getByRole('textbox')).toHaveValue('21:45')
  })

  it('names its parts with the labels it is given', () => {
    render(
      <TimePicker
        labels={{
          hours: 'Horas',
          minutes: 'Minutos',
          openTimePicker: 'Abrir',
          timePicker: 'Hora',
        }}
      />,
    )
    openPicker('Abrir')
    expect(screen.getByRole('dialog', { name: 'Hora' })).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: 'Horas' })).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: 'Minutos' })).toBeInTheDocument()
  })

  it('passes the field attributes to the input', () => {
    render(
      <TimePicker
        aria-invalid
        className="mine"
        classNames={{ input: 'input-mine', panel: 'panel-mine' }}
        id="start"
        name="start"
        required
      />,
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'start')
    expect(input).toHaveAttribute('name', 'start')
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('input-mine')
    expect(input).not.toHaveClass('mine')
    openPicker()
    expect(screen.getByRole('dialog')).toHaveClass('panel-mine')
  })

  it('gives the input ref and the root ref', () => {
    const inputRef = vi.fn()
    const ref = vi.fn()
    render(<TimePicker inputRef={inputRef} ref={ref} />)
    expect(inputRef).toHaveBeenCalledWith(screen.getByRole('textbox'))
    expect(ref).toHaveBeenCalled()
  })

  it('gives the panel the look of the variant, size and shape', () => {
    render(<TimePicker shape="pill" size="lg" variant="filled" />)
    openPicker()
    expect(screen.getByRole('dialog')).toHaveClass('panelFilled', 'panelLg', 'panelPill')
  })

  it('leaves the panel unstyled with the unstyled variant', () => {
    render(<TimePicker variant="unstyled" />)
    openPicker()
    expect(screen.getByRole('dialog').className).not.toMatch(/panel(Outline|Filled|Underline)/)
  })

  describe('with 12 hours', () => {
    it('shows the period and lists 12 hours with AM and PM', () => {
      render(<TimePicker defaultValue="15:30" hour12 />)
      expect(screen.getByRole('textbox')).toHaveValue('03:30 PM')
      expect(screen.getByPlaceholderText('hh:mm AM')).toBeInTheDocument()
      openPicker()
      expect(
        within(screen.getByRole('listbox', { name: 'Hours' })).getAllByRole('option'),
      ).toHaveLength(12)
      expect(screen.getByRole('option', { name: 'PM' })).toHaveAttribute('aria-selected', 'true')
    })

    it('keeps the period when picking the hour and changes the hours when picking the period', () => {
      const onChange = vi.fn()
      render(<TimePicker defaultValue="15:30" hour12 onChange={onChange} />)
      openPicker()
      pick('Hours', '09')
      expect(onChange).toHaveBeenLastCalledWith('21:30')
      pick('Period', 'AM')
      expect(onChange).toHaveBeenLastCalledWith('09:30')
    })

    it('parses the typed time on blur', () => {
      const onChange = vi.fn()
      render(<TimePicker hour12 onChange={onChange} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '7:05 pm' } })
      expect(onChange).not.toHaveBeenCalled()
      fireEvent.blur(input)
      expect(onChange).toHaveBeenCalledWith('19:05')
      expect(input).toHaveValue('07:05 PM')
    })

    it('uses the labels of the period', () => {
      render(
        <TimePicker
          labels={{ am: 'a. m.', pm: 'p. m.', period: 'Periodo' }}
          defaultValue="08:00"
          hour12
        />,
      )
      expect(screen.getByRole('textbox')).toHaveValue('08:00 a. m.')
      openPicker()
      expect(screen.getByRole('listbox', { name: 'Periodo' })).toBeInTheDocument()
    })

    it('selects no period without a value', () => {
      render(<TimePicker hour12 />)
      openPicker()
      expect(screen.getByRole('option', { name: 'AM' })).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('as a compound component', () => {
    it('takes its parts as children and opens the panel outside of the TimePicker', () => {
      const { container } = render(
        <TimePicker defaultValue="10:30">
          <TimePickerPanel className="mine" />
          <TimePickerInput placeholder="Start" />
        </TimePicker>,
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByPlaceholderText('Start')).toBeInTheDocument()

      openPicker()

      const root = container.firstChild as HTMLElement
      expect(root.contains(screen.getByRole('dialog'))).toBe(false)
      expect(screen.getByRole('dialog')).toHaveClass('mine')
    })

    it('shows the panel without the input and keeps it open when a minute is picked', () => {
      const onChange = vi.fn()
      render(<TimePicker defaultValue="09:00" isPanel onChange={onChange} />)
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', { name: 'Time picker' })).toHaveClass('inline')

      pick('Hours', '11')
      pick('Minutes', '45')

      expect(onChange).toHaveBeenLastCalledWith('11:45')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('names the panel with its own label', () => {
      render(
        <TimePicker isPanel>
          <TimePickerPanel aria-label="Start time" />
        </TimePicker>,
      )
      expect(screen.getByRole('dialog', { name: 'Start time' })).toBeInTheDocument()
    })

    it('closes only the panel with Escape when it is inside a modal', () => {
      render(
        <Modal defaultOpen>
          <ModalContent aria-label="Booking">
            <ModalBody>
              <TimePicker />
            </ModalBody>
          </ModalContent>
        </Modal>,
      )
      openPicker()
      expect(screen.getAllByRole('dialog')).toHaveLength(2)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      expect(screen.getByRole('dialog', { name: 'Booking' })).toBeInTheDocument()
    })

    it('throws when a part is used outside of a TimePicker', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<TimePickerInput />)).toThrow(
        'TimePickerInput must be used within a <TimePicker>',
      )
      error.mockRestore()
    })
  })

  describe('with react-hook-form', () => {
    it('submits the picked time', async () => {
      const onSubmit = vi.fn()
      function Form(): React.ReactNode {
        const { control, handleSubmit } = useForm({ defaultValues: { start: '' } })
        return (
          <form
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event)
            }}
          >
            <Controller
              control={control}
              name="start"
              render={({ field }) => (
                <TimePicker
                  inputRef={field.ref}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <button type="submit">Send</button>
          </form>
        )
      }
      render(<Form />)
      openPicker()
      pick('Hours', '10')
      pick('Minutes', '20')
      fireEvent.click(screen.getByRole('button', { name: 'Send' }))
      await vi.waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ start: '10:20' }, expect.anything())
      })
    })
  })
})
