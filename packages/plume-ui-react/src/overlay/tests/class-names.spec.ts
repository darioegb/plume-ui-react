import { joinClasses } from '../class-names'

describe('joinClasses', () => {
  it('joins the names that are set', () => {
    expect(joinClasses('a', false, 'b', null, undefined, '')).toBe('a b')
  })

  it('returns undefined when there is none', () => {
    expect(joinClasses(false, '', undefined)).toBeUndefined()
  })
})
