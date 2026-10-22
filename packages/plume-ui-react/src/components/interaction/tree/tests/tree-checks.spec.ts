import {
  checkStateOf,
  expandChecked,
  readStructure,
  toggleChecked,
  type TreeStructure,
} from '../tree-checks'

const structure: TreeStructure = {
  admin: [
    { disabled: false, value: 'users' },
    { disabled: false, value: 'read' },
    { disabled: false, value: 'write' },
    { disabled: false, value: 'delete' },
  ],
  users: [
    { disabled: false, value: 'read' },
    { disabled: false, value: 'write' },
    { disabled: false, value: 'delete' },
  ],
}

describe('expandChecked', () => {
  it('keeps the list when it does not cascade', () => {
    expect([...expandChecked(['users'], structure, false)]).toEqual(['users'])
  })

  it('adds every descendant of a checked branch', () => {
    expect([...expandChecked(['users'], structure, true)].sort()).toEqual([
      'delete',
      'read',
      'users',
      'write',
    ])
  })

  it('adds the descendants of a branch inside a branch', () => {
    expect(expandChecked(['admin'], structure, true).has('write')).toBe(true)
  })

  it('leaves a leaf as it is', () => {
    expect([...expandChecked(['read'], structure, true)]).toEqual(['read'])
  })
})

describe('checkStateOf', () => {
  it('is whether the value is checked for a leaf', () => {
    expect(checkStateOf('read', new Set(['read']), structure, true)).toBe(true)
    expect(checkStateOf('read', new Set(), structure, true)).toBe(false)
  })

  it('is checked when all the descendants are', () => {
    expect(checkStateOf('users', new Set(['read', 'write', 'delete']), structure, true)).toBe(true)
  })

  it('is unchecked when none is', () => {
    expect(checkStateOf('users', new Set(['other']), structure, true)).toBe(false)
  })

  it('is mixed when some are', () => {
    expect(checkStateOf('users', new Set(['read']), structure, true)).toBe('mixed')
  })

  it('does not look at the descendants without cascade', () => {
    expect(checkStateOf('users', new Set(['read']), structure, false)).toBe(false)
    expect(checkStateOf('users', new Set(['users']), structure, false)).toBe(true)
  })

  it('treats a branch without descendants as a leaf', () => {
    expect(checkStateOf('empty', new Set(['empty']), { empty: [] }, true)).toBe(true)
  })
})

describe('toggleChecked', () => {
  it('checks a leaf, and its parent when it completes the branch', () => {
    const result = toggleChecked('delete', new Set(['read', 'write']), structure, true)
    expect(result.sort()).toEqual(['admin', 'delete', 'read', 'users', 'write'])
  })

  it('unchecks a leaf and the branches that are no longer complete', () => {
    const all = new Set(['admin', 'users', 'read', 'write', 'delete'])
    expect(toggleChecked('write', all, structure, true).sort()).toEqual(['delete', 'read'])
  })

  it('checks a branch and everything under it', () => {
    expect(toggleChecked('users', new Set(), structure, true).sort()).toEqual([
      'admin',
      'delete',
      'read',
      'users',
      'write',
    ])
  })

  it('unchecks a branch and everything under it when it is checked', () => {
    const all = new Set(['admin', 'users', 'read', 'write', 'delete'])
    expect(toggleChecked('users', all, structure, true)).toEqual([])
  })

  it('checks everything when the branch is mixed', () => {
    expect(toggleChecked('users', new Set(['read']), structure, true).sort()).toContain('delete')
  })

  it('does not change the descendants that are disabled', () => {
    const locked: TreeStructure = {
      group: [
        { disabled: true, value: 'fixed' },
        { disabled: false, value: 'free' },
      ],
    }
    const checked = toggleChecked('group', new Set(), locked, true)
    expect(checked).toContain('free')
    expect(checked).not.toContain('fixed')
    expect(checked).not.toContain('group')
    const cleared = toggleChecked('group', new Set(['fixed', 'free', 'group']), locked, true)
    expect(cleared).toEqual(['fixed'])
  })

  it('can uncheck a branch that has a disabled item that is not checked', () => {
    const locked: TreeStructure = {
      group: [
        { disabled: true, value: 'fixed' },
        { disabled: false, value: 'free' },
      ],
    }
    const checked = toggleChecked('group', new Set(['free']), locked, true)
    expect(checked).toEqual([])
  })

  it('toggles only the value without cascade', () => {
    expect(toggleChecked('users', new Set(), structure, false)).toEqual(['users'])
    expect(toggleChecked('users', new Set(['users', 'read']), structure, false)).toEqual(['read'])
  })
})

describe('readStructure', () => {
  const build = (): HTMLElement => {
    const root = document.createElement('div')
    root.innerHTML = `
      <div><div role="treeitem" data-plume-tree-value="a"></div>
        <div role="group">
          <div><div role="treeitem" data-plume-tree-value="b"></div></div>
          <div><div role="treeitem" data-plume-tree-value="c" aria-disabled="true"></div></div>
        </div>
      </div>
      <div><div role="treeitem" data-plume-tree-value="d"></div></div>`
    return root
  }

  it('lists the descendants of every item that has a group', () => {
    expect(readStructure(build())).toEqual({
      a: [
        { disabled: false, value: 'b' },
        { disabled: true, value: 'c' },
      ],
    })
  })

  it('is empty without a root', () => {
    expect(readStructure(null)).toEqual({})
  })
})
