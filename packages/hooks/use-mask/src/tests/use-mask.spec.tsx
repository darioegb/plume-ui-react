import { fireEvent, render, screen } from '@testing-library/react'
import type { ChangeEvent } from 'react'
import { applyMask, useMask } from '..'

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
}): JSX.Element {
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
    render(<MaskedField mask="##:##" onChange={jest.fn()} value="0930" />)
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
    const onChange = jest.fn()
    render(<MaskedField onChange={onChange} value="plain" />)
    const input = screen.getByRole<HTMLInputElement>('textbox')

    expect(input).toHaveValue('plain')
    fireEvent.change(input, { target: { value: 'plain text' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})
