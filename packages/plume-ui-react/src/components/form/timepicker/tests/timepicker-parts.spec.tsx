import { fireEvent, render, screen, within } from '@testing-library/react'
import { createRef } from 'react'
import { Input, InputControl, InputElement, InputField } from '../../input'
import {
  TimePicker,
  TimePickerHours,
  TimePickerInput,
  TimePickerMinutes,
  TimePickerOption,
  TimePickerPanel,
  TimePickerPeriod,
  TimePickerTrigger,
} from '..'

const column = (name: string): HTMLElement => screen.getByRole('listbox', { name })

describe('TimePicker parts', () => {
  describe('the panel', () => {
    it('lists only the columns it is given', () => {
      render(
        <TimePicker defaultValue="09:30" isPanel>
          <TimePickerPanel>
            <TimePickerMinutes />
            <TimePickerHours />
          </TimePickerPanel>
        </TimePicker>,
      )
      const lists = screen.getAllByRole('listbox')
      expect(lists.map((list) => list.getAttribute('aria-label'))).toEqual(['Minutes', 'Hours'])
    })

    it('can hold only the hours', () => {
      render(
        <TimePicker isPanel>
          <TimePickerPanel>
            <TimePickerHours />
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(screen.getAllByRole('listbox')).toHaveLength(1)
    })

    it('takes className, style and ref and marks itself', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <TimePicker isPanel>
          <TimePickerPanel className="mine" ref={ref} style={{ width: 123 }} />
        </TimePicker>,
      )
      const panel = screen.getByRole('dialog')
      expect(panel).toHaveClass('mine')
      expect(panel).toHaveStyle({ width: '123px' })
      expect(panel).toHaveAttribute('data-plume-timepicker-panel')
      expect(ref.current).toBe(panel)
    })

    it('marks the open popup', () => {
      render(<TimePicker />)
      fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
      expect(screen.getByRole('dialog')).toHaveAttribute('data-open')
    })
  })

  describe('the columns', () => {
    it('take className, style and ref and mark themselves', () => {
      const hours = createRef<HTMLDivElement>()
      const minutes = createRef<HTMLDivElement>()
      render(
        <TimePicker hour12 isPanel>
          <TimePickerPanel>
            <TimePickerHours className="h" ref={hours} style={{ width: 11 }} />
            <TimePickerMinutes className="m" ref={minutes} />
            <TimePickerPeriod className="p" />
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(column('Hours')).toHaveClass('h')
      expect(column('Hours')).toHaveStyle({ width: '11px' })
      expect(column('Hours')).toHaveAttribute('data-plume-timepicker-hours')
      expect(column('Hours')).toHaveAttribute('data-plume-timepicker-column')
      expect(column('Minutes')).toHaveAttribute('data-plume-timepicker-minutes')
      expect(column('Period')).toHaveAttribute('data-plume-timepicker-period')
      expect(column('Period')).toHaveClass('p')
      expect(hours.current).toBe(column('Hours'))
      expect(minutes.current).toBe(column('Minutes'))
    })

    it('are named with their own label or the one of the picker', () => {
      render(
        <TimePicker isPanel labels={{ hours: 'Horas' }}>
          <TimePickerPanel>
            <TimePickerHours />
            <TimePickerMinutes aria-label="Mins" />
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(column('Horas')).toBeInTheDocument()
      expect(column('Mins')).toBeInTheDocument()
    })

    it('leave the period out when the picker has 24 hours', () => {
      render(
        <TimePicker isPanel>
          <TimePickerPanel>
            <TimePickerPeriod />
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('render the options with a function and keep the keyboard and the selection', () => {
      const onChange = vi.fn()
      render(
        <TimePicker defaultValue="10:00" isPanel onChange={onChange}>
          <TimePickerPanel>
            <TimePickerHours>
              {(option) => (
                <TimePickerOption className="custom" key={option.value} option={option}>
                  {`H${option.label}`}
                </TimePickerOption>
              )}
            </TimePickerHours>
          </TimePickerPanel>
        </TimePicker>,
      )
      const options = within(column('Hours')).getAllByRole('option')
      expect(options[10]).toHaveTextContent('H10')
      expect(options[10]).toHaveClass('custom')
      expect(options[10]).toHaveAttribute('aria-selected', 'true')
      expect(options[10]).toHaveAttribute('data-selected')
      expect(options[10]).toHaveAttribute('tabindex', '0')
      expect(options[9]).toHaveAttribute('tabindex', '-1')

      fireEvent.keyDown(options[10], { key: 'ArrowDown' })
      expect(options[11]).toHaveFocus()
      fireEvent.click(options[11])
      expect(onChange).toHaveBeenCalledWith('11:00')
    })

    it('can render something else than an option', () => {
      render(
        <TimePicker isPanel>
          <TimePickerPanel>
            <TimePickerMinutes>
              {(option) => <i key={option.value}>{option.label}</i>}
            </TimePickerMinutes>
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(within(column('Minutes')).queryAllByRole('option')).toHaveLength(0)
      expect(within(column('Minutes')).getAllByText(/\d\d/)).toHaveLength(60)
    })
  })

  describe('an option', () => {
    it('takes ref and style, marks itself and replaces the label with children', () => {
      const ref = createRef<HTMLButtonElement>()
      render(
        <TimePicker isPanel>
          <TimePickerPanel>
            <TimePickerMinutes>
              {() => (
                <TimePickerOption option={{ label: '05', value: 5 }} ref={ref} style={{ width: 9 }}>
                  five
                </TimePickerOption>
              )}
            </TimePickerMinutes>
          </TimePickerPanel>
        </TimePicker>,
      )
      const option = screen.getAllByRole('option')[0]
      expect(option).toHaveTextContent('five')
      expect(option).toHaveStyle({ width: '9px' })
      expect(option).toHaveAttribute('data-plume-timepicker-option')
      const options = screen.getAllByRole('option')
      expect(ref.current).toBe(options[options.length - 1])
    })

    it('throws outside of a column', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() =>
        render(
          <TimePicker isPanel>
            <TimePickerOption option={{ label: '01', value: 1 }} />
          </TimePicker>,
        ),
      ).toThrow('TimePickerOption must be used within a <TimePickerHours>')
      error.mockRestore()
    })
  })

  describe('the input and the trigger', () => {
    it('compose the field and the button in any order', () => {
      render(
        <TimePicker>
          <TimePickerInput>
            <InputControl>
              <InputElement position="before">
                <TimePickerTrigger className="mine" />
              </InputElement>
              <InputField className="field" />
            </InputControl>
          </TimePickerInput>
        </TimePicker>,
      )
      const field = screen.getByRole('textbox')
      const button = screen.getByRole('button', { name: 'Open time picker' })
      expect(field).toHaveClass('field')
      expect(button).toHaveClass('mine')
      expect(button).toHaveAttribute('data-plume-timepicker-trigger')
      expect(button.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })

    it('open the panel from the composed trigger and mark it', () => {
      render(
        <TimePicker>
          <TimePickerInput>
            <InputControl>
              <InputField />
              <InputElement position="after">
                <TimePickerTrigger />
              </InputElement>
            </InputControl>
          </TimePickerInput>
          <TimePickerPanel />
        </TimePicker>,
      )
      const trigger = screen.getByRole('button', { name: 'Open time picker' })
      expect(trigger).not.toHaveAttribute('data-open')
      fireEvent.click(trigger)
      expect(trigger).toHaveAttribute('data-open')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('keeps the ref of the input pointing to the field when composed', () => {
      const inputRef = vi.fn()
      render(
        <TimePicker>
          <TimePickerInput inputRef={inputRef}>
            <InputControl>
              <InputField />
            </InputControl>
          </TimePickerInput>
        </TimePicker>,
      )
      expect(inputRef).toHaveBeenCalledWith(screen.getByRole('textbox'))
    })

    it('blocks the trigger when the input is disabled or read only', () => {
      const { rerender } = render(<TimePicker disabled />)
      expect(screen.getByRole('button', { name: 'Open time picker' })).toBeDisabled()
      rerender(<TimePicker readOnly />)
      expect(screen.getByRole('button', { name: 'Open time picker' })).toBeDisabled()
    })

    it('lets the trigger be disabled on its own and renames it', () => {
      render(
        <TimePicker>
          <TimePickerInput>
            <InputControl>
              <InputField />
              <InputElement position="after">
                <TimePickerTrigger aria-label="Choose" disabled title="Pick">
                  go
                </TimePickerTrigger>
              </InputElement>
            </InputControl>
          </TimePickerInput>
        </TimePicker>,
      )
      const trigger = screen.getByRole('button', { name: 'Choose' })
      expect(trigger).toBeDisabled()
      expect(trigger).toHaveAttribute('title', 'Pick')
      expect(trigger).toHaveTextContent('go')
    })

    it('works as a lone trigger beside a panel, outside of any Input', () => {
      render(
        <TimePicker>
          <TimePickerTrigger />
          <TimePickerPanel />
        </TimePicker>,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('throws when a trigger is used outside of a TimePicker', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<TimePickerTrigger />)).toThrow(
        'TimePickerTrigger must be used within a <TimePicker>',
      )
      error.mockRestore()
    })
  })

  describe('the root', () => {
    it('marks itself and its open state', () => {
      const { container } = render(<TimePicker />)
      const root = container.firstChild as HTMLElement
      expect(root).toHaveAttribute('data-plume-timepicker')
      expect(root).not.toHaveAttribute('data-open')
      fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
      expect(root).toHaveAttribute('data-open')
    })

    it('keeps the plain Input working next to a picker', () => {
      render(
        <>
          <Input aria-label="Plain" />
          <TimePicker />
        </>,
      )
      expect(screen.getAllByRole('textbox')).toHaveLength(2)
    })
  })

  describe('unstyled', () => {
    it('drops the Plume classes of the columns and options but keeps the structure marks', () => {
      render(<TimePicker defaultValue="10:15" isPanel variant="unstyled" />)
      const hours = column('Hours')
      const selected = within(hours).getByRole('option', { name: '10' })
      expect(hours).not.toHaveAttribute('class')
      expect(hours).toHaveAttribute('data-plume-timepicker-column')
      expect(selected).not.toHaveAttribute('class')
      expect(selected).toHaveAttribute('data-plume-timepicker-option')
    })

    it('keeps only the class of the user on its parts', () => {
      render(
        <TimePicker defaultValue="10:15" isPanel variant="unstyled">
          <TimePickerPanel>
            <TimePickerHours className="mine">
              {(option) => <TimePickerOption className="opt" key={option.value} option={option} />}
            </TimePickerHours>
          </TimePickerPanel>
        </TimePicker>,
      )
      expect(column('Hours')).toHaveAttribute('class', 'mine')
      expect(within(column('Hours')).getAllByRole('option')[0]).toHaveAttribute('class', 'opt')
    })

    it('styles the parts in the other variants', () => {
      render(<TimePicker defaultValue="10:15" isPanel />)
      expect(column('Hours')).toHaveClass('column')
      expect(within(column('Hours')).getByRole('option', { name: '10' })).toHaveClass(
        'option',
        'selected',
      )
    })
  })

  it('shows Input on its own through the parts of the input', () => {
    render(
      <Input aria-label="Time">
        <InputControl>
          <InputField />
        </InputControl>
      </Input>,
    )
    expect(screen.getByRole('textbox', { name: 'Time' })).toBeInTheDocument()
  })
})
