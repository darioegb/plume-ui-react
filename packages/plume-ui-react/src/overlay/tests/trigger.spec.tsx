import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { cloneWithProps, mergeRefs } from '../trigger'

describe('mergeRefs', () => {
  it('sets function and object refs, and ignores a missing one', () => {
    const fn = vi.fn()
    const object = createRef<HTMLDivElement>()
    const merged = mergeRefs<HTMLDivElement>(fn, object, undefined)
    const node = document.createElement('div')

    merged(node)
    expect(fn).toHaveBeenCalledWith(node)
    expect(object.current).toBe(node)

    merged(null)
    expect(fn).toHaveBeenLastCalledWith(null)
    expect(object.current).toBeNull()
  })
})

describe('cloneWithProps', () => {
  it('adds props and merges the refs, the one of the element included', () => {
    const own = createRef<HTMLButtonElement>()
    const added = createRef<HTMLButtonElement>()
    render(cloneWithProps(<button ref={own}>Open</button>, { 'aria-haspopup': 'dialog' }, added))
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(own.current).toBe(button)
    expect(added.current).toBe(button)
  })

  it('calls the handler of the element and then the injected one', () => {
    const calls: string[] = []
    render(
      cloneWithProps(<button onClick={() => calls.push('own')}>Open</button>, {
        onClick: () => calls.push('added'),
      }),
    )
    fireEvent.click(screen.getByRole('button'))
    expect(calls).toEqual(['own', 'added'])
  })

  it('skips the injected handler when the one of the element prevents the default', () => {
    const added = vi.fn()
    render(
      cloneWithProps(<button onClick={(event) => event.preventDefault()}>Open</button>, {
        onClick: added,
      }),
    )
    fireEvent.click(screen.getByRole('button'))
    expect(added).not.toHaveBeenCalled()
  })

  it('keeps the props of the element that are not injected', () => {
    render(cloneWithProps(<button className="mine">Open</button>, { 'aria-expanded': false }))
    expect(screen.getByRole('button')).toHaveClass('mine')
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })
})
