import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef } from 'react'
import { Field } from '../../field'
import {
  Input,
  InputAddon,
  InputControl,
  InputElement,
  InputField,
  InputGroup,
  InputReveal,
} from '..'

describe('Input parts', () => {
  describe('default composition', () => {
    it('builds the group from the parts', () => {
      const { container } = render(
        <Input
          addonAfter={<span>after</span>}
          addonBefore={<span>before</span>}
          elementAfter={<span>el-after</span>}
          elementBefore={<span>el-before</span>}
          placeholder="x"
        />,
      )
      const group = container.firstElementChild as HTMLElement
      expect(group).toHaveAttribute('data-plume-input-group')
      expect(group.children).toHaveLength(3)
      expect(group.children[0]).toHaveAttribute('data-plume-input-addon')
      expect(group.children[0]).toHaveAttribute('data-position', 'before')
      expect(group.children[1]).toHaveAttribute('data-plume-input-control')
      expect(group.children[2]).toHaveAttribute('data-position', 'after')
      const control = group.children[1]
      expect(control.children).toHaveLength(3)
      expect(control.children[0]).toHaveAttribute('data-plume-input-element')
      expect(control.children[1]).toBe(screen.getByPlaceholderText('x'))
      expect(control.children[2]).toHaveAttribute('data-position', 'after')
    })

    it('puts className on the group and the ref on the input', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <Input addonBefore="$" className="mine" placeholder="x" ref={ref} />,
      )
      expect(container.firstElementChild).toHaveClass('mine')
      expect(ref.current).toBe(screen.getByPlaceholderText('x'))
    })
  })

  describe('compound', () => {
    it('renders the parts in the order they are given', () => {
      const { container } = render(
        <Input>
          <InputControl>
            <InputField placeholder="amount" />
          </InputControl>
          <InputAddon position="after">EUR</InputAddon>
          <InputAddon>Total</InputAddon>
        </Input>,
      )
      const group = container.firstElementChild as HTMLElement
      expect(group.children[0]).toHaveAttribute('data-plume-input-control')
      expect(group.children[1]).toHaveTextContent('EUR')
      expect(group.children[1]).toHaveClass('addOn', 'addOnAfter')
      expect(group.children[2]).toHaveTextContent('Total')
      expect(group.children[2]).toHaveClass('addOn', 'addOnBefore')
    })

    it('can leave out the control and the extras', () => {
      const { container } = render(
        <Input>
          <InputField placeholder="bare" />
        </Input>,
      )
      expect(container.firstElementChild).toHaveAttribute('data-plume-input-group')
      expect(screen.getByPlaceholderText('bare').parentElement).toBe(container.firstElementChild)
    })

    it('puts the className and style of the root on the group', () => {
      const { container } = render(
        <Input className="mine" colorScheme="info" style={{ width: 200 }}>
          <InputField placeholder="x" />
        </Input>,
      )
      const group = container.firstElementChild as HTMLElement
      expect(group).toHaveClass('inputGroup', 'mine')
      expect(group.style.width).toBe('200px')
      expect(group.style.getPropertyValue('--input-color')).toBe('var(--plume-color-info-text)')
    })

    it('points the ref of the root to the input', () => {
      const ref = createRef<HTMLInputElement>()
      const { container } = render(
        <Input ref={ref}>
          <InputControl>
            <InputField placeholder="x" />
          </InputControl>
        </Input>,
      )
      expect(ref.current).toBe(screen.getByPlaceholderText('x'))
      expect(ref.current).not.toBe(container.firstElementChild)
    })

    it('sets the ref of the root and the one of the field', () => {
      const rootRef = createRef<HTMLInputElement>()
      const fieldRef = vi.fn()
      render(
        <Input ref={rootRef}>
          <InputField placeholder="x" ref={fieldRef} />
        </Input>,
      )
      const input = screen.getByPlaceholderText('x')
      expect(rootRef.current).toBe(input)
      expect(fieldRef).toHaveBeenCalledWith(input)
    })

    it('leaves the ref of the root empty when there is no field', () => {
      const ref = createRef<HTMLInputElement>()
      render(
        <Input ref={ref}>
          <InputAddon>only</InputAddon>
        </Input>,
      )
      expect(ref.current).toBeNull()
    })

    it('gives the field its own ref, className, style and native props', () => {
      const ref = createRef<HTMLInputElement>()
      render(
        <Input shape="pill" size="lg" variant="filled">
          <InputField
            className="own"
            maxLength={5}
            placeholder="x"
            ref={ref}
            style={{ color: 'red' }}
          />
        </Input>,
      )
      const input = screen.getByPlaceholderText('x')
      expect(ref.current).toBe(input)
      expect(input).toHaveClass('base', 'lg', 'pill', 'filled', 'own')
      expect(input).toHaveAttribute('maxlength', '5')
      expect(input.style.color).toBe('red')
      expect(input).toHaveAttribute('data-plume-input-field')
    })

    it('shares the native props of the root with the field', () => {
      render(
        <Input
          aria-describedby="hint"
          id="mail"
          name="mail"
          placeholder="Mail"
          required
          type="email"
        >
          <InputField />
        </Input>,
      )
      const input = screen.getByPlaceholderText('Mail')
      expect(input).toHaveAttribute('id', 'mail')
      expect(input).toHaveAttribute('name', 'mail')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('aria-describedby', 'hint')
      expect(input).toBeRequired()
    })

    it('lets the props of the field win over the ones of the root', () => {
      render(
        <Input id="root" placeholder="root" type="email">
          <InputField id="own" placeholder="own" type="tel" />
        </Input>,
      )
      const input = screen.getByPlaceholderText('own')
      expect(input).toHaveAttribute('id', 'own')
      expect(input).toHaveAttribute('type', 'tel')
    })

    it('applies the mask of the root and calls both onChange', () => {
      const onRoot = vi.fn()
      const onField = vi.fn()
      render(
        <Input mask="##-##" onChange={onRoot} placeholder="masked">
          <InputField onChange={onField} />
        </Input>,
      )
      const input = screen.getByPlaceholderText('masked')
      fireEvent.change(input, { target: { value: '1234' } })
      expect(input).toHaveValue('12-34')
      expect(onRoot).toHaveBeenCalledTimes(1)
      expect(onField).toHaveBeenCalledTimes(1)
    })

    it('calls both onBlur', () => {
      const onRoot = vi.fn()
      const onField = vi.fn()
      render(
        <Input onBlur={onRoot} placeholder="x">
          <InputField onBlur={onField} />
        </Input>,
      )
      fireEvent.blur(screen.getByPlaceholderText('x'))
      expect(onRoot).toHaveBeenCalledTimes(1)
      expect(onField).toHaveBeenCalledTimes(1)
    })

    it('disables and marks the parts that depend on the root state', () => {
      const { container } = render(
        <Input aria-invalid disabled placeholder="x">
          <InputControl>
            <InputField />
            <InputReveal />
          </InputControl>
        </Input>,
      )
      const input = screen.getByPlaceholderText('x')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('invalid', 'disabled')
      expect(input).toHaveAttribute('data-invalid')
      expect(input).toHaveAttribute('data-disabled')
      expect(container.firstElementChild).toHaveAttribute('data-invalid')
      expect(container.firstElementChild).toHaveAttribute('data-disabled')
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByRole('button')).toHaveAttribute('data-disabled')
    })

    it('marks as invalid a field that has aria-invalid on its own', () => {
      render(
        <Input>
          <InputField aria-invalid placeholder="x" />
        </Input>,
      )
      const input = screen.getByPlaceholderText('x')
      expect(input).toHaveClass('invalid')
      expect(input.style.getPropertyValue('--input-color')).toBe('var(--plume-color-error-text)')
    })

    it('disables a field on its own', () => {
      render(
        <Input>
          <InputField disabled placeholder="x" readOnly />
        </Input>,
      )
      expect(screen.getByPlaceholderText('x')).toBeDisabled()
      expect(screen.getByPlaceholderText('x')).toHaveAttribute('readonly')
    })

    it('reveals the password from a part placed anywhere', async () => {
      render(
        <Input labels={{ reveal: 'Mostrar' }} type="password">
          <InputControl>
            <InputReveal className="eye" />
            <InputField placeholder="Secret" />
          </InputControl>
        </Input>,
      )
      const toggle = screen.getByRole('button', { name: 'Mostrar' })
      expect(toggle).toHaveClass('revealButton', 'eye')
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute('type', 'password')
      await userEvent.click(toggle)
      expect(screen.getByPlaceholderText('Secret')).toHaveAttribute('type', 'text')
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
    })

    it('lets the reveal button take its own label, icon and click', async () => {
      const onClick = vi.fn()
      render(
        <Input type="password">
          <InputControl>
            <InputField placeholder="Secret" />
            <InputReveal aria-label="Eye" onClick={onClick}>
              icon
            </InputReveal>
          </InputControl>
        </Input>,
      )
      await userEvent.click(screen.getByRole('button', { name: 'Eye' }))
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(screen.getByRole('button', { name: 'Eye' })).toHaveTextContent('icon')
    })

    it('keeps the reveal enabled when the root is disabled but the button is not', () => {
      render(
        <Input disabled type="password">
          <InputControl>
            <InputField placeholder="Secret" />
            <InputReveal disabled={false} />
          </InputControl>
        </Input>,
      )
      expect(screen.getByRole('button')).toBeEnabled()
    })

    it('gives className, style and ref to every part', () => {
      const refs = {
        addon: createRef<HTMLSpanElement>(),
        control: createRef<HTMLDivElement>(),
        element: createRef<HTMLSpanElement>(),
        reveal: createRef<HTMLButtonElement>(),
      }
      render(
        <Input type="password">
          <InputAddon className="a" ref={refs.addon} style={{ color: 'red' }}>
            addon
          </InputAddon>
          <InputControl className="c" ref={refs.control} style={{ color: 'blue' }}>
            <InputElement
              className="e"
              position="after"
              ref={refs.element}
              style={{ color: 'green' }}
            >
              element
            </InputElement>
            <InputField />
            <InputReveal className="r" ref={refs.reveal} style={{ color: 'pink' }} />
          </InputControl>
        </Input>,
      )
      expect(refs.addon.current).toHaveClass('a', 'addOn')
      expect(refs.addon.current?.style.color).toBe('red')
      expect(refs.control.current).toHaveClass('c', 'control')
      expect(refs.control.current?.style.color).toBe('blue')
      expect(refs.element.current).toHaveClass('e', 'element', 'elementAfter')
      expect(refs.element.current?.style.color).toBe('green')
      expect(refs.reveal.current).toHaveClass('r', 'revealButton')
      expect(refs.reveal.current?.style.color).toBe('pink')
    })

    it('drops the Plume classes of every part when it is unstyled', () => {
      const { container } = render(
        <Input type="password" variant="unstyled">
          <InputAddon className="a">addon</InputAddon>
          <InputControl className="c">
            <InputElement className="e">element</InputElement>
            <InputField className="f" placeholder="x" />
            <InputReveal className="r" />
          </InputControl>
        </Input>,
      )
      expect(container.firstElementChild).not.toHaveAttribute('class')
      expect(screen.getByText('addon')).toHaveAttribute('class', 'a')
      expect(screen.getByText('element')).toHaveAttribute('class', 'e')
      expect(screen.getByPlaceholderText('x').className.split(' ')).toEqual(
        expect.arrayContaining(['f', 'base']),
      )
      expect(screen.getByPlaceholderText('x')).not.toHaveClass('outline')
      expect(screen.getByRole('button')).toHaveAttribute('class', 'r')
      expect(screen.getByPlaceholderText('x').parentElement).toHaveAttribute('class', 'c')
    })

    it('can be labelled by a Field', () => {
      render(
        <Field errorText="Required" helperText="Your mail" label="Mail">
          <Input type="email">
            <InputControl>
              <InputField />
            </InputControl>
          </Input>
        </Field>,
      )
      const input = screen.getByLabelText('Mail')
      expect(input.tagName).toBe('INPUT')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAccessibleDescription('Required Your mail')
    })

    it('hands the Field state to the field', () => {
      render(
        <Field disabled label="Mail" required>
          <Input>
            <InputField />
          </Input>
        </Field>,
      )
      const input = screen.getByLabelText(/Mail/)
      expect(input).toBeDisabled()
      expect(input).toBeRequired()
    })
  })

  describe('outside the root', () => {
    it.each([
      ['InputAddon', <InputAddon key="a">x</InputAddon>],
      ['InputControl', <InputControl key="c" />],
      ['InputElement', <InputElement key="e">x</InputElement>],
      ['InputField', <InputField key="f" />],
      ['InputGroup', <InputGroup key="g" />],
      ['InputReveal', <InputReveal key="r" />],
    ])('%s throws', (name, element) => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() => render(element)).toThrow(`<${name}> must be rendered inside an <Input>`)
      spy.mockRestore()
    })
  })
})
