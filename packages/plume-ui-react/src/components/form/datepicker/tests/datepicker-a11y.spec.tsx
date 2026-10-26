import { fireEvent, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerHeader,
  DatePickerInput,
  DatePickerNav,
  DatePickerNext,
  DatePickerPage,
  DatePickerPrevious,
} from '..'

const value = { startDate: new Date(2026, 5, 15), endDate: null }

const open = async (): Promise<void> => {
  await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
}

describe('DatePicker accessibility', () => {
  it('asks the browser not to autofill the input and describes its format', () => {
    render(<DatePicker onChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAccessibleDescription('Format: mm/dd/yyyy')
  })

  it('describes the format of a range and of another language', () => {
    const { rerender } = render(<DatePicker isRange onChange={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Format: mm/dd/yyyy - mm/dd/yyyy',
    )
    rerender(
      <DatePicker
        displayFormat="dd/mm/yyyy"
        labels={{ format: (format) => `Formato: ${format}` }}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Formato: dd/mm/yyyy')
  })

  it('adds its own description to the one it is given', () => {
    render(
      <>
        <p id="help">Your birthday</p>
        <DatePicker aria-describedby="help" onChange={vi.fn()} />
      </>,
    )
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
      'Your birthday Format: mm/dd/yyyy',
    )
  })

  it('links the button to the dialog it opens, which is modal', async () => {
    render(<DatePicker onChange={vi.fn()} value={value} />)
    const button = screen.getByRole('button', { name: 'Open calendar' })
    expect(button).not.toHaveAttribute('aria-controls')
    await open()
    const dialog = screen.getByRole('dialog', { name: 'Calendar' })
    expect(button).toHaveAttribute('aria-controls', dialog.id)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('leaves the always visible calendar without modal semantics', () => {
    render(<DatePicker isCalendar onChange={vi.fn()} value={value} />)
    const dialog = screen.getByRole('dialog', { name: 'Calendar' })
    expect(dialog).not.toHaveAttribute('aria-modal')
    expect(dialog).not.toHaveAttribute('id')
  })

  it('moves the focus to the selected day and keeps Tab inside the dialog', async () => {
    render(
      <>
        <DatePicker onChange={vi.fn()} value={value} />
        <button type="button">after</button>
      </>,
    )
    await open()
    const dialog = screen.getByRole('dialog')
    expect(document.activeElement).toHaveAttribute('data-date', '2026-06-15')
    const buttons = within(dialog).getAllByRole('button')
    const tabStops = buttons.filter((button) => button.tabIndex === 0)
    const last = tabStops[tabStops.length - 1]
    last.focus()
    fireEvent.keyDown(last, { key: 'Tab' })
    expect(within(dialog).getByRole('button', { name: 'Previous month' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'Tab', shiftKey: true })
    expect(last).toHaveFocus()
  })

  it('announces the month that is shown when it changes', async () => {
    render(<DatePicker onChange={vi.fn()} value={value} />)
    await open()
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('June 2026')
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByRole('status')).toBe(status)
    expect(status).toHaveTextContent('July 2026')
  })

  it('announces only the first month of a range', async () => {
    render(<DatePicker isRange onChange={vi.fn()} value={value} />)
    await open()
    expect(screen.getAllByRole('status')).toHaveLength(1)
  })

  it('tells whether the month and the year lists are open', async () => {
    render(<DatePicker onChange={vi.fn()} value={value} />)
    await open()
    const month = screen.getByRole('button', { name: 'June' })
    const year = screen.getByRole('button', { name: '2026' })
    expect(month).toHaveAttribute('aria-expanded', 'false')
    expect(year).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(month)
    expect(month).toHaveAttribute('aria-expanded', 'true')
    expect(year).toHaveAttribute('aria-expanded', 'false')
  })

  it('gives the focus back to the month button after choosing a month', async () => {
    render(<DatePicker onChange={vi.fn()} value={value} />)
    await open()
    await userEvent.click(screen.getByRole('button', { name: 'June' }))
    await userEvent.click(screen.getByRole('button', { name: 'March' }))
    expect(screen.getByRole('button', { name: 'March' })).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('March 2026')
  })

  it('gives the focus back to the year button after choosing a year', async () => {
    render(<DatePicker onChange={vi.fn()} value={value} />)
    await open()
    await userEvent.click(screen.getByRole('button', { name: '2026' }))
    await userEvent.click(screen.getByRole('button', { name: '2030' }))
    expect(screen.getByRole('button', { name: '2030' })).toHaveFocus()
  })

  it('lets text children name the buttons that change the month', async () => {
    render(
      <DatePicker onChange={vi.fn()} value={value}>
        <DatePickerInput aria-label="Date" />
        <DatePickerCalendar>
          <DatePickerPage>
            <DatePickerHeader>
              <DatePickerNav>
                <DatePickerPrevious>Back</DatePickerPrevious>
                <DatePickerNext aria-label="Following month">Forward</DatePickerNext>
              </DatePickerNav>
            </DatePickerHeader>
          </DatePickerPage>
        </DatePickerCalendar>
      </DatePicker>,
    )
    await open()
    expect(screen.getByRole('button', { name: 'Back' })).not.toHaveAttribute('aria-label')
    expect(screen.getByRole('button', { name: 'Following month' })).toBeInTheDocument()
  })

  it('names the input with the aria-label it is given, also in a composition', () => {
    render(
      <DatePicker onChange={vi.fn()}>
        <DatePickerInput aria-label="Birthday" />
      </DatePicker>,
    )
    expect(screen.getByRole('textbox', { name: 'Birthday' })).toBeInTheDocument()
  })
})
