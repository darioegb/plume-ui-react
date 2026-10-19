import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { getTabbableElements, useFocusTrap, type UseFocusTrapOptions } from '../use-focus-trap'

type TrapProps = Partial<UseFocusTrapOptions> & { empty?: boolean; withInitial?: boolean }

function Trap({ active = true, empty = false, withInitial = false, ...options }: TrapProps): React.ReactNode {
  const [container, setContainer] = useState<HTMLElement | null>(null)
  const [second, setSecond] = useState<HTMLElement | null>(null)
  useFocusTrap(container, { active, initialFocus: withInitial ? second : undefined, ...options })
  return (
    <>
      <button>before</button>
      <div data-testid="trap" ref={setContainer}>
        {empty ? (
          <span>nothing to focus</span>
        ) : (
          <>
            <button>first</button>
            <input aria-label="second" ref={setSecond} />
            <button>last</button>
          </>
        )}
      </div>
      <button>after</button>
    </>
  )
}

const press = (key: string, shiftKey = false): void => {
  fireEvent.keyDown(document.activeElement ?? document.body, { key, shiftKey })
}

describe('useFocusTrap', () => {
  it('focuses the first tabbable element when it activates', () => {
    render(<Trap />)
    expect(screen.getByText('first')).toHaveFocus()
  })

  it('focuses the initial element when one is given', () => {
    render(<Trap withInitial />)
    expect(screen.getByLabelText('second')).toHaveFocus()
  })

  it('focuses the container when it has nothing tabbable', () => {
    render(<Trap empty />)
    expect(screen.getByTestId('trap')).toHaveFocus()
    expect(screen.getByTestId('trap')).toHaveAttribute('tabindex', '-1')
  })

  it('keeps the container tabindex when it already has one', () => {
    function Custom(): React.ReactNode {
      const [container, setContainer] = useState<HTMLElement | null>(null)
      useFocusTrap(container, { active: true })
      return <div data-testid="custom" ref={setContainer} tabIndex={-1} />
    }
    render(<Custom />)
    expect(screen.getByTestId('custom')).toHaveFocus()
    expect(screen.getByTestId('custom')).toHaveAttribute('tabindex', '-1')
  })

  it('wraps from the last element to the first with Tab', () => {
    render(<Trap />)
    screen.getByText('last').focus()
    press('Tab')
    expect(screen.getByText('first')).toHaveFocus()
  })

  it('wraps from the first element to the last with Shift+Tab', () => {
    render(<Trap />)
    press('Tab', true)
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('wraps from the container to the last element with Shift+Tab', () => {
    render(<Trap />)
    screen.getByTestId('trap').focus()
    press('Tab', true)
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('leaves the browser to move the focus between elements inside', () => {
    render(<Trap />)
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    screen.getByText('first').dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('brings the focus back inside when it is outside', () => {
    render(<Trap />)
    screen.getByText('after').focus()
    press('Tab')
    expect(screen.getByText('first')).toHaveFocus()
  })

  it('keeps the focus on the container when there is nothing to tab to', () => {
    render(<Trap empty />)
    screen.getByText('after').focus()
    press('Tab')
    expect(screen.getByTestId('trap')).toHaveFocus()
  })

  it('ignores other keys', () => {
    render(<Trap />)
    screen.getByText('last').focus()
    press('Enter')
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('restores the focus to the previously focused element when it deactivates', () => {
    function Host(): React.ReactNode {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen((value) => !value)}>toggle</button>
          {open ? <Trap /> : null}
        </>
      )
    }
    render(<Host />)
    const toggle = screen.getByText('toggle')
    toggle.focus()
    fireEvent.click(toggle)
    expect(screen.getByText('first')).toHaveFocus()

    fireEvent.click(toggle)
    expect(toggle).toHaveFocus()
  })

  it('returns the focus to the given element, such as a trigger that was not focused by the click', () => {
    function Host(): React.ReactNode {
      const [open, setOpen] = useState(false)
      const [trigger, setTrigger] = useState<HTMLElement | null>(null)
      return (
        <>
          <button onClick={() => setOpen((value) => !value)} ref={setTrigger}>
            toggle
          </button>
          {open ? <Trap returnFocus={trigger} /> : null}
        </>
      )
    }
    render(<Host />)
    const toggle = screen.getByText('toggle')
    fireEvent.click(toggle)
    expect(screen.getByText('first')).toHaveFocus()

    fireEvent.click(toggle)
    expect(toggle).toHaveFocus()
  })

  it('does not restore the focus when asked not to', () => {
    const { rerender } = render(
      <>
        <button>origin</button>
        <Trap restoreFocus={false} />
      </>,
    )
    expect(screen.getByText('first')).toHaveFocus()
    rerender(
      <>
        <button>origin</button>
        <Trap active={false} restoreFocus={false} />
      </>,
    )
    expect(screen.getByText('origin')).not.toHaveFocus()
  })

  it('does nothing while inactive', () => {
    render(<Trap active={false} />)
    expect(screen.getByText('first')).not.toHaveFocus()
    screen.getByText('last').focus()
    press('Tab')
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('leaves the trapping to the topmost layer', () => {
    render(<Trap isTopmost={() => false} />)
    screen.getByText('last').focus()
    press('Tab')
    expect(screen.getByText('last')).toHaveFocus()
  })
})

describe('getTabbableElements', () => {
  const build = (html: string): HTMLElement => {
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    return container
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns the elements that can receive focus with the keyboard, in order', () => {
    const container = build(
      '<a href="#">link</a><button>button</button><input /><select></select><textarea></textarea><div tabindex="0">custom</div>',
    )
    expect(getTabbableElements(container).map((element) => element.tagName)).toEqual([
      'A',
      'BUTTON',
      'INPUT',
      'SELECT',
      'TEXTAREA',
      'DIV',
    ])
  })

  it('skips disabled, hidden, inert and out of the tab order elements', () => {
    const container = build(`
      <button disabled>disabled</button>
      <button tabindex="-1">negative</button>
      <input type="hidden" />
      <div hidden><button>in hidden</button></div>
      <div inert><button>in inert</button></div>
      <button style="display: none">display none</button>
      <button style="visibility: hidden">visibility hidden</button>
      <a>no href</a>
      <button>visible</button>
    `)
    expect(getTabbableElements(container).map((element) => element.textContent)).toEqual(['visible'])
  })
})
