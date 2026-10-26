import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { TimePicker } from '..'

const open = async (): Promise<void> => {
  await userEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
}

const option = (list: string, name: string): HTMLElement =>
  within(screen.getByRole('listbox', { name: list })).getByRole('option', { name })

describe('TimePicker accessibility', () => {
  it('asks the browser not to autofill the input and describes its format', () => {
    render(<TimePicker />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAccessibleDescription('Format: hh:mm')
  })

  it('describes the format of the 12 hour clock and of another language', () => {
    const { rerender } = render(<TimePicker hour12 />)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Format: hh:mm AM')
    rerender(
      <TimePicker labels={{ format: (format) => `Formato: ${format}` }} placeholder="hh:mm" />,
    )
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Formato: hh:mm')
  })

  it('links the button to the dialog it opens, which is modal', async () => {
    render(<TimePicker defaultValue="09:30" />)
    const button = screen.getByRole('button', { name: 'Open time picker' })
    expect(button).not.toHaveAttribute('aria-controls')
    await open()
    const dialog = screen.getByRole('dialog', { name: 'Time picker' })
    expect(button).toHaveAttribute('aria-controls', dialog.id)
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('leaves the always visible panel without modal semantics', () => {
    render(<TimePicker defaultValue="09:30" isPanel />)
    const dialog = screen.getByRole('dialog', { name: 'Time picker' })
    expect(dialog).not.toHaveAttribute('aria-modal')
    expect(dialog).not.toHaveAttribute('id')
  })

  it('moves the focus to the selected hour', async () => {
    render(<TimePicker defaultValue="09:30" />)
    await open()
    expect(option('Hours', '09')).toHaveFocus()
  })

  it('keeps the tab stop of a column on the option that has the focus', async () => {
    render(<TimePicker defaultValue="09:30" />)
    await open()
    fireEvent.keyDown(option('Hours', '09'), { key: 'ArrowDown' })
    expect(option('Hours', '10')).toHaveFocus()
    expect(option('Hours', '10')).toHaveAttribute('tabindex', '0')
    expect(option('Hours', '09')).toHaveAttribute('tabindex', '-1')
  })

  it('goes back to the selected option as tab stop when the focus leaves the column', async () => {
    render(<TimePicker defaultValue="09:30" />)
    await open()
    fireEvent.keyDown(option('Hours', '09'), { key: 'ArrowDown' })
    act(() => option('Minutes', '30').focus())
    expect(option('Hours', '09')).toHaveAttribute('tabindex', '0')
    expect(option('Hours', '10')).toHaveAttribute('tabindex', '-1')
  })

  it('keeps Tab inside the dialog', async () => {
    render(<TimePicker defaultValue="09:30" />)
    await open()
    const minutes = option('Minutes', '30')
    minutes.focus()
    fireEvent.keyDown(minutes, { key: 'Tab' })
    expect(option('Hours', '09')).toHaveFocus()
    fireEvent.keyDown(option('Hours', '09'), { key: 'Tab', shiftKey: true })
    expect(minutes).toHaveFocus()
  })
})
