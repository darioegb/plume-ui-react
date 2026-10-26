import { createRef } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import {
  DatePicker,
  DatePickerApply,
  DatePickerCalendar,
  DatePickerCancel,
  DatePickerDay,
  DatePickerField,
  DatePickerFooter,
  DatePickerGrid,
  DatePickerHeader,
  DatePickerInput,
  DatePickerMonthButton,
  DatePickerMonthOption,
  DatePickerMonths,
  DatePickerNav,
  DatePickerNext,
  DatePickerPage,
  DatePickerPages,
  DatePickerPrevious,
  DatePickerSeparator,
  DatePickerTrigger,
  DatePickerView,
  DatePickerWeekday,
  DatePickerWeekdays,
  DatePickerYearButton,
  DatePickerYearOption,
  DatePickerYears,
} from '..'
import { InputControl, InputElement } from '../../input'

const openCalendar = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
}

const part = (name: string): HTMLElement =>
  document.querySelector<HTMLElement>(`[data-plume-datepicker-${name}]`) as HTMLElement

describe('DatePicker parts', () => {
  it('renders the default composition from the parts', () => {
    render(<DatePicker onValueChange={vi.fn()} showFooter />)
    openCalendar()
    for (const name of [
      'trigger',
      'calendar',
      'pages',
      'page',
      'header',
      'nav',
      'previous',
      'month-button',
      'separator',
      'year-button',
      'next',
      'weekdays',
      'grid',
      'footer',
      'cancel',
      'apply',
    ]) {
      expect(part(name)).not.toBeNull()
    }
    expect(document.querySelectorAll('[data-plume-datepicker-weekday]')).toHaveLength(7)
    expect(document.querySelectorAll('[data-plume-datepicker-day]')).toHaveLength(42)
    expect(part('field')).toBe(screen.getByRole('textbox'))
  })

  it('renders two pages for a range', () => {
    render(<DatePicker calendar range onValueChange={vi.fn()} />)
    expect(document.querySelectorAll('[data-plume-datepicker-page]')).toHaveLength(2)
  })

  it('throws outside the DatePicker', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<DatePickerCalendar />)).toThrow(
      'DatePickerCalendar must be used within a <DatePicker>',
    )
    expect(() => render(<DatePickerFooter />)).toThrow(
      'DatePickerFooter must be used within a <DatePicker>',
    )
    vi.restoreAllMocks()
  })

  it('throws when a page part is outside a page', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar>
            <DatePickerGrid />
          </DatePickerCalendar>
        </DatePicker>,
      ),
    ).toThrow('DatePickerGrid must be used within a <DatePickerPage>')
    vi.restoreAllMocks()
  })

  it('throws when the field or the trigger is outside a DatePickerInput', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerTrigger />
        </DatePicker>,
      ),
    ).toThrow('DatePickerTrigger must be used within a <DatePickerInput>')
    vi.restoreAllMocks()
  })

  describe('input parts', () => {
    it('lets the trigger go before the field', () => {
      render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerInput>
            <InputControl>
              <InputElement>
                <DatePickerTrigger />
              </InputElement>
              <DatePickerField />
            </InputControl>
          </DatePickerInput>
          <DatePickerCalendar />
        </DatePicker>,
      )
      const control = document.querySelector('[data-plume-input-control]') as HTMLElement
      expect(control.firstElementChild?.querySelector('button')).toBe(
        screen.getByRole('button', { name: 'Open calendar' }),
      )
      openCalendar()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('styles the field and the trigger and forwards their refs', () => {
      const fieldRef = createRef<HTMLInputElement>()
      const triggerRef = createRef<HTMLButtonElement>()
      render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerInput>
            <InputControl>
              <DatePickerField className="field-mine" ref={fieldRef} />
              <InputElement position="after">
                <DatePickerTrigger className="trigger-mine" ref={triggerRef} style={{ margin: 1 }}>
                  <span>cal</span>
                </DatePickerTrigger>
              </InputElement>
            </InputControl>
          </DatePickerInput>
        </DatePicker>,
      )
      expect(fieldRef.current).toBe(screen.getByRole('textbox'))
      expect(screen.getByRole('textbox')).toHaveClass('field-mine')
      expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Open calendar' }))
      expect(triggerRef.current).toHaveClass('trigger-mine')
      expect(triggerRef.current?.style.margin).toBe('1px')
      expect(screen.getByText('cal')).toBeInTheDocument()
      expect(triggerRef.current).toHaveAttribute('data-plume-datepicker-trigger')
    })

    it('marks the trigger as open', () => {
      render(<DatePicker onValueChange={vi.fn()} />)
      const trigger = screen.getByRole('button', { name: 'Open calendar' })
      expect(trigger).not.toHaveAttribute('data-open')
      openCalendar()
      expect(trigger).toHaveAttribute('data-open')
    })

    it('keeps the inputRef of the DatePickerInput on the field', () => {
      const inputRef = createRef<HTMLInputElement>()
      render(
        <DatePicker onValueChange={vi.fn()}>
          <DatePickerInput inputRef={inputRef} />
        </DatePicker>,
      )
      expect(inputRef.current).toBe(screen.getByRole('textbox'))
    })
  })

  describe('calendar parts', () => {
    it('styles and refs every part', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <DatePicker calendar onValueChange={vi.fn()} showFooter>
          <DatePickerCalendar className="calendar-mine" ref={ref} style={{ margin: 3 }}>
            <DatePickerPages className="pages-mine">
              <DatePickerPage className="page-mine">
                <DatePickerHeader className="header-mine">
                  <DatePickerNav className="nav-mine">
                    <DatePickerPrevious className="previous-mine" />
                    <DatePickerMonthButton className="month-mine" />
                    <DatePickerSeparator className="separator-mine" />
                    <DatePickerYearButton className="year-mine" />
                    <DatePickerNext className="next-mine" />
                  </DatePickerNav>
                </DatePickerHeader>
                <DatePickerView>
                  <DatePickerWeekdays className="weekdays-mine">
                    {(weekday) => <DatePickerWeekday key={weekday}>{weekday}</DatePickerWeekday>}
                  </DatePickerWeekdays>
                  <DatePickerGrid className="grid-mine" />
                </DatePickerView>
              </DatePickerPage>
            </DatePickerPages>
            <DatePickerFooter className="footer-mine">
              <DatePickerCancel className="cancel-mine" />
              <DatePickerApply className="apply-mine" />
            </DatePickerFooter>
          </DatePickerCalendar>
        </DatePicker>,
      )
      expect(ref.current).toBe(screen.getByRole('dialog'))
      expect(ref.current?.style.margin).toBe('3px')
      for (const name of [
        'calendar',
        'pages',
        'page',
        'header',
        'nav',
        'previous',
        'month',
        'separator',
        'year',
        'next',
        'weekdays',
        'grid',
        'footer',
        'cancel',
        'apply',
      ]) {
        expect(document.querySelector(`.${name}-mine`)).not.toBeNull()
      }
    })

    it('reorders and omits parts', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar>
            <DatePickerPages>
              <DatePickerPage>
                <DatePickerHeader>
                  <DatePickerNav>
                    <DatePickerNext />
                    <DatePickerPrevious />
                  </DatePickerNav>
                </DatePickerHeader>
                <DatePickerView />
              </DatePickerPage>
            </DatePickerPages>
          </DatePickerCalendar>
        </DatePicker>,
      )
      const nav = part('nav')
      expect(nav.children).toHaveLength(2)
      expect(nav.firstElementChild).toBe(part('next'))
      expect(part('month-button')).toBeNull()
    })

    it('replaces the content of a part', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()} showFooter>
          <DatePickerCalendar>
            <DatePickerPages>
              <DatePickerPage>
                <DatePickerHeader>
                  <DatePickerNav>
                    <DatePickerPrevious>back</DatePickerPrevious>
                    <DatePickerMonthButton>month</DatePickerMonthButton>
                    <DatePickerSeparator>-</DatePickerSeparator>
                    <DatePickerYearButton>year</DatePickerYearButton>
                    <DatePickerNext>forward</DatePickerNext>
                  </DatePickerNav>
                </DatePickerHeader>
                <DatePickerView />
              </DatePickerPage>
            </DatePickerPages>
            <DatePickerFooter>
              <DatePickerCancel>No</DatePickerCancel>
              <DatePickerApply>Yes</DatePickerApply>
            </DatePickerFooter>
          </DatePickerCalendar>
        </DatePicker>,
      )
      for (const text of ['back', 'month', '-', 'year', 'forward', 'No', 'Yes']) {
        expect(screen.getByText(text)).toBeInTheDocument()
      }
    })

    it('navigates with custom previous and next parts and the labels of the root', () => {
      render(<DatePicker calendar labels={{ nextMonth: 'Adelante' }} onValueChange={vi.fn()} />)
      const month = part('month-button').textContent
      fireEvent.click(screen.getByRole('button', { name: 'Adelante' }))
      expect(part('month-button').textContent).not.toBe(month)
    })

    it('switches the views and pages through the years', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} />)
      fireEvent.click(part('year-button'))
      expect(part('years')).not.toBeNull()
      expect(part('year-button')).toHaveAttribute('data-active')
      const first = within(part('years')).getAllByRole('button')[0].textContent
      fireEvent.click(screen.getByRole('button', { name: 'Previous years' }))
      expect(within(part('years')).getAllByRole('button')[0].textContent).toBe(
        String(Number(first) - 20),
      )
      fireEvent.click(screen.getByRole('button', { name: 'Next years' }))
      fireEvent.click(part('month-button'))
      expect(part('months')).not.toBeNull()
      expect(part('month-button')).toHaveAttribute('data-active')
      fireEvent.click(within(part('months')).getAllByRole('button')[0])
      expect(part('grid')).not.toBeNull()
    })

    it('picks a year', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} />)
      fireEvent.click(part('year-button'))
      const option = within(part('years')).getAllByRole('button')[2]
      fireEvent.click(option)
      expect(part('year-button').textContent).toBe(option.textContent)
    })

    it('renders days, weekdays, months and years from render functions', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar>
            <DatePickerPages>
              <DatePickerPage>
                <DatePickerHeader />
                <DatePickerView>
                  {(view) => (
                    <>
                      {view === 'day' ? (
                        <>
                          <DatePickerWeekdays>
                            {(weekday) => <b key={weekday}>{weekday}</b>}
                          </DatePickerWeekdays>
                          <DatePickerGrid>
                            {(day) =>
                              day.isCurrentMonth ? (
                                <DatePickerDay className="day-mine" day={day} key={day.dataDate} />
                              ) : (
                                <i key={day.dataDate} />
                              )
                            }
                          </DatePickerGrid>
                        </>
                      ) : null}
                      {view === 'month' ? (
                        <DatePickerMonths>
                          {(month) => (
                            <DatePickerMonthOption key={month.index} month={month}>
                              {month.label.slice(0, 3)}
                            </DatePickerMonthOption>
                          )}
                        </DatePickerMonths>
                      ) : null}
                      {view === 'year' ? (
                        <DatePickerYears>
                          {(year) => (
                            <DatePickerYearOption key={year.value} year={year}>
                              {`'${year.value % 100}`}
                            </DatePickerYearOption>
                          )}
                        </DatePickerYears>
                      ) : null}
                    </>
                  )}
                </DatePickerView>
              </DatePickerPage>
            </DatePickerPages>
          </DatePickerCalendar>
        </DatePicker>,
      )
      expect(document.querySelectorAll('b')).toHaveLength(7)
      expect(document.querySelectorAll('.day-mine').length).toBeGreaterThan(27)
      fireEvent.click(part('month-button'))
      expect(within(part('months')).getAllByRole('button')).toHaveLength(12)
      fireEvent.click(part('year-button'))
      expect(within(part('years')).getAllByRole('button')[0].textContent).toMatch(/^'\d\d$/)
    })

    it('takes the children of the grid and weekdays as plain nodes', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar>
            <DatePickerPages>
              <DatePickerPage>
                <DatePickerView>
                  <DatePickerWeekdays>
                    <span>only</span>
                  </DatePickerWeekdays>
                  <DatePickerGrid>
                    <span>none</span>
                  </DatePickerGrid>
                </DatePickerView>
              </DatePickerPage>
            </DatePickerPages>
          </DatePickerCalendar>
        </DatePicker>,
      )
      expect(screen.getByText('only')).toBeInTheDocument()
      expect(screen.getByText('none')).toBeInTheDocument()
    })

    it('marks the state of the days with data attributes', () => {
      const today = new Date()
      render(
        <DatePicker
          calendar
          maxDate={new Date(today.getFullYear(), today.getMonth(), 28)}
          minDate={new Date(today.getFullYear(), today.getMonth(), 2)}
          onValueChange={vi.fn()}
          value={{ startDate: new Date(today.getFullYear(), today.getMonth(), 10), endDate: null }}
        />,
      )
      const day = (n: number): HTMLElement =>
        document.querySelector<HTMLElement>(
          `[data-plume-datepicker-day]:not([data-outside])[aria-label][data-date$="-${String(n).padStart(2, '0')}"]`,
        ) as HTMLElement
      expect(day(10)).toHaveAttribute('data-selected')
      expect(day(1)).toBeDisabled()
      expect(day(5)).not.toHaveAttribute('data-selected')
      expect(document.querySelector('[data-outside]')).not.toBeNull()
    })

    it('marks today and the days in a range', () => {
      const today = new Date()
      render(
        <DatePicker
          range
          onValueChange={vi.fn()}
          value={{
            startDate: new Date(today.getFullYear(), today.getMonth(), 3),
            endDate: new Date(today.getFullYear(), today.getMonth(), 6),
          }}
        />,
      )
      openCalendar()
      expect(document.querySelector('[data-today]')).not.toBeNull()
      expect(document.querySelectorAll('[data-in-range]').length).toBeGreaterThan(0)
    })

    it('selects a day through a standalone day part and lets the footer apply it', () => {
      const onChange = vi.fn()
      render(<DatePicker calendar onValueChange={onChange} showFooter />)
      fireEvent.click(
        document.querySelector('[data-plume-datepicker-day]:not([aria-hidden])') as HTMLElement,
      )
      expect(onChange).not.toHaveBeenCalled()
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('renders nothing but the content when the day has children', () => {
      render(
        <DatePicker calendar onValueChange={vi.fn()}>
          <DatePickerCalendar>
            <DatePickerPages>
              <DatePickerPage>
                <DatePickerGrid>
                  {(day) => (
                    <DatePickerDay day={day} key={day.dataDate}>
                      {day.date.getDate()}!
                    </DatePickerDay>
                  )}
                </DatePickerGrid>
              </DatePickerPage>
            </DatePickerPages>
          </DatePickerCalendar>
        </DatePicker>,
      )
      expect(screen.getAllByText('1!').length).toBeGreaterThan(0)
    })

    it('marks the inline calendar', () => {
      render(<DatePicker calendar onValueChange={vi.fn()} />)
      expect(screen.getByRole('dialog')).toHaveAttribute('data-inline')
    })

    it('cancels from a custom footer', () => {
      render(
        <DatePicker onValueChange={vi.fn()} showFooter>
          <DatePickerInput />
          <DatePickerCalendar />
        </DatePicker>,
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
