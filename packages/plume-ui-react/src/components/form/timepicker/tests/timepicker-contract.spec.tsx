import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { InputControl, InputField } from '../../input'
import { TimePicker, TimePickerFormatHint, TimePickerInput } from '..'

const classesOf = (selector: string): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>(selector)).map((node) => node.className.trim())

describe('TimePicker contract', () => {
  it('forwards the ref to the native input and marks it', () => {
    const ref = createRef<HTMLInputElement>()
    render(<TimePicker ref={ref} />)
    expect(ref.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toHaveAttribute('data-plume-timepicker-input')
  })

  it('forwards the ref of the TimePickerInput to the native input', () => {
    const rootRef = createRef<HTMLInputElement>()
    const ref = createRef<HTMLInputElement>()
    render(
      <TimePicker ref={rootRef}>
        <TimePickerInput ref={ref} />
      </TimePicker>,
    )
    expect(rootRef.current).toBe(screen.getByRole('textbox'))
    expect(ref.current).toBe(screen.getByRole('textbox'))
  })

  it('takes the default placeholder from the labels', () => {
    const { rerender } = render(<TimePicker />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm')
    rerender(<TimePicker hour12 />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm AM')
    rerender(<TimePicker labels={{ placeholder: (period) => `hh:mm${period ? '' : ' 24h'}` }} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'hh:mm 24h')
  })

  it('renders the format hint as a part that can be replaced', () => {
    const { rerender } = render(<TimePicker />)
    const hint = document.querySelector('[data-plume-timepicker-format-hint]')
    expect(hint).toHaveTextContent('Format: hh:mm')
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toContain(hint?.id)

    const ref = createRef<HTMLSpanElement>()
    rerender(
      <TimePicker>
        <TimePickerInput>
          <InputControl>
            <InputField />
          </InputControl>
          <TimePickerFormatHint className="mine" ref={ref}>
            Type the time
          </TimePickerFormatHint>
        </TimePickerInput>
      </TimePicker>,
    )
    expect(document.querySelectorAll('[data-plume-timepicker-format-hint]')).toHaveLength(1)
    expect(ref.current).toHaveTextContent('Type the time')
    expect(ref.current).toHaveClass('mine')
  })

  it('throws when the format hint is used outside its input', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<TimePickerFormatHint />)).toThrow('TimePickerFormatHint')
  })

  it('drops every Plume class of the parts with the unstyled variant', () => {
    render(<TimePicker defaultValue="09:30" hour12 variant="unstyled" />)
    fireEvent.click(screen.getByRole('button', { name: 'Open time picker' }))
    for (const name of ['trigger', 'panel', 'column', 'option']) {
      const classes = classesOf(`[data-plume-timepicker-${name}]`)
      expect(classes.length).toBeGreaterThan(0)
      for (const className of classes) expect(className).toBe('')
    }
  })

  it('computes no colors in JavaScript', () => {
    const { container } = render(<TimePicker colorScheme="primary" />)
    const style = (container.firstChild as HTMLElement).getAttribute('style') ?? ''
    expect(style).not.toContain('color-mix')
    expect(style).toContain('--plume-color-primary-tint')
  })
})
