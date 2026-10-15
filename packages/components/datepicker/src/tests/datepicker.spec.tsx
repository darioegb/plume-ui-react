import { act, fireEvent, render, screen } from '@testing-library/react'
import { DatePicker } from '..'
import type { DateRange } from '../datepicker'

const openCalendar = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
}

const dayButton = (day: number, month = new Date().getMonth()): HTMLElement =>
  screen.getAllByRole('button', { name: `${day}` }).find((button) => {
    const date = new Date(button.id)
    return date.getMonth() === month && date.getDate() === day
  }) as HTMLElement

const selector = (kind: 'month' | 'year'): HTMLElement =>
  document.querySelector<HTMLElement>(`[class*="${kind}Selector"]`) as HTMLElement

describe('DatePicker component', () => {
  it('renders the input with a placeholder', () => {
    render(<DatePicker onChange={jest.fn()} placeholder="Select date" />)
    expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument()
  })

  it('uses the format of the language as the default placeholder', () => {
    render(<DatePicker onChange={jest.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'mm/dd/yyyy')
  })

  it('shows a range placeholder in range mode', () => {
    render(<DatePicker isRange onChange={jest.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'mm/dd/yyyy - mm/dd/yyyy',
    )
  })

  it('disables the input and the calendar button', () => {
    render(<DatePicker disabled onChange={jest.fn()} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled()
  })

  it('opens the calendar from the trigger button', () => {
    render(<DatePicker onChange={jest.fn()} />)
    const trigger = screen.getByRole('button', { name: 'Open calendar' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(trigger)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('always renders the calendar when isCalendar is set', () => {
    render(<DatePicker isCalendar onChange={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('lists the weekday headers Monday to Sunday', () => {
    render(<DatePicker isCalendar config={{ language: 'en', footer: { apply: 'Apply', cancel: 'Cancel' } }} onChange={jest.fn()} />)
    const headers = document.querySelector('[class*="daysOfWeek"]') as HTMLElement
    expect(headers.textContent).toBe('MonTueWedThuFriSatSun')
  })

  it('gives the calendar dialog an accessible name', () => {
    render(<DatePicker onChange={jest.fn()} />)
    openCalendar()
    expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument()
  })

  it('selects a date, notifies onChange and closes the calendar', () => {
    const onChange = jest.fn<void, [DateRange]>()
    render(<DatePicker onChange={onChange} />)
    openCalendar()

    fireEvent.click(screen.getByRole('button', { name: '15' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const { startDate, endDate } = onChange.mock.calls[0][0]
    expect(startDate?.getDate()).toBe(15)
    expect(endDate).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toMatch(/15/)
  })

  it('selects a range with two clicks', () => {
    const onChange = jest.fn<void, [DateRange]>()
    render(<DatePicker isRange onChange={onChange} />)
    openCalendar()

    fireEvent.click(screen.getAllByRole('button', { name: '15' })[0])
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.click(screen.getAllByRole('button', { name: '16' })[0])

    expect(onChange).toHaveBeenCalledTimes(1)
    const { startDate, endDate } = onChange.mock.calls[0][0]
    expect(startDate?.getDate()).toBe(15)
    expect(endDate?.getDate()).toBe(16)
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toMatch(/15.* - .*16/)
  })

  it('notifies the applied value when the footer is used', () => {
    const onChange = jest.fn<void, [DateRange]>()
    render(<DatePicker onChange={onChange} showFooter />)
    openCalendar()

    fireEvent.click(screen.getByRole('button', { name: '15' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].startDate?.getDate()).toBe(15)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar with the cancel button without notifying', () => {
    const onChange = jest.fn()
    render(<DatePicker onChange={onChange} showFooter />)
    openCalendar()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses custom footer labels', () => {
    render(
      <DatePicker
        config={{ language: 'es', footer: { cancel: 'Cancelar', apply: 'Aplicar' } }}
        onChange={jest.fn()}
        showFooter
      />,
    )
    openCalendar()

    expect(screen.getByRole('button', { name: 'Aplicar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('moves between months with the navigation buttons', () => {
    render(<DatePicker onChange={jest.fn()} />)
    openCalendar()

    const monthButton = selector('month')
    const before = monthButton.textContent

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(monthButton.textContent).not.toBe(before)

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(monthButton.textContent).toBe(before)
  })

  it('picks a month from the month grid', () => {
    render(<DatePicker onChange={jest.fn()} />)
    openCalendar()

    fireEvent.click(selector('month'))
    fireEvent.click(screen.getByRole('button', { name: 'February' }))

    expect(selector('month')).toHaveTextContent('February')
  })

  it('picks a year from the year grid', () => {
    render(<DatePicker onChange={jest.fn()} />)
    openCalendar()

    fireEvent.click(selector('year'))
    const targetYear = new Date().getFullYear() + 1
    fireEvent.click(screen.getByRole('button', { name: `${targetYear}` }))

    expect(selector('year')).toHaveTextContent(`${targetYear}`)
  })

  it('pages through the year grid in blocks of 20', () => {
    render(<DatePicker onChange={jest.fn()} />)
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
    render(<DatePicker onChange={jest.fn()} />)
    openCalendar()

    fireEvent.mouseEnter(dayButton(12))

    expect(dayButton(12)).toHaveClass('hovered')
  })

  it('previews the range between the first click and the hovered day', () => {
    render(<DatePicker isRange onChange={jest.fn()} />)
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
    render(<DatePicker maxDate={maxDate} minDate={minDate} onChange={jest.fn()} />)
    openCalendar()

    expect(dayButton(5)).toBeDisabled()
    expect(dayButton(15)).toBeEnabled()
    expect(dayButton(25)).toBeDisabled()
  })

  it('formats typed digits with the date mask', () => {
    render(<DatePicker onChange={jest.fn()} />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '03152025' } })

    expect(input).toHaveValue('03/15/2025')
  })

  it('rejects letters and uses a numeric keyboard', () => {
    render(<DatePicker onChange={jest.fn()} />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '03ab15cd2025' } })

    expect(input).toHaveValue('03/15/2025')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  describe('typed dates', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('moves the calendar to a valid typed date after the debounce', () => {
      render(<DatePicker onChange={jest.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '03152025' } })

      act(() => {
        jest.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('month')).toHaveTextContent('March')
      expect(selector('year')).toHaveTextContent('2025')
    })

    it('moves the calendar to a valid typed range', () => {
      render(<DatePicker isRange onChange={jest.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '0315202504202025' } })

      act(() => {
        jest.advanceTimersByTime(600)
      })
      openCalendar()

      expect(screen.getAllByRole('button', { name: '15' }).length).toBeGreaterThan(0)
      expect(selector('month')).toHaveTextContent('March')
    })

    it('ignores an invalid typed date', () => {
      render(<DatePicker onChange={jest.fn()} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '99992025' } })

      act(() => {
        jest.advanceTimersByTime(600)
      })
      openCalendar()

      expect(selector('year')).not.toHaveTextContent('2025')
    })
  })

  it('calls onBlur with the current value', () => {
    const onBlur = jest.fn()
    render(<DatePicker onBlur={onBlur} onChange={jest.fn()} />)

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
      render(<DatePicker isRange onChange={jest.fn()} />)
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

  it('maps the color scheme to calendar CSS variables', () => {
    const { container } = render(<DatePicker colorScheme="success" onChange={jest.fn()} />)
    const root = container.firstChild as HTMLElement

    expect(root.style.getPropertyValue('--datepicker-solid')).toBe(
      'var(--plume-color-success-solid)',
    )
    expect(root.style.getPropertyValue('--datepicker-scheme')).toBe(
      'var(--plume-color-success-text)',
    )
  })
})
