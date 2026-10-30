import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerDay,
  DatePickerDayNumber,
  DatePickerFormatHint,
  DatePickerInput,
  DatePickerPage,
  DatePickerPages,
} from '..'
import { InputControl, InputField } from '../../input'

const openCalendar = (): void => {
  fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
}

const stylesOf = (selector: string): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>(selector)).map((node) => node.className)

describe('DatePicker contract', () => {
  it('marks the root and the input', () => {
    const { container } = render(<DatePicker onValueChange={vi.fn()} />)
    expect(container.firstChild).toHaveAttribute('data-plume-datepicker')
    expect(screen.getByRole('textbox')).toHaveAttribute('data-plume-datepicker-input')
  })

  it('marks the root as open', () => {
    const { container } = render(<DatePicker onValueChange={vi.fn()} />)
    expect(container.firstChild).not.toHaveAttribute('data-open')
    openCalendar()
    expect(container.firstChild).toHaveAttribute('data-open')
  })

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<DatePicker onValueChange={vi.fn()} ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('renders the format hint and the day number as parts', () => {
    render(<DatePicker onValueChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    const hint = document.querySelector('[data-plume-datepicker-format-hint]')
    expect(hint).toHaveTextContent('Format: ')
    expect(input.getAttribute('aria-describedby')).toContain(hint?.id)
    openCalendar()
    expect(document.querySelector('[data-plume-datepicker-day-number]')).toBeInTheDocument()
  })

  it('replaces the format hint and the day number with the ones given', () => {
    const hint = createRef<HTMLSpanElement>()
    render(
      <DatePicker onValueChange={vi.fn()}>
        <DatePickerInput>
          <InputControl>
            <InputField />
          </InputControl>
          <DatePickerFormatHint className="mine" ref={hint}>
            Type a date
          </DatePickerFormatHint>
        </DatePickerInput>
      </DatePicker>,
    )
    expect(document.querySelectorAll('[data-plume-datepicker-format-hint]')).toHaveLength(1)
    expect(hint.current).toHaveTextContent('Type a date')
    expect(hint.current).toHaveClass('mine')
  })

  it('takes children in the day number', () => {
    render(
      <DatePicker onValueChange={vi.fn()} panel>
        <DatePickerCalendar>
          <DatePickerPages>
            <DatePickerPage>
              <DatePickerDayNumber className="mine">7</DatePickerDayNumber>
            </DatePickerPage>
          </DatePickerPages>
        </DatePickerCalendar>
      </DatePicker>,
    )
    expect(document.querySelector('[data-plume-datepicker-day-number]')).toHaveClass('mine')
  })

  it('throws when a part is used outside its root', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<DatePickerFormatHint />)).toThrow('DatePickerFormatHint')
    expect(() =>
      render(
        <DatePicker onValueChange={vi.fn()} panel>
          <DatePickerDay day={{} as never} />
        </DatePicker>,
      ),
    ).toThrow('DatePickerDay')
  })

  it('drops every Plume class of the parts with the unstyled variant', () => {
    render(<DatePicker onValueChange={vi.fn()} showFooter variant="unstyled" />)
    openCalendar()
    const parts = [
      'calendar',
      'pages',
      'page',
      'header',
      'nav',
      'previous',
      'next',
      'month-button',
      'year-button',
      'weekdays',
      'weekday',
      'grid',
      'day',
      'footer',
      'cancel',
      'apply',
      'trigger',
    ]
    for (const name of parts) {
      const classes = stylesOf(`[data-plume-datepicker-${name}]`)
      if (classes.length === 0) continue
      for (const className of classes) expect(className.trim()).toBe('')
    }
  })

  it('drops the classes of the months and the years with the unstyled variant', () => {
    render(<DatePicker onValueChange={vi.fn()} variant="unstyled" />)
    openCalendar()
    fireEvent.click(document.querySelector('[data-plume-datepicker-month-button]') as Element)
    expect(stylesOf('[data-plume-datepicker-months], [data-plume-datepicker-month-option]')).toSatisfy(
      (names: string[]) => names.length > 0 && names.every((name) => name.trim() === ''),
    )
    fireEvent.click(document.querySelector('[data-plume-datepicker-month-option]') as Element)
    fireEvent.click(document.querySelector('[data-plume-datepicker-year-button]') as Element)
    expect(stylesOf('[data-plume-datepicker-years], [data-plume-datepicker-year-option]')).toSatisfy(
      (names: string[]) => names.length > 0 && names.every((name) => name.trim() === ''),
    )
  })

  it('computes no colors in JavaScript', () => {
    const { container } = render(<DatePicker colorScheme="primary" onValueChange={vi.fn()} />)
    const style = (container.firstChild as HTMLElement).getAttribute('style') ?? ''
    expect(style).not.toContain('color-mix')
    expect(style).toContain('--plume-color-primary-tint')
    expect(style).toContain('--plume-color-primary-tint-text')
  })
})
