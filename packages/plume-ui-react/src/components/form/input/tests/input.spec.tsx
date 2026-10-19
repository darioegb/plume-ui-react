import { fireEvent, render, screen } from '@testing-library/react'
import { Input } from '..'

describe('Input component', () => {
  it('renders a text input by default', () => {
    render(<Input placeholder="Name" />)
    const input = screen.getByPlaceholderText('Name')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })

  it('forwards the type', () => {
    render(<Input placeholder="Mail" type="email" />)
    expect(screen.getByPlaceholderText('Mail')).toHaveAttribute('type', 'email')
  })

  it('supports disabled and readOnly', () => {
    render(
      <>
        <Input disabled placeholder="off" />
        <Input placeholder="ro" readOnly />
      </>,
    )
    expect(screen.getByPlaceholderText('off')).toBeDisabled()
    expect(screen.getByPlaceholderText('ro')).toHaveAttribute('readonly')
  })

  it('applies size, shape and variant classes', () => {
    render(<Input placeholder="x" shape="pill" size="lg" variant="filled" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('lg')
    expect(input).toHaveClass('pill')
    expect(input).toHaveClass('filled')
  })

  it('does not apply Plume classes when unstyled', () => {
    render(<Input className="form-control" placeholder="x" variant="unstyled" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('form-control')
    expect(input).not.toHaveClass('outline')
    expect(input).not.toHaveClass('md')
  })

  it('maps the color scheme to palette CSS variables', () => {
    render(<Input colorScheme="success" placeholder="x" />)
    const { style } = screen.getByPlaceholderText('x')
    expect(style.getPropertyValue('--input-color')).toBe('var(--plume-color-success-text)')
  })

  it('switches to the error colors when aria-invalid is set', () => {
    render(<Input aria-invalid colorScheme="success" placeholder="x" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toHaveClass('invalid')
    expect(input.style.getPropertyValue('--input-color')).toBe('var(--plume-color-error-text)')
  })

  it('lets the style prop override the color variables', () => {
    render(<Input placeholder="x" style={{ '--input-color': 'hotpink' } as React.CSSProperties} />)
    expect(screen.getByPlaceholderText('x').style.getPropertyValue('--input-color')).toBe(
      'hotpink',
    )
  })

  it('calls onChange when typing', () => {
    const onChange = jest.fn()
    render(<Input onChange={onChange} placeholder="x" />)

    fireEvent.change(screen.getByPlaceholderText('x'), { target: { value: 'abc' } })

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('supports an uncontrolled defaultValue', () => {
    render(<Input defaultValue="hello" placeholder="x" />)
    expect(screen.getByPlaceholderText('x')).toHaveValue('hello')
  })

  it('passes required to the input', () => {
    render(<Input placeholder="x" required />)
    expect(screen.getByPlaceholderText('x')).toBeRequired()
  })

  it('forwards the ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input placeholder="x" ref={ref} />)
    expect(ref.current).toBe(screen.getByPlaceholderText('x'))
  })

  describe('addons and elements', () => {
    it('renders addons and elements around the input', () => {
      render(
        <Input
          addonAfter={<span>after</span>}
          addonBefore={<span>before</span>}
          elementAfter={<span>el-after</span>}
          elementBefore={<span>el-before</span>}
          placeholder="x"
        />,
      )
      expect(screen.getByText('before')).toBeInTheDocument()
      expect(screen.getByText('after')).toBeInTheDocument()
      expect(screen.getByText('el-before')).toBeInTheDocument()
      expect(screen.getByText('el-after')).toBeInTheDocument()
    })

    it('puts the color variables on the group wrapper', () => {
      const { container } = render(
        <Input addonBefore={<span>$</span>} colorScheme="info" placeholder="x" />,
      )
      const group = container.firstChild as HTMLElement
      expect(group.style.getPropertyValue('--input-color')).toBe('var(--plume-color-info-text)')
    })

    it('does not wrap the input when there is nothing to group', () => {
      const { container } = render(<Input placeholder="x" />)
      expect(container.firstChild).toBe(screen.getByPlaceholderText('x'))
    })

    it('keeps the group markup unstyled when variant is unstyled', () => {
      const { container } = render(
        <Input addonAfter={<span>after</span>} placeholder="x" variant="unstyled" />,
      )
      const group = container.firstChild as HTMLElement
      expect(group).not.toHaveClass('inputGroup')
      expect(screen.getByText('after').parentElement).not.toHaveClass('addOn')
    })
  })

  describe('mask', () => {
    it('formats typed characters with the mask', () => {
      render(<Input mask="##/##/####" placeholder="date" />)
      const input = screen.getByPlaceholderText('date')

      fireEvent.change(input, { target: { value: '15082024' } })

      expect(input).toHaveValue('15/08/2024')
    })

    it('supports phone and card masks', () => {
      render(
        <>
          <Input mask="(###) ###-####" placeholder="phone" />
          <Input mask="#### #### #### ####" placeholder="card" />
        </>,
      )

      fireEvent.change(screen.getByPlaceholderText('phone'), { target: { value: '5551234567' } })
      fireEvent.change(screen.getByPlaceholderText('card'), {
        target: { value: '4111111111111111' },
      })

      expect(screen.getByPlaceholderText('phone')).toHaveValue('(555) 123-4567')
      expect(screen.getByPlaceholderText('card')).toHaveValue('4111 1111 1111 1111')
    })

    it('applies the mask to a defaultValue', () => {
      render(<Input defaultValue="0930" mask="##:##" placeholder="time" />)
      expect(screen.getByPlaceholderText('time')).toHaveValue('09:30')
    })

    it('masks a controlled value and still notifies onChange', () => {
      const received: string[] = []
      render(
        <Input
          mask="##:##"
          onChange={(event) => {
            received.push(event.target.value)
          }}
          placeholder="time"
          value=""
        />,
      )

      fireEvent.change(screen.getByPlaceholderText('time'), { target: { value: '0930' } })

      expect(received).toEqual(['09:30'])
    })

    it('masks inside an input group as well', () => {
      render(<Input addonBefore={<span>+</span>} mask="##-##" placeholder="grouped" />)
      const input = screen.getByPlaceholderText('grouped')

      fireEvent.change(input, { target: { value: '1234' } })

      expect(input).toHaveValue('12-34')
    })
  })
})
