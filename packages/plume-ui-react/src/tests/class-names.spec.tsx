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

type Mode = 'alias' | 'classNames'

interface Case {
  classes: string[]
  element: (mode: Mode) => ReactElement
  open?: () => void
}

const pick = <T extends object>(mode: Mode, alias: T, parts: Record<string, string>): object =>
  mode === 'alias' ? alias : { classNames: parts }

const cases: Record<string, Case> = {
  Checkbox: {
    classes: ['a-input', 'a-label'],
    element: (mode) => (
      <Checkbox
        {...pick(
          mode,
          { inputClassName: 'a-input', labelClassName: 'a-label' },
          { input: 'a-input', label: 'a-label' },
        )}
      >
        Accept
      </Checkbox>
    ),
  },
  Radio: {
    classes: ['a-input', 'a-label'],
    element: (mode) => (
      <Radio
        value="x"
        {...pick(
          mode,
          { inputClassName: 'a-input', labelClassName: 'a-label' },
          { input: 'a-input', label: 'a-label' },
        )}
      >
        Option
      </Radio>
    ),
  },
  Toggle: {
    classes: ['a-input', 'a-label'],
    element: (mode) => (
      <Toggle
        {...pick(
          mode,
          { inputClassName: 'a-input', labelClassName: 'a-label' },
          { input: 'a-input', label: 'a-label' },
        )}
      >
        Notify
      </Toggle>
    ),
  },
  PinInput: {
    classes: ['a-input'],
    element: (mode) => (
      <PinInput
        aria-label="Code"
        length={2}
        {...pick(mode, { inputClassName: 'a-input' }, { input: 'a-input' })}
      />
    ),
  },
  Input: {
    classes: ['a-reveal'],
    element: (mode) => (
      <Input
        revealable
        type="password"
        {...pick(mode, { revealClassName: 'a-reveal' }, { reveal: 'a-reveal' })}
      />
    ),
  },
  Textarea: {
    classes: ['a-count'],
    element: (mode) => (
      <Textarea
        aria-label="Bio"
        showCount
        {...pick(mode, { countClassName: 'a-count' }, { count: 'a-count' })}
      />
    ),
  },
  SelectGroup: {
    classes: ['a-label'],
    element: (mode) => (
      <Select aria-label="Fruit">
        <SelectTrigger />
        <SelectContent>
          <SelectGroup
            label="Fruits"
            {...pick(mode, { labelClassName: 'a-label' }, { label: 'a-label' })}
          >
            <SelectOption value="apple">Apple</SelectOption>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  TimePicker: {
    classes: ['a-panel'],
    element: (mode) => (
      <TimePicker {...pick(mode, { panelClassName: 'a-panel' }, { panel: 'a-panel' })} />
    ),
    open: () => fireEvent.click(screen.getByRole('button', { name: 'Open time picker' })),
  },
  Sidebar: {
    classes: ['a-backdrop'],
    element: (mode) => (
      <SidebarProvider>
        <Sidebar {...pick(mode, { backdropClassName: 'a-backdrop' }, { backdrop: 'a-backdrop' })}>
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
  },
  AccordionContent: {
    classes: ['a-body'],
    element: (mode) => (
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent {...pick(mode, { bodyClassName: 'a-body' }, { body: 'a-body' })}>
            Content
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  Breadcrumb: {
    classes: ['a-list', 'a-separator'],
    element: (mode) => (
      <Breadcrumb
        {...pick(
          mode,
          { listClassName: 'a-list', separatorClassName: 'a-separator' },
          { list: 'a-list', separator: 'a-separator' },
        )}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>
    ),
  },
  ModalContent: {
    classes: ['a-backdrop'],
    element: (mode) => (
      <Modal defaultOpen>
        <ModalContent
          aria-label="Name"
          {...pick(mode, { backdropClassName: 'a-backdrop' }, { backdrop: 'a-backdrop' })}
        >
          Body
        </ModalContent>
      </Modal>
    ),
  },
  Skeleton: {
    classes: ['a-line'],
    element: (mode) => (
      <Skeleton lines={2} {...pick(mode, { lineClassName: 'a-line' }, { line: 'a-line' })} />
    ),
  },
  Collapse: {
    classes: ['a-body'],
    element: (mode) => (
      <Collapse {...pick(mode, { bodyClassName: 'a-body' }, { body: 'a-body' })}>Text</Collapse>
    ),
  },
  ProgressBar: {
    classes: ['a-indicator', 'a-value'],
    element: (mode) => (
      <ProgressBar
        aria-label="Upload"
        showValue
        value={40}
        {...pick(
          mode,
          { indicatorClassName: 'a-indicator', valueClassName: 'a-value' },
          { indicator: 'a-indicator', value: 'a-value' },
        )}
      />
    ),
  },
  CarouselDots: {
    classes: ['a-dot'],
    element: (mode) => (
      <Carousel aria-label="x">
        <CarouselSlides>
          <CarouselSlide>A</CarouselSlide>
          <CarouselSlide>B</CarouselSlide>
        </CarouselSlides>
        <CarouselDots {...pick(mode, { dotClassName: 'a-dot' }, { dot: 'a-dot' })} />
      </Carousel>
    ),
  },
  Table: {
    classes: ['a-container', 'a-loading'],
    element: (mode) => (
      <Table
        aria-label="t"
        loading
        {...pick(
          mode,
          { containerClassName: 'a-container', loadingClassName: 'a-loading' },
          { container: 'a-container', loading: 'a-loading' },
        )}
      >
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
    element: (mode) => (
      <Table aria-label="t">
        <TableHeader>
          <TableRow>
            <TableHead
              onSort={() => undefined}
              sort="none"
              {...pick(mode, { sortClassName: 'a-sort' }, { sort: 'a-sort' })}
            >
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    ),
  },
  TableEmpty: {
    classes: ['a-state', 'a-title'],
    element: (mode) => (
      <Table aria-label="t">
        <TableBody>
          <TableRow>
            <TableEmpty
              title="Nothing"
              {...(mode === 'alias'
                ? { classNames: { title: 'a-title' }, emptyStateClassName: 'a-state' }
                : { classNames: { emptyState: 'a-state', title: 'a-title' } })}
            />
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
}

describe('classNames of the parts', () => {
  describe.each(Object.entries(cases))('%s', (_name, { classes, element, open }) => {
    it.each(['classNames', 'alias'] as const)('puts the classes of the parts with %s', (mode) => {
      render(element(mode))
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
