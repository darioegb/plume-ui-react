import type { CSSProperties } from 'react'
import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerField,
  DatePickerInput,
  DatePickerTrigger,
} from '..'
import type { DateRange } from '../datepicker'
import { Modal, ModalBody, ModalContent } from '../../../overlay/modal'
import { InputControl, InputElement } from '../../input'

const openCalendar = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
}

const dayButton = (day: number, month = new Date().getMonth()): HTMLElement =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-date]:not([aria-hidden])')).find(
    (button) => {
      const [, buttonMonth, buttonDay] = (button.dataset.date ?? '').split('-').map(Number)
      return buttonMonth - 1 === month && buttonDay === day
    },
  ) as HTMLElement

const defaultRange = { startDate: null, endDate: null }

const selector = (kind: 'month' | 'year'): HTMLElement =>
  document.querySelector<HTMLElement>(`[class*="${kind}Selector"]`) as HTMLElement

describe('DatePicker component', () => {
  it('renders the input with a placeholder', () => {
    render(<DatePicker onValueChange={vi.fn()} placeholder="Select date" />)
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
  })

  it('uses the format of the language as the default placeholder', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'mm/dd/yyyy')
  })

  it('shows a range placeholder in range mode', () => {
    render(<DatePicker range onValueChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'mm/dd/yyyy - mm/dd/yyyy')
  })

  it('disables the input and the calendar button', () => {
    render(<DatePicker disabled onValueChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled()
  })

  it('marks the input invalid when aria-invalid is set', () => {
    render(<DatePicker aria-describedby="hint" aria-invalid onValueChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('invalid')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')?.split(' ')[0]).toBe('hint')
  })

  it('blocks typing and the calendar when read-only', () => {
    render(<DatePicker onValueChange={vi.fn()} readOnly />)
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled()
  })

  it('opens the calendar from the trigger button', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: 'Open calendar' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(trigger)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('always renders the calendar when calendar is set', () => {
    render(<DatePicker calendar onValueChange={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('lists the weekday headers Monday to Sunday', () => {
    render(
      <DatePicker
        calendar
        locale='en'
        labels={{ apply: 'Apply', cancel: 'Cancel' }}
        onValueChange={vi.fn()}
      />,
    )
    const headers = document.querySelector('[class*="daysOfWeek"]') as HTMLElement
    expect(headers.textContent).toBe('MonTueWedThuFriSatSun')
  })

  it('gives the calendar dialog an accessible name', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()
    expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument()
  })

  it('selects a date, notifies onChange and closes the calendar', () => {
    const onChange = vi.fn<(value: DateRange) => void>()
    render(<DatePicker onValueChange={onChange} />)
    openCalendar()

    fireEvent.click(dayButton(15))

    expect(onChange).toHaveBeenCalledTimes(1)
    const { startDate, endDate } = onChange.mock.calls[0][0]
    expect(startDate?.getDate()).toBe(15)
    expect(endDate).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole<HTMLInputElement>('textbox').value).toMatch(/15/)
  })

  it('selects a range with two clicks', () => {
    const onChange = vi.fn<(value: DateRange) => void>()
    render(<DatePicker range onValueChange={onChange} />)
    openCalendar()

    fireEvent.click(dayButton(15))
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(dayButton(16))

    expect(onChange).toHaveBeenCalledTimes(1)
    const { startDate, endDate } = onChange.mock.calls[0][0]
    expect(startDate?.getDate()).toBe(15)
    expect(endDate?.getDate()).toBe(16)
    expect(screen.getByRole<HTMLInputElement>('textbox').value).toMatch(/15.* - .*16/)
  })

  it('notifies the applied value when the footer is used', () => {
    const onChange = vi.fn<(value: DateRange) => void>()
    render(<DatePicker onValueChange={onChange} showFooter />)
    openCalendar()

    fireEvent.click(dayButton(15))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].startDate?.getDate()).toBe(15)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar with the cancel button without notifying', () => {
    const onChange = vi.fn()
    render(<DatePicker onValueChange={onChange} showFooter />)
    openCalendar()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('fills in the labels that are left out', () => {
    render(<DatePicker labels={{ apply: 'Aplicar' }} onValueChange={vi.fn()} showFooter />)
    openCalendar()

    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(selector('month').textContent).toBe(
      new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date()),
    )
  })

  it('reads the language alone from the config', () => {
    render(<DatePicker locale='es' onValueChange={vi.fn()} showFooter />)

    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'dd/mm/yyyy')
    openCalendar()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  it('passes required to the input', () => {
    render(<DatePicker onValueChange={vi.fn()} required />)
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('uses custom footer labels', () => {
    render(
      <DatePicker
        locale='es'
        labels={{ cancel: 'Cancelar', apply: 'Aplicar' }}
        onValueChange={vi.fn()}
        showFooter
      />,
    )
    openCalendar()

    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('moves between months with the navigation buttons', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()

    const monthButton = selector('month')
    const before = monthButton.textContent

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(monthButton.textContent).not.toBe(before)

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(monthButton.textContent).toBe(before)
  })

  it('picks a month from the month grid', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()

    fireEvent.click(selector('month'))
    fireEvent.click(screen.getByRole('button', { name: 'February' }))

    expect(selector('month')).toHaveTextContent('February')
  })

  it('picks a year from the year grid', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()

    fireEvent.click(selector('year'))
    const targetYear = new Date().getFullYear() + 1
    fireEvent.click(screen.getByRole('button', { name: `${targetYear}` }))

    expect(selector('year')).toHaveTextContent(`${targetYear}`)
  })

  it('pages through the year grid in blocks of 20', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()
    const year = new Date().getFullYear()

    fireEvent.click(selector('year'))
    fireEvent.click(screen.getByRole('button', { name: 'Previous years' }))
    expect(screen.getByRole('button', { name: `${year - 20}` })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next years' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next years' }))
    expect(screen.getByRole('button', { name: `${year + 20}` })).toBeInTheDocument()
  })

  it('previews the hovered day', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    openCalendar()

    fireEvent.mouseEnter(dayButton(12))

    expect(dayButton(12)).toHaveClass('hovered')
  })

  it('previews the range between the first click and the hovered day', () => {
    render(<DatePicker range onValueChange={vi.fn()} />)
    openCalendar()

    fireEvent.click(dayButton(10))
    fireEvent.mouseEnter(dayButton(13))

    expect(dayButton(11)).toHaveClass('rangeItem')
    expect(dayButton(12)).toHaveClass('rangeItem')
    expect(dayButton(13)).toHaveClass('rangeItem')
    expect(dayButton(20)).not.toHaveClass('rangeItem')
  })

  it('disables days outside of the min/max range', () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear(), today.getMonth(), 10)
    const maxDate = new Date(today.getFullYear(), today.getMonth(), 20)
    render(<DatePicker maxDate={maxDate} minDate={minDate} onValueChange={vi.fn()} />)
    openCalendar()

    expect(dayButton(5)).toBeDisabled()
    expect(dayButton(15)).toBeEnabled()
    expect(dayButton(25)).toBeDisabled()
  })

  it('formats typed digits with the date mask', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '03152025' } })

    expect(input).toHaveValue('03/15/2025')
  })

  it('rejects letters and uses a numeric keyboard', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '03ab15cd2025' } })

    expect(input).toHaveValue('03/15/2025')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  describe('typed dates', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('moves the calendar to a valid typed date after the debounce', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '03152025' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('month')).toHaveTextContent('March')
      expect(selector('year')).toHaveTextContent('2025')
    })

    it('moves the calendar to a valid typed range', () => {
      render(<DatePicker range onValueChange={vi.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0315202504202025' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(dayButton(15, 2)).toHaveAttribute('aria-pressed', 'true')
      expect(selector('month')).toHaveTextContent('March')
    })

    it('calls onChange once with the typed date', () => {
      const onChange = vi.fn()
      function Controlled(): React.ReactNode {
        const [value, setValue] = useState<DateRange>({ startDate: null, endDate: null })
        return (
          <DatePicker
            onValueChange={(next) => {
              onChange(next)
              setValue(next)
            }}
            value={value}
          />
        )
      }
      render(<Controlled />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '03152025' } })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith({ startDate: new Date(2025, 2, 15), endDate: null })
    })

    it('calls onChange with the typed range', () => {
      const onChange = vi.fn()
      render(<DatePicker range onValueChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0315202504202025' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })

      expect(onChange).toHaveBeenCalledWith({
        startDate: new Date(2025, 2, 15),
        endDate: new Date(2025, 3, 20),
      })
    })

    it('does not call onChange for an invalid typed date', () => {
      const onChange = vi.fn()
      render(<DatePicker onValueChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '99992025' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })

      expect(onChange).not.toHaveBeenCalled()
    })

    it('ignores an invalid typed date', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '99992025' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('year')).not.toHaveTextContent('2025')
    })

    it.each([
      ['es', '31/01/2026', 'Enero'],
      ['de', '31.01.2026', 'Januar'],
    ])('reads a typed date in the %s day-first format', (language, typed, month) => {
      render(<DatePicker locale={language} onValueChange={vi.fn()} />)
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '31012026' } })
      expect(input).toHaveValue(typed)

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('month')).toHaveTextContent(month)
      expect(selector('year')).toHaveTextContent('2026')
    })

    it('reads a typed date with an uppercase displayFormat', () => {
      render(<DatePicker displayFormat="DD/MM/YYYY" onValueChange={vi.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '31012026' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('month')).toHaveTextContent('January')
      expect(selector('year')).toHaveTextContent('2026')
    })

    it('ignores a typed date that does not exist', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '02312040' } })

      act(() => {
        vi.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('year')).not.toHaveTextContent('2040')
    })
  })

  it('does not echo a new value prop back through onChange', () => {
    const onChange = vi.fn()
    const { rerender } = render(<DatePicker range onValueChange={onChange} value={defaultRange} />)

    rerender(
      <DatePicker
        range
        onValueChange={onChange}
        value={{ startDate: new Date(2040, 0, 10), endDate: new Date(2040, 0, 12) }}
      />,
    )
    openCalendar()

    expect(onChange).not.toHaveBeenCalled()
    expect(dayButton(10, 0)).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onBlur with the current value', () => {
    const onBlur = vi.fn()
    render(<DatePicker onBlur={onBlur} onValueChange={vi.fn()} />)

    fireEvent.blur(screen.getByRole('textbox'))

    expect(onBlur).toHaveBeenCalledWith({ startDate: null, endDate: null })
  })

  describe('range mode keeps two calendars in order', () => {
    const headers = (): { month: string; year: string }[] =>
      Array.from(document.querySelectorAll('[class*="monthSelector"]')).map((month, index) => ({
        month: month.textContent ?? '',
        year: document.querySelectorAll('[class*="yearSelector"]')[index].textContent ?? '',
      }))

    const openRange = (): void => {
      render(<DatePicker range onValueChange={vi.fn()} />)
      openCalendar()
    }

    it('shows consecutive months', () => {
      openRange()
      const [first, second] = headers()
      const firstIndex = new Date(`${first.month} 1, ${first.year}`).getMonth()
      const secondIndex = new Date(`${second.month} 1, ${second.year}`).getMonth()
      expect(secondIndex).toBe((firstIndex + 1) % 12)
    })

    it('drags the second calendar forward when the first moves past it', () => {
      openRange()
      const before = headers()

      fireEvent.click(screen.getAllByRole('button', { name: 'Next month' })[0])
      fireEvent.click(screen.getAllByRole('button', { name: 'Next month' })[0])
      const [first, second] = headers()

      expect(first.month).not.toBe(before[0].month)
      expect(new Date(`${second.month} 1, ${second.year}`).getTime()).toBeGreaterThan(
        new Date(`${first.month} 1, ${first.year}`).getTime(),
      )
    })

    it('drags the first calendar back when the second moves before it', () => {
      openRange()

      fireEvent.click(screen.getAllByRole('button', { name: 'Previous month' })[1])
      fireEvent.click(screen.getAllByRole('button', { name: 'Previous month' })[1])
      const [first, second] = headers()

      expect(new Date(`${first.month} 1, ${first.year}`).getTime()).toBeLessThan(
        new Date(`${second.month} 1, ${second.year}`).getTime(),
      )
    })

    it('moves the second calendar to a year picked on the first', () => {
      openRange()
      const target = new Date().getFullYear() + 2

      fireEvent.click(selector('year'))
      fireEvent.click(screen.getByRole('button', { name: `${target}` }))

      const [first, second] = headers()
      expect(first.year).toBe(`${target}`)
      expect(Number(second.year)).toBeGreaterThanOrEqual(target)
    })

    it('moves the first calendar to a year picked on the second', () => {
      openRange()
      const target = new Date().getFullYear() + 3

      fireEvent.click(document.querySelectorAll<HTMLElement>('[class*="yearSelector"]')[1])
      fireEvent.click(screen.getByRole('button', { name: `${target}` }))

      const [first, second] = headers()
      expect(second.year).toBe(`${target}`)
      expect(Number(first.year)).toBeLessThanOrEqual(target)
    })

    it('rolls over to the next year when the first calendar reaches December', () => {
      openRange()

      fireEvent.click(selector('month'))
      fireEvent.click(screen.getAllByRole('button', { name: 'December' })[0])

      const [first, second] = headers()
      expect(first.month).toBe('December')
      expect(second.month).toBe('January')
      expect(Number(second.year)).toBe(Number(first.year) + 1)
    })

    it('rolls back to the previous year when the second calendar reaches January', () => {
      openRange()

      fireEvent.click(document.querySelectorAll<HTMLElement>('[class*="monthSelector"]')[1])
      fireEvent.click(screen.getAllByRole('button', { name: 'January' })[0])

      const [first, second] = headers()
      expect(second.month).toBe('January')
      expect(first.month).toBe('December')
      expect(Number(first.year)).toBe(Number(second.year) - 1)
    })
  })

  describe('accessibility', () => {
    const value = { startDate: new Date(2040, 0, 15), endDate: null }

    it('names each day with its full date and marks today and the selection', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      const selected = screen.getByRole('button', { name: 'Sunday, January 15, 2040' })
      expect(selected).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: 'Monday, January 16, 2040' })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('marks only the current day of the current month as today', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      openCalendar()

      const today = document.querySelectorAll('[aria-current="date"]')
      expect(today).toHaveLength(1)
      expect(today[0]).toBe(dayButton(new Date().getDate()))
    })

    it('moves focus to the selected day when it opens', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      expect(dayButton(15, 0)).toHaveFocus()
      expect(dayButton(15, 0)).toHaveAttribute('tabindex', '0')
      expect(dayButton(16, 0)).toHaveAttribute('tabindex', '-1')
    })

    it('closes with Escape and returns focus to the input', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      fireEvent.keyDown(dayButton(15, 0), { key: 'Escape' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveFocus()
    })

    it('returns focus to the input after picking a date', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      fireEvent.click(dayButton(20, 0))

      expect(screen.getByRole('textbox')).toHaveFocus()
    })

    it('closes when focus leaves the date picker', () => {
      render(
        <>
          <DatePicker onValueChange={vi.fn()} value={value} />
          <button type="button">Next field</button>
        </>,
      )
      openCalendar()

      fireEvent.blur(dayButton(15, 0), {
        relatedTarget: screen.getByRole('button', { name: 'Next field' }),
      })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes from the trigger button instead of reopening', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      const trigger = screen.getByRole('button', { name: 'Open calendar' })
      fireEvent.click(trigger)

      fireEvent.mouseDown(trigger)
      fireEvent.click(trigger)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('moves between days with the arrow keys', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      fireEvent.keyDown(dayButton(15, 0), { key: 'ArrowRight' })
      expect(dayButton(16, 0)).toHaveFocus()

      fireEvent.keyDown(dayButton(16, 0), { key: 'ArrowDown' })
      expect(dayButton(23, 0)).toHaveFocus()
      expect(dayButton(23, 0)).toHaveAttribute('tabindex', '0')

      fireEvent.keyDown(dayButton(23, 0), { key: 'End' })
      expect(dayButton(29, 0)).toHaveFocus()

      fireEvent.keyDown(dayButton(29, 0), { key: 'Home' })
      expect(dayButton(23, 0)).toHaveFocus()
    })

    it('changes month when the arrow keys leave the visible one', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      fireEvent.keyDown(dayButton(15, 0), { key: 'PageUp' })
      expect(selector('month')).toHaveTextContent('December')
      expect(selector('year')).toHaveTextContent('2039')
      expect(dayButton(15, 11)).toHaveFocus()

      fireEvent.keyDown(dayButton(15, 11), { key: 'ArrowDown' })
      fireEvent.keyDown(dayButton(22, 11), { key: 'ArrowDown' })
      fireEvent.keyDown(dayButton(29, 11), { key: 'ArrowDown' })
      expect(selector('month')).toHaveTextContent('January')
      expect(selector('year')).toHaveTextContent('2040')
      expect(dayButton(5, 0)).toHaveFocus()
    })

    it('does not move past the min and max dates', () => {
      render(
        <DatePicker
          maxDate={new Date(2040, 0, 16)}
          minDate={new Date(2040, 0, 15)}
          onValueChange={vi.fn()}
          value={value}
        />,
      )
      openCalendar()

      fireEvent.keyDown(dayButton(15, 0), { key: 'ArrowLeft' })
      expect(dayButton(15, 0)).toHaveFocus()

      fireEvent.keyDown(dayButton(15, 0), { key: 'ArrowRight' })
      fireEvent.keyDown(dayButton(16, 0), { key: 'ArrowRight' })
      expect(dayButton(16, 0)).toHaveFocus()
    })

    it('goes back to December of the previous year from January', () => {
      render(<DatePicker onValueChange={vi.fn()} value={value} />)
      openCalendar()

      fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))

      expect(selector('month')).toHaveTextContent('December')
      expect(selector('year')).toHaveTextContent('2039')
    })

    it('previews the range for the focused day', () => {
      render(<DatePicker range onValueChange={vi.fn()} />)
      openCalendar()

      fireEvent.click(dayButton(10))
      fireEvent.focus(dayButton(12))

      expect(dayButton(11)).toHaveClass('rangeItem')
    })
  })

  it('maps the color scheme to calendar CSS variables', () => {
    const { container } = render(<DatePicker colorScheme="success" onValueChange={vi.fn()} />)
    const root = container.firstChild as HTMLElement

    expect(root.style.getPropertyValue('--datepicker-solid')).toBe(
      'var(--plume-color-success-solid)',
    )
    expect(root.style.getPropertyValue('--datepicker-scheme')).toBe(
      'var(--plume-color-success-text)',
    )
  })
  describe('closing', () => {
    it('closes with a press outside', () => {
      render(
        <>
          <DatePicker onValueChange={vi.fn()} />
          <p>Outside</p>
        </>,
      )
      openCalendar()

      fireEvent.pointerDown(screen.getByText('Outside'))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('stays open with a press inside', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      openCalendar()

      fireEvent.pointerDown(screen.getByRole('dialog'))
      fireEvent.pointerDown(screen.getByRole('textbox'))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes with Escape from anywhere and gives the focus back to the input', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      openCalendar()

      fireEvent.keyDown(document.body, { key: 'Escape' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveFocus()
    })

    it('does not listen to Escape or presses while the calendar is shown on the page', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} />)

      fireEvent.keyDown(document.body, { key: 'Escape' })
      fireEvent.pointerDown(document.body)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('compound parts', () => {
    it('shows the input and the calendar by itself', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      openCalendar()
      expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument()
    })

    it('takes its parts as children and opens the calendar outside of the DatePicker', () => {
      const { container } = render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerCalendar className="mine" />
          <DatePickerInput placeholder="Pick a day" />
        </DatePicker>,
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByPlaceholderText('Pick a day')).toBeInTheDocument()

      openCalendar()

      const root = container.firstChild as HTMLElement
      expect(root.contains(screen.getByRole('dialog'))).toBe(false)
      expect(screen.getByRole('dialog')).toHaveClass('mine')
    })

    it('gives the popup the color variables, including the ones in style', () => {
      render(
        <DatePicker
          colorScheme="primary"
          onValueChange={vi.fn()}
          style={{ '--datepicker-solid': 'red', width: '10rem' } as CSSProperties}
        />,
      )
      openCalendar()
      const { style } = screen.getByRole('dialog')
      expect(style.getPropertyValue('--datepicker-scheme')).toBe('var(--plume-color-primary-text)')
      expect(style.getPropertyValue('--datepicker-solid')).toBe('red')
      expect(style.width).toBe('')
    })

    it('closes only the calendar with Escape when it is inside a modal', () => {
      render(
        <Modal defaultOpen>
          <ModalContent aria-label="Booking">
            <ModalBody>
              <DatePicker onValueChange={vi.fn()} />
            </ModalBody>
          </ModalContent>
        </Modal>,
      )
      openCalendar()
      expect(screen.getAllByRole('dialog')).toHaveLength(2)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      expect(screen.getByRole('dialog', { name: 'Booking' })).toBeInTheDocument()
    })

    it('stays open while the focus moves into the popup', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      openCalendar()
      fireEvent.blur(screen.getByRole('textbox'), {
        relatedTarget: screen.getByRole('dialog').querySelector('[data-date]'),
      })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('can have a calendar without an input', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar />
        </DatePicker>,
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    it('styles the input with its own props and the look of the DatePicker', () => {
      render(
        <DatePicker onValueChange={vi.fn()} shape="pill" size="lg" variant="filled">
          <DatePickerInput className="mine" disabled>
            <InputControl>
              <DatePickerField className="inner" />
              <InputElement position="after">
                <DatePickerTrigger />
              </InputElement>
            </InputControl>
          </DatePickerInput>
        </DatePicker>,
      )
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('inner', 'lg', 'pill', 'filled', 'disabled')
      expect(input.closest('[data-plume-input-group]')).toHaveClass('mine')
      expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled()
    })

    it.each([
      ['outline', 'panelOutline'],
      ['filled', 'panelFilled'],
      ['underline', 'panelUnderline'],
    ] as const)('gives the calendar the %s look', (variant, expected) => {
      render(<DatePicker calendar onValueChange={vi.fn()} variant={variant} />)
      expect(screen.getByRole('dialog')).toHaveClass('panel', expected)
    })

    it('leaves the calendar unstyled with the unstyled variant', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} variant="unstyled" />)
      expect(screen.getByRole('dialog').className).not.toMatch(/panel(Outline|Filled|Underline)/)
    })

    it('scales and rounds the calendar with the size and the shape', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} shape="pill" size="sm" />)
      expect(screen.getByRole('dialog')).toHaveClass('panelSm', 'panelPill', 'daySm')
    })

    it('keeps the always visible calendar in the flow', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} />)
      expect(screen.getByRole('dialog')).toHaveClass('inline')
    })

    it('gives the calendar the large size', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} size="lg" />)
      expect(screen.getByRole('dialog')).toHaveClass('panelLg', 'dayLg')
    })

    it('names the calendar and the button with the labels it is given', () => {
      render(
        <DatePicker
          labels={{ calendar: 'Calendario', openCalendar: 'Abrir calendario' }}
          onValueChange={vi.fn()}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' }))
      expect(screen.getByRole('dialog', { name: 'Calendario' })).toBeInTheDocument()
    })

    it('names the navigation buttons with the labels it is given', () => {
      render(
        <DatePicker
          labels={{
            nextMonth: 'Mes siguiente',
            nextYears: 'Años siguientes',
            previousMonth: 'Mes anterior',
            previousYears: 'Años anteriores',
          }}
          onValueChange={vi.fn()}
        />,
      )
      openCalendar()
      expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Next month' })).not.toBeInTheDocument()
      fireEvent.click(selector('year'))
      expect(screen.getByRole('button', { name: 'Años anteriores' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Años siguientes' })).toBeInTheDocument()
    })

    it('names the calendar with its own aria-label', () => {
      render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerInput />
          <DatePickerCalendar aria-label="Pick a date" />
        </DatePicker>,
      )
      openCalendar()
      expect(screen.getByRole('dialog', { name: 'Pick a date' })).toBeInTheDocument()
    })

    it('needs a DatePicker around its parts', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(<DatePickerInput />)).toThrow(
        'DatePickerInput must be used within a <DatePicker>',
      )
      expect(() => render(<DatePickerCalendar />)).toThrow(
        'DatePickerCalendar must be used within a <DatePicker>',
      )
      error.mockRestore()
    })
  })
})
