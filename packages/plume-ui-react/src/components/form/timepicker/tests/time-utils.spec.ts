import {
  displayTime,
  formatTime,
  fromTwelveHour,
  parseDisplayTime,
  parseTime,
  range,
  toTwelveHour,
} from '../time-utils'

const labels = { am: 'AM', pm: 'PM' }

describe('time-utils', () => {
  it('parses valid 24-hour times and rejects the rest', () => {
    expect(parseTime('09:05')).toEqual({ hours: 9, minutes: 5 })
    expect(parseTime('9:05')).toEqual({ hours: 9, minutes: 5 })
    expect(parseTime('24:00')).toBeNull()
    expect(parseTime('12:60')).toBeNull()
    expect(parseTime('noon')).toBeNull()
    expect(parseTime('')).toBeNull()
  })

  it('formats with leading zeros', () => {
    expect(formatTime({ hours: 7, minutes: 3 })).toBe('07:03')
  })

  it('converts between 24 and 12 hours', () => {
    expect(toTwelveHour(0)).toEqual({ hour: 12, period: 'am' })
    expect(toTwelveHour(12)).toEqual({ hour: 12, period: 'pm' })
    expect(toTwelveHour(15)).toEqual({ hour: 3, period: 'pm' })
    expect(fromTwelveHour(12, 'am')).toBe(0)
    expect(fromTwelveHour(12, 'pm')).toBe(12)
    expect(fromTwelveHour(3, 'pm')).toBe(15)
  })

  it('displays the value in the chosen clock', () => {
    expect(displayTime('15:30', false, labels)).toBe('15:30')
    expect(displayTime('15:30', true, labels)).toBe('03:30 PM')
    expect(displayTime('00:05', true, { am: 'a. m.', pm: 'p. m.' })).toBe('12:05 a. m.')
    expect(displayTime('', true, labels)).toBe('')
    expect(displayTime('nope', false, labels)).toBe('')
  })

  it('parses the typed text of both clocks', () => {
    expect(parseDisplayTime('9:30', false, labels)).toBe('09:30')
    expect(parseDisplayTime('25:00', false, labels)).toBeNull()
    expect(parseDisplayTime('03:30 pm', true, labels)).toBe('15:30')
    expect(parseDisplayTime('12:00AM', true, labels)).toBe('00:00')
    expect(parseDisplayTime('12:15 PM', true, labels)).toBe('12:15')
    expect(parseDisplayTime('13:00 PM', true, labels)).toBeNull()
    expect(parseDisplayTime('00:10 AM', true, labels)).toBeNull()
    expect(parseDisplayTime('03:99 AM', true, labels)).toBeNull()
    expect(parseDisplayTime('03:30', true, labels)).toBeNull()
  })

  it('parses custom period labels, escaping them', () => {
    const custom = { am: 'a.m.', pm: 'p.m.' }
    expect(parseDisplayTime('01:00 p.m.', true, custom)).toBe('13:00')
    expect(parseDisplayTime('01:00 pxm', true, custom)).toBeNull()
  })

  it('builds ranges with a step', () => {
    expect(range(4)).toEqual([0, 1, 2, 3])
    expect(range(60, 15)).toEqual([0, 15, 30, 45])
    expect(range(12, 1, 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })
})
