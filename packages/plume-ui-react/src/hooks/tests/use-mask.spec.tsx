import { fireEvent, render, screen } from '@testing-library/react'
import type { ChangeEvent, ReactElement } from 'react'
import { applyMask, useMask } from '../use-mask'

function MaskedField({
  mask,
  value,
  defaultValue,
  onChange,
}: {
  mask?: string
  value?: string
  defaultValue?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}): ReactElement {
  const props = useMask({ mask, value, defaultValue, onChange })
  return <input {...props} />
}

describe('applyMask', () => {
  it('inserts literals as the digits are typed', () => {
    expect(applyMask('15082024', '##/##/####')).toBe('15/08/2024')
  })

  it('stops at the end of the typed value without adding trailing literals', () => {
    expect(applyMask('15', '##/##/####')).toBe('15')
    expect(applyMask('150', '##/##/####')).toBe('15/0')
  })

  it('does not duplicate a literal the user already typed', () => {
    expect(applyMask('15/08/2024', '##/##/####')).toBe('15/08/2024')
  })

  it('ignores extra characters beyond the mask length', () => {
    expect(applyMask('150820241234', '##/##/####')).toBe('15/08/2024')
  })

  it('supports any literal, not only slashes', () => {
    expect(applyMask('5551234567', '(###) ###-####')).toBe('(555) 123-4567')
    expect(applyMask('4111111111111111', '#### #### #### ####')).toBe('4111 1111 1111 1111')
    expect(applyMask('0930', '##:##')).toBe('09:30')
  })

  it('returns the value untouched when there is no mask', () => {
    expect(applyMask('abc', '')).toBe('abc')
  })

  it('returns an empty string for an empty value', () => {
    expect(applyMask('', '##/##')).toBe('')
  })

  it('only accepts digits in a # slot', () => {
    expect(applyMask('a5b5c1', '(###)')).toBe('(551')
    expect(applyMask('abc', '###')).toBe('')
    expect(applyMask('12ab34', '##/##')).toBe('12/34')
  })

  it('only accepts letters in an A slot', () => {
    expect(applyMask('1a2b3c', 'AAA')).toBe('abc')
    expect(applyMask('ñandú', 'AAAAA')).toBe('ñandú')
  })

  it('accepts letters and digits in a * slot and drops anything else', () => {
    expect(applyMask('a-1_b', '***')).toBe('a1b')
  })

  it('combines slot types in one mask', () => {
    expect(applyMask('ab12', 'AA-##')).toBe('ab-12')
    expect(applyMask('12ab', 'AA-##')).toBe('ab')
  })

  it('treats an escaped slot character as a literal', () => {
    expect(applyMask('12', '\\A##')).toBe('A12')
    expect(applyMask('1234', '\\###')).toBe('#12')
  })

  it('does not leave a dangling literal when the next character is rejected', () => {
    expect(applyMask('15a', '##/##')).toBe('15')
    expect(applyMask('15/', '##/##')).toBe('15')
  })

  it('is idempotent for an already formatted value', () => {
    const formatted = applyMask('5551234567', '(###) ###-####')
    expect(applyMask(formatted, '(###) ###-####')).toBe(formatted)
  })
})

describe('useMask', () => {
  it('masks an uncontrolled field as the user types', () => {
    render(<MaskedField mask="##/##/####" />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    fireEvent.change(input, { target: { value: '15082024' } })

    expect(input).toHaveValue('15/08/2024')
  })

  it('applies the mask to the default value', () => {
    render(<MaskedField defaultValue="15082024" mask="##/##/####" />)
    expect(screen.getByRole('textbox')).toHaveValue('15/08/2024')
  })

  it('masks a controlled value', () => {
    render(<MaskedField mask="##:##" onChange={vi.fn()} value="0930" />)
    expect(screen.getByRole('textbox')).toHaveValue('09:30')
  })

  it('hands the masked value to the consumer onChange', () => {
    const received: string[] = []
    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
      received.push(event.target.value)
    }
    render(<MaskedField mask="##/##" onChange={onChange} value="" />)

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1208' } })

    expect(received).toEqual(['12/08'])
  })

  it('passes the value and handler through when there is no mask', () => {
    const onChange = vi.fn()
    render(<MaskedField onChange={onChange} value="plain" />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    expect(input).toHaveValue('plain')
    fireEvent.change(input, { target: { value: 'plain text' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
