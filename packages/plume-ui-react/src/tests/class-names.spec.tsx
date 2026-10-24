import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Checkbox } from '../components/form/checkbox'
import { DatePicker } from '../components/form/datepicker'
import { Input } from '../components/form/input'
import { PinInput } from '../components/form/pininput'
import { Radio } from '../components/form/radio'
import { Textarea } from '../components/form/textarea'
import { TimePicker } from '../components/form/timepicker'
import { Toggle } from '../components/form/toggle'
import { Collapse } from '../components/utility/collapse'
import { ProgressBar } from '../components/utility/progressbar'
import { Table } from '../components/utility/table'

describe('className of the root', () => {
  describe.each<[string, () => ReactElement]>([
    ['Checkbox', () => <Checkbox className="a-root" />],
    ['Collapse', () => <Collapse className="a-root">Text</Collapse>],
    ['DatePicker', () => <DatePicker className="a-root" onChange={() => undefined} />],
    ['Input with a group', () => <Input className="a-root" elementAfter={<span />} />],
    ['Input', () => <Input className="a-root" />],
    ['PinInput', () => <PinInput aria-label="Code" className="a-root" length={2} />],
    [
      'ProgressBar with a value',
      () => <ProgressBar aria-label="Load" className="a-root" showValue value={4} />,
    ],
    ['ProgressBar', () => <ProgressBar aria-label="Load" className="a-root" value={4} />],
    ['Radio', () => <Radio className="a-root" value="x" />],
    ['Table', () => <Table aria-label="t" className="a-root" />],
    ['Textarea with a counter', () => <Textarea aria-label="Bio" className="a-root" showCount />],
    ['Textarea', () => <Textarea aria-label="Bio" className="a-root" />],
    ['TimePicker', () => <TimePicker className="a-root" />],
    ['Toggle', () => <Toggle className="a-root" />],
  ])('%s', (_name, element) => {
    it('goes to the outermost element', () => {
      const { container } = render(element())
      expect(container.firstElementChild).toHaveClass('a-root')
      expect(container.querySelectorAll('.a-root')).toHaveLength(1)
    })
  })
})
