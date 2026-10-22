import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { Tree, TreeItem, TreeItemGroup, TreeItemLabel } from '..'
import type { TreeProps } from '..'

function Files(props: Readonly<Partial<TreeProps>>) {
  return (
    <Tree aria-label="Files" {...(props as TreeProps)}>
      <TreeItem value="docs">
        <TreeItemLabel>Documents</TreeItemLabel>
        <TreeItemGroup>
          <TreeItem value="alpha">
            <TreeItemLabel>Alpha</TreeItemLabel>
          </TreeItem>
          <TreeItem value="beta">
            <TreeItemLabel>Beta</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="bravo">
                <TreeItemLabel>Bravo</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
      <TreeItem value="pictures">
        <TreeItemLabel>Pictures</TreeItemLabel>
      </TreeItem>
      <TreeItem disabled value="music">
        <TreeItemLabel>Music</TreeItemLabel>
      </TreeItem>
      <TreeItem value="videos">
        <TreeItemLabel>Videos</TreeItemLabel>
      </TreeItem>
    </Tree>
  )
}

const item = (value: string): HTMLElement =>
  document.querySelector(`[data-plume-tree-value="${value}"]`) as HTMLElement

const label = (value: string): HTMLElement =>
  item(value).querySelector('[data-plume-tree-label]') as HTMLElement

const group = (value: string): HTMLElement | null => {
  const next = item(value).nextElementSibling
  return next?.getAttribute('role') === 'group' ? (next as HTMLElement) : null
}

const isOpen = (value: string): boolean => group(value)?.hasAttribute('data-open') ?? false

const tabStops = (): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="treeitem"]'))
    .filter((node) => node.tabIndex === 0)
    .map((node) => node.dataset.plumeTreeValue ?? '')

