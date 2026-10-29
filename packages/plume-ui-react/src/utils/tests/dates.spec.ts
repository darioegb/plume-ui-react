import { getMonthsByLanguage } from '../dates'

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

describe('getMonthsByLanguage', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it.each([
    ['the 29th', new Date(2026, 9, 29)],
    ['the 30th', new Date(2026, 0, 30)],
    ['the 31st', new Date(2026, 0, 31)],
  ])('lists the twelve months on %s, when a month is shorter than the day', (_, today) => {
    vi.useFakeTimers()
    vi.setSystemTime(today)

    expect(getMonthsByLanguage('en')).toEqual(ENGLISH_MONTHS)
  })

  it('names the months in another language', () => {
    expect(getMonthsByLanguage('es')[1]).toBe('Febrero')
  })
})
