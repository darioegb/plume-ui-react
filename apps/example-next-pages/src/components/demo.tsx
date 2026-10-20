import { useState } from 'react'
import {
  useTheme,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  DatePicker,
  Field,
  Icon,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  useToast,
  type DateRange,
} from 'plume-ui-react'

const card: React.CSSProperties = {
  border: '1px solid var(--plume-border)',
  borderRadius: 'var(--plume-radius-lg, 12px)',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  alignItems: 'center',
}

function Section({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>): React.ReactElement {
  return (
    <section style={card}>
      <h2 style={{ margin: 0, fontSize: '1rem' }}>{title}</h2>
      {children}
    </section>
  )
}

const inbox = (
  <Icon>
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  </Icon>
)

function ToastButtons(): React.ReactElement {
  const toast = useToast()
  return (
    <div style={row}>
      <Button
        variant="outline"
        onClick={() => toast.success({ description: 'Your changes were saved.', title: 'Saved' })}
      >
        Success toast
      </Button>
      <Button
        colorScheme="error"
        variant="outline"
        onClick={() =>
          toast.error({
            action: { label: 'Retry', onClick: () => toast.info('Trying again…') },
            description: 'Check your connection.',
            title: 'Could not save',
          })
        }
      >
        Error toast
      </Button>
    </div>
  )
}

export function Demo(): React.ReactElement {
  const { colorMode, setColorMode } = useTheme()
  const [date, setDate] = useState<DateRange>({ startDate: null, endDate: null })
  const [plan, setPlan] = useState('team')
  const [notify, setNotify] = useState(true)

  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 720,
        margin: '0 auto',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Plume UI React — Next Pages Router</h1>
        <Button
          colorScheme="secondary"
          variant="outline"
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
        >
          {colorMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </header>

      <Section title="Buttons">
        <div style={row}>
          <Button colorScheme="primary">Primary</Button>
          <Button colorScheme="secondary">Secondary</Button>
          <Button colorScheme="success">Success</Button>
          <Button colorScheme="error" variant="outline">
            Danger
          </Button>
          <Button colorScheme="primary" disabled>
            Disabled
          </Button>
          <Button colorScheme="salmon">Salmon (custom)</Button>
        </div>
      </Section>

      <Section title="Badge and Spinner">
        <div style={row}>
          <Badge colorScheme="primary">New</Badge>
          <Badge colorScheme="success" variant="subtle">
            Paid
          </Badge>
          <Badge colorScheme="error" variant="outline">
            Failed
          </Badge>
          <Badge colorScheme="warning" dot>
            Pending
          </Badge>
          <Badge colorScheme="salmon">Salmon (custom)</Badge>
          <Spinner size="sm" />
          <Spinner />
        </div>
      </Section>

      <Section title="Card">
        <Card>
          <CardHeader>Team plan</CardHeader>
          <CardBody>Up to ten members, with shared projects and a history of thirty days.</CardBody>
          <CardFooter>
            <Button size="sm">Choose</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="List">
        <List variant="bordered" divided>
          <ListSubheader>Mailboxes</ListSubheader>
          <ListItem>
            <ListItemButton selected>
              <ListItemIcon>{inbox}</ListItemIcon>
              <ListItemText primary="Inbox" secondary="Messages to read" />
              <Badge colorScheme="primary" size="sm">
                4
              </Badge>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>{inbox}</ListItemIcon>
              <ListItemText primary="Archive" />
            </ListItemButton>
          </ListItem>
        </List>
      </Section>

      <Section title="Input, Textarea and Field">
        <Input placeholder="Type something…" colorScheme="primary" />
        <Input placeholder="Phone (masked)" mask="(###) ###-####" colorScheme="primary" />
        <Field
          label="Message"
          helperText="Say what you need, in a few lines."
          optionalText="optional"
        >
          <Textarea placeholder="Your message" rows={3} />
        </Field>
      </Section>

      <Section title="Checkbox, Radio and Toggle">
        <Checkbox defaultChecked>I accept the terms</Checkbox>
        <Checkbox indeterminate variant="outline">
          Select all
        </Checkbox>
        <Field label="Plan">
          <RadioGroup value={plan} onChange={setPlan}>
            <Radio value="solo">Solo</Radio>
            <Radio value="team">Team</Radio>
            <Radio value="company">Company</Radio>
          </RadioGroup>
        </Field>
        <Toggle checked={notify} onChange={(event) => setNotify(event.target.checked)}>
          Email notifications {notify ? 'on' : 'off'}
        </Toggle>
      </Section>

      <Section title="Tabs">
        <Tabs colorScheme="primary">
          <TabList>
            <Tab label="Overview" />
            <Tab label="Features" />
            <Tab label="Pricing" />
          </TabList>
          <TabPanels>
            <TabPanel>
              <p>A themeable, SSR-safe React component library.</p>
            </TabPanel>
            <TabPanel>
              <p>Design tokens, dark mode, Tailwind preset and an unstyled escape hatch.</p>
            </TabPanel>
            <TabPanel>
              <p>Free and open source.</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Section>

      <Section title="Modal, Popover, Tooltip and Toast">
        <div style={row}>
          <Modal>
            <ModalTrigger>
              <Button>Open modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>Delete project</ModalHeader>
              <ModalBody>This removes its files and its history, and cannot be undone.</ModalBody>
              <ModalFooter>
                <ModalClose>
                  <Button variant="ghost">Cancel</Button>
                </ModalClose>
                <ModalClose>
                  <Button colorScheme="error">Delete</Button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Popover>
            <PopoverTrigger>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent aria-label="Share">
              <p style={{ margin: '0 0 0.75rem' }}>Anyone with the link can view.</p>
              <PopoverClose>
                <Button size="sm">Done</Button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <Tooltip content="Save the changes">
            <Button variant="outline">Hover or focus me</Button>
          </Tooltip>
        </div>
        <ToastButtons />
      </Section>

      <Section title="DatePicker">
        <DatePicker colorScheme="primary" value={date} onChange={setDate} />
        <small style={{ color: 'var(--plume-muted-foreground, #71717a)' }}>
          Selected: {date.startDate ? date.startDate.toLocaleDateString() : '—'}
        </small>
      </Section>
    </main>
  )
}
