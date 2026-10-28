import { readdirSync } from 'node:fs'
import path from 'node:path'
import { buildCssUnits } from '../../scripts/component-css'

const srcDir = path.join(__dirname, '..')

describe('css of each component', () => {
  it('has one unit for every folder of components with CSS modules', async () => {
    const units = await buildCssUnits(srcDir)
    const folders = ['form', 'interaction', 'navigation', 'overlay', 'presentation', 'utility']
      .flatMap((category) => {
        const dir = path.join(srcDir, 'components', category)
        return readdirSync(dir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory() && entry.name !== 'shared')
          .map((entry) => ({ name: entry.name, dir: path.join(dir, entry.name) }))
      })
      .filter(({ dir }) => readdirSync(dir).some((file) => file.endsWith('.module.css')))
    for (const { name } of folders) expect(Object.keys(units)).toContain(name)
    expect(Object.keys(units)).toEqual(
      expect.arrayContaining(['tag', 'picker-panel', 'picker-trigger']),
    )
  })

  it('brings the CSS of the components a component renders', async () => {
    const units = await buildCssUnits(srcDir)
    expect(units.button.imports).toEqual(['spinner'])
    expect(units.datepicker.imports).toEqual(
      expect.arrayContaining(['button', 'input', 'picker-panel', 'picker-trigger']),
    )
    expect(units.paginator.imports).toEqual(expect.arrayContaining(['button', 'select', 'chip']))
    expect(units.select.imports).toEqual(expect.arrayContaining(['chip', 'tag']))
    expect(units.drawer.imports).toEqual(['modal'])
    expect(units.alert.imports).toEqual(['tag'])
    expect(units.table.imports).toEqual(expect.arrayContaining(['emptystate', 'spinner']))
  })

  it('does not drag the whole library into a leaf component', async () => {
    const units = await buildCssUnits(srcDir)
    expect(units.tooltip.imports).toEqual([])
    expect(units.skeleton.imports).toEqual([])
    expect(units.checkbox.imports).toEqual([])
  })

  it('never imports itself', async () => {
    const units = await buildCssUnits(srcDir)
    for (const [name, unit] of Object.entries(units)) expect(unit.imports).not.toContain(name)
  })
})
