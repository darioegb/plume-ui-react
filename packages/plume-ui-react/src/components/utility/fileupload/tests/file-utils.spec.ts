import { formatBytes, matchesAccept, selectFiles } from '../file-utils'

const file = (name: string, type = '', size = 10): File =>
  new File([new Uint8Array(size)], name, { type })

describe('matchesAccept', () => {
  it('accepts everything without an accept list', () => {
    expect(matchesAccept(file('a.exe'), undefined)).toBe(true)
    expect(matchesAccept(file('a.exe'), '')).toBe(true)
  })

  it('matches extensions without regard to case', () => {
    expect(matchesAccept(file('Photo.PNG'), '.png')).toBe(true)
    expect(matchesAccept(file('doc.pdf'), '.png')).toBe(false)
  })

  it('matches exact types and wildcards', () => {
    expect(matchesAccept(file('a', 'image/png'), 'image/png')).toBe(true)
    expect(matchesAccept(file('a', 'image/jpeg'), 'image/png')).toBe(false)
    expect(matchesAccept(file('a', 'image/jpeg'), 'image/*')).toBe(true)
    expect(matchesAccept(file('a', 'video/mp4'), 'image/*')).toBe(false)
  })

  it('matches any token of a list', () => {
    expect(matchesAccept(file('a.pdf', 'application/pdf'), ' image/* , .pdf ')).toBe(true)
    expect(matchesAccept(file('a.txt', 'text/plain'), 'image/*,.pdf')).toBe(false)
  })
})

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [1024, '1 KB'],
    [1536, '1.5 KB'],
    [10 * 1024, '10 KB'],
    [5 * 1024 * 1024, '5 MB'],
    [3 * 1024 ** 3, '3 GB'],
    [2048 * 1024 ** 3, '2048 GB'],
  ])('formats %i bytes as %s', (bytes, text) => {
    expect(formatBytes(bytes)).toBe(text)
  })
})

describe('selectFiles', () => {
  const base = { current: [] as File[], multiple: true }

  it('keeps the current files and adds the accepted ones', () => {
    const current = [file('old.txt')]
    const result = selectFiles({ ...base, current, incoming: [file('new.txt')] })
    expect(result.files.map((item) => item.name)).toEqual(['old.txt', 'new.txt'])
    expect(result.rejections).toEqual([])
  })

  it('rejects the type and the size', () => {
    const result = selectFiles({
      ...base,
      accept: 'image/*',
      incoming: [
        file('a.txt', 'text/plain'),
        file('big.png', 'image/png', 100),
        file('ok.png', 'image/png', 5),
      ],
      maxSize: 50,
    })
    expect(result.files.map((item) => item.name)).toEqual(['ok.png'])
    expect(result.rejections.map((item) => item.reason)).toEqual(['type', 'size'])
  })

  it('limits the number of files', () => {
    const result = selectFiles({
      ...base,
      current: [file('1')],
      incoming: [file('2'), file('3'), file('4')],
      maxFiles: 3,
    })
    expect(result.files.map((item) => item.name)).toEqual(['1', '2', '3'])
    expect(result.rejections).toEqual([
      { file: expect.objectContaining({ name: '4' }), reason: 'count' },
    ])
  })

  it('replaces the file when it is not multiple and takes only the first one', () => {
    const result = selectFiles({
      current: [file('old')],
      incoming: [file('a'), file('b')],
      multiple: false,
    })
    expect(result.files.map((item) => item.name)).toEqual(['a'])
    expect(result.rejections.map((item) => item.reason)).toEqual(['count'])
  })

  it('has no room when the limit is already reached', () => {
    const result = selectFiles({
      ...base,
      current: [file('1'), file('2')],
      incoming: [file('3')],
      maxFiles: 2,
    })
    expect(result.files).toHaveLength(2)
    expect(result.rejections).toHaveLength(1)
  })
})
