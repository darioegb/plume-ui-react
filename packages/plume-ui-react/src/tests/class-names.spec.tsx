import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/navigation/accordion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../components/navigation/breadcrumb'
import { Sidebar, SidebarContent, SidebarProvider } from '../components/navigation/sidebar'
import {
  Carousel,
  CarouselDots,
  CarouselSlide,
  CarouselSlides,
} from '../components/utility/carousel'
import { Checkbox } from '../components/form/checkbox'
import { Collapse } from '../components/utility/collapse'
import { Input } from '../components/form/input'
import { Modal, ModalContent } from '../components/overlay/modal'
import { PinInput } from '../components/form/pininput'
import { ProgressBar } from '../components/utility/progressbar'
import { Radio } from '../components/form/radio'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectOption,
  SelectTrigger,
} from '../components/form/select'
import { Skeleton } from '../components/utility/skeleton'
import {
  Table,
  TableBody,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/utility/table'
import { Textarea } from '../components/form/textarea'
import { TimePicker } from '../components/form/timepicker'
import { Toggle } from '../components/form/toggle'

interface Case {
  classes: string[]
  element: () => ReactElement
  open?: () => void
}

const cases: Record<string, Case> = {
  Checkbox: {
    classes: ['a-input', 'a-label'],
    element: () => <Checkbox classNames={{ input: 'a-input', label: 'a-label' }}>Accept</Checkbox>,
  },
  Radio: {
    classes: ['a-input', 'a-label'],
    element: () => (
      <Radio value="x" classNames={{ input: 'a-input', label: 'a-label' }}>
        Option
      </Radio>
    ),
  },
  Toggle: {
    classes: ['a-input', 'a-label'],
    element: () => <Toggle classNames={{ input: 'a-input', label: 'a-label' }}>Notify</Toggle>,
  },
  PinInput: {
    classes: ['a-input'],
    element: () => <PinInput aria-label="Code" length={2} classNames={{ input: 'a-input' }} />,
  },
  Input: {
    classes: ['a-reveal'],
    element: () => <Input revealable type="password" classNames={{ reveal: 'a-reveal' }} />,
  },
  Textarea: {
    classes: ['a-count'],
    element: () => <Textarea aria-label="Bio" showCount classNames={{ count: 'a-count' }} />,
  },
  SelectGroup: {
    classes: ['a-label'],
    element: () => (
      <Select aria-label="Fruit">
        <SelectTrigger />
        <SelectContent>
          <SelectGroup label="Fruits" classNames={{ label: 'a-label' }}>
            <SelectOption value="apple">Apple</SelectOption>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  TimePicker: {
    classes: ['a-panel'],
    element: () => <TimePicker classNames={{ panel: 'a-panel' }} />,
    open: () => fireEvent.click(screen.getByRole('button', { name: 'Open time picker' })),
  },
  Sidebar: {
    classes: ['a-backdrop'],
    element: () => (
      <SidebarProvider>
        <Sidebar classNames={{ backdrop: 'a-backdrop' }}>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  },
  AccordionContent: {
    classes: ['a-body'],
    element: () => (
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent classNames={{ body: 'a-body' }}>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  Breadcrumb: {
    classes: ['a-list', 'a-separator'],
    element: () => (
      <Breadcrumb classNames={{ list: 'a-list', separator: 'a-separator' }}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Page</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  ModalContent: {
    classes: ['a-backdrop'],
    element: () => (
      <Modal defaultOpen>
        <ModalContent aria-label="Name" classNames={{ backdrop: 'a-backdrop' }}>
          Body
        </ModalContent>
      </Modal>
    ),
  },
  Skeleton: {
    classes: ['a-line'],
    element: () => <Skeleton lines={2} classNames={{ line: 'a-line' }} />,
  },
  Collapse: {
    classes: ['a-body'],
    element: () => <Collapse classNames={{ body: 'a-body' }}>Text</Collapse>,
  },
  ProgressBar: {
    classes: ['a-indicator', 'a-value'],
    element: () => (
      <ProgressBar
        aria-label="Upload"
        showValue
        value={40}
        classNames={{ indicator: 'a-indicator', value: 'a-value' }}
      />
    ),
  },
  CarouselDots: {
    classes: ['a-dot'],
    element: () => (
      <Carousel aria-label="x">
        <CarouselSlides>
          <CarouselSlide>A</CarouselSlide>
          <CarouselSlide>B</CarouselSlide>
        </CarouselSlides>
        <CarouselDots classNames={{ dot: 'a-dot' }} />
      </Carousel>
    ),
  },
  Table: {
    classes: ['a-container', 'a-loading'],
    element: () => (
      <Table aria-label="t" loading classNames={{ container: 'a-container', loading: 'a-loading' }}>
        <TableBody>
          <TableRow>
            <TableEmpty>Nothing</TableEmpty>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  TableHead: {
    classes: ['a-sort'],
    element: () => (
      <Table aria-label="t">
        <TableHeader>
          <TableRow>
            <TableHead onSort={() => undefined} sort="none" classNames={{ sort: 'a-sort' }}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    ),
  },
  TableEmpty: {
    classes: ['a-state', 'a-title'],
    element: () => (
      <Table aria-label="t">
        <TableBody>
          <TableRow>
            <TableEmpty title="Nothing" classNames={{ emptyState: 'a-state', title: 'a-title' }} />
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
}

describe('classNames of the parts', () => {
  describe.each(Object.entries(cases))('%s', (_name, { classes, element, open }) => {
    it('puts the classes of the parts', () => {
      render(element())
      open?.()
      for (const name of classes) {
        expect(document.querySelector(`.${name}`)).not.toBeNull()
      }
    })
  })

  it('adds the class of the toast', async () => {
    const { ToastProvider, useToast } = await import('../components/overlay/toast')
    function Trigger(): ReactElement {
      const { toast } = useToast()
      return (
        <button onClick={() => toast('Saved')} type="button">
          Go
        </button>
      )
    }
    render(
      <ToastProvider classNames={{ toast: 'a-toast' }}>
        <Trigger />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(screen.getByRole('status')).toHaveClass('a-toast')
  })
})