describe('Tree component', () => {
  describe('structure', () => {
    it('is a tree with the name of the user', () => {
      render(<Files />)
      expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument()
    })

    it('can be named by another element', () => {
      render(
        <>
          <h2 id="title">Project</h2>
          <Files aria-label={undefined} aria-labelledby="title" />
        </>,
      )
      expect(screen.getByRole('tree', { name: 'Project' })).toBeInTheDocument()
    })

    it('has a treeitem for every node, named by its label', () => {
      render(<Files />)
      expect(screen.getByRole('treeitem', { name: 'Documents' })).toBeInTheDocument()
      expect(screen.getByRole('treeitem', { name: 'Pictures' })).toBeInTheDocument()
      expect(screen.getByRole('treeitem', { name: 'Bravo' })).toBeInTheDocument()
    })

    it('names an item with its own label and not with the text of its children', () => {
      render(<Files defaultExpanded={['docs']} />)
      expect(item('docs')).toHaveAccessibleName('Documents')
    })

    it('lets aria-label of an item replace its label', () => {
      render(
        <Tree aria-label="Files">
          <TreeItem aria-label="Custom" value="a">
            <TreeItemLabel>Alpha</TreeItemLabel>
          </TreeItem>
        </Tree>,
      )
      expect(screen.getByRole('treeitem', { name: 'Custom' })).toBeInTheDocument()
    })

    it('puts the children of an item in a group that the item owns', () => {
      render(<Files />)
      expect(group('docs')).toBeInTheDocument()
      expect(item('docs')).toHaveAttribute('aria-owns', group('docs')?.id)
      expect(group('pictures')).toBeNull()
      expect(item('pictures')).not.toHaveAttribute('aria-owns')
    })

    it('names the item with its label even though it owns its children', () => {
      render(<Files defaultExpanded={['docs']} />)
      expect(item('docs')).toHaveAccessibleName('Documents')
    })

    it('keeps the children out of the item, so its text is only its label', () => {
      render(<Files defaultExpanded={['docs']} />)
      expect(item('docs')).toHaveTextContent(/^Documents$/)
      expect(item('docs')).not.toContainElement(item('alpha'))
    })

    it('gives every item its level', () => {
      render(<Files />)
      expect(item('docs')).toHaveAttribute('aria-level', '1')
      expect(item('beta')).toHaveAttribute('aria-level', '2')
      expect(item('bravo')).toHaveAttribute('aria-level', '3')
    })

    it('has aria-expanded only on the items with children', () => {
      render(<Files />)
      expect(item('docs')).toHaveAttribute('aria-expanded', 'false')
      expect(item('pictures')).not.toHaveAttribute('aria-expanded')
    })

    it('marks a disabled item', () => {
      render(<Files />)
      expect(item('music')).toHaveAttribute('aria-disabled', 'true')
      expect(item('music')).toHaveAttribute('tabindex', '-1')
    })

    it('forwards the ref, the id and the title', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Tree aria-label="Files" id="files" ref={ref} title="Files">
          <TreeItem value="a">
            <TreeItemLabel>Alpha</TreeItemLabel>
          </TreeItem>
        </Tree>,
      )
      expect(ref.current).toBe(screen.getByRole('tree'))
      expect(ref.current).toHaveAttribute('id', 'files')
      expect(ref.current).toHaveAttribute('title', 'Files')
    })

    it('forwards the ref and the attributes of an item and its parts', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Tree aria-label="Files">
          <TreeItem id="item" ref={ref} title="Item" value="a">
            <TreeItemLabel title="Label">Alpha</TreeItemLabel>
            <TreeItemGroup title="Children">
              <TreeItem value="b">
                <TreeItemLabel>Beta</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </Tree>,
      )
      expect(ref.current).toBe(item('a'))
      expect(item('a')).toHaveAttribute('id', 'item')
      expect(label('a')).toHaveAttribute('title', 'Label')
      expect(group('a')).toHaveAttribute('title', 'Children')
    })

    it('throws when a part is used outside its parent', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      expect(() =>
        render(
          <TreeItem value="a">
            <TreeItemLabel>Alpha</TreeItemLabel>
          </TreeItem>,
        ),
      ).toThrow('TreeItem must be used within a <Tree>')
      expect(() => render(<TreeItemLabel>Alpha</TreeItemLabel>)).toThrow(
        'TreeItemLabel must be used within a <Tree>',
      )
      expect(() => render(<TreeItemGroup>x</TreeItemGroup>)).toThrow(
        'TreeItemGroup must be used within a <TreeItem>',
      )
      spy.mockRestore()
    })
  })

  describe('expanding', () => {
    it('is collapsed by default and opens with defaultExpanded', () => {
      render(<Files defaultExpanded={['docs']} />)
      expect(isOpen('docs')).toBe(true)
      expect(item('docs')).toHaveAttribute('aria-expanded', 'true')
      expect(isOpen('beta')).toBe(false)
    })

    it('opens and closes an item when it is pressed', async () => {
      render(<Files />)
      await userEvent.click(label('docs'))
      expect(isOpen('docs')).toBe(true)
      await userEvent.click(label('docs'))
      expect(isOpen('docs')).toBe(false)
    })

    it('does not open the parent when a child is pressed', async () => {
      render(<Files defaultExpanded={['docs']} />)
      await userEvent.click(label('alpha'))
      expect(isOpen('docs')).toBe(true)
    })

    it('reports the open items', async () => {
      const onExpandedChange = vi.fn()
      render(<Files onExpandedChange={onExpandedChange} />)
      await userEvent.click(label('docs'))
      expect(onExpandedChange).toHaveBeenLastCalledWith(['docs'])
      await userEvent.click(label('docs'))
      expect(onExpandedChange).toHaveBeenLastCalledWith([])
    })

    it('follows expanded when it is controlled', async () => {
      const onExpandedChange = vi.fn()
      render(<Files expanded={[]} onExpandedChange={onExpandedChange} />)
      await userEvent.click(label('docs'))
      expect(onExpandedChange).toHaveBeenCalledWith(['docs'])
      expect(isOpen('docs')).toBe(false)
    })

    it('opens with ArrowRight, and goes to the first child when it is open', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(isOpen('docs')).toBe(true)
      expect(item('docs')).toHaveFocus()
      await userEvent.keyboard('{ArrowRight}')
      expect(item('alpha')).toHaveFocus()
    })

    it('does nothing on ArrowRight of a leaf', async () => {
      render(<Files />)
      item('pictures').focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(item('pictures')).toHaveFocus()
    })

    it('closes with ArrowLeft, and goes to the parent when it is closed or a leaf', async () => {
      render(<Files defaultExpanded={['docs']} />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(isOpen('docs')).toBe(false)
      await userEvent.keyboard('{ArrowRight}{ArrowRight}')
      expect(item('alpha')).toHaveFocus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(item('docs')).toHaveFocus()
    })

    it('stays on a root item that is closed with ArrowLeft', async () => {
      render(<Files />)
      item('pictures').focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(item('pictures')).toHaveFocus()
    })
  })

  describe('selection', () => {
    it('selects the item that is pressed and reports it', async () => {
      const onValueChange = vi.fn()
      render(<Files onValueChange={onValueChange} />)
      await userEvent.click(label('pictures'))
      expect(onValueChange).toHaveBeenCalledWith('pictures')
      expect(item('pictures')).toHaveAttribute('aria-selected', 'true')
      expect(item('videos')).toHaveAttribute('aria-selected', 'false')
    })

    it('replaces the selection in single mode', async () => {
      render(<Files />)
      await userEvent.click(label('pictures'))
      await userEvent.click(label('videos'))
      expect(item('pictures')).toHaveAttribute('aria-selected', 'false')
      expect(item('videos')).toHaveAttribute('aria-selected', 'true')
    })

    it('does not report the item that is already selected', async () => {
      const onValueChange = vi.fn()
      render(<Files defaultValue="pictures" onValueChange={onValueChange} />)
      await userEvent.click(label('pictures'))
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('starts with defaultValue', () => {
      render(<Files defaultValue="videos" />)
      expect(item('videos')).toHaveAttribute('aria-selected', 'true')
    })

    it('follows value when it is controlled', async () => {
      const onValueChange = vi.fn()
      render(<Files onValueChange={onValueChange} value="pictures" />)
      await userEvent.click(label('videos'))
      expect(onValueChange).toHaveBeenCalledWith('videos')
      expect(item('pictures')).toHaveAttribute('aria-selected', 'true')
      expect(item('videos')).toHaveAttribute('aria-selected', 'false')
    })

    it('selects a parent and opens it in one press', async () => {
      render(<Files />)
      await userEvent.click(label('docs'))
      expect(item('docs')).toHaveAttribute('aria-selected', 'true')
      expect(isOpen('docs')).toBe(true)
    })

    it('selects several items in multiple mode', async () => {
      const onValueChange = vi.fn()
      render(<Files onValueChange={onValueChange} selection="multiple" />)
      await userEvent.click(label('pictures'))
      await userEvent.click(label('videos'))
      expect(onValueChange).toHaveBeenLastCalledWith(['pictures', 'videos'])
      await userEvent.click(label('pictures'))
      expect(onValueChange).toHaveBeenLastCalledWith(['videos'])
      expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true')
    })

    it('is not multiselectable by default', () => {
      render(<Files />)
      expect(screen.getByRole('tree')).not.toHaveAttribute('aria-multiselectable')
    })

    it('has no selection with none, and does not mark the items', async () => {
      const onValueChange = vi.fn()
      render(<Files onValueChange={onValueChange} selection="none" />)
      await userEvent.click(label('pictures'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(item('pictures')).not.toHaveAttribute('aria-selected')
    })

    it('still opens a parent with selection none', async () => {
      render(<Files selection="none" />)
      await userEvent.click(label('docs'))
      expect(isOpen('docs')).toBe(true)
    })

    it('does not select or open a disabled item', async () => {
      const onValueChange = vi.fn()
      render(<Files onValueChange={onValueChange} />)
      await userEvent.click(label('music'))
      expect(onValueChange).not.toHaveBeenCalled()
      expect(item('music')).toHaveAttribute('aria-selected', 'false')
    })

    it('selects with Space and with Enter', async () => {
      render(<Files />)
      item('pictures').focus()
      await userEvent.keyboard(' ')
      expect(item('pictures')).toHaveAttribute('aria-selected', 'true')
      await userEvent.keyboard('{ArrowDown}{Enter}')
      expect(item('videos')).toHaveAttribute('aria-selected', 'true')
    })

    it('opens a parent with Enter but not with Space', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard(' ')
      expect(isOpen('docs')).toBe(false)
      await userEvent.keyboard('{Enter}')
      expect(isOpen('docs')).toBe(true)
    })
  })

  describe('keyboard', () => {
    it('moves between the visible items with ArrowDown and ArrowUp', async () => {
      render(<Files defaultExpanded={['docs']} />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('alpha')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
      expect(item('pictures')).toHaveFocus()
      await userEvent.keyboard('{ArrowUp}')
      expect(item('beta')).toHaveFocus()
    })

    it('skips the items of a closed group and the disabled ones', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('pictures')).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('videos')).toHaveFocus()
    })

    it('stays on the first and the last item at the ends', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowUp}')
      expect(item('docs')).toHaveFocus()
      await userEvent.keyboard('{End}{ArrowDown}')
      expect(item('videos')).toHaveFocus()
    })

    it('goes to the first and the last visible item with Home and End', async () => {
      render(<Files />)
      item('pictures').focus()
      await userEvent.keyboard('{End}')
      expect(item('videos')).toHaveFocus()
      await userEvent.keyboard('{Home}')
      expect(item('docs')).toHaveFocus()
    })

    it('jumps to the item that starts with the typed letters', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('v')
      expect(item('videos')).toHaveFocus()
    })

    it('jumps to the item that starts with the letter, from the top', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('p')
      expect(item('pictures')).toHaveFocus()
    })

    it('matches several typed letters together', async () => {
      render(<Files defaultExpanded={['docs', 'beta']} />)
      item('docs').focus()
      await userEvent.keyboard('br')
      expect(item('bravo')).toHaveFocus()
    })

    it('forgets the typed letters after a pause', () => {
      vi.useFakeTimers()
      render(<Files defaultExpanded={['docs']} />)
      item('docs').focus()
      act(() => {
        item('docs').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'b' }))
      })
      expect(item('beta')).toHaveFocus()
      act(() => {
        vi.advanceTimersByTime(600)
      })
      act(() => {
        item('beta').dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }))
      })
      expect(item('alpha')).toHaveFocus()
      vi.useRealTimers()
    })

    it('ignores the keys that do nothing and the ones with a modifier', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('{Control>}v{/Control}')
      expect(item('docs')).toHaveFocus()
      await userEvent.keyboard('{Shift}')
      expect(item('docs')).toHaveFocus()
    })

    it('does not let a key of a child act on its ancestors', async () => {
      render(<Files defaultExpanded={['docs']} />)
      item('alpha').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(item('beta')).toHaveFocus()
      expect(isOpen('docs')).toBe(true)
    })

    it('does nothing on the keys of a disabled item', async () => {
      render(<Files />)
      item('music').focus()
      await userEvent.keyboard('{Enter}')
      expect(item('music')).toHaveAttribute('aria-selected', 'false')
    })
  })

  describe('focus', () => {
    it('makes only one item reachable with Tab', () => {
      render(<Files />)
      expect(tabStops()).toEqual(['docs'])
    })

    it('makes the selected item the one that Tab reaches', () => {
      render(<Files defaultValue="pictures" />)
      expect(tabStops()).toEqual(['pictures'])
    })

    it('moves the tab stop with the focus', async () => {
      render(<Files />)
      item('docs').focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(tabStops()).toEqual(['pictures'])
    })

    it('moves the tab stop to a visible item when its item gets hidden', async () => {
      render(<Files defaultExpanded={['docs']} />)
      act(() => item('alpha').focus())
      expect(tabStops()).toEqual(['alpha'])
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      expect(item('docs')).toHaveFocus()
      expect(tabStops()).toEqual(['docs'])
    })

    it('falls back to the first visible item when the active one is gone', async () => {
      function Collapsing() {
        const [open, setOpen] = useState(['docs'])
        return (
          <>
            <button onClick={() => setOpen([])} type="button">
              Close
            </button>
            <Files expanded={open} onExpandedChange={setOpen} />
          </>
        )
      }
      render(<Collapsing />)
      act(() => item('alpha').focus())
      await userEvent.click(screen.getByRole('button', { name: 'Close' }))
      expect(tabStops()).toEqual(['docs'])
    })

    it('can be reached with the keyboard', async () => {
      render(<Files />)
      await userEvent.tab()
      expect(item('docs')).toHaveFocus()
    })

    it('has no tab stop when there are no items', () => {
      render(<Tree aria-label="Empty" />)
      expect(tabStops()).toEqual([])
    })
  })

  describe('appearance', () => {
    it('is solid and medium by default', () => {
      render(<Files />)
      expect(screen.getByRole('tree')).toHaveClass('tree', 'solid', 'md')
      expect(item('docs')).toHaveClass('item')
      expect(label('docs')).toHaveClass('label')
    })

    it.each(['accent', 'ghost', 'solid'] as const)('applies the %s variant', (variant) => {
      render(<Files variant={variant} />)
      expect(screen.getByRole('tree')).toHaveClass(variant)
    })

    it('applies the size', () => {
      render(<Files size="lg" />)
      expect(screen.getByRole('tree')).toHaveClass('lg')
    })

    it('exposes the color scheme as CSS variables and lets style override them', () => {
      render(
        <Files colorScheme="success" style={{ '--tree-tint': 'red' } as React.CSSProperties} />,
      )
      const tree = screen.getByRole('tree')
      expect(tree.style.getPropertyValue('--tree-solid')).toBe('var(--plume-color-success-solid)')
      expect(tree.style.getPropertyValue('--tree-tint')).toBe('red')
    })

    it('gives every item its level as a CSS variable', () => {
      render(<Files />)
      expect(item('docs').style.getPropertyValue('--tree-level')).toBe('1')
      expect(item('bravo').style.getPropertyValue('--tree-level')).toBe('3')
    })

    it('shows the chevron only on the items with children', () => {
      render(<Files />)
      expect(item('docs').querySelector('[data-plume-tree-chevron] svg')).toBeInTheDocument()
      expect(item('pictures').querySelector('[data-plume-tree-chevron] svg')).toBeNull()
      expect(item('pictures').querySelector('[data-plume-tree-chevron]')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('shows the icon of a label and hides it from assistive technology', () => {
      render(
        <Tree aria-label="Files">
          <TreeItem value="a">
            <TreeItemLabel icon={<svg data-testid="icon" />}>Alpha</TreeItemLabel>
          </TreeItem>
        </Tree>,
      )
      expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true')
    })

    it('adds the classes of the user to the tree and its parts', () => {
      render(
        <Tree aria-label="Files" className="root">
          <TreeItem className="row" value="a">
            <TreeItemLabel className="text">Alpha</TreeItemLabel>
            <TreeItemGroup className="children">
              <TreeItem value="b">
                <TreeItemLabel>Beta</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </Tree>,
      )
      expect(screen.getByRole('tree')).toHaveClass('tree', 'root')
      expect(item('a')).toHaveClass('item', 'row')
      expect(label('a')).toHaveClass('label', 'text')
      expect(group('a')).toHaveClass('children')
    })

    it('drops every Plume class when it is unstyled and keeps the user ones', () => {
      render(
        <Tree aria-label="Files" className="root" variant="unstyled">
          <TreeItem className="row" value="a">
            <TreeItemLabel className="text" icon={<svg />}>
              Alpha
            </TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="b">
                <TreeItemLabel>Beta</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </Tree>,
      )
      expect(screen.getByRole('tree')).toHaveAttribute('class', 'root')
      expect(item('a')).toHaveAttribute('class', 'row')
      expect(label('a')).toHaveAttribute('class', 'text')
      expect(item('b')).not.toHaveAttribute('class')
      expect(item('a').querySelector('[data-plume-tree-chevron]')).not.toHaveAttribute('class')
    })

    it('exposes the state of an item for styling', async () => {
      render(<Files />)
      await userEvent.click(label('docs'))
      expect(item('docs')).toHaveAttribute('data-expanded')
      expect(item('docs')).toHaveAttribute('data-selected')
      expect(item('pictures')).not.toHaveAttribute('data-selected')
    })
  })

  describe('checkbox selection', () => {
    function Permissions(props: Readonly<Partial<TreeProps>>) {
      return (
        <Tree
          aria-label="Permissions"
          defaultExpanded={['users', 'billing']}
          {...({ selection: 'checkbox', ...props } as TreeProps)}
        >
          <TreeItem value="users">
            <TreeItemLabel>Users</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="read">
                <TreeItemLabel>Read</TreeItemLabel>
              </TreeItem>
              <TreeItem value="write">
                <TreeItemLabel>Write</TreeItemLabel>
              </TreeItem>
              <TreeItem disabled value="delete">
                <TreeItemLabel>Delete</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
          <TreeItem value="billing">
            <TreeItemLabel>Billing</TreeItemLabel>
            <TreeItemGroup>
              <TreeItem value="invoices">
                <TreeItemLabel>Invoices</TreeItemLabel>
              </TreeItem>
            </TreeItemGroup>
          </TreeItem>
        </Tree>
      )
    }

    const checked = (value: string): string | null => item(value).getAttribute('aria-checked')

    it('uses aria-checked on every item and not aria-selected', () => {
      render(<Permissions />)
      expect(checked('users')).toBe('false')
      expect(checked('read')).toBe('false')
      expect(item('read')).not.toHaveAttribute('aria-selected')
      expect(screen.getByRole('tree')).not.toHaveAttribute('aria-multiselectable')
    })

    it('shows a checkbox that is hidden from assistive technology', () => {
      render(<Permissions defaultValue={['read']} />)
      const box = item('read').querySelector('[data-plume-tree-checkbox]')
      expect(box).toHaveAttribute('aria-hidden', 'true')
      expect(box).toHaveAttribute('data-state', 'checked')
      expect(item('write').querySelector('[data-plume-tree-checkbox]')).toHaveAttribute(
        'data-state',
        'unchecked',
      )
    })

    it('checks and unchecks an item and reports the list', async () => {
      const onValueChange = vi.fn()
      render(<Permissions onValueChange={onValueChange} />)
      await userEvent.click(label('read'))
      expect(checked('read')).toBe('true')
      expect(onValueChange).toHaveBeenLastCalledWith(['read'])
      await userEvent.click(label('read'))
      expect(checked('read')).toBe('false')
      expect(onValueChange).toHaveBeenLastCalledWith([])
    })

    it('checks every enabled item under a branch, and the branch', async () => {
      const onValueChange = vi.fn()
      render(<Permissions onValueChange={onValueChange} />)
      await userEvent.click(label('users'))
      expect(checked('read')).toBe('true')
      expect(checked('write')).toBe('true')
      expect(checked('delete')).toBe('false')
      expect(checked('users')).toBe('mixed')
      expect(onValueChange).toHaveBeenLastCalledWith(['read', 'write'])
    })

    it('is mixed while only some items are checked, and checked when all are', async () => {
      render(<Permissions defaultValue={['delete']} />)
      await userEvent.click(label('read'))
      expect(checked('users')).toBe('mixed')
      await userEvent.click(label('write'))
      expect(checked('users')).toBe('true')
      expect(item('users').querySelector('[data-plume-tree-checkbox]')).toHaveAttribute(
        'data-state',
        'checked',
      )
    })

    it('shows the mixed state with its own icon', async () => {
      render(<Permissions />)
      await userEvent.click(label('read'))
      expect(item('users').querySelector('[data-plume-tree-checkbox]')).toHaveAttribute(
        'data-state',
        'mixed',
      )
      expect(item('users').querySelector('[data-plume-tree-checkbox] svg')).toBeInTheDocument()
    })

    it('puts a branch in the list only when everything under it is checked', async () => {
      const onValueChange = vi.fn()
      render(<Permissions defaultValue={['delete']} onValueChange={onValueChange} />)
      await userEvent.click(label('read'))
      expect(onValueChange).toHaveBeenLastCalledWith(['delete', 'read'])
      await userEvent.click(label('write'))
      expect(onValueChange).toHaveBeenLastCalledWith(['delete', 'read', 'write', 'users'])
      await userEvent.click(label('read'))
      expect(onValueChange).toHaveBeenLastCalledWith(['delete', 'write'])
    })

    it('unchecks everything under a checked branch except what is disabled', async () => {
      render(<Permissions defaultValue={['users']} />)
      expect(checked('users')).toBe('true')
      await userEvent.click(label('users'))
      expect(checked('read')).toBe('false')
      expect(checked('write')).toBe('false')
      expect(checked('delete')).toBe('true')
      expect(checked('users')).toBe('mixed')
    })

    it('unchecks a branch that is mixed only because of a disabled item', async () => {
      render(<Permissions defaultValue={['read', 'write']} />)
      expect(checked('users')).toBe('mixed')
      await userEvent.click(label('users'))
      expect(checked('read')).toBe('false')
      expect(checked('write')).toBe('false')
      expect(checked('users')).toBe('false')
    })

    it('treats a branch in the value as everything under it', () => {
      render(<Permissions defaultValue={['users']} />)
      expect(checked('read')).toBe('true')
      expect(checked('delete')).toBe('true')
    })

    it('derives a branch from the items under it', () => {
      render(<Permissions defaultValue={['read', 'write', 'delete']} />)
      expect(checked('users')).toBe('true')
      expect(checked('billing')).toBe('false')
    })

    it('follows value when it is controlled', async () => {
      const onValueChange = vi.fn()
      render(<Permissions onValueChange={onValueChange} value={['invoices']} />)
      expect(checked('billing')).toBe('true')
      await userEvent.click(label('read'))
      expect(onValueChange).toHaveBeenCalledWith(
        expect.arrayContaining(['invoices', 'billing', 'read']),
      )
      expect(checked('read')).toBe('false')
    })

    it('does not cascade when cascade is off', async () => {
      const onValueChange = vi.fn()
      render(<Permissions cascade={false} onValueChange={onValueChange} />)
      await userEvent.click(label('users'))
      expect(checked('users')).toBe('true')
      expect(checked('read')).toBe('false')
      expect(onValueChange).toHaveBeenLastCalledWith(['users'])
      await userEvent.click(label('read'))
      expect(checked('users')).toBe('true')
      expect(onValueChange).toHaveBeenLastCalledWith(['users', 'read'])
    })

    it('does not check a disabled item', async () => {
      const onValueChange = vi.fn()
      render(<Permissions onValueChange={onValueChange} />)
      await userEvent.click(label('delete'))
      expect(onValueChange).not.toHaveBeenCalled()
    })

    it('does not open or close a branch when it is checked from its label', async () => {
      render(<Permissions defaultExpanded={[]} />)
      await userEvent.click(label('users'))
      expect(isOpen('users')).toBe(false)
      expect(checked('users')).toBe('mixed')
    })

    it('opens and closes a branch from its chevron without checking it', async () => {
      render(<Permissions defaultExpanded={[]} />)
      const chevron = item('users').querySelector('[data-plume-tree-chevron]') as HTMLElement
      await userEvent.click(chevron)
      expect(isOpen('users')).toBe(true)
      expect(checked('users')).toBe('false')
      await userEvent.click(chevron)
      expect(isOpen('users')).toBe(false)
    })

    it('checks with Space and with Enter', async () => {
      render(<Permissions />)
      item('users').focus()
      await userEvent.keyboard('{ArrowDown} ')
      expect(checked('read')).toBe('true')
      await userEvent.keyboard('{ArrowDown}{Enter}')
      expect(checked('write')).toBe('true')
    })

    it('does not open a branch with Enter, only with the arrows', async () => {
      render(<Permissions defaultExpanded={[]} />)
      item('users').focus()
      await userEvent.keyboard('{Enter}')
      expect(isOpen('users')).toBe(false)
      await userEvent.keyboard('{ArrowRight}')
      expect(isOpen('users')).toBe(true)
    })

    it('updates a branch when an item is added under it', async () => {
      function Growing() {
        const [extra, setExtra] = useState(false)
        return (
          <>
            <button onClick={() => setExtra(true)} type="button">
              Add
            </button>
            <Tree
              aria-label="Permissions"
              defaultExpanded={['users']}
              defaultValue={['read']}
              selection="checkbox"
            >
              <TreeItem value="users">
                <TreeItemLabel>Users</TreeItemLabel>
                <TreeItemGroup>
                  <TreeItem value="read">
                    <TreeItemLabel>Read</TreeItemLabel>
                  </TreeItem>
                  {extra ? (
                    <TreeItem value="extra">
                      <TreeItemLabel>Extra</TreeItemLabel>
                    </TreeItem>
                  ) : null}
                </TreeItemGroup>
              </TreeItem>
            </Tree>
          </>
        )
      }
      render(<Growing />)
      expect(checked('users')).toBe('true')
      await userEvent.click(screen.getByRole('button', { name: 'Add' }))
      expect(checked('users')).toBe('mixed')
    })

    it('exposes the state for styling', async () => {
      render(<Permissions />)
      await userEvent.click(label('read'))
      expect(item('read')).toHaveAttribute('data-checked', 'true')
      expect(item('users')).toHaveAttribute('data-checked', 'mixed')
      expect(item('write')).toHaveAttribute('data-checked', 'false')
    })

    it('drops the Plume class of the checkbox when it is unstyled', () => {
      render(<Permissions variant="unstyled" />)
      expect(item('read').querySelector('[data-plume-tree-checkbox]')).not.toHaveAttribute('class')
    })

    it('shows no checkbox in the other modes', () => {
      render(<Files />)
      expect(document.querySelector('[data-plume-tree-checkbox]')).toBeNull()
      expect(item('docs')).not.toHaveAttribute('aria-checked')
    })
  })
})
