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
import { DatePicker } from '../components/form/datepicker'
import { Collapse } from '../components/utility/collapse'
import { Input } from '../components/form/input'
import { Modal, ModalContent } from '../components/overlay/modal'
import { PinInput } from '../components/form/pininput'
import { ProgressBar } from '../components/utility/progressbar'
import { Radio } from '../components/form/radio'
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

  describe.each<[string, () => ReactElement]>([
    ['Checkbox', () => <Checkbox className="a-root" />],
    ['DatePicker', () => <DatePicker className="a-root" onChange={() => undefined} />],
    ['Input with a group', () => <Input className="a-root" elementAfter={<span />} />],
    ['Input', () => <Input className="a-root" />],
    ['PinInput', () => <PinInput aria-label="Code" className="a-root" length={2} />],
    ['Radio', () => <Radio className="a-root" value="x" />],
    ['Textarea with a counter', () => <Textarea aria-label="Bio" className="a-root" showCount />],
    ['Textarea', () => <Textarea aria-label="Bio" className="a-root" />],
    ['TimePicker', () => <TimePicker className="a-root" />],
    ['Toggle', () => <Toggle className="a-root" />],
  ])('className of %s', (_name, element) => {
    it('goes to the outermost element', () => {
      const { container } = render(element())
      expect(container.firstElementChild).toHaveClass('a-root')
      expect(container.querySelectorAll('.a-root')).toHaveLength(1)
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
